<?php

namespace App\Interface\Iris\Service\Relatorios;

use App\DTO\Iris\Relatorios\DemonstrativoImpostoRendaDTO;

interface DemonstrativoImpostoRendaServiceInterface
{
    public function getDemonstrativoImpostoRenda(string $cpf, string $ano, string $orgao): DemonstrativoImpostoRendaDTO;
}
