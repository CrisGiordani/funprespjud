<?php

namespace App\Service\Trust\Simulador;

use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\DTO\Trust\Input\SimuladorDTO;
use App\DTO\Trust\Output\ProjecaoBeneficioOutputDTO;
use App\DTO\Trust\Output\SimuladorOutputDTO;
use App\Enum\Trust\IndexadorValor\IndexadorValorEnum;
use App\Enum\Trust\Simulador\ContribuicaoAdministrativaEnum;
use App\Exception\SimuladorNotFoundException;
use App\Interface\Helpers\CalculationsHelperInterface;
use App\Interface\Trust\Repository\TrustExtratoRepositoryInterface;
use App\Interface\Trust\Repository\TrustParticipanteRepositoryInterface;
use App\Interface\Trust\Repository\TrustSimuladorRepositoryInterface;
use App\Interface\Trust\Service\IndexadorValorServiceInterface;
use App\Interface\Trust\Service\TrustContribuicaoServiceInterface;
use App\Interface\Trust\Service\TrustCotasServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Interface\Trust\Service\TrustPlanoServiceInterface;
use App\Interface\Trust\Service\TrustSimuladorServiceInterface;
use App\Service\Trust\Extrato\TrustExtratoService;
use App\Service\Trust\Patrimonio\TrustPatrimonioService;
use App\Service\Trust\Saldo\TrustSaldoService;
use App\Service\Trust\Simulador\Calculator\TrustSimuladorCalculator;
use App\Service\Trust\Simulador\Validator\TrustSimuladorValidator;
use DateInterval;
use DateTime;
use DateTimeImmutable;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface as SymfonyValidatorInterface;

class TrustSimuladorService implements TrustSimuladorServiceInterface
{
    // Constants
    private const FCBE = TrustSimuladorConstants::FCBE;
    private const TAXA_ADMINISTRATIVA = TrustSimuladorConstants::TAXA_ADMINISTRATIVA;
    private const RENTABILIDADE_ALTERNATIVA = TrustSimuladorConstants::RENTABILIDADE_ALTERNATIVA;
    private const PERCENTUAL_VINCULADO = TrustSimuladorConstants::PERCENTUAL_VINCULADO;
    private const PERCENTUAL_MINIMO_CONTRIBUICAO_FACULTATIVA = TrustSimuladorConstants::PERCENTUAL_MINIMO_CONTRIBUICAO_FACULTATIVA;
    // Account types
    private const CONTA_RAN_NORMAL_PARTIC = TrustSimuladorConstants::CONTA_RAN_NORMAL_PARTIC;
    private const CONTA_RAN_NORMAL_PATROC = TrustSimuladorConstants::CONTA_RAN_NORMAL_PATROC;
    private const CONTA_RAN_AUTOPATROCINADO = TrustSimuladorConstants::CONTA_RAN_AUTOPATROCINADO;
    private const CONTA_RAS_FACULTATIVA = TrustSimuladorConstants::CONTA_RAS_FACULTATIVA;
    private const CONTA_RAS_VINCULADO = TrustSimuladorConstants::CONTA_RAS_VINCULADO;
    // Plan situations
    private const SITUACAO_PATROCINADO = TrustSimuladorConstants::SITUACAO_PATROCINADO;
    private const SITUACAO_VINCULADO = TrustSimuladorConstants::SITUACAO_VINCULADO;
    private const SITUACAO_AUTOPATROCINADO = TrustSimuladorConstants::SITUACAO_AUTOPATROCINADO;
    private const SITUACAO_PATROCINADO_CJ = TrustSimuladorConstants::SITUACAO_PATROCINADO_CJ;
    private const SITUACAO_BPD_DEPOSITO = TrustSimuladorConstants::SITUACAO_BPD_DEPOSITO;
    private const SITUACAO_BPD_SALDO = TrustSimuladorConstants::SITUACAO_BPD_SALDO;
    private const TOTAL_URPS = TrustSimuladorConstants::TOTAL_URPS;
    private SymfonyValidatorInterface $validator;
    private TrustSimuladorCalculator $calculator;
    private TrustSimuladorValidator $simuladorValidator;

    public function __construct(
        private readonly TrustSimuladorRepositoryInterface $repository,
        private readonly TrustParticipanteRepositoryInterface $participanteRepository,
        private readonly TrustExtratoService $trustExtratoService,
        private readonly TrustExtratoRepositoryInterface $trustExtratoRepository,
        private readonly LoggerInterface $logger,
        SymfonyValidatorInterface $validator,
        TrustSimuladorCalculator $calculator,
        TrustSimuladorValidator $simuladorValidator,
        private readonly TrustSaldoService $trustSaldoService,
        private readonly TrustParticipanteServiceInterface $trustParticipanteService,
        private readonly TrustPlanoServiceInterface $trustPlanoService,
        private readonly IndexadorValorServiceInterface $indexadorValorService,
        private readonly TrustContribuicaoServiceInterface $trustContribuicaoService,
        private readonly CalculationsHelperInterface $calculationsHelper,
        private readonly TrustCotasServiceInterface $trustCotasService,
        private readonly TrustPatrimonioService $trustPatrimonioService,
    ) {
        $this->validator = $validator;
        $this->calculator = $calculator;
        $this->simuladorValidator = $simuladorValidator;
    }

    /**
     * Calcula a simulação com base nos dados de entrada
     */
    public function calculoSimulacao(SimuladorDTO $input): SimuladorOutputDTO
    {
        $this->logger->info('Iniciando cálculo de simulação', ['cpf' => $input->getCpf()]);

        try {
            $this->validarInput($input);
            $dadosSimulacao = $this->getDadosSimulador($input->getCpf());

            $dadosSimulacao['salarioParticipante'] = $input->getSalarioParticipante();

            if ($input->getPercentualContribuicaoFacultativa() == null && $input->getPercentualContribuicaoFacultativa() != 0) {
                $filter['idParticipante'] = $dadosSimulacao['dadosParticipante']->getId();
                $dadosSimulacao['percentualContribuicaoFacultativa'] = $this->repository->getPercentualContribuicaoFacultativa($filter);
            } else {
                $dadosSimulacao['percentualContribuicaoFacultativa'] = $input->getPercentualContribuicaoFacultativa();
            }

            if ($input->getPercentualContribuicaoNormal() == null) {
                $filter['idParticipante'] = $dadosSimulacao['dadosParticipante']->getId();
                $dadosSimulacao['percentualContribuicaoNormal'] = $this->repository->getPercentualContribuicaoNormal($filter);
            } else {
                $dadosSimulacao['percentualContribuicaoNormal'] = $input->getPercentualContribuicaoNormal();
            }

            $dadosCalculo['planoSituacaoAtual'] = $dadosSimulacao['planoSituacao'];
            $dadosSimulacao['planoSituacaoAtual'] = $dadosSimulacao['planoSituacao'];
            if ($dadosSimulacao['planoSituacao'] === self::SITUACAO_AUTOPATROCINADO) {
                $novaSituacao = $this->repository->getSituacaoAnteriorParticipante($dadosSimulacao['dadosParticipante']->getId());
                $dadosSimulacao['planoSituacao'] = $novaSituacao;
                $dadosCalculo['planoSituacao'] = $novaSituacao;
            }

            $input->setPercentualContribuicaoNormal($dadosSimulacao['percentualContribuicaoNormal']);
            $input->setPercentualContribuicaoFacultativa($dadosSimulacao['percentualContribuicaoFacultativa']);

            $baseContribuicaoFunpresp = $input->getBaseContribuicaoFunpresp();
            if ($baseContribuicaoFunpresp == null) {
                $baseContribuicaoFunpresp = $dadosSimulacao['salarioParticipante'] - $this->obterTetoRPPS();
            }
            $baseContribuicaoFunpresp = $baseContribuicaoFunpresp <= 0 ? 0 : $baseContribuicaoFunpresp;
            $dadosSimulacao['baseContribuicaoFunpresp'] = $baseContribuicaoFunpresp;
            $dadosCalculo['baseContribuicaoFunpresp'] = $baseContribuicaoFunpresp;

            $dadosSimulacao['valorCotaAtual'] = $this->trustCotasService->getCotasAtual($input->getCpf())->getValor();

            $dadosCalculo = $this->prepararDadosCalculo($input, $dadosSimulacao);

            $output = $this->criarOutputSimulacao($dadosSimulacao, $dadosCalculo);

            $this->logger->info('Cálculo de simulação concluído com sucesso', [
                'cpf' => $input->getCpf(),
                'dadosCalculo' => $dadosCalculo,
            ]);

            return $output;
        } catch (\Exception $e) {
            $this->logger->error('Erro ao calcular simulação', [
                'error' => $e->getMessage(),
                'cpf' => $input->getCpf(),
            ]);

            throw new SimuladorNotFoundException('Erro ao calcular simulação: ' . $e->getMessage());
        }
    }

    /**
     * Prepara os dados para cálculo da simulação
     */
    private function prepararDadosCalculo(SimuladorDTO $input, array $dadosBase): array
    {
        $isVinculadoOuSalarioMenorTeto = $this->isVinculadoOuSalarioMenorTeto($dadosBase);

        $dataNascimento = new DateTime($input->getDataNascimento());
        $dataAposentadoria = (clone $dataNascimento)->modify("+{$input->getIdadeAposentadoria()} years");
        $hoje = new DateTime();

        if ($dadosBase['valorCotaAtual'] <= 0) {
            throw new InvalidArgumentException('Valor da cota atual inválido ou não encontrado');
        }
        $rentabilidadeProjetada = floatval($input->getRentabilidadeProjetada());
        $mesesAteAposentadoria = $this->calcularMesesAteAposentadoria($hoje, $dataAposentadoria);
        $valorCotaProjetado = $this->calcularValorCotaProjetado(
            $dadosBase['valorCotaAtual'],
            $rentabilidadeProjetada,
            $mesesAteAposentadoria
        );

        // Calcula a base de contribuição do Funpresp Jud (salário participante - teto RPPS)
        $baseContribuicaoFunpresp = $dadosBase['baseContribuicaoFunpresp'];

        $percentualNormal = $input->getPercentualContribuicaoNormal();
        $percentualFacultativa = $input->getPercentualContribuicaoFacultativa();

        $valorContribuicaoNormal = $isVinculadoOuSalarioMenorTeto ?
            $this->calcularValorContribuicaoVinculado($baseContribuicaoFunpresp, $percentualNormal) :
            $this->calcularValorContribuicaoNormal($baseContribuicaoFunpresp, $percentualNormal);

        $valorContribuicaoFacultativa = $this->calcularValorContribuicaoFacultativa($baseContribuicaoFunpresp, $percentualFacultativa);

        $fatorTabuaAtuarial = $this->getFatorVida($dataNascimento->format('Y'), $input->getIdadeAposentadoria(), $input->getSexo());

        return array_merge($dadosBase, [
            'valorCotaProjetado' => $valorCotaProjetado,
            'mesesAteAposentadoria' => $mesesAteAposentadoria,
            'rentabilidadeProjetada' => $rentabilidadeProjetada,
            'salarioParticipante' => $input->getSalarioParticipante(),
            'percentualContribuicaoNormal' => $percentualNormal,
            'percentualContribuicaoFacultativa' => $percentualFacultativa,
            'valorContribuicaoNormal' => $valorContribuicaoNormal,
            'valorContribuicaoFacultativa' => $valorContribuicaoFacultativa,
            'dataNascimento' => $dataNascimento,
            'dataAposentadoria' => $dataAposentadoria,
            'prazoRecebimento' => $input->getPrazoRecebimento(),
            'saqueReserva' => $input->getSaqueReserva(),
            'aporteExtraordinario' => $input->getAporteExtraordinario(),
            'planoSituacao' => $dadosBase['planoSituacao'] ?? null,
            'fatorTabuaAtuarial' => $fatorTabuaAtuarial,
            'fatorSobrevida' => $dadosBase['fatorSobrevida'] ?? 1,
            'fatorSobrevidaRas' => $dadosBase['fatorSobrevidaRas'] ?? 1,
            'valorCotaAtual' => $dadosBase['valorCotaAtual'],
            'valorCotaProjetado' => $valorCotaProjetado,
            'mesesAteAposentadoria' => $mesesAteAposentadoria,
            'rentabilidadeProjetada' => $rentabilidadeProjetada,
            'salarioParticipante' => $input->getSalarioParticipante(),
            'percentualContribuicaoNormal' => $percentualNormal,
            'percentualContribuicaoFacultativa' => $percentualFacultativa,
            'valorContribuicaoNormal' => $valorContribuicaoNormal,
            'valorContribuicaoFacultativa' => $valorContribuicaoFacultativa,
        ]);
    }

    /**
     * Calcula o valor da cota projetada
     */
    private function calcularValorCotaProjetado(float $valorCotaAtual, float $rentabilidadeProjetada, int $mesesAteAposentadoria): float
    {
        return $valorCotaAtual * pow(
            1 + ($rentabilidadeProjetada / 100),
            $mesesAteAposentadoria / 12
        );
    }

    /**
     * Cria o objeto de saída com os resultados da simulação
     */
    private function criarOutputSimulacao(array $dadosSimulacao, array $dadosCalculo): SimuladorOutputDTO
    {
        $output = new SimuladorOutputDTO();

        $tetoRPPS = $this->obterTetoRPPS();

        // Prepara os dados da simulação
        $dadosSimulacaoFormatados = $this->prepararDadosSimulacao($dadosCalculo);

        // Calcula as contribuições simuladas primeiro para obter os totais rentabilizados
        $contribuicoes = $this->calcularContribuicoes($dadosSimulacao, $dadosCalculo);

        // Atualiza os totais rentabilizados no dadosCalculo
        $dadosCalculo['totalRentabilizadoCotasRanParticipante'] = $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRanParticipante'];
        $dadosCalculo['totalRentabilizadoCotasRanPatrocinador'] = $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRanPatrocinador'];
        $dadosCalculo['totalRentabilizadoCotasRasParticipante'] = $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRasParticipante'];
        $dadosCalculo['valorCotaProjetado'] = $contribuicoes['totaisRentabilizados']['valorCotaProjetado'];

        // Calcula os benefícios usando os dados atualizados
        $beneficioNormal = $this->calcularBeneficioNormal($dadosCalculo, $contribuicoes);

        $beneficioSuplementar = $this->calcularBeneficioSuplementar($dadosCalculo, $contribuicoes, $beneficioNormal);

        $saldos_e_beneficios = $this->calcularSaldosEBeneficios($dadosCalculo, $beneficioNormal, $beneficioSuplementar);

        $contribuicoes_mensais_participante = $this->calcularContribuicoesMensaisParticipante($dadosCalculo);

        $beneficios = $this->calcularBeneficios($beneficioNormal, $beneficioSuplementar);

        $output->setSaldosEBeneficios($saldos_e_beneficios);

        $output->setContribuicoesMensaisParticipante($contribuicoes_mensais_participante);

        $output->setBeneficios($beneficios);

        // Define os dados da simulação e do participante
        $output->setDadosSimulacao($dadosSimulacaoFormatados['dados_simulacao']);
        $output->setDadosParticipante($dadosSimulacaoFormatados['dados_participante']);

        // Define informações adicionais
        $informacoesAdicionais = $this->calcularInformacoesAdicionais($dadosCalculo, $beneficios);

        $planoCusteioVigente = $this->calcularPlanoCusteioVigente($dadosCalculo);



        $output->setInformacoesAdicionais($informacoesAdicionais);
        $output->setPlanoCusteioVigente($planoCusteioVigente);

        // Define o teto RPPS como string
        $output->setTetoRPPS(number_format($tetoRPPS, 2, '.', ''));
        // Calcula e define o saldo projetado
        $saldoProjetado = $this->calcularSaldoProjetado($dadosCalculo);
        $output->setSaldoProjetado([
            'saldoProjetadoCotasRanParticipante' => $saldoProjetado['saldoProjetadoCotasRanParticipante'],
            'saldoProjetadoCotasRanPatrocinador' => $saldoProjetado['saldoProjetadoCotasRanPatrocinador'],
            'saldoProjetadoCotasRasParticipante' => $saldoProjetado['saldoProjetadoCotasRasParticipante'],
            'valorCotaProjetado' => $saldoProjetado['valorCotaProjetado'],
            'saldoProjetadoRanParticipante' => $saldoProjetado['saldoProjetadoRanParticipante'],
            'saldoProjetadoRanPatrocinador' => $saldoProjetado['saldoProjetadoRanPatrocinador'],
            'saldoProjetadoRasParticipante' => $saldoProjetado['saldoProjetadoRasParticipante'],
        ]);
        // Calcula e define o total rentabilizado
        $totalRentabilizado = $this->calcularTotalRentabilizado($dadosCalculo);
        $output->setTotalRentabilizado([
            'totalRentabilizadoRanParticipante' => $totalRentabilizado['totalRentabilizadoRanParticipante'],
            'totalRentabilizadoRanPatrocinador' => $totalRentabilizado['totalRentabilizadoRanPatrocinador'],
            'totalRentabilizadoRasParticipante' => $totalRentabilizado['totalRentabilizadoRasParticipante'],
        ]);
        // Define o benefício normal usando os valores já calculados
        $output->setBeneficioAposentadoriaNormal([
            'saldoTotalRan' => $beneficioNormal['saldoTotalRan'],
            'fatorSobrevida' => $beneficioNormal['fatorSobrevida'],
            'valorBeneficioMensalBruto' => $beneficioNormal['valorBeneficioMensalBruto'],
        ]);
        // Define o benefício suplementar usando os valores já calculados
        $output->setBeneficioSuplementar([
            'saldoRasTotal' => $beneficioSuplementar['saldoRasTotal'],
            'prazo' => $beneficioSuplementar['prazo'],
            'percentualSaque' => $beneficioSuplementar['percentualSaque'],
            'valorSaque' => $beneficioSuplementar['valorSaque'],
            'valorBeneficioSumplementarMensal' => $beneficioSuplementar['valorBeneficioSumplementarMensal'],
        ]);
        // Adiciona o valor do benefício suplementar mensal ao dadosCalculo
        $dadosCalculo['valorBeneficioSumplementarMensal'] = $beneficioSuplementar['valorBeneficioSumplementarMensal'];
        $output->setSaldoRentabilizado([
            'saldoRanRentabilizado' => $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRanParticipante'],
            'beneficioNormalBruto' => $beneficioNormal['valorBeneficioMensalBruto'],
            'saldoRasRentabilizado' => $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRasParticipante'],
            'beneficioSuplementarBruto' => $beneficioSuplementar['valorBeneficioSumplementarMensal'],
        ]);
        // Define as contribuições simuladas
        $output->setContribuicoesSimuladas($contribuicoes['contribuicoes']);

        // Calcula e define performance e benefício líquido
        $performance = $contribuicoes['performance'] ?? [];
        $beneficioLiquido = $this->calcularBeneficioLiquido($beneficioNormal, $beneficioSuplementar);

        $output->setPerformance($performance);
        $output->setBeneficioLiquido($beneficioLiquido);

        $urp = $this->calcularIndexadorUrp();
        $output->setUrp($urp);

        return $output;
    }

    public function calcularIndexadorUrp(): array
    {
        $totalUrps = self::TOTAL_URPS;
        $indexadoresURPs = $this->indexadorValorService->getByCodigo('URP');

        $ano = (new DateTimeImmutable())->sub(new DateInterval('P1Y'))->format('Y');
        $indexadorUrp = null;
        foreach ($indexadoresURPs as $indexador) {
            if (str_contains($indexador->getDtIndexador(), '11/' . $ano)) {
                $indexadorUrp = $indexador;
                break;
            }
        }

        return [
            'valorUrp' => $indexadorUrp->getValor(),
            'urps' => $totalUrps,
            'tetoUrp' => $indexadorUrp->getValor() * $totalUrps,
        ];
    }

    public function getLastHistoricoSalario(string $cpf): float
    {
        $lastHistoricoSalario = $this->repository->getLastHistoricoSalario($cpf);

        return $lastHistoricoSalario;
    }

    /**
     * Obtém o teto do RPPS
     */
    private function obterTetoRPPS(): float
    {
        $tetoRPPS = $this->repository->getRemuneracaoTetoRGPS();

        return $tetoRPPS ? $tetoRPPS['valor'] : 0;
    }

    /**
     * Prepara os dados da simulação para o output
     */
    private function prepararDadosSimulacao(array $dadosCalculo): array
    {
        $dadosParticipante = $dadosCalculo['dadosParticipante'];
        $valorCotaAtual = floatval($dadosCalculo['valorCotaAtual']);
        $valorCotaProjetado = floatval($dadosCalculo['valorCotaProjetado']);
        // Calcula valores de contribuição
        $valoresContribuicao = $this->calcularValoresContribuicao($dadosCalculo);

        // Calcula quantidades de cotas
        $cotas = $this->calcularQuantidadesCotasPorTipo($dadosCalculo, $valorCotaAtual, $valorCotaProjetado);

        return [
            'dados_participante' => $this->formatarDadosParticipante($dadosCalculo),
            'dados_simulacao' => array_merge(
                $this->prepararDadosPessoais($dadosParticipante),
                $this->prepararDadosPlano($dadosCalculo),
                $this->prepararDadosContribuicao($dadosCalculo, $valoresContribuicao),
                $this->prepararDadosCotas($cotas, $valorCotaAtual, $valorCotaProjetado),
                $this->prepararDadosProjecao($dadosCalculo)
            ),
        ];
    }

    /**
     * Normaliza o regime tributário de abreviação para nome completo
     * 
     * Para participantes que aderiram após a Lei 14.803/2024 (11/01/2024) e não fizeram
     * opção pelo regime tributário, retorna "Não informado" em vez de "Progressivo".
     * 
     * @param string|null $regimeTributacao
     * @param string|null $dataAdesao Data de adesão do participante (formato dd/mm/yyyy)
     * @param string|null $dataOpcaoTributacao Data de opção pelo regime tributário (formato dd/mm/yyyy ou null)
     * @return string
     */
    private function normalizarRegimeTributacao(?string $regimeTributacao, ?string $dataAdesao = null, ?string $dataOpcaoTributacao = null): string
    {
        // Se o regime está vazio/null, verifica se deve retornar "Não informado"
        if (empty($regimeTributacao)) {
            // Verifica se aderiu após a Lei 14.803/2024 (11/01/2024) e não fez opção
            if ($dataAdesao && empty($dataOpcaoTributacao)) {
                try {
                    $dataAdesaoObj = null;

                    // Tenta parsear em formato brasileiro (dd/mm/yyyy)
                    $dataAdesaoObj = DateTime::createFromFormat('d/m/Y', $dataAdesao);

                    // Se falhar, tenta formato ISO (yyyy-mm-dd)
                    if (!$dataAdesaoObj) {
                        $dataAdesaoObj = DateTime::createFromFormat('Y-m-d', $dataAdesao);
                    }

                    // Se ainda falhar, tenta criar diretamente
                    if (!$dataAdesaoObj) {
                        $dataAdesaoObj = new DateTime($dataAdesao);
                    }

                    if ($dataAdesaoObj) {
                        $dataLei = new DateTime('2024-01-11');
                        $dataLei->setTime(0, 0, 0);
                        $dataAdesaoObj->setTime(0, 0, 0);

                        if ($dataAdesaoObj >= $dataLei) {
                            return 'Não informado';
                        }
                    }
                } catch (\Exception $e) {
                    // Se houver erro ao parsear a data, mantém o comportamento padrão
                    $this->logger->warning('Erro ao parsear data de adesão para normalização de regime tributário', [
                        'dataAdesao' => $dataAdesao,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            return 'Progressivo';
        }

        $regimeTributacao = strtoupper(trim($regimeTributacao));

        return match ($regimeTributacao) {
            'R', 'REGRESSIVO' => 'Regressivo',
            'P', 'PROGRESSIVO' => 'Progressivo',
            'NÃO INFORMADO', 'NAO INFORMADO', 'N', 'NI' => 'Não informado',
            default => 'Progressivo', // Padrão
        };
    }

    /**
     * Formata os dados do participante para o formato esperado
     */
    private function formatarDadosParticipante(array $dadosCalculo): array
    {
        $dadosParticipante = $dadosCalculo['dadosParticipante'];

        return [
            'data_nascimento' => $dadosParticipante->getDtNascimento(),
            'tipo_participante' => $dadosCalculo['planoSituacaoAtual'],
            'data_adesao' => $dadosParticipante->getDtExercicio(),
            'regime_tributacao' => $this->normalizarRegimeTributacao(
                $dadosCalculo['regimeTributacao'] ?? null,
                $dadosParticipante->getDtExercicio(),
                $dadosParticipante->getDtOpcaoTributacao()
            ),
            'data_opcao_regime_tributario' => $dadosParticipante->getDtOpcaoTributacao(),
            'idade_provavel_aposentadoria' => $dadosCalculo['idadePrevistaAposentadoria'] . ' anos',
            'prazo_recebimento_aposentadoria_normal' => $dadosCalculo['fatorTabuaAtuarial'] . ' meses',
            'prazo_recebimento_aposentadoria_suplementar' => $dadosCalculo['prazoRecebimento'] . ' meses',
        ];
    }

    /**
     * Calcula os valores de contribuição
     */
    private function calcularValoresContribuicao(array $dadosCalculo): array
    {
        $valorNormal = 0;
        $valorFacultativa = 0;

        // Verifica se valorContribuicaoNormal é um array ou valor direto
        if (isset($dadosCalculo['valorContribuicaoNormal'])) {
            if (is_array($dadosCalculo['valorContribuicaoNormal'])) {
                $valorNormal = $dadosCalculo['valorContribuicaoNormal']['valorLiquido'] ?? 0;
            } else {
                $valorNormal = floatval($dadosCalculo['valorContribuicaoNormal']);
            }
        }

        // Verifica se valorContribuicaoFacultativa é um array ou valor direto
        if (isset($dadosCalculo['valorContribuicaoFacultativa'])) {
            if (is_array($dadosCalculo['valorContribuicaoFacultativa'])) {
                $valorFacultativa = $dadosCalculo['valorContribuicaoFacultativa']['valorLiquido'] ?? 0;
            } else {
                $valorFacultativa = floatval($dadosCalculo['valorContribuicaoFacultativa']);
            }
        }

        return [
            'normal' => $valorNormal,
            'facultativa' => $valorFacultativa,
            'vinculada' => $this->calcularValorContribuicaoVinculada($dadosCalculo['salarioParticipante']),
        ];
    }

    /**
     * Calcula as quantidades de cotas por tipo de conta
     */
    private function calcularQuantidadesCotasPorTipo(array $dadosCalculo, float $valorCotaAtual, float $valorCotaProjetado): array
    {
        return [
            'ranParticipante' => $this->calcularQuantidadesCotas(
                $dadosCalculo['saldoRanParticipante'],
                $valorCotaAtual,
                $valorCotaProjetado
            ),
            'ranPatrocinador' => $this->calcularQuantidadesCotas(
                $dadosCalculo['saldoRanPatrocinador'],
                $valorCotaAtual,
                $valorCotaProjetado
            ),
            'rasParticipante' => $this->calcularQuantidadesCotas(
                $dadosCalculo['saldoRasParticipante'],
                $valorCotaAtual,
                $valorCotaProjetado
            ),
        ];
    }

    /**
     * Calcula as quantidades de cotas atual e projetada
     *
     * @param float $saldo Saldo da conta
     * @param float $valorCotaAtual Valor atual da cota
     * @param float $valorCotaProjetado Valor projetado da cota
     * @return array Array com as quantidades de cotas atual e projetada
     */
    private function calcularQuantidadesCotas(float $saldo, float $valorCotaAtual, float $valorCotaProjetado): array
    {
        return [
            'atual' => $saldo / $valorCotaAtual,
            'projetado' => $saldo / $valorCotaProjetado,
        ];
    }

    /**
     * Prepara os dados pessoais do participante
     */
    private function prepararDadosPessoais($dadosParticipante): array
    {
        return [
            'nome' => $dadosParticipante->getNome(),
            'dataNascimento' => $dadosParticipante->getDtNascimento(),
            'sexo' => $dadosParticipante->getSexo(),
            'dtInscricaoPlano' => $dadosParticipante->getDtInscricaoPlano(),
            'idParticipante' => $dadosParticipante->getId(),
            'inscricao' => $dadosParticipante->getInscricao(),
            'matricula' => $dadosParticipante->getMatricula(),
            'rg' => $dadosParticipante->getRg(),
            'emissorRg' => $dadosParticipante->getEmissorRg(),
            'ufRg' => $dadosParticipante->getUfRg(),
            'dataExpedicaoRg' => $dadosParticipante->getDtExpedicaoRg(),
            'estadoCivil' => $dadosParticipante->getEstadoCivil(),
            'email' => $dadosParticipante->getEmail(),
            'id_situacao' => $dadosParticipante->getIdCargo(),
            'dataAdmissao' => $dadosParticipante->getDtExercicio(),
            'idTrust' => $dadosParticipante->getId(),
            'dadosParticipante' => $dadosParticipante,
        ];
    }

    /**
     * Prepara os dados do plano
     */
    private function prepararDadosPlano(array $dadosCalculo): array
    {
        $dadosParticipante = $dadosCalculo['dadosParticipante'];

        return [
            'planoSituacao' => $dadosCalculo['planoSituacao'],
            'planoSituacaoConsiderada' => $dadosCalculo['planoSituacao'],
            'dataSaldoConta' => $dadosCalculo['dataSaldoConta'],
            'saldoRanParticipante' => $dadosCalculo['saldoRanParticipante'],
            'saldoRanPatrocinador' => $dadosCalculo['saldoRanPatrocinador'],
            'saldoRasParticipante' => $dadosCalculo['saldoRasParticipante'],
            'regimeTributacao' => $this->normalizarRegimeTributacao(
                $dadosCalculo['regimeTributacao'] ?? null,
                $dadosParticipante->getDtExercicio(),
                $dadosParticipante->getDtOpcaoTributacao()
            ),
            'fatorTabuaAtuarial' => $dadosCalculo['fatorTabuaAtuarial'],
            'fatorSobrevida' => $dadosCalculo['fatorSobrevida'],
            'fatorSobrevidaRas' => $dadosCalculo['fatorSobrevidaRas'],
        ];
    }

    /**
     * Prepara os dados de contribuição
     */
    private function prepararDadosContribuicao(array $dadosCalculo, array $valoresContribuicao): array
    {
        return [
            'salarioParticipante' => $dadosCalculo['salarioParticipante'],
            'percentualContribuicaoNormal' => $dadosCalculo['percentualContribuicaoNormal'],
            'percentualContribuicaoVinculada' => 0,
            'percentualContribuicaoFacultativa' => $dadosCalculo['percentualContribuicaoFacultativa'],
            'novoPercentualContribuicaoNormal' => $dadosCalculo['percentualContribuicaoNormal'],
            'novoPercentualContribuicaoVinculada' => self::PERCENTUAL_VINCULADO,
            'novoPercentualContribuicaoFacultativa' => $dadosCalculo['percentualContribuicaoFacultativa'],
            'valorContribuicaoNormal' => $valoresContribuicao['normal'],
            'valorContribuicaoVinculada' => 0,
            'novoValorContribuicaoNormal' => $valoresContribuicao['normal'],
            'novoValorContribuicaoVinculada' => $valoresContribuicao['vinculada'],
            'valorContribuicaoFacultativa' => $valoresContribuicao['facultativa'],
            'novoValorContribuicaoFacultativa' => $valoresContribuicao['facultativa'],
            'fcbe' => self::FCBE,
            'pga' => self::TAXA_ADMINISTRATIVA,
        ];
    }

    /**
     * Prepara os dados de cotas
     */
    private function prepararDadosCotas(array $cotas, float $valorCotaAtual, float $valorCotaProjetado): array
    {
        return [
            'valorCotaAtual' => $valorCotaAtual,
            'valorCotaProjetado' => $valorCotaProjetado,
            'totalRentabilizadoCotasRanParticipante' => $cotas['ranParticipante']['atual'],
            'totalRentabilizadoCotasRanPatrocinador' => $cotas['ranPatrocinador']['atual'],
            'totalRentabilizadoCotasRasParticipante' => $cotas['rasParticipante']['atual'],
            'qtCotaAtualRanParticipante' => $cotas['ranParticipante']['atual'],
            'qtCotaProjetadoRanParticipante' => $cotas['ranParticipante']['projetado'],
            'qtCotaAtualRanPatrocinador' => $cotas['ranPatrocinador']['atual'],
            'qtCotaProjetadoRanPatrocinador' => $cotas['ranPatrocinador']['projetado'],
            'qtCotaAtualRasParticipante' => $cotas['rasParticipante']['atual'],
            'qtCotaProjetadoRasParticipante' => $cotas['rasParticipante']['projetado'],
        ];
    }

    /**
     * Prepara os dados de projeção
     */
    private function prepararDadosProjecao(array $dadosCalculo): array
    {
        return [
            'aporteExtraordinario' => $dadosCalculo['aporteExtraordinario'],
            'rentabilidadeProjetada' => $dadosCalculo['rentabilidadeProjetada'],
            'idadeAposentadoria' => $dadosCalculo['idadePrevistaAposentadoria'],
            'saqueReserva' => $dadosCalculo['saqueReserva'],
            'prazoRecebimento' => $dadosCalculo['prazoRecebimento'],
            'dataPrevistaAposentadoria' => $dadosCalculo['dataPrevistaAposentadoria'],
            'percentualSaque' => 0,
            'novoSalarioParticipante' => $dadosCalculo['salarioParticipante'],
            'novoAporteExtraordinario' => $dadosCalculo['aporteExtraordinario'],
            'novaRentabilidadeProjetada' => $dadosCalculo['rentabilidadeProjetada'],
            'novaIdadeAposentadoria' => $dadosCalculo['idadePrevistaAposentadoria'],
            'novaDataPrevistaAposentadoria' => $dadosCalculo['dataPrevistaAposentadoria'],
            'novoPrazoRecebimento' => $dadosCalculo['prazoRecebimento'],
            'novoSaqueReserva' => $dadosCalculo['saqueReserva'],
        ];
    }

    /**
     * Valida os dados de entrada
     */
    private function validarInput(SimuladorDTO $input): void
    {
        $violations = $this->validator->validate($input);
        if (count($violations) > 0) {
            throw new InvalidArgumentException($violations->__toString());
        }
        $input->validate();
    }

    /**
     * Calcula o valor da contribuição
     */
    private function calcularValorContribuicao(float $salario, float $percentual, bool $isNormal = true, bool $isDezembro = false): array
    {
        $this->simuladorValidator->validarParametrosContribuicao($salario, $percentual);
        $valorBruto = $this->calculator->calcularValorBrutoContribuicao($salario, $percentual, $isDezembro);
        if (! $isNormal) {
            return $this->criarRetornoContribuicao($valorBruto, $valorBruto, 0, 0);
        }
        $taxaAdmin = round($valorBruto * self::TAXA_ADMINISTRATIVA, 2);
        $taxaFcbe = round($valorBruto * self::FCBE, 2);
        $valorLiquido = round($valorBruto - $taxaAdmin - $taxaFcbe, 2);
        if ($valorLiquido <= 0) {
            throw new InvalidArgumentException('O valor líquido da contribuição deve ser maior que zero');
        }

        return $this->criarRetornoContribuicao($valorBruto, $valorLiquido, $taxaAdmin, $taxaFcbe);
    }

    /**
     * Valida os parâmetros da contribuição
     */
    private function validarParametrosContribuicao(float $salario, float $percentual): void
    {
        if ($salario <= 0) {
            throw new InvalidArgumentException('O salário deve ser maior que zero');
        }
        if ($percentual <= 0) {
            throw new InvalidArgumentException('O percentual de contribuição deve ser maior que zero');
        }
    }

    /**
     * Calcula o valor bruto da contribuição
     */
    private function calcularValorBrutoContribuicao(float $salario, float $percentual, bool $isDezembro): float
    {
        $valorBruto = round($salario * ($percentual / 100), 2);

        return $isDezembro ? round($valorBruto * 2, 2) : $valorBruto;
    }

    /**
     * Cria o array de retorno da contribuição
     */
    private function criarRetornoContribuicao(float $valorBruto, float $valorLiquido, float $taxaAdmin, float $fcbe): array
    {
        return [
            'valorBruto' => $valorBruto,
            'valorLiquido' => $valorLiquido,
            'taxaAdministrativa' => $taxaAdmin,
            'fcbe' => $fcbe,
        ];
    }

    /**
     * Calcula o valor da contribuição facultativa
     */
    /**
     * Calcula o valor da contribuição facultativa
     *
     * Fórmula: salario × percentualContribuicaoFacultativa ÷ 100
     * Observação: Não há descontos aplicados na contribuição facultativa
     *
     * @param float $salario Salário do participante
     * @param float $percentual Percentual de contribuição facultativa
     * @param bool $isDezembro Se é dezembro (13º salário)
     * @return float Valor da contribuição facultativa
     */
    private function calcularValorContribuicaoFacultativa(float $salario, float $percentual, bool $isDezembro = false): float
    {
        if ($percentual > 0 && $percentual < self::PERCENTUAL_MINIMO_CONTRIBUICAO_FACULTATIVA) {
            throw new InvalidArgumentException(sprintf('O valor mínimo para a contribuição facultativa é de %.1f%%', self::PERCENTUAL_MINIMO_CONTRIBUICAO_FACULTATIVA));
        }

        return $this->calculator->calcularValorBrutoContribuicao($salario, $percentual, $isDezembro);
    }

    /**
     * Calcula o número de meses até a aposentadoria
     */
    private function calcularMesesAteAposentadoria(DateTime $dataInicial, DateTime $dataFinal): int
    {
        $diff = $dataInicial->diff($dataFinal);
        $meses = ($diff->y * 12) + $diff->m;

        return $diff->d > 0 ? $meses + 1 : $meses;
    }

    /**
     * Obtém os dados completos do simulador para um participante
     */
    public function getDadosSimulador(string $cpf): array
    {
        try {
            $filter = $this->criarFiltroBase($cpf);
            $dadosParticipante = $this->obterDadosParticipante($filter['cpf']);
            $dadosFinanceiros = $this->obterDadosFinanceiros($filter);
            $dadosPlano = $this->obterDadosPlano($filter);

            return $this->montarDadosSimulacao($dadosParticipante, $dadosFinanceiros, $dadosPlano);
        } catch (\Exception $e) {
            $this->logger->error('Erro ao obter dados do simulador', [
                'cpf' => $cpf,
                'erro' => $e->getMessage(),
            ]);

            throw new SimuladorNotFoundException('Erro ao obter dados do simulador: ' . $e->getMessage());
        }
    }

    /**
     * Cria o filtro base com CPF e idTrust
     */
    private function criarFiltroBase(string $cpf): array
    {
        $dadosParticipante = $this->obterDadosParticipante($cpf)['atual'];

        return [
            'cpf' => $cpf,
            'idParticipante' => $dadosParticipante->getId(),
        ];
    }

    /**
     * Obtém e processa os dados do participante
     */
    private function obterDadosParticipante(string $cpf): array
    {
        $dadosParticipante = $this->participanteRepository->getParticipante($cpf);
        if (empty($dadosParticipante)) {
            throw new SimuladorNotFoundException('Participante não encontrado');
        }

        return ['atual' => $dadosParticipante];
    }

    /**
     * Obtém dados financeiros do participante
     */
    private function obterDadosFinanceiros(array $filter): array
    {
        $dataSaldoConta = $this->repository->getDataIndexador('COTA');
        $dadosPlano = $this->repository->getDadosPlano($filter);
        $valorCotaAtual = $this->repository->getValorCotaAtual($filter);
        $filterContribuicao = new ContribuicaoFilterDTO();
        $filterContribuicao->setDataInicial(null);
        $filterContribuicao->setDataFinal(null);
        $saldos = $this->trustSaldoService->getSaldo($filter['cpf'], $filterContribuicao);

        $saldoRanParticipante['saldoRanParticipante'] = $saldos['contribuicaoNormalParticipanteRan']['totalContribuido'];
        $saldoRanPatrocinador['saldoRanPatrocinador'] = $saldos['contribuicaoNormalPatrocinadorRan']['totalContribuido'];
        $saldoRasParticipante['saldoRasParticipante'] = $saldos['contribuicaoNormalParticipanteRas']['totalContribuido'];
        $saldoRanParticipanteRentabilizado['saldoRanParticipanteRentabilizado'] = $saldos['contribuicaoNormalParticipanteRan']['totalRentabilizado'];
        $saldoRanPatrocinadorRentabilizado['saldoRanPatrocinadorRentabilizado'] = $saldos['contribuicaoNormalPatrocinadorRan']['totalRentabilizado'];
        $saldoRasParticipanteRentabilizado['saldoRasParticipanteRentabilizado'] = $saldos['contribuicaoNormalParticipanteRas']['totalRentabilizado'];

        $salario = $this->participanteRepository->getSalarioParticipante($filter['idParticipante']);
        $percentualNormal = $this->repository->getPercentualContribuicaoNormal($filter);
        $percentualFacultativa = $this->repository->getPercentualContribuicaoFacultativa($filter);
        $rentabilidadeProjetada = $this->getRentabilidadesProjetadas($filter['cpf']);

        return [
            'saldo' => [
                'ranParticipante' => $saldoRanParticipante['saldoRanParticipante'],
                'ranPatrocinador' => $saldoRanPatrocinador['saldoRanPatrocinador'],
                'rasParticipante' => $saldoRasParticipante['saldoRasParticipante'],
                'ranParticipanteRentabilizado' => $saldoRanParticipanteRentabilizado['saldoRanParticipanteRentabilizado'],
                'ranPatrocinadorRentabilizado' => $saldoRanPatrocinadorRentabilizado['saldoRanPatrocinadorRentabilizado'],
                'rasParticipanteRentabilizado' => $saldoRasParticipanteRentabilizado['saldoRasParticipanteRentabilizado'],
            ],
            'salario' => $salario,
            'contribuicoes' => [
                'normal' => [
                    'percentual' => $percentualNormal,
                    'valor' => $salario * ($percentualNormal / 100),
                ],
                'facultativa' => [
                    'percentual' => $percentualFacultativa,
                    'valor' => $salario * ($percentualFacultativa / 100),
                ],
            ],
            'rentabilidade' => floatval($rentabilidadeProjetada['rentabilidadeProjetada']),
            'dataSaldoConta' => $dataSaldoConta,
            'valorCotaAtual' => $valorCotaAtual,
        ];
    }

    /**
     * Obtém dados do plano e situação
     */
    private function obterDadosPlano(array $filter): array
    {
        $dadosPlano = $this->repository->getDadosPlano($filter);
        $idadePrevistaAposentadoria = $this->getIdadePrevistaAposentadoria($filter);
        $idParticpante = $filter['idParticipante'];
        $situacaoConsiderada = $dadosPlano[0]['planoSituacao'];

        if ($situacaoConsiderada === self::SITUACAO_AUTOPATROCINADO && $idParticpante) {
            $situacaoConsiderada = $this->repository->getSituacaoAnteriorParticipante($idParticpante);
        }

        return [
            'categoria' => $dadosPlano[0]['planoCategoria'],
            'situacao' => $dadosPlano[0]['planoSituacao'],
            'regimeTributacao' => $dadosPlano[0]['regimeTributacao'] ?? null,
            'situacaoConsiderada' => $situacaoConsiderada,
            'aposentadoria' => $idadePrevistaAposentadoria,
            'perfis' => [
                'lista' => $this->getPerfisInvestimento(),
                'recomendado' => $this->getPerfilRecomendado($filter),
            ],
        ];
    }

    /**
     * Monta o array final com todos os dados da simulação
     */
    private function montarDadosSimulacao(array $dadosParticipante, array $dadosFinanceiros, array $dadosPlano): array
    {
        return [
            'dadosParticipante' => $dadosParticipante['atual'],
            'idadePrevistaAposentadoria' => $dadosPlano['aposentadoria']['idadePrevista'],
            'dataPrevistaAposentadoria' => $dadosPlano['aposentadoria']['dataPrevistaAposentadoria'],
            'planoCategoria' => $dadosPlano['categoria'],
            'planoSituacao' => $dadosPlano['situacao'],
            'regimeTributacao' => $dadosPlano['regimeTributacao'],
            'saldoRanParticipante' => $dadosFinanceiros['saldo']['ranParticipante'],
            'saldoRanPatrocinador' => $dadosFinanceiros['saldo']['ranPatrocinador'],
            'saldoRasParticipante' => $dadosFinanceiros['saldo']['rasParticipante'],
            'saldoRanParticipanteRentabilizado' => $dadosFinanceiros['saldo']['ranParticipanteRentabilizado'],
            'saldoRanPatrocinadorRentabilizado' => $dadosFinanceiros['saldo']['ranPatrocinadorRentabilizado'],
            'saldoRasParticipanteRentabilizado' => $dadosFinanceiros['saldo']['rasParticipanteRentabilizado'],
            'salarioParticipante' => $dadosFinanceiros['salario'],
            'percentualContribuicaoNormal' => $dadosFinanceiros['contribuicoes']['normal']['percentual'],
            'valorContribuicaoNormal' => $dadosFinanceiros['contribuicoes']['normal']['valor'],
            'percentualContribuicaoFacultativa' => $dadosFinanceiros['contribuicoes']['facultativa']['percentual'],
            'valorContribuicaoFacultativa' => $dadosFinanceiros['contribuicoes']['facultativa']['valor'],
            'rentabilidadeRealProjetada' => $dadosFinanceiros['rentabilidade'],
            'dataSaldoConta' => $dadosFinanceiros['dataSaldoConta'],
            'valorCotaAtual' => $dadosFinanceiros['valorCotaAtual'],
            'percentuaisPatrocinados' => $this->getPercentuaisContribuicao($dadosPlano['situacaoConsiderada']),
            'listaPerfilDeInvestimento' => $dadosPlano['perfis']['lista'],
            'perfilDeInvestimentoRecomendadoSimulador' => $dadosPlano['perfis']['recomendado'],
        ];
    }

    /**
     * Obtém os percentuais de contribuição baseado na situação do plano
     */
    private function getPercentuaisContribuicao(string $planoSituacao): array
    {
        return match ($planoSituacao) {
            self::SITUACAO_PATROCINADO => [6.5, 7.0, 7.5, 8.0, 8.5],
            self::SITUACAO_VINCULADO => range(6.5, 22, 0.5),
            self::SITUACAO_PATROCINADO_CJ => [6.5, 7.0, 7.5, 8.0, 8.5],
            default => []
        };
    }

    /**
     * Obtém a idade prevista de aposentadoria
     */
    private function getIdadePrevistaAposentadoria(array $filter): array
    {
        $dadosParticipante = $this->participanteRepository->getParticipante($filter['cpf']);
        $sexo = $dadosParticipante->getSexo();
        $idadePrevista = $sexo === 'F' ? 62 : 65;
        $dataNascimento = DateTime::createFromFormat('d/m/Y', $dadosParticipante->getdtNascimento());
        $dataAdesao = new DateTime($dadosParticipante->getdtInscricaoPlano());
        $dataPrevistaAposentadoria = (clone $dataNascimento)->modify("+{$idadePrevista} years");
        $dataAtual = new DateTime();
        $diferencaNascimentoAdesaoMinima = date_diff($dataAdesao, $dataNascimento);
        $tempoRestante = date_diff($dataAtual, $dataPrevistaAposentadoria);
        if ($diferencaNascimentoAdesaoMinima->y > $idadePrevista) {
            $idadePrevista = $diferencaNascimentoAdesaoMinima->y;
            $tempoRestante = date_diff($dataAtual, $dataAdesao);
        }

        return [
            'idadePrevista' => $idadePrevista,
            'tempoRestante' => $tempoRestante,
            'dataPrevistaAposentadoria' => $dataPrevistaAposentadoria,
        ];
    }

    /**
     * Obtém os perfis de investimento disponíveis
     */
    public function getPerfisInvestimento(): array
    {
        return [
            ['id' => '1', 'nome' => 'Horizonte 2040'],
            ['id' => '2', 'nome' => 'Horizonte 2050'],
            ['id' => '3', 'nome' => 'Horizonte Protegido'],
        ];
    }

    /**
     * Obtém o perfil de investimento recomendado
     */
    public function getPerfilRecomendado(array $filter): int
    {
        $idadePrevistaAposentadoria = $this->getIdadePrevistaAposentadoria($filter);

        return $idadePrevistaAposentadoria['dataPrevistaAposentadoria']->format('Y') <= 2046 ? 1 : 2;
    }

    /**
     * Obtém as rentabilidades projetadas
     */
    public function getRentabilidadesProjetadas(string $cpf): array
    {
        $perfilInvestimento = $this->trustParticipanteService->getPerfilAtual($cpf)['idPerfil'];
        $idIndexadorCotaPerfil = IndexadorValorEnum::getBenchmarkPerfilInvestimentoByIdPerfilTrust($perfilInvestimento);
        $rentabilidadeProjetada = $this->repository->getRentabilidadeProjetada($idIndexadorCotaPerfil);

        // Se não houver rentabilidade projetada, usa a rentabilidade alternativa
        if (empty($rentabilidadeProjetada) || ! isset($rentabilidadeProjetada['rentabilidadeProjetada'])) {
            return [
                'rentabilidadeProjetada' => self::RENTABILIDADE_ALTERNATIVA,
                'rentabilidadeAlternativa' => self::RENTABILIDADE_ALTERNATIVA,
            ];
        }
        $taxaAtual = floatval($rentabilidadeProjetada['rentabilidadeProjetada']);
        $taxaAlternativa = $taxaAtual == 4.15 ? 4.50 : 4.15;

        return [
            'rentabilidadeProjetada' => $taxaAtual,
            'rentabilidadeAlternativa' => $taxaAlternativa,
        ];
    }

    public function preparaDadosSimulacaoSimplificada(string $cpf, int|null $idPerfil = null): SimuladorDTO
    {

        //* Busca o participante
        $participante = $this->trustParticipanteService->getParticipante($cpf);

        //*Busca o perfil do particiapante
        $perfil = (empty($idPerfil) ? $this->trustParticipanteService->getPerfilAtual($cpf)['idPerfil'] : $idPerfil);

        //*Busca o plano do participante
        $planoPercentualContribuicao = $this->trustPlanoService->getPlanosByCpf($cpf)[0]->getPercentualContribuicao();

        //* Busca o percentual de rentabilidade do perfil de investimento
        // $codigoPerfilInvestimento = IndexadorValorEnum::getCodigoPerfilInvestimentoByIdIndexadorTrust($perfil);
        // $indexadorValor = $this->indexadorValorService->getLastValueByCodigo($codigoPerfilInvestimento);
        // $percentualContribuicaoNormal = $indexadorValor[0]->getPercentual() * 100;
        $idIndexadorCotaPerfil = IndexadorValorEnum::getBenchmarkPerfilInvestimentoByIdPerfilTrust($perfil);
        $ultimoValorIndexadorPerfilInvestimento = $this->indexadorValorService->getLastValueByCodigo($idIndexadorCotaPerfil);
        $rentabilidadeProjetada = $ultimoValorIndexadorPerfilInvestimento[0]->getValor();

        //* Busca a última contribuição facultativa do participante
        $ultimaContribuicaoFacultativa = $this->trustContribuicaoService->getUltimaContribuicaoFacultativaByCpf($participante->getId());

        //* Busca o salario do participante
        $salarioParticipante = $this->trustParticipanteService->getSalarioParticipante($cpf);

        // Mesclar os dados do CPF com os dados da requisição
        $dataNascimento = $participante->getDtNascimento() ?? null;

        // Converter data do formato brasileiro (dd/mm/yyyy) para formato ISO (yyyy-mm-dd)
        if ($dataNascimento) {
            $dataNascimento = \DateTime::createFromFormat('d/m/Y', $dataNascimento);
            if ($dataNascimento) {
                $dataNascimento = $dataNascimento->format('Y-m-d');
            }
        }

        $data = [];
        $data['cpf'] = $cpf;
        $data['dataNascimento'] = $dataNascimento;
        $data['sexo'] = $participante->getSexo();
        $data['idadeAposentadoria'] = $participante->getSexo() == 'M' ? 65 : 62;
        $data['rentabilidadeProjetada'] = $rentabilidadeProjetada;
        $data['salarioParticipante'] = $salarioParticipante;

        $data['percentualContribuicaoNormal'] = $planoPercentualContribuicao;

        $data['percentualContribuicaoFacultativa'] = isset($ultimaContribuicaoFacultativa['PC_CONTRIB']) ? $ultimaContribuicaoFacultativa['PC_CONTRIB'] : 0;
        $data['aporteExtraordinario'] = 0;
        $data['prazoRecebimento'] = 480;
        $data['saqueReserva'] = 0;

        return new SimuladorDTO($data);
    }

    /**
     * Obtém os dados do plano
     */
    public function getDadosPlano(string $cpf): array
    {
        $filter = $this->criarFiltroBase($cpf);

        return $this->obterDadosPlano($filter);
    }

    /**
     * Obtém o histórico de simulações
     */
    public function getHistoricoSimulacoes(string $cpf): array
    {
        return $this->repository->getHistoricoContribuicoes($cpf);
    }

    /**
     * Obtém os parâmetros padrão
     */
    public function getParametrosPadrao(): array
    {
        return [
            'fcbe' => self::FCBE,
            'taxaAdministrativa' => self::TAXA_ADMINISTRATIVA,
            'rentabilidadeAlternativa' => self::RENTABILIDADE_ALTERNATIVA,
        ];
    }

    /**
     * Calcula o valor líquido da contribuição
     */
    private function calcularValorLiquidoContribuicao(float $valorBruto, bool $isVinculado = false): float
    {
        $taxaAdmin = $valorBruto * self::TAXA_ADMINISTRATIVA;
        $taxaFcbe = $valorBruto * self::FCBE;

        if ($isVinculado) {
            return round($valorBruto - $taxaAdmin, 2);
        }

        return round($valorBruto - $taxaAdmin - $taxaFcbe, 2);
    }

    /**
     * Calcula a quantidade de cotas
     */
    private function calcularQuantidadeCotasContribuicao(float $valorContribuicao, float $valorCota): float
    {
        return $valorContribuicao / $valorCota;
    }

    /**
     * Calcula o valor total em cotas
     */
    private function calcularValorTotalCotas(float $quantidadeCotas, float $valorCota): float
    {
        return $quantidadeCotas * $valorCota;
    }

    /**
     * Cria o array de contribuição simulada
     */
    private function criarContribuicaoSimulada(
        string $referencia,
        string $conta,
        float $valorContribuicao,
        float $valorCota,
        float $quantidadeCotas,
        float $totalCotas
    ): array {
        return [
            'referencia' => $referencia,
            'conta' => $conta,
            'valorContribuicao' => $valorContribuicao,
            'valorCota' => $valorCota,
            'quantidadeCotasAtual' => $quantidadeCotas,
            'saldoCotaTotal' => $totalCotas,
            'valorSaldoTotal' => $this->calcularValorTotalCotas($totalCotas, $valorCota),
        ];
    }

    /**
     * Calcula o valor da contribuição normal
     */
    private function calcularValorContribuicaoNormal(float $salario, float $percentual, bool $isDezembro = false): float
    {
        $valorBruto = $this->calculator->calcularValorBrutoContribuicao($salario, $percentual, $isDezembro);

        return $this->calcularValorLiquidoContribuicao($valorBruto);
    }

    /**
     * Calcula o valor da contribuição vinculado
     */
    private function calcularValorContribuicaoVinculado(float $salario, float $percentual, bool $isDezembro = false): float
    {
        $valorBruto = $this->calculator->calcularValorBrutoContribuicao($salario, $percentual, $isDezembro);

        return $this->calcularValorLiquidoContribuicao($valorBruto, true);
    }


    /**
     * Calcula os saldos projetados
     */
    private function calcularSaldoProjetado(array $dadosCalculo): array
    {
        $valorCotaProjetado = floatval($dadosCalculo['valorCotaProjetado']);
        $totalRentabilizadoCotasRanParticipante = floatval($dadosCalculo['totalRentabilizadoCotasRanParticipante']);
        $totalRentabilizadoCotasRanPatrocinador = floatval($dadosCalculo['totalRentabilizadoCotasRanPatrocinador']);
        $totalRentabilizadoCotasRasParticipante = floatval($dadosCalculo['totalRentabilizadoCotasRasParticipante']);

        return [
            'saldoProjetadoCotasRanParticipante' => $totalRentabilizadoCotasRanParticipante,
            'saldoProjetadoCotasRanPatrocinador' => $totalRentabilizadoCotasRanPatrocinador,
            'saldoProjetadoCotasRasParticipante' => $totalRentabilizadoCotasRasParticipante,
            'valorCotaProjetado' => $valorCotaProjetado,
            'saldoProjetadoRanParticipante' => $this->calcularValorTotalCotas($totalRentabilizadoCotasRanParticipante, $valorCotaProjetado),
            'saldoProjetadoRanPatrocinador' => $this->calcularValorTotalCotas($totalRentabilizadoCotasRanPatrocinador, $valorCotaProjetado),
            'saldoProjetadoRasParticipante' => $this->calcularValorTotalCotas($totalRentabilizadoCotasRasParticipante, $valorCotaProjetado),
        ];
    }

    /**
     * @param $anoNascimento
     * @param $idadeAposentadoria
     * @param $sexo
     * @return mixed
     */
    public function getFatorVida($anoNascimento, $idadeAposentadoria, $sexo)
    {
        /*
         * A tabela de fator atuarial não possui valores para nascidos depois de 2000.
         * conforme orientação da GEABE, consideramos o 2000 para anos posteriores
         * */
        if ($anoNascimento > 2000) {
            $anoNascimento = 2000;
        }

        $fator = $this->repository->getFatorAtuarial($anoNascimento, $idadeAposentadoria);

        if ($sexo == 'F') {
            return intval($fator[0]['fatorMulher']);
        } else {
            return intval($fator[0]['fatorHomem']);
        }
    }

    /**
     * Calcula o benefício normal
     *
     * Fórmula: saldoTotalRan ÷ fatorTabuaAtuarial
     * Observação: Usa fatorTabuaAtuarial diretamente da tabela FATOR_ATUARIAL,
     * não o fatorSobrevida calculado (que inclui gratificação natalina)
     */
    private function calcularBeneficioNormal(array $dadosCalculo, $contribuicoes): array
    {
        $isVinculadoOuSalarioMenorTeto = $this->isVinculadoOuSalarioMenorTeto($dadosCalculo);

        $dataNascimento = DateTime::createFromFormat('d/m/Y', $dadosCalculo['dadosParticipante']->getdtNascimento());

        $idadePrevista = $dadosCalculo['idadePrevistaAposentadoria'];

        $sexo = $dadosCalculo['dadosParticipante']->getSexo();
        $prazoRecebimentoBeneficioSuplementar = $dadosCalculo['prazoRecebimento'];
        $taxaAnual = floatval($dadosCalculo['rentabilidadeProjetada']) / 100;

        $fatorTabuaAtuarial = intval($this->getFatorVida($dataNascimento->format('Y'), $idadePrevista, $sexo));
        $taxaMensal = pow(1 + $taxaAnual, 1 / 12) - 1;
        $fatorSobrevidaBeneficio = $this->calculaFatorConversaoBeneficio($taxaMensal, $fatorTabuaAtuarial, -1, 0, 0);
        $fatorSobrevidaBeneficioGratificacaoNatalina = $this->calculaFatorConversaoBeneficio($taxaAnual, $fatorTabuaAtuarial / 12, -1, 0, 0);
        $fatorSobrevida = $fatorSobrevidaBeneficio + $fatorSobrevidaBeneficioGratificacaoNatalina;
        $fatorSobrevidaBeneficioRAS = $this->calculaFatorConversaoBeneficio($taxaMensal, $prazoRecebimentoBeneficioSuplementar, -1, 0, 0);
        $fatorSobrevidaBeneficioGratificacaoNatalinaRas = $this->calculaFatorConversaoBeneficio($taxaAnual, $prazoRecebimentoBeneficioSuplementar / 12, -1, 0, 0);
        $fatorSobrevidaRas = $fatorSobrevidaBeneficioRAS + $fatorSobrevidaBeneficioGratificacaoNatalinaRas;

        $valorCotaProjetado = floatval($dadosCalculo['valorCotaProjetado']);

        $totalRentabilizadoCotasRanParticipante = $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRanParticipante'];
        $totalRentabilizadoCotasRanPatrocinador = $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRanPatrocinador'];

        $totalRentabilizadoCotasRanParticipante = floatval($totalRentabilizadoCotasRanParticipante);
        $totalRentabilizadoCotasRanPatrocinador = floatval($totalRentabilizadoCotasRanPatrocinador);

        $saldoTotalRan = $this->calcularValorTotalCotas(
            $totalRentabilizadoCotasRanParticipante + $totalRentabilizadoCotasRanPatrocinador,
            $valorCotaProjetado
        );

        return [
            'saldoTotalRan' => $saldoTotalRan,
            'fatorSobrevida' => $fatorSobrevida,
            'fatorSobrevidaRas' => $isVinculadoOuSalarioMenorTeto ? $fatorSobrevidaRas : $fatorSobrevidaBeneficioRAS,
            'fatorTabuaAtuarial' => $fatorTabuaAtuarial,
            'valorBeneficioMensalBruto' => $saldoTotalRan / $fatorSobrevida,
        ];
    }

    /**
     * @param int $taxa
     * @param int $periodo
     * @param int $pagamento
     * @param int $valorFuturo
     * @param int $tipo
     * @return false|float|int
     */
    public function calculaFatorConversaoBeneficio($taxa = 0, $periodo = 0, $pagamento = 0, $valorFuturo = 0, $tipo = 0)
    {
        if ($tipo != 0 && $tipo != 1) {
            return false;
        }
        if ($taxa != 0.0) {
            return (-$pagamento * (1 + $taxa * $tipo) * ((pow(1 + $taxa, $periodo) - 1) / $taxa)) / pow(1 + $taxa, $periodo);
        } else {
            return -$valorFuturo - $pagamento * $periodo;
        }
    }

    /**
     * Calcula o benefício suplementar
     */
    private function calcularBeneficioSuplementar(array $dadosCalculo, array $contribuicoes, array $beneficioNormal): array
    {
        $valorCotaProjetado = floatval($dadosCalculo['valorCotaProjetado']);
        $valorCotaAtual = floatval($dadosCalculo['valorCotaAtual']);
        $totalRentabilizadoCotasRasParticipante = $contribuicoes['totaisRentabilizados']['totalRentabilizadoCotasRasParticipante'];
        $totalRentabilizadoCotasRasParticipante = floatval($totalRentabilizadoCotasRasParticipante);

        $fatorSobrevidaRas = floatval($beneficioNormal['fatorSobrevidaRas'] ?? 1);

        // Calcula o saldo total RAS considerando aporte extraordinário
        $saldoRasTotal = $this->calcularValorTotalCotas($totalRentabilizadoCotasRasParticipante, $valorCotaProjetado);

        // Adiciona aporte extraordinário projetado
        $aporteExtraordinario = floatval($dadosCalculo['aporteExtraordinario'] ?? 0);
        if ($aporteExtraordinario > 0) {
            $aporteExtraordinarioProjetado = $aporteExtraordinario * ($valorCotaProjetado / $valorCotaAtual);
            $saldoRasTotal += $aporteExtraordinarioProjetado;
        }

        // Calcula o valor do saque se houver percentual de saque
        $percentualSaque = floatval($dadosCalculo['saqueReserva'] ?? 0);
        $valorSaque = $percentualSaque > 0 ? ($saldoRasTotal * $percentualSaque / 100) : 0;

        // Calcula o benefício suplementar mensal considerando o saque
        $saldoLiquidoRas = $saldoRasTotal - $valorSaque;
        $valorBeneficioSumplementarMensal = $saldoLiquidoRas / $fatorSobrevidaRas;

        return [
            'saldoRasTotal' => $saldoRasTotal,
            'prazo' => floatval($dadosCalculo['prazoRecebimento'] ?? 480),
            'percentualSaque' => $percentualSaque,
            'valorSaque' => $valorSaque,
            'valorBeneficioSumplementarMensal' => $valorBeneficioSumplementarMensal,
        ];
    }

    /**
     * Calcula o total rentabilizado para cada tipo de conta
     */
    private function calcularTotalRentabilizado(array $dadosCalculo): array
    {
        $valorCotaProjetado = floatval($dadosCalculo['valorCotaProjetado']);
        $totalRentabilizadoCotasRanParticipante = floatval($dadosCalculo['totalRentabilizadoCotasRanParticipante']);
        $totalRentabilizadoCotasRanPatrocinador = floatval($dadosCalculo['totalRentabilizadoCotasRanPatrocinador']);
        $totalRentabilizadoCotasRasParticipante = floatval($dadosCalculo['totalRentabilizadoCotasRasParticipante']);

        return [
            'totalRentabilizadoRanParticipante' => $this->calcularValorTotalCotas($totalRentabilizadoCotasRanParticipante, $valorCotaProjetado),
            'totalRentabilizadoRanPatrocinador' => $this->calcularValorTotalCotas($totalRentabilizadoCotasRanPatrocinador, $valorCotaProjetado),
            'totalRentabilizadoRasParticipante' => $this->calcularValorTotalCotas($totalRentabilizadoCotasRasParticipante, $valorCotaProjetado),
        ];
    }

    /**
     * Calcula as contribuições simuladas
     */
    private function calcularContribuicoes(array $dadosSimulacao, array $dadosCalculo): array
    {
        $isAutopatrocinado = $dadosSimulacao['planoSituacao'] === self::SITUACAO_AUTOPATROCINADO;
        $isBpd = $dadosSimulacao['planoSituacao'] === self::SITUACAO_BPD_DEPOSITO || $dadosSimulacao['planoSituacao'] === self::SITUACAO_BPD_SALDO;

        $isVinculadoOuSalarioMenorTeto = $this->isVinculadoOuSalarioMenorTeto($dadosSimulacao);

        $valorCotaAtual = floatval($dadosCalculo['valorCotaAtual']);
        $valorCotaProjetado = $valorCotaAtual;
        $rentabilidadeProjetada = floatval($dadosCalculo['rentabilidadeProjetada']);

        // Calcula a base de contribuição do Funpresp Jud (salário participante - teto RPPS)
        $baseContribuicaoFunpresp = $dadosCalculo['baseContribuicaoFunpresp'];

        $percentualNormal = floatval($dadosSimulacao['percentualContribuicaoNormal']);
        $percentualFacultativa = floatval($dadosSimulacao['percentualContribuicaoFacultativa']);

        $aporteExtraordinario = isset($dadosCalculo['aporteExtraordinario']) ? $dadosCalculo['aporteExtraordinario'] : 0;

        // Calcula contribuições vigentes
        $valorContribuicaoNormal = $isVinculadoOuSalarioMenorTeto ?
            $this->calcularValorContribuicaoVinculado($baseContribuicaoFunpresp, $percentualNormal) :
            $this->calcularValorContribuicaoNormal($baseContribuicaoFunpresp, $percentualNormal);

        $valorContribuicaoFacultativa = $isBpd ? $percentualFacultativa : $this->calcularValorContribuicaoFacultativa($baseContribuicaoFunpresp, $percentualFacultativa);

        // Debug: Log dos valores calculados
        $this->logger->info('Valores de contribuição calculados', [
            'baseContribuicaoFunpresp' => $baseContribuicaoFunpresp,
            'percentualNormal' => $percentualNormal,
            'percentualFacultativa' => $percentualFacultativa,
            'valorContribuicaoNormal' => $valorContribuicaoNormal,
            'valorContribuicaoFacultativa' => $valorContribuicaoFacultativa,
            'calculo_esperado' => [
                'contribuicao_bruta' => $baseContribuicaoFunpresp * $percentualNormal / 100,
                'desconto_taxa_admin' => ($baseContribuicaoFunpresp * $percentualNormal / 100) * 0.045,
                'desconto_fcbe' => ($baseContribuicaoFunpresp * $percentualNormal / 100) * 0.1344,
                'valor_liquido_esperado' => ($baseContribuicaoFunpresp * $percentualNormal / 100) * (1 - 0.045 - 0.1344),
            ],
        ]);

        // Inicializa totais rentabilizados com saldo atual
        $totalRentabilizadoCotasRanParticipante = $dadosSimulacao['saldoRanParticipanteRentabilizado'] / $valorCotaAtual;
        $totalRentabilizadoCotasRanPatrocinador = $dadosSimulacao['saldoRanPatrocinadorRentabilizado'] / $valorCotaAtual;
        $totalRentabilizadoCotasRasParticipante = $dadosSimulacao['saldoRasParticipanteRentabilizado'] / $valorCotaAtual;
        $totalRentabilizadoCotasRasParticipante = $totalRentabilizadoCotasRasParticipante + $aporteExtraordinario;

        $totalCotasRanParticipante = $dadosSimulacao['saldoRanParticipante'] / $valorCotaAtual;
        $totalCotasRanPatrocinador = $dadosSimulacao['saldoRanPatrocinador'] / $valorCotaAtual;
        $totalCotasRasParticipante = $dadosSimulacao['saldoRasParticipante'] / $valorCotaAtual;

        // Prepara datas
        $dataAtual = new DateTime();
        $dataAtual->setDate($dataAtual->format('Y'), $dataAtual->format('m'), 1);
        $dataAtual->add(\DateInterval::createFromDateString('1 month'));
        $dataAposentadoria = $dadosCalculo['dataAposentadoria'];
        // Prepara iteração
        $dtIteracao = clone $dataAtual;
        $dtIteracao->setTime(0, 0);

        // Prepara array para armazenar contribuições
        $contribuicoesSimuladas = [];

        while ($dtIteracao <= $dataAposentadoria) {
            // Atualiza valor da cota projetada
            $valorCotaProjetado = $this->atualizarValorCotaProjetado($valorCotaProjetado, $rentabilidadeProjetada);
            $isDezembro = $dtIteracao->format('m') == '12';

            // Contribuição do participante (RAN)
            if (!$isBpd) {
                $valorContribuicaoParticipante = $isDezembro ? $valorContribuicaoNormal * 2 : $valorContribuicaoNormal;
                $quantidadeCotasParticipante = $valorContribuicaoParticipante / $valorCotaProjetado;

                $totalCotasRanParticipante += $quantidadeCotasParticipante;
                $totalRentabilizadoCotasRanParticipante = $totalRentabilizadoCotasRanParticipante > 0 ? $totalRentabilizadoCotasRanParticipante + $quantidadeCotasParticipante : $totalRentabilizadoCotasRanParticipante;

                $totalRentabilizadoCotasRanParticipante =
                    $totalRentabilizadoCotasRanPatrocinador <= 0 && $valorContribuicaoNormal > 0 ?
                    $valorContribuicaoNormal : $totalRentabilizadoCotasRanParticipante;

                $conta = $isAutopatrocinado ? self::CONTA_RAN_AUTOPATROCINADO : self::CONTA_RAN_NORMAL_PARTIC;
                $conta = $isVinculadoOuSalarioMenorTeto ? self::CONTA_RAS_VINCULADO : $conta;
                $contribuicao = [
                    'referencia' => $dtIteracao->format('m/Y'),
                    'conta' => $conta,
                    'valorContribuicao' => $valorContribuicaoParticipante,
                    'valorCota' => $valorCotaProjetado,
                    'quantidadeCotasAtual' => $quantidadeCotasParticipante,
                    'saldoCotaTotal' => $totalRentabilizadoCotasRanParticipante,
                    'valorSaldoTotal' => $totalRentabilizadoCotasRanParticipante * $valorCotaProjetado,
                ];
                $contribuicoesSimuladas[] = $contribuicao;
            }

            // Contribuição do patrocinador (RAN)
            if (!$isVinculadoOuSalarioMenorTeto && !$isBpd) {
                $valorContribuicaoPatrocinador = $isDezembro ? $valorContribuicaoNormal * 2 : $valorContribuicaoNormal;
                $quantidadeCotasPatrocinador = $valorContribuicaoPatrocinador / $valorCotaProjetado;
                $quantidadeCotasPatrocinador = $isAutopatrocinado ? 0 : $quantidadeCotasPatrocinador;

                $totalCotasRanPatrocinador += $quantidadeCotasPatrocinador;
                $totalRentabilizadoCotasRanPatrocinador = $totalRentabilizadoCotasRanPatrocinador > 0 ? $totalRentabilizadoCotasRanPatrocinador + $quantidadeCotasPatrocinador : $totalRentabilizadoCotasRanPatrocinador;

                $totalRentabilizadoCotasRanPatrocinador =
                    $totalRentabilizadoCotasRanPatrocinador <= 0 && $valorContribuicaoNormal > 0 ?
                    $valorContribuicaoNormal : $totalRentabilizadoCotasRanPatrocinador;

                $contribuicao = [
                    'referencia' => $dtIteracao->format('m/Y'),
                    'conta' => self::CONTA_RAN_NORMAL_PATROC,
                    'valorContribuicao' => $isAutopatrocinado ? 0 : $valorContribuicaoPatrocinador,
                    'valorCota' => $valorCotaProjetado,
                    'quantidadeCotasAtual' => $quantidadeCotasPatrocinador,
                    'saldoCotaTotal' => $totalRentabilizadoCotasRanPatrocinador,
                    'valorSaldoTotal' => $totalRentabilizadoCotasRanPatrocinador * $valorCotaProjetado,
                ];

                $contribuicoesSimuladas[] = $contribuicao;
            }

            // Contribuição facultativa (RAS)
            $valorContribuicaoFacultativaRas = $isDezembro ? $valorContribuicaoFacultativa * 2 : $valorContribuicaoFacultativa;
            $quantidadeCotasFacultativa = $valorContribuicaoFacultativaRas / $valorCotaProjetado;
            $totalCotasRasParticipante += $quantidadeCotasFacultativa;
            $totalRentabilizadoCotasRasParticipante = $totalRentabilizadoCotasRasParticipante > 0 ? $totalRentabilizadoCotasRasParticipante + $quantidadeCotasFacultativa : $totalRentabilizadoCotasRasParticipante;

            $totalRentabilizadoCotasRasParticipante =
                $totalRentabilizadoCotasRasParticipante <= 0 && $valorContribuicaoFacultativa > 0 ?
                $valorContribuicaoFacultativa : $totalRentabilizadoCotasRasParticipante;

            $contribuicao = [
                'referencia' => $dtIteracao->format('m/Y'),
                'conta' => self::CONTA_RAS_FACULTATIVA,
                'valorContribuicao' => $valorContribuicaoFacultativaRas,
                'valorCota' => $valorCotaProjetado,
                'quantidadeCotasAtual' => $quantidadeCotasFacultativa,
                'saldoCotaTotal' => $totalRentabilizadoCotasRasParticipante,
                'valorSaldoTotal' => $totalRentabilizadoCotasRasParticipante * $valorCotaProjetado,
            ];
            $contribuicoesSimuladas[] = $contribuicao;

            if ($isBpd) {
                $contribuicao = [
                    'referencia' => $dtIteracao->format('m/Y'),
                    'conta' => self::CONTA_RAN_NORMAL_PARTIC,
                    'valorContribuicao' => 0,
                    'valorCota' => $valorCotaProjetado,
                    'quantidadeCotasAtual' => 0,
                    'saldoCotaTotal' => $totalRentabilizadoCotasRanParticipante,
                    'valorSaldoTotal' => $totalRentabilizadoCotasRanParticipante * $valorCotaProjetado,
                ];
                $contribuicoesSimuladas[] = $contribuicao;

                $contribuicao = [
                    'referencia' => $dtIteracao->format('m/Y'),
                    'conta' => self::CONTA_RAN_NORMAL_PATROC,
                    'valorContribuicao' => 0,
                    'valorCota' => $valorCotaProjetado,
                    'quantidadeCotasAtual' => 0,
                    'saldoCotaTotal' => $totalRentabilizadoCotasRanPatrocinador,
                    'valorSaldoTotal' => $totalRentabilizadoCotasRanPatrocinador * $valorCotaProjetado,
                ];

                $contribuicoesSimuladas[] = $contribuicao;
            }

            $dtIteracao->add(new \DateInterval('P1M'));
        }


        // Tratamento especial para situação VINCULADO
        if ($isVinculadoOuSalarioMenorTeto) {
            $totalRentabilizadoCotasRasParticipante += $totalRentabilizadoCotasRasParticipante;
            $totalRentabilizadoCotasRanParticipante += $totalRentabilizadoCotasRanParticipante;
            $totalRentabilizadoCotasRanPatrocinador = 0;
        }

        // Calcula performance baseada nas contribuições simuladas
        $performance = $this->calcularPerformanceDasContribuicoes($contribuicoesSimuladas, $dadosCalculo);

        return [
            'contribuicoes' => $contribuicoesSimuladas,
            'totaisRentabilizados' => [
                'totalRentabilizadoCotasRanParticipante' => $totalRentabilizadoCotasRanParticipante,
                'totalRentabilizadoCotasRanPatrocinador' => $totalRentabilizadoCotasRanPatrocinador,
                'totalRentabilizadoCotasRasParticipante' => $totalRentabilizadoCotasRasParticipante,
                'valorCotaProjetado' => $valorCotaProjetado,
            ],
            'performance' => $performance,
        ];
    }

    /**
     * Atualiza o valor da cota projetada
     */
    /**
     * Atualiza o valor da cota projetada usando fórmula mensal iterativa
     *
     * @param float $valorCotaProjetado Valor atual da cota projetada
     * @param float $rentabilidadeProjetada Rentabilidade projetada anual (%)
     * @return float Novo valor da cota projetada
     */
    private function atualizarValorCotaProjetado(float $valorCotaProjetado, float $rentabilidadeProjetada): float
    {
        // Fórmula mensal: valorCotaProjetado × (1 + rentabilidadeProjetada/100)^(1/12)
        $fator = pow(1 + $rentabilidadeProjetada / 100, 1 / 12);

        return $valorCotaProjetado * $fator;
    }

    /**
     * Calcula o valor da contribuição vinculada
     *
     * @param float $salario Salário do participante
     * @return float Valor da contribuição vinculada
     */
    private function calcularValorContribuicaoVinculada(float $salario): float
    {

        if ($salario == 0.0 || $salario == null) {

            return 0.0;
        }
        return $salario * self::PERCENTUAL_VINCULADO / 100;
    }

    /**
     * Calcula os saldos e benefícios da simulação
     *
     * Fórmulas utilizadas:
     * - saldoNormalTotal: (totalRentabilizadoCotasRanParticipante + totalRentabilizadoCotasRanPatrocinador) × valorCotaProjetado
     * - saldoSuplementarTotal: totalRentabilizadoCotasRasParticipante × valorCotaProjetado
     * - saldoTotal: saldoNormalTotal + saldoSuplementarTotal
     * - beneficioMensalTotal: beneficioNormalMensal + beneficioSuplementarMensal
     *
     * @param array $dadosCalculo Dados calculados da simulação
     * @param array $beneficioNormal Dados do benefício normal
     * @param array $beneficioSuplementar Dados do benefício suplementar
     * @return array Array com os saldos e benefícios calculados
     */
    private function calcularSaldosEBeneficios(array $dadosCalculo, array $beneficioNormal, array $beneficioSuplementar): array
    {
        // Validação dos parâmetros de entrada
        if (! isset($dadosCalculo['valorCotaProjetado']) || ! isset($beneficioNormal['valorBeneficioMensalBruto']) || ! isset($beneficioSuplementar['valorBeneficioSumplementarMensal'])) {
            throw new InvalidArgumentException('Dados obrigatórios não encontrados para cálculo dos saldos e benefícios');
        }

        $valorCotaProjetado = floatval($dadosCalculo['valorCotaProjetado']);
        $totalRentabilizadoCotasRanParticipante = floatval($dadosCalculo['totalRentabilizadoCotasRanParticipante'] ?? 0);
        $totalRentabilizadoCotasRanPatrocinador = floatval($dadosCalculo['totalRentabilizadoCotasRanPatrocinador'] ?? 0);
        $totalRentabilizadoCotasRasParticipante = floatval($dadosCalculo['totalRentabilizadoCotasRasParticipante'] ?? 0);

        // Calcula os saldos totais
        $saldoNormalTotal = ($totalRentabilizadoCotasRanParticipante + $totalRentabilizadoCotasRanPatrocinador) * $valorCotaProjetado;
        $saldoSuplementarTotal = $totalRentabilizadoCotasRasParticipante * $valorCotaProjetado;
        $saldoTotal = $saldoNormalTotal + $saldoSuplementarTotal;

        // Calcula os benefícios mensais
        $beneficioNormalMensal = floatval($beneficioNormal['valorBeneficioMensalBruto']);
        $beneficioSuplementarMensal = floatval($beneficioSuplementar['valorBeneficioSumplementarMensal']);
        $beneficioMensalTotal = $beneficioNormalMensal + $beneficioSuplementarMensal;

        return [
            'saldo_normal_total' => $saldoNormalTotal,
            'beneficio_normal_mensal' => $beneficioNormalMensal,
            'saldo_suplementar_total' => $saldoSuplementarTotal,
            'beneficio_suplementar_mensal' => $beneficioSuplementarMensal,
            'saldo_total' => $saldoTotal,
            'beneficio_mensal_total' => $beneficioMensalTotal,
        ];
    }

    /**
     * Calcula as contribuições mensais do participante
     *
     * @param array $dadosCalculo Dados calculados da simulação
     * @return array Array com as contribuições mensais (normal, facultativa e total)
     */
    private function calcularContribuicoesMensaisParticipante(array $dadosCalculo): array
    {
        // Validação dos dados obrigatórios
        if (! isset($dadosCalculo['percentualContribuicaoNormal'])) {
            throw new InvalidArgumentException('Dados obrigatórios não encontrados para cálculo das contribuições mensais');
        }

        // Extrai os valores das contribuições
        $valorContribuicaoNormal = 0;
        $valorContribuicaoNormalBruto = 0;
        $valorContribuicaoFacultativa = 0;


        // Verifica se valorContribuicaoNormal é um array ou valor direto
        if (isset($dadosCalculo['valorContribuicaoNormal'])) {
            if (is_array($dadosCalculo['valorContribuicaoNormal'])) {
                $valorContribuicaoNormal = floatval($dadosCalculo['valorContribuicaoNormal']['valorLiquido'] ?? 0);
            } else {
                $valorContribuicaoNormal = floatval($dadosCalculo['valorContribuicaoNormal']);
            }
        }

        $valorContribuicaoNormalBruto = $this->calcularValorBrutoContribuicao($dadosCalculo['baseContribuicaoFunpresp'], $dadosCalculo['percentualContribuicaoNormal'], false);

        // Verifica se valorContribuicaoFacultativa é um array ou valor direto
        if (isset($dadosCalculo['valorContribuicaoFacultativa'])) {
            if (is_array($dadosCalculo['valorContribuicaoFacultativa'])) {
                $valorContribuicaoFacultativa = floatval($dadosCalculo['valorContribuicaoFacultativa']['valorLiquido'] ?? 0);
            } else {
                $valorContribuicaoFacultativa = floatval($dadosCalculo['valorContribuicaoFacultativa']);
            }
        }

        $percentualContribuicaoNormal = floatval($dadosCalculo['percentualContribuicaoNormal']);
        $percentualContribuicaoFacultativa = floatval($dadosCalculo['percentualContribuicaoFacultativa'] ?? 0);

        // Calcula os totais
        $valorTotal = $valorContribuicaoNormal + $valorContribuicaoFacultativa;
        $valorTotalBruto = $valorContribuicaoNormalBruto + $valorContribuicaoFacultativa;
        $percentualTotal = $percentualContribuicaoNormal + $percentualContribuicaoFacultativa;

        return [
            'normal' => [
                'valor' => $valorContribuicaoNormal,
                'bruto' => $valorContribuicaoNormalBruto,
                'percentual' => $percentualContribuicaoNormal
            ],
            'facultativa' => [
                'valor' => $valorContribuicaoFacultativa,
                'percentual' => $percentualContribuicaoFacultativa,
            ],
            'total' => [
                'valor' => $valorTotal,
                'bruto' => $valorTotalBruto,
                'percentual' => $percentualTotal,
            ],
        ];
    }

    /**
     * Calcula os benefícios da simulação
     *
     * @param array $beneficioNormal Dados do benefício normal
     * @param array $beneficioSuplementar Dados do benefício suplementar
     * @return array Array com os benefícios calculados
     */
    private function calcularBeneficios(array $beneficioNormal, array $beneficioSuplementar): array
    {
        // Validação dos dados obrigatórios
        if (! isset($beneficioNormal['valorBeneficioMensalBruto']) || ! isset($beneficioSuplementar['valorBeneficioSumplementarMensal'])) {
            throw new InvalidArgumentException('Dados obrigatórios não encontrados para cálculo dos benefícios');
        }

        // Extrai os valores dos benefícios
        $beneficioNormalMensal = floatval($beneficioNormal['valorBeneficioMensalBruto']);
        $beneficioSuplementarMensal = floatval($beneficioSuplementar['valorBeneficioSumplementarMensal']);

        // Calcula o benefício total
        $beneficioTotal = $beneficioNormalMensal + $beneficioSuplementarMensal;

        return [
            'beneficio_especial' => 0,
            'beneficio_rpps' => 0,
            'beneficios_funpresp_jud' => $beneficioTotal,
            'beneficio_previdenciario_bruto' => $beneficioNormalMensal,
            'beneficio_previdenciario_liquido' => $beneficioNormalMensal,
            'beneficio_suplementar_mensal' => $beneficioSuplementarMensal,
        ];
    }

    /**
     * Calcula as informações adicionais da simulação
     *
     * @param array $dadosCalculo Dados calculados da simulação
     * @param array $beneficios Benefícios calculados (normal + suplementar)
     * @return array Array com as informações adicionais
     */
    private function calcularInformacoesAdicionais(array $dadosCalculo, array $beneficios): array
    {
        $percentualSaque = $dadosCalculo['saqueReserva'] ?? 0;

        // Calcula o benefício total mensal (normal + suplementar)
        $beneficioTotalMensal = $beneficios['beneficios_funpresp_jud'] ?? 0;

        $percentualComparativo = ($dadosCalculo['salarioParticipante'] <= 0)
            ? '0,00%'
            : (
                $beneficioTotalMensal > 0
                ? number_format(($beneficioTotalMensal / $dadosCalculo['salarioParticipante']) * 100, 2, ',', '.') . '%'
                : '0,00%'
            );

        return [
            'base_contribuicao_funpresp' => 'R$ ' . number_format($dadosCalculo['baseContribuicaoFunpresp'], 2, ',', '.'),
            'rentabilidade_real_anual' => number_format($dadosCalculo['rentabilidadeProjetada'], 1, ',', '.') . '%',
            'aporte_extraordinario_ou_portabilidade' => 'R$ ' . number_format($dadosCalculo['aporteExtraordinario'] ?? 0, 2, ',', '.'),
            'prazo_certo' => $dadosCalculo['prazoRecebimento'] . ' meses',
            'percentual_saque' => number_format($percentualSaque, 0) . '%',
            'percentual_comparativo' => $percentualComparativo,
        ];
    }

    /**
     * Calcula o plano de custeio vigente
     *
     * @param array $dadosCalculo Dados calculados da simulação
     * @return array Array com o plano de custeio vigente
     */
    private function calcularPlanoCusteioVigente(array $dadosCalculo): array
    {
        $fcbe = round(self::FCBE * 100, 2);
        $taxaCarregamento = round(self::TAXA_ADMINISTRATIVA * 100, 2);

        $patrocinadaRan = round(100 - ($fcbe + $taxaCarregamento), 2);

        return [
            'patrocinada' => [
                'RAN' => $patrocinadaRan,
                'RAS' => 0.00,
                'FCBE' => $fcbe,
                'taxa_carregamento' => $taxaCarregamento,
            ],
            'vinculada' => [
                'RAN' => '0,00%',
                'RAS' => '96,50%',
                'FCBE' => '0,00%',
                'taxa_carregamento' => '3,50%',
            ],
            'facultativa' => [
                'RAN' => '0,00%',
                'RAS' => '100,00%',
                'FCBE' => '0,00%',
                'taxa_carregamento' => '0,00%',
            ],
        ];
    }

    /**
     * Calcula a performance baseada nos dados reais das contribuições simuladas
     */
    private function calcularPerformanceDasContribuicoes(array $contribuicoesSimuladas, array $dadosCalculo): array
    {
        // Saldos atuais como base inicial
        $saldoAcumuladoAtual = $dadosCalculo['saldoRanParticipanteRentabilizado'] +
            $dadosCalculo['saldoRanPatrocinadorRentabilizado'] +
            $dadosCalculo['saldoRasParticipanteRentabilizado'];

        // Agrupa contribuições por ano
        $contribuicoesPorAno = [];
        $valorSaldoTotalPorAno = [];

        $valorSaldoTotalPorMes = [];

        foreach ($contribuicoesSimuladas as $contribuicao) {
            $referencia = $contribuicao['referencia'];

            if (!isset($valorSaldoTotalPorMes[$referencia])) {
                $valorSaldoTotalPorMes[$referencia] = 0;
            }

            $valorSaldoTotalPorMes[$referencia] += $contribuicao['valorSaldoTotal'];
        }

        foreach ($valorSaldoTotalPorMes as $referencia => $contribuicao) {
            $ano = explode('/', $referencia)[1]; // Extrai ano de "m/Y"

            if (! isset($contribuicoesPorAno[$ano])) {
                $contribuicoesPorAno[$ano] = 0;
                $valorSaldoTotalPorAno[$ano] = 0;
            }

            // Pega o maior valorSaldoTotal do ano (último mês)
            $valorSaldoTotalPorAno[$ano] = max($valorSaldoTotalPorAno[$ano], $contribuicao);
        }


        // Ordena anos
        ksort($contribuicoesPorAno);

        $anos = array_keys($contribuicoesPorAno);
        $performanceAtual = [];
        $performanceSimulada = [];

        foreach ($anos as $ano) {
            // Performance atual (baseada em saldo atual + rentabilidade)
            $saldoAcumuladoAtual *= (1 + $dadosCalculo['rentabilidadeProjetada'] / 100);
            $performanceAtual[] = round($saldoAcumuladoAtual, 2);

            // Performance simulada (valor real calculado das contribuições)
            $performanceSimulada[] = round($valorSaldoTotalPorAno[$ano], 2);
        }

        return [
            'anos' => $anos,
            'performance_atual' => $performanceAtual,
            'performance_simulada' => $performanceSimulada,
            'total_atual' => end($valorSaldoTotalPorMes) ?: 0,
            'total_simulada' => end($valorSaldoTotalPorMes) ?: 0,
        ];
    }

    /**
     * Calcula o benefício líquido
     */
    private function calcularBeneficioLiquido(array $beneficioNormal, array $beneficioSuplementar): array
    {
        $beneficioBruto = $beneficioNormal['valorBeneficioMensalBruto'] + $beneficioSuplementar['valorBeneficioSumplementarMensal'];

        // Simula IRPF regressivo (10% do benefício bruto)
        $irpfRegressivo = $beneficioBruto * 0.10;

        // Simula contribuição administrativa (0.3% do benefício bruto)
        $contribuicaoAdministrativa = $this->calculationsHelper->getPercentage($beneficioBruto, ContribuicaoAdministrativaEnum::CONTRIBUICAO_ADMINISTRATIVA->getValue());

        $beneficioLiquido = $beneficioBruto - $irpfRegressivo - $contribuicaoAdministrativa;

        return [
            'beneficio_bruto' => $beneficioBruto,
            'irpf_regressivo' => [
                'valor' => -$irpfRegressivo,
                'percentual' => 10,
            ],
            'contribuicao_administrativa' => [
                'valor' => -$contribuicaoAdministrativa,
                'percentual' => ContribuicaoAdministrativaEnum::CONTRIBUICAO_ADMINISTRATIVA->getValue(),
            ],
            'beneficio_liquido' => $beneficioLiquido,
        ];
    }

    /**
     * @param string $cpf
     *
     * @return ProjecaoBeneficioOutputDTO|null
     */
    public function getProjecaoBeneficio(string $cpf): ProjecaoBeneficioOutputDTO|null
    {
        try {
            $dadosSimulacao = $this->preparaDadosSimulacaoSimplificada($cpf);

            $dataSimulacao = [
                'cpf' => $dadosSimulacao->getCpf(),
                'dataNascimento' => $dadosSimulacao->getDataNascimento(),
                'sexo' => $dadosSimulacao->getSexo(),
                'idadeAposentadoria' => $dadosSimulacao->getIdadeAposentadoria(),
                'rentabilidadeProjetada' => floatval($dadosSimulacao->getRentabilidadeProjetada()),
                'novaRentabilidadeProjetada' => $dadosSimulacao->getNovaRentabilidadeProjetada(),
                'salarioParticipante' => $dadosSimulacao->getSalarioParticipante(),
                'percentualContribuicaoFacultativa' => $dadosSimulacao->getPercentualContribuicaoFacultativa(),
                'percentualContribuicaoNormal' => $dadosSimulacao->getPercentualContribuicaoNormal(),
                'aporteExtraordinario' => $dadosSimulacao->getAporteExtraordinario(),
                'prazoRecebimento' => $dadosSimulacao->getPrazoRecebimento(),
                'saqueReserva' => $dadosSimulacao->getSaqueReserva(),
                'perfilDeInvestimentoRecomendadoSimulador' => $dadosSimulacao->getPerfilDeInvestimentoRecomendadoSimulador(),
                'novoPerfilDeInvestimentoSimulador' => $dadosSimulacao->getnovoPerfilDeInvestimentoSimulador()
            ];

            $resultado = $this->calculoSimulacao(new SimuladorDTO($dataSimulacao));

            $beneficioMensalTotal = $resultado->getSaldosEBeneficios()['beneficio_mensal_total'];
            $novoSalarioParticipante = $resultado->getDadosSimulacao()['novoSalarioParticipante'] - $resultado->getTetoRPPS();

            $valorPercentual = $this->calculationsHelper->calculatePercentage($novoSalarioParticipante, $beneficioMensalTotal);

            return new ProjecaoBeneficioOutputDTO([
                'projecaoAtual' => $valorPercentual,
                'idadeAposentadoria' => $resultado->getDadosParticipante()['idade_provavel_aposentadoria'],
                'regimeTributacao' => $resultado->getDadosParticipante()['regime_tributacao'],
                'regimeTributacaoDataOpcao' => $resultado->getDadosParticipante()['data_opcao_regime_tributario'],
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Erro ao calcular projeção de benefício', [
                'error' => $e->getMessage(),
            ]);

            throw new SimuladorNotFoundException('Erro ao calcular projeção de benefício: ' . $e->getMessage());
        }
    }

    private function isVinculadoOuSalarioMenorTeto(array $dadosBase): bool
    {
        $tetoRPPS = $this->obterTetoRPPS();
        $salarioParticipante = $dadosBase['salarioParticipante'];

        $isSalarioMenorTeto = $salarioParticipante && $salarioParticipante < $tetoRPPS;
        $isVinculado = $dadosBase['planoSituacao'] === self::SITUACAO_VINCULADO;

        return $isSalarioMenorTeto || $isVinculado;
    }


    public function simplificadaNormal(string $cpf): array
    {
        try {
            $dadosSimulacao = $this->preparaDadosSimulacaoSimplificada($cpf);

            $dataSimulacao = [
                'cpf' => $dadosSimulacao->getCpf(),
                'dataNascimento' => $dadosSimulacao->getDataNascimento(),
                'sexo' => $dadosSimulacao->getSexo(),
                'idadeAposentadoria' => $dadosSimulacao->getIdadeAposentadoria(),
                'rentabilidadeProjetada' => floatval($dadosSimulacao->getRentabilidadeProjetada()),
                'novaRentabilidadeProjetada' => $dadosSimulacao->getNovaRentabilidadeProjetada(),
                'salarioParticipante' => $dadosSimulacao->getSalarioParticipante(),
                'percentualContribuicaoFacultativa' => $dadosSimulacao->getPercentualContribuicaoFacultativa(),
                'percentualContribuicaoNormal' => $dadosSimulacao->getPercentualContribuicaoNormal(),
                'aporteExtraordinario' => $dadosSimulacao->getAporteExtraordinario(),
                'prazoRecebimento' => $dadosSimulacao->getPrazoRecebimento(),
                'saqueReserva' => $dadosSimulacao->getSaqueReserva(),
                'perfilDeInvestimentoRecomendadoSimulador' => $dadosSimulacao->getPerfilDeInvestimentoRecomendadoSimulador(),
                'novoPerfilDeInvestimentoSimulador' => $dadosSimulacao->getnovoPerfilDeInvestimentoSimulador()
            ];

            $resultadoSimulacao = $this->calculoSimulacao(new SimuladorDTO($dataSimulacao));
            return [
                'beneficio_aposentadoria_normal' => $resultadoSimulacao->getBeneficioAposentadoriaNormal(),
            ];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao calcular simulação simplificada', [
                'error' => $e->getMessage(),
            ]);

            throw new SimuladorNotFoundException('Erro ao calcular simulação simplificada: ' . $e->getMessage());
        }
    }
}