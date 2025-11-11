<?php

namespace App\Interface\Iris\Service\App;

use App\Entity\Iris\App\StatusHistorico;

interface StatusHistoricoServiceInterface
{
    public function getByCdStatus(int $cdStatus): StatusHistorico;
}
