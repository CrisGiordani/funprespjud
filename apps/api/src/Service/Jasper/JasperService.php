<?php

namespace App\Service\Jasper;

use App\Interface\Jasper\JasperServiceInterface;
use Sigedi\JasperReportBundle\ReportService;

// use Jaspersoft\Service\ReportService;

class JasperService implements JasperServiceInterface
{
    public function __construct(
        private ReportService $reportService
    ) {
    }

    /**
     * @param string $reportName
     * @param array $params
     *
     * @return string
     */
    public function generateReport(string $reportName, array $params, string $format = 'pdf'): string
    {
        try {
            return $this->reportService->runReport(
                uri:$reportName,
                format:$format,
                inputControls: ['jsonString' => $this->formatParams($params)]
            );
        } catch (\Throwable $th) {
            error_log(sprintf(
                'Error generating Jasper report: %s for report: %s',
                $th->getMessage(),
                $reportName
            ));

            throw new \Exception('Erro ao gerar relatório: ' . $th->getMessage());
        }
    }

    private function formatParams(array $params): string
    {
        return json_encode($params, JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param string $content
     * @param string $outputDir
     * @param null|string|null $outputFile
     *
     * @return void
     */
    public function saveReport(string $content, string $outputDir, null|string $outputFile = null): void
    {
        if (is_null($outputFile)) {
            $outputFile = 'report_' . date('Y-m-d_H-i-s');
        }

        $outputFile = $outputDir . $outputFile . '.pdf';

        if (! is_dir($outputDir)) {
            mkdir($outputDir, 0777, true);
        }

        file_put_contents($outputFile, $content);
    }
}