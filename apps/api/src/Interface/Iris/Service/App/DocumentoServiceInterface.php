<?php

namespace App\Interface\Iris\Service\App;

interface DocumentoServiceInterface
{
    /**
     * @param string $cpf
     * @param string $status
     * @return string|null
     */
    public function relatoriosApp(string $cpf, string $status): ?string;
}
