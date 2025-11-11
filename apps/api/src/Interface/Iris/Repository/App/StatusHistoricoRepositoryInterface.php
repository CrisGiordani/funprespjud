<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\StatusHistorico;

interface StatusHistoricoRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $cdStatus
     * @return StatusHistorico|null
     */
    public function getByCdStatus(int $cdStatus): ?StatusHistorico;
}
