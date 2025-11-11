<?php

namespace App\Interface\Iris\Service\App;

use App\DTO\Iris\App\Output\StatusHistoricoOutputDTO;
use App\Entity\Iris\App\Historico;
use Knp\Component\Pager\Pagination\PaginationInterface;

interface HistoricoServiceInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return array
     */
    public function getById(int $id): array;

    /**
     * @param string $cpf
     *
     * @return PaginationInterface
     */
    public function getByCpf(string $cpf, array $filterPagination): PaginationInterface;

    /**
     * @param Historico $historico
     *
     * @return void
     */
    public function save(Historico $historico): void;

    /**
     * @param string $cpf
     *
     * @return Historico|null
     */
    public function findByCpfLastresult(string $cpf): ?Historico;

    /**
     * @param string $cpf
     *
     * @return StatusHistoricoOutputDTO|null
     */
    public function getStatusApp(string $cpf): ?StatusHistoricoOutputDTO;
}
