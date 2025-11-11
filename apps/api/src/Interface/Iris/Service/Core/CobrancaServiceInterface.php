<?php

namespace App\Interface\Iris\Service\Core;

use App\DTO\Iris\Core\Output\CobrancaOutputDTO;
use Knp\Component\Pager\Pagination\PaginationInterface;

interface CobrancaServiceInterface
{
    public function obterCobranca(string $nossoNumero): ?CobrancaOutputDTO;

    public function criarCobranca(array $data): CobrancaOutputDTO;

    public function editarCobranca(string $nossoNumero, array $data): CobrancaOutputDTO;

    public function cancelarCobranca(string $nossoNumero): CobrancaOutputDTO;

    public function listarCobrancas(array $filter = []): PaginationInterface;
}
