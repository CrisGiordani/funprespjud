<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\App\Historico;
use App\Enum\Iris\App\StatusHistoricoEnum;
use App\Enum\Jasper\JasperReportPathEnum;
use App\Exception\ParticipanteNotFoundException;
use App\Interface\Iris\Repository\App\QuestionarioRespostaRepositoryInterface;
use App\Interface\Iris\Service\App\DocumentoServiceInterface;
use App\Interface\Iris\Service\App\HistoricoServiceInterface;
use App\Interface\Iris\Service\App\StatusHistoricoServiceInterface;
use App\Interface\Jasper\JasperServiceInterface;
use App\Interface\Storage\WebDAV\WebDAVServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use Psr\Log\LoggerInterface;

class DocumentoService implements DocumentoServiceInterface
{
    public function __construct(
        private readonly TrustParticipanteServiceInterface $trustParticipanteService,
        private readonly JasperServiceInterface $jasperService,
        private readonly WebDAVServiceInterface $webDAVService,
        private readonly StatusHistoricoServiceInterface $statusHistoricoService,
        private readonly HistoricoServiceInterface $historicoService,
        private readonly QuestionarioRespostaRepositoryInterface $questionarioRespostaRepository,
        private readonly LoggerInterface $logger
    ) {
    }

    /**
     * @param string $cpf
     * @param string $status
     *
     * @return string|null
     */
    public function relatoriosApp(string $cpf, string $status): ?string
    {
        try {
            $dados = $this->getDadosBasicos($cpf);

            $statusReport = $this->indentifyStatus($status, $cpf)();

            if (isset($statusReport['respostas']) && $statusReport['status'] == StatusHistoricoEnum::PREENCHIDO) {
                $dados = array_merge($dados, $statusReport['respostas']);
            }

            $report = $this->jasperService->generateReport(
                reportName: $statusReport['report'],
                params: $dados
            );

            if ($report) {
                $caminho = date('Y') . '/' . date('m') . '/';
              
                if (! $this->webDAVService->fileExists($caminho)) {
                 
                    $this->webDAVService->createDirectory($caminho);
                }
                $url = $this->uploadDocumento($report, $caminho, $statusReport['nomeArquivo']);

                $this->saveHistorico($cpf, $url, $statusReport['status']);

                return $url;
            }
        } catch (\Throwable $th) {
            $this->logger->error($th->getMessage());

            throw $th;
        }

        return null;
    }

    /**
     * @param string $cpf
     *
     * @return array
     */
    private function getDadosBasicos(string $cpf): array
    {
        $participante = $this->trustParticipanteService->getParticipante($cpf);

        if (! $participante) {
            throw new ParticipanteNotFoundException();
        }

        $date = new \DateTime(timezone: new \DateTimeZone('America/Sao_Paulo'));
        $date = 'dia ' . $date->format('d/m/Y') . ' às ' . $date->format('H:i');

        return [
            'nome' => $participante->getNome(),
            'data' => $date,
        ];
    }

    /**
     * @param string $report
     * @param string $caminho
     * @param string $nomeArquivo
     *
     * @return string
     */
    private function uploadDocumento(string $report, string $caminho, string $nomeArquivo): string
    {

        return $this->webDAVService->uploadContent($report, $caminho . $nomeArquivo);
    }

    /**
     * @param string $cpf
     * @param string $url
     * @param StatusHistoricoEnum $statusHistoricoEnum
     *
     * @return void
     */
    private function saveHistorico(string $cpf, string $url, StatusHistoricoEnum $statusHistoricoEnum): void
    {
        $statusHistorico = $this->statusHistoricoService->getByCdStatus($statusHistoricoEnum->value);

        if (! $statusHistorico) {
            throw new \Exception('Status do histórico não encontrado');
        }

        $this->historicoService->save(new Historico(
            cpf: $cpf,
            status: $statusHistorico,
            urlDocumento: $url,
            dt_evento: new \DateTime()
        ));
    }

    private function getRespostas(string $cpf): array
    {
        $respostas = $this->questionarioRespostaRepository->getUltimaRespostaByCpf($cpf);

        $respostasParamsJasper = [];

        array_walk($respostas, function ($resposta, $index) use (&$respostasParamsJasper)
        {
            $respostasParamsJasper['resposta' . $index + 1] = intval($resposta['ordem_resposta']);
        });

        return $respostasParamsJasper;
    }

    /**
     * @param int $status
     * @param string $cpf
     *
     * @return callable
     */
    private function indentifyStatus(int $status, string $cpf): callable
    {
        return match ($status) {
            1 => function () use ($cpf)
            {
                return [
                    'report' => JasperReportPathEnum::REPORT_RELATORIO_QUESTIONARIO->value,
                    'status' => StatusHistoricoEnum::PREENCHIDO,
                    'nomeArquivo' => 'relatorio_questionario_preenchido_' . $cpf . '-' . date('Y-m-d_H:i:s') . '.pdf',
                    'respostas' => $this->getRespostas($cpf),
                ];
            },
            2 => function () use ($cpf)
            {
                return [
                    'report' => JasperReportPathEnum::REPORT_RELATORIO_QUESTIONARIO_NAO_RESPONDIDO->value,
                    'status' => StatusHistoricoEnum::NAO_PREENCHIDO_OPCAO_PARTICIPANTE,
                    'nomeArquivo' => 'relatorio_questionario_nao_respondido_' . $cpf . '-' . date('Y-m-d_H:i:s') . '.pdf',
                ];
            },
            3 => function () use ($cpf)
            {
                return [
                    'report' => JasperReportPathEnum::REPORT_RELATORIO_QUESTIONARIO_NAO_RESPONDIDO_SEM_NOTIFICACAO->value,
                    'status' => StatusHistoricoEnum::NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR,
                    'nomeArquivo' => 'relatorio_questionario_nao_respondido_sem_notificacao_' . $cpf . '-' . date('Y-m-d_H:i:s') . '.pdf',
                ];
            },
            default => throw new \Exception('Status não encontrado'),
        };
    }
}
