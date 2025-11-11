<?php

namespace App\Interface\Jasper;

interface JasperServiceInterface
{
    /**
     * Gera um relatório Jasper
     *
     * @param string $reportName
     * @param array $params
     * @return string
     */
    public function generateReport(string $reportName, array $params): string;

    /**
     * Salva um relatório Jasper
     *
     * @param string $content
     * @param string $outputDir
     * @param string|null $outputFile
     * @return void
     */
    public function saveReport(string $content, string $outputDir, null|string $outputFile = null): void;
}
