<?php

namespace App\Command;

use App\Entity\Iris\App\PerfilInvestimentoAlteracao;
use App\Interface\Iris\Service\App\PerfilInvestimentoAlteracaoServiceInterface;
use App\Interface\Iris\Service\App\PortalPerfilInvestimentoServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Enum\Iris\App\StatusSolicitacaoAlteracaoPerfilInvestimentoEnum;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Doctrine\DBAL\Connection;

#[AsCommand(
    name: 'app:migracao-perfil-investimento',
    description: 'Migracao de perfil de investimento',
)]
class MigracaoPerfilInvestimentoCommand extends Command
{
    public function __construct(
        private readonly PerfilInvestimentoAlteracaoServiceInterface $perfilInvestimentoAlteracaoService,
        private readonly TrustParticipanteServiceInterface $trustParticipanteService,
        private readonly PortalPerfilInvestimentoServiceInterface $perfilInvestimentoService,
        private readonly TrustParticipanteServiceInterface $participanteService,
        private readonly Connection $connection,
    ) {
        parent::__construct();
    }


    protected function configure(): void
    {
        $this
            ->addArgument('idCampanha', InputArgument::REQUIRED, 'Informe o ID da campanha que deseja migrar');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int

    {
        $io = new SymfonyStyle($input, $output);

        //Id Campanha
        $solicitacoes = $this->perfilInvestimentoAlteracaoService->solicitacoesRecebidas(intval($input->getArgument('idCampanha')));

        if (empty($solicitacoes)) {
            $io->error('Não há solicitações para processar');
            return Command::FAILURE;
        }

        $io->success('Iniciando a migração de perfil de investimento');

        $totalSolicitacoes = count($solicitacoes);
        $batchSize = 500;
        $batches = array_chunk($solicitacoes, $batchSize);
        $totalBatches = count($batches);

        $io->info("Total de solicitações: {$totalSolicitacoes}");
        $io->info("Processando em {$totalBatches} batches de até {$batchSize} solicitações cada");

        $totalProcessadas = 0;
        $totalErros = 0;

        foreach ($batches as $batchIndex => $batch) {
            $io->info("Processando batch " . ($batchIndex + 1) . "/{$totalBatches} (" . count($batch) . " solicitações)");

            //* Inicia transação para cada batch
            $this->connection->beginTransaction();
            $batchProcessadas = 0;
            $batchErros = 0;

            try {
                foreach ($batch as $solicitacao) {
                    $solicitacaoProcessadaComSucesso = false;

                    try {
                        $perfilAtual = $this->trustParticipanteService->getPerfilAtual($solicitacao['cpf']);
                        $dadosPessoa = $this->participanteService->getDadosPessoa($solicitacao['cpf']);
                        $perfil = $this->perfilInvestimentoService->getPerfilByIdTrust(intval($perfilAtual['idPerfil']));

                        if (!$perfilAtual || !$perfil || empty($dadosPessoa)) {
                            $io->error("Perfil atual ou perfil não encontrado ou dados pessoa vazio para o CPF {$solicitacao['cpf']}");
                            $batchErros++;
                            $totalErros++;

                            //* Atualizar status para erro
                            $this->atualizarStatusSolicitacao($solicitacao, StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::ERRO_NO_PROCESSAMENTO);
                            continue;
                        }

                        foreach ($dadosPessoa as $dado) {
                            $qb = $this->connection->createQueryBuilder();
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

                        //* Se chegou até aqui, o insert foi bem-sucedido
                        $solicitacaoProcessadaComSucesso = true;
                        $batchProcessadas++;
                        $totalProcessadas++;
                    } catch (\Exception $e) {
                        $batchErros++;
                        $totalErros++;
                        $io->error("Erro ao processar solicitação CPF {$solicitacao['cpf']}: " . $e->getMessage());

                        //* Atualizar status para erro
                        $this->atualizarStatusSolicitacao($solicitacao, StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::ERRO_NO_PROCESSAMENTO);
                        continue;
                    }

                    //* Atualizar status para processada se tudo correu bem
                    if ($solicitacaoProcessadaComSucesso) {
                        $this->atualizarStatusSolicitacao($solicitacao, StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::SOLICITACAO_PROCESSADA);
                    }
                }

                $this->connection->commit();
                $io->info("Batch " . ($batchIndex + 1) . " concluído: {$batchProcessadas} processadas, {$batchErros} erros");
            } catch (\Exception $e) {
                //* Rollback do batch em caso de erro geral
                $this->connection->rollBack();
                $io->error("Erro geral no batch " . ($batchIndex + 1) . ": " . $e->getMessage());
                $io->warning("Batch " . ($batchIndex + 1) . " foi revertido devido a erro geral");
            }

            //* Pausa entre batches para dar alívio ao banco de dados
            if ($batchIndex < $totalBatches - 1) {
                $io->info("Aguardando 5 segundos antes do próximo batch...");
                sleep(5);
            }
        }

        $io->info("Resumo da migração:");
        $io->info("- Total processadas: {$totalProcessadas}");
        $io->info("- Total com erro: {$totalErros}");



        $io->success('Migração de perfil de investimento finalizada');

        return Command::SUCCESS;
    }

    /**
     * Atualiza o status de uma solicitação de alteração de perfil
     *
     * @param array $solicitacao
     * @param StatusSolicitacaoAlteracaoPerfilInvestimentoEnum $status
     * @return void
     */
    private function atualizarStatusSolicitacao(array $solicitacao, StatusSolicitacaoAlteracaoPerfilInvestimentoEnum $status): void
    {
        try {
            $perfilInvestimentoAlteracao = $this->perfilInvestimentoAlteracaoService->getById($solicitacao['id']);

            if (!$perfilInvestimentoAlteracao->getId()) {
                throw new \Exception('Solicitação não encontrada ID: ' . $solicitacao['id']);
            }

            $perfilInvestimentoAlteracao->setStatus($status->getDescricao());
            $this->perfilInvestimentoAlteracaoService->updatePerfilInvestimentoAlteracao($perfilInvestimentoAlteracao);
        } catch (\Exception $e) {
            error_log("Erro ao atualizar status da solicitação ID {$solicitacao['id']}: " . $e->getMessage());
        }
    }
}
