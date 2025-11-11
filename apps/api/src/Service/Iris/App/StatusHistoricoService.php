<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\App\StatusHistorico;
use App\Interface\Iris\Repository\App\StatusHistoricoRepositoryInterface;
use App\Interface\Iris\Service\App\StatusHistoricoServiceInterface;

class StatusHistoricoService implements StatusHistoricoServiceInterface
{
    public function __construct(
        private readonly StatusHistoricoRepositoryInterface $statusHistoricoRepository
    ) {
    }

    public function getByCdStatus(int $cdStatus): StatusHistorico
    {
        return $this->statusHistoricoRepository->getByCdStatus($cdStatus);
    }
}
