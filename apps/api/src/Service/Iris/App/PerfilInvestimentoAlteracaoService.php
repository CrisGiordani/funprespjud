<?php

namespace App\Service\Iris\App;

use App\DTO\Trust\Input\MigracaoSolicitacoesDTO;
use App\DTO\Trust\Output\ParticipanteProfileOutputDTO;
use App\Entity\Iris\App\PerfilInvestimento;
use App\Entity\Iris\App\PerfilInvestimentoAlteracao;
use App\Enum\Iris\App\StatusSolicitacaoAlteracaoPerfilInvestimentoEnum;
use App\Enum\Jasper\JasperReportPathEnum;
use App\Exception\SolicitacaoAlteracaoPerfilNotFoundException;
use App\Helper\CpfHelper;
use App\Helper\FormatHelper;
use App\Helper\GenerateHashHelper;
use App\Interface\Iris\Repository\App\PerfilInvestimentoAlteracaoRepositoryInterface;
use App\Interface\Iris\Service\App\CampanhaServiceInterface;
use App\Interface\Iris\Service\App\PerfilInvestimentoAlteracaoServiceInterface;
use App\Interface\Iris\Service\App\PortalPerfilInvestimentoServiceInterface;
use App\Interface\Jasper\JasperServiceInterface;
use App\Interface\Storage\WebDAV\WebDAVServiceInterface;
use App\Interface\Trust\Service\TrustBeneficiarioServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;

class PerfilInvestimentoAlteracaoService implements PerfilInvestimentoAlteracaoServiceInterface
{
    public function __construct(
        private readonly PerfilInvestimentoAlteracaoRepositoryInterface $perfilInvestimentoAlteracaoRepository,
        private readonly TrustParticipanteServiceInterface $trustParticipanteService,
        private readonly TrustBeneficiarioServiceInterface $trustBeneficiarioService,
        private readonly JasperServiceInterface $jasperService,
        private readonly WebDAVServiceInterface $webDAVService,
        private readonly CampanhaServiceInterface $campanhaService,
        private readonly PortalPerfilInvestimentoServiceInterface $perfilInvestimentoService,
        private readonly PaginatorInterface $paginator,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->perfilInvestimentoAlteracaoRepository->getAll();
    }

    /**
     * @param int $id
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getById(int $id): ?PerfilInvestimentoAlteracao
    {
        return $this->perfilInvestimentoAlteracaoRepository->getById($id);
    }

    /**
     * @param string $cpf
     * @param array $filterPagination
     *
     * @return PaginationInterface
     */
    public function getByCpf(string $cpf, array $filterPagination): PaginationInterface
    {
        if (! CpfHelper::isValidCpf($cpf)) {
            throw new Exception('CPF inválido');
        }
        $query = $this->perfilInvestimentoAlteracaoRepository->getByCpf($cpf);

        return $this->paginator->paginate(
            $query,
            $filterPagination['pageIndex'] + 1,
            $filterPagination['pageSize']
        );
    }

    /**
     * @param string $cpf
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getUltimaSolicitacaoAlteracaoPerfil(string $cpf): ?PerfilInvestimentoAlteracao
    {
        try {
            if (! CpfHelper::isValidCpf($cpf)) {
                throw new Exception('CPF inválido');
            }
            $ultimaSolicitacaoAlteracaoPerfil = $this->perfilInvestimentoAlteracaoRepository->getUltimaSolicitacaoAlteracaoPerfil($cpf);

            if (! $ultimaSolicitacaoAlteracaoPerfil) {
                throw new SolicitacaoAlteracaoPerfilNotFoundException();
            }

            return $ultimaSolicitacaoAlteracaoPerfil;
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    /**
     * @param string $cpf
     * @param int $perfilInvestimento
     * @param int $idCampanha
     * @param string $ipMaquina
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function postPerfilSolicitacaoAlteracao(string $cpf, int $perfilInvestimento, int $idCampanha, string $ipMaquina, string $dadosSimulacao): ?PerfilInvestimentoAlteracao
    {
        // Validações de parâmetros
        if (empty($dadosSimulacao)) {
            throw new \InvalidArgumentException('Dados de simulação são obrigatórios');
        }

        if ($perfilInvestimento <= 0) {
            throw new \InvalidArgumentException('ID do perfil de investimento deve ser maior que zero');
        }

        if ($idCampanha <= 0) {
            throw new \InvalidArgumentException('ID da campanha deve ser maior que zero');
        }

        if (empty($ipMaquina)) {
            throw new \InvalidArgumentException('IP da máquina é obrigatório');
        }

        // Valida se a campanha está ativa
        $campanha = $this->campanhaService->getById($idCampanha);

        if (!$campanha) {
            throw new \InvalidArgumentException('Campanha não encontrada');
        }

        // Verifica se a campanha enviada é realmente a campanha ativa
        $campanhaAtiva = $this->campanhaService->getCampanhaAtiva();

        if (!$campanhaAtiva) {
            throw new \InvalidArgumentException('Não há campanha ativa no momento');
        }

        // Verifica se o ID da campanha enviada é o mesmo da campanha ativa
        if ($campanhaAtiva['idCampanha'] != $idCampanha) {
            throw new \InvalidArgumentException('A campanha enviada não é a campanha ativa. Campanha ativa: ' . $campanhaAtiva['id']);
        }

        // Verifica se a campanha está ativa
        if (is_array($campanha)) {
            $dataInicio = new \DateTime($campanha['dt_inicio']);
            $dataFim = new \DateTime($campanha['dt_fim']);
            $dataAtual = new \DateTime();

            if ($dataAtual < $dataInicio || $dataAtual > $dataFim) {
                throw new \InvalidArgumentException('Campanha não está ativa no momento');
            }
        }

        // Inicia transação para evitar race conditions
        $this->entityManager->beginTransaction();

        try {
            $ultimaSolicitacaoAlteracaoPerfil = $this->perfilInvestimentoAlteracaoRepository->getUltimaSolicitacaoAlteracaoPerfil($cpf);

            if (
                $ultimaSolicitacaoAlteracaoPerfil?->getStatus() == StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::SOLICITACAO_PROCESSADA->getDescricao() ||
                $ultimaSolicitacaoAlteracaoPerfil?->getStatus() == StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::CONFIRMACAO_PENDENTE->getDescricao()
            ) {
                $ultimaSolicitacaoAlteracaoPerfil->setStatus(StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::CANCELADO_NOVA_SOLICITACAO_REGISTRADA->getDescricao());
                $this->perfilInvestimentoAlteracaoRepository->update($ultimaSolicitacaoAlteracaoPerfil);
            }

            $perfilSolicitacaoAlteracao = $this->perfilSolicitacaoAlteracao($cpf, $perfilInvestimento, $idCampanha, $ipMaquina, $dadosSimulacao);
            if ($perfilSolicitacaoAlteracao) {
                $this->perfilInvestimentoAlteracaoRepository->postPerfilSolicitacaoAlteracao($perfilSolicitacaoAlteracao);
            }

            // Confirma a transação
            $this->entityManager->commit();

            return $perfilSolicitacaoAlteracao;
        } catch (\Exception $e) {
            // Em caso de erro, desfaz a transação
            $this->entityManager->rollback();
            throw $e;
        }
    }

    /**
     * @param string $cpf
     * @param int $perfilInvestimento
     * @param int $idCampanha
     * @param string $ipMaquina
     * @param string $dadosSimulacao
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function perfilSolicitacaoAlteracao(string $cpf, int $perfilInvestimento, int $idCampanha, string $ipMaquina, string $dadosSimulacao): ?PerfilInvestimentoAlteracao
    {
        // Validações de parâmetros
        if (empty($dadosSimulacao)) {
            throw new \InvalidArgumentException('Dados de simulação são obrigatórios');
        }

        if ($perfilInvestimento <= 0) {
            throw new \InvalidArgumentException('ID do perfil de investimento deve ser maior que zero');
        }

        if ($idCampanha <= 0) {
            throw new \InvalidArgumentException('ID da campanha deve ser maior que zero');
        }

        if (empty($ipMaquina)) {
            throw new \InvalidArgumentException('IP da máquina é obrigatório');
        }

        $participante = $this->trustParticipanteService->getParticipante($cpf);
        if (!$participante) {
            throw new \InvalidArgumentException('Participante não encontrado');
        }

        $campanha = $this->campanhaService->getById($idCampanha);
        if (!$campanha) {
            throw new \InvalidArgumentException('Campanha não encontrada');
        }

        $perfilInvestimento = $this->perfilInvestimentoService->getPerfilByIdTrust($perfilInvestimento);
        if (!$perfilInvestimento) {
            throw new \InvalidArgumentException('Perfil de investimento não encontrado');
        }


        $reportDados = $this->gerarDocumento($cpf, $participante, $perfilInvestimento, $ipMaquina);
        $report = $this->jasperService->generateReport(
            reportName: JasperReportPathEnum::REPORT_RELATORIO_PERFIL_INVESTIMENTO->value,
            params: $reportDados
        );
        if ($report) {
            $caminho = date('Y') . '/' . date('m') . '/';
            if (! $this->webDAVService->fileExists($caminho)) {
                $this->webDAVService->createDirectory($caminho);
            }
            $url = $this->webDAVService->uploadContent($report, $caminho . GenerateHashHelper::generateHashMd5($cpf) . '.pdf');

            $perfilInvestimentoAlteracao = new PerfilInvestimentoAlteracao();
            $perfilInvestimentoAlteracao->setCpf($cpf);
            $perfilInvestimentoAlteracao->setPerfilInvestimento($perfilInvestimento);
            $perfilInvestimentoAlteracao->setCampanha($campanha);
            $perfilInvestimentoAlteracao->setIdTrust($participante->getId());
            $perfilInvestimentoAlteracao->setEmail($participante->getEmail());
            $perfilInvestimentoAlteracao->setStatus(StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::CONFIRMACAO_PENDENTE->getDescricao());
            $perfilInvestimentoAlteracao->setProtocolo(md5(uniqid()));
            $perfilInvestimentoAlteracao->setToken(uniqid());
            $perfilInvestimentoAlteracao->setDtSolicitacao(new \DateTime());
            $perfilInvestimentoAlteracao->setDtEnvioToken(new \DateTime());
            $perfilInvestimentoAlteracao->setAtivo(false);
            $perfilInvestimentoAlteracao->setVerificado(false);
            $perfilInvestimentoAlteracao->setIpMaquina($ipMaquina);
            $perfilInvestimentoAlteracao->setDadosSimulacaoJson($dadosSimulacao);
            $perfilInvestimentoAlteracao->setOwncloud($url);

            return $perfilInvestimentoAlteracao;
        }

        return null;
    }

    /**
     * @param string $cpf
     * @param PerfilInvestimento $perfilInvestimento
     * @param string $ipMaquina
     *
     */
    public function gerarDocumento(string $cpf, ParticipanteProfileOutputDTO $participante, PerfilInvestimento $perfilInvestimento, string $ipMaquina)
    {
        $patrocinadores = $this->trustParticipanteService->getPatrocinadores($cpf);
        if (empty($patrocinadores) || !is_array($patrocinadores)) {
            throw new \Exception('Patrocinador não encontrado para o CPF: ' . $cpf);
        }
        $patrocinador = $patrocinadores[0];
        $dadosReport = [];

        $dadosReport['dadosPessoais'] = $participante->toArray();
        $dadosReport['dadosPessoais']['telefone'] = FormatHelper::formatPhone($participante->getTelefone());
        $dadosReport['dadosPessoais']['celular'] = FormatHelper::formatPhone($participante->getCelular()); //82999829382
        $dadosReport['dadosPessoais']['telefoneComercial'] = FormatHelper::formatPhone($participante->getTelefoneComercial()); //8234822900

        $dadosReport['nmPerfil'] = $perfilInvestimento->getDescricao();

        $dadosReport['dadosPessoais']['patrocinador']['nome'] = $patrocinador->getNome();
        $dadosReport['dtOpcao'] = new \DateTime();
        $dadosReport['dtUTC'] = (new \DateTime())->format('c');
        $dadosReport['protocolo'] = hash('sha256', uniqid() . time() . $cpf);
        $dadosReport['CNPB'] = '2013.001738';
        $dadosReport['dadosPessoais']['dtNascimento'] = $participante->getDtNascimento();
        $dadosReport['dadosPessoais']['dtExpedicaoRg'] = $participante->getRg();
        $dadosReport['dadosPessoais']['dtExercicio'] = $participante->getDtExercicio();
        $dadosReport['dadosPessoais']['dtInscricaoPlano'] = $patrocinador->getDtInscricaoPlano();

        $dadosReport['dadosPessoais']['cpf'] = $cpf;
        $dadosReport['dtToken'] = (new \DateTime())->format('d/m/Y');
        $dadosReport['ip'] = $ipMaquina;
        $dadosReport['image_base64'] = GenerateHashHelper::generateHashMd5($cpf); //! Não Grava imagem, conversa com o gestor !

        //* Beneficiários
        $beneficiarios = $this->trustBeneficiarioService->getBeneficiarios($cpf);
        $beneficiariosFormatados = [];

        if ($beneficiarios && is_array($beneficiarios)) {
            $beneficiariosFormatados = array_map(function ($beneficiario) {
                return [
                    'id' => $beneficiario['id'],
                    'nome' => $beneficiario['nome'],
                    'dtNascimento' => ($beneficiario['dtNascimento'] ? date('d/m/Y', strtotime($beneficiario['dtNascimento'])) : null),
                    'nmParentesco' => $beneficiario['grauParentesco'],
                    'invalido' => $beneficiario['invalido'],
                    'sexo' => $beneficiario['sexo'],
                ];
            }, $beneficiarios);
        }
        $dadosReport['dadosPessoais']['beneficiarios'] = $beneficiariosFormatados;

        return $dadosReport;
    }

    /**
     * @param string $cpf
     * @param string $token
     * @param string $ipMaquina
     *
     * @return bool
     */
    public function verificarToken(string $cpf, string $token, string $ipMaquina): bool
    {
        // Validações de parâmetros
        if (empty($token)) {
            throw new \InvalidArgumentException('Token é obrigatório');
        }

        if (empty($ipMaquina)) {
            throw new \InvalidArgumentException('IP da máquina é obrigatório');
        }

        // Inicia transação para evitar race conditions
        $this->entityManager->beginTransaction();

        try {
            $perfilInvestimentoAlteracao = $this->perfilInvestimentoAlteracaoRepository->getUltimaSolicitacaoAlteracaoPerfil($cpf);
            if (! $perfilInvestimentoAlteracao) {
                $this->entityManager->rollback();
                return false;
            }
            if ($perfilInvestimentoAlteracao->getToken() !== $token) {
                $this->entityManager->rollback();
                return false;
            }

            $this->atualizarPerfilInvestimentoValidacaoToken($perfilInvestimentoAlteracao, $ipMaquina);

            // Confirma a transação
            $this->entityManager->commit();
            return true;
        } catch (Exception $exception) {
            $this->entityManager->rollback();
            throw $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return string
     */
    public function gerarNovoToken(string $cpf): string
    {
        // Validações de parâmetros
        if (empty($cpf)) {
            throw new \InvalidArgumentException('CPF é obrigatório');
        }

        if (!CpfHelper::isValidCpf($cpf)) {
            throw new \InvalidArgumentException('CPF inválido');
        }

        // Inicia transação para evitar race conditions
        $this->entityManager->beginTransaction();

        try {
            $perfilInvestimentoAlteracao = $this->perfilInvestimentoAlteracaoRepository->getUltimaSolicitacaoAlteracaoPerfil($cpf);
            if (! $perfilInvestimentoAlteracao) {
                $this->entityManager->rollback();
                throw new Exception('Perfil de investimento não encontrado');
            }

            // Gera token seguro usando random_bytes
            $perfilInvestimentoAlteracao->setToken(bin2hex(random_bytes(32)));
            $perfilInvestimentoAlteracao->setDtEnvioToken(new \DateTime());
            $perfilInvestimentoAlteracao->setAtivo(false);
            $perfilInvestimentoAlteracao->setVerificado(false);

            $this->perfilInvestimentoAlteracaoRepository->update($perfilInvestimentoAlteracao);

            // Confirma a transação
            $this->entityManager->commit();

            return $perfilInvestimentoAlteracao->getToken();
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            throw $e;
        }
    }

    /**
     * @param PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao
     * @param string $ipMaquina
     *
     */
    private function atualizarPerfilInvestimentoValidacaoToken(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao, string $ipMaquina)
    {
        $perfilInvestimentoAlteracao->setVerificado(true);
        $perfilInvestimentoAlteracao->setIpMaquinaVerificacaoToken($ipMaquina);
        $perfilInvestimentoAlteracao->setDtVerificado(new \DateTime());
        $perfilInvestimentoAlteracao->setAtivo(true);
        $perfilInvestimentoAlteracao->setStatus(StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::SOLICITACAO_RECEBIDA->getDescricao());

        $this->perfilInvestimentoAlteracaoRepository->update($perfilInvestimentoAlteracao);

        return true;
    }

    /**
     * @param string $cpf
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getPerfilSolicitado(string $cpf): ?PerfilInvestimentoAlteracao
    {
        $perfilSolicitado = $this->perfilInvestimentoAlteracaoRepository->getUltimaSolicitacaoAlteracaoPerfil($cpf);

        return ! $perfilSolicitado ||
            $perfilSolicitado->getStatus() == StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE->getDescricao() ||
            $perfilSolicitado->getStatus() == StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::CANCELADO_NOVA_SOLICITACAO_REGISTRADA->getDescricao() ?
            null : $perfilSolicitado;
    }

    /**
     * @param string $cpf
     *
     * @return bool
     */
    public function cancelarSolicitacaoAlteracaoPerfil(string $cpf, int $status = StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE->value): bool
    {
        // Validações de parâmetros
        if (empty($cpf)) {
            throw new \InvalidArgumentException('CPF é obrigatório');
        }

        if (!CpfHelper::isValidCpf($cpf)) {
            throw new \InvalidArgumentException('CPF inválido');
        }

        // Inicia transação para evitar race conditions
        $this->entityManager->beginTransaction();

        try {
            $perfilSolicitado = $this->perfilInvestimentoAlteracaoRepository->getUltimaSolicitacaoAlteracaoPerfil($cpf);
            if (! $perfilSolicitado) {
                $this->entityManager->rollback();
                return false;
            }
            // Converte o valor do enum para a descrição
            $statusEnum = StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::from($status);
            $perfilSolicitado->setStatus($statusEnum->getDescricao());
            $this->perfilInvestimentoAlteracaoRepository->update($perfilSolicitado);

            // Confirma a transação
            $this->entityManager->commit();
            return true;
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            throw $e;
        }
    }

    /**
     * @param int $campanha
     *
     * @return array
     */
    public function solicitacoesRecebidas(int $campanha): array
    {

        return $this->perfilInvestimentoAlteracaoRepository->solicitacoesRecebidas($campanha);
    }

    /**
     * @param int $campanha
     *
     * @return array
     */
    public function solicitacoesInconsistentes(int $campanha): array
    {
        return $this->perfilInvestimentoAlteracaoRepository->solicitacoesInconsistentes($campanha);
    }

    /**
     * @param int $campanha
     *
     * @return array
     */
    public function solicitacoesProcessadas(int $campanha): array
    {
        return $this->perfilInvestimentoAlteracaoRepository->solicitacoesProcessadas($campanha);
    }

    /**
     * @param int $campanha
     *
     * @return MigracaoSolicitacoesDTO
     */
    public function migracaoPerfilInvestimento(int $campanha): MigracaoSolicitacoesDTO
    {
        $solicitacoesProcessadas = $this->solicitacoesProcessadas($campanha);
        $solicitacoesInconsistentes = $this->solicitacoesInconsistentes($campanha);

        return new MigracaoSolicitacoesDTO([
            'solicitacoesProcessadas' => $solicitacoesProcessadas,
            'solicitacoesProcessadasTotal' => count($solicitacoesProcessadas),
            'solicitacoesInconsistentes' => $solicitacoesInconsistentes,
            'solicitacoesInconsistentesTotal' => count($solicitacoesInconsistentes),
        ]);
    }


    /**
     * @param PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao
     *
     * @return void
     */
    public function updatePerfilInvestimentoAlteracao(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao): void
    {
        $this->perfilInvestimentoAlteracaoRepository->update($perfilInvestimentoAlteracao);
    }

    /**
     * Migra o perfil de investimento de uma solicitação individual
     *
     * @param int $solicitacaoId
     * @return array
     * @throws \Exception
     */
    public function migrarPerfilIndividual(int $solicitacaoId): array
    {
        // Validações de parâmetros
        if (empty($solicitacaoId)) {
            throw new \InvalidArgumentException('ID da solicitação é obrigatório');
        }

        // Inicia transação
        $this->entityManager->beginTransaction();

        try {
            // Busca a solicitação
            $solicitacao = $this->perfilInvestimentoAlteracaoRepository->getById($solicitacaoId);

            if (!$solicitacao) {
                throw new \Exception('Solicitação não encontrada');
            }

            // Verifica se a solicitação está em status que permite migração
            if (
                $solicitacao->getStatus() !== StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::SOLICITACAO_RECEBIDA->getDescricao() &&
                $solicitacao->getStatus() !== StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::ERRO_NO_PROCESSAMENTO->getDescricao()
            ) {
                throw new \Exception('Solicitação não está em status válido para migração');
            }

            $cpf = $solicitacao->getCpf();

            // Busca dados necessários
            $perfilAtual = $this->trustParticipanteService->getPerfilAtual($cpf);
            $dadosPessoa = $this->trustParticipanteService->getDadosPessoa($cpf);
            $perfil = $this->perfilInvestimentoService->getPerfilByIdTrust(intval($perfilAtual['idPerfil']));

            if (!$perfilAtual || !$perfil || empty($dadosPessoa)) {
                throw new \Exception('Perfil atual, perfil ou dados pessoa não encontrados para o CPF: ' . $cpf);
            }

            // Insere o novo perfil na tabela PERFIL_PLANO_PARTICIPANTE
            foreach ($dadosPessoa as $dado) {
                $qb = $this->entityManager->getConnection()->createQueryBuilder();
                $qb->insert('PERFIL_PLANO_PARTICIPANTE')
                    ->values([
                        'ID_PERFIL' => ':idPerfil',
                        'ID_PESSOA' => ':idPessoa',
                        'DT_VIGENCIA' => ':dtVigencia',
                        'ID_PLANO' => ':idPlano',
                    ])
                    ->setParameters([
                        'idPessoa' => $dado['ID_PESSOA'],
                        'idPerfil' => $perfil->getIdPerfil(),
                        'dtVigencia' => (new \DateTime())->format('Y-m-d H:i:s'),
                        'idPlano' => '1',
                    ]);
                $qb->executeStatement();
            }

            // Atualiza o status da solicitação para processada
            $solicitacao->setStatus(StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::SOLICITACAO_PROCESSADA->getDescricao());
            $this->perfilInvestimentoAlteracaoRepository->update($solicitacao);

            // Confirma a transação
            $this->entityManager->commit();

            return [
                'success' => true,
                'message' => 'Perfil migrado com sucesso',
                'cpf' => $cpf,
                'perfilId' => $perfil->getIdPerfil(),
                'perfilDescricao' => $perfil->getDescricao()
            ];
        } catch (\Exception $e) {
            // Rollback em caso de erro
            $this->entityManager->rollback();

            // Atualiza status para erro se a solicitação existe
            if (isset($solicitacao) && $solicitacao) {
                try {
                    $solicitacao->setStatus(StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::ERRO_NO_PROCESSAMENTO->getDescricao());
                    $this->perfilInvestimentoAlteracaoRepository->update($solicitacao);
                } catch (\Exception $updateError) {
                    // Log do erro de atualização mas não falha a operação principal
                    error_log("Erro ao atualizar status da solicitação ID {$solicitacaoId}: " . $updateError->getMessage());
                }
            }

            throw new \Exception('Erro ao migrar perfil: ' . $e->getMessage());
        }
    }
}
