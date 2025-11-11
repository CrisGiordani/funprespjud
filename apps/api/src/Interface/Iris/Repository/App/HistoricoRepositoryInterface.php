<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\Historico;
use Doctrine\ORM\Query;

interface HistoricoRepositoryInterface
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
     * @return Query
     */
    public function getByCpf(string $cpf): Query;

    /**
     * @param Historico $historico
     *
     * @return void
     */
    public function save(Historico $historico): void;

    /**
     * @param string $cpf
     *
        * @return Historico|null|array
     */
    public function findByCpfLastresult(string $cpf): ?Historico;
}
