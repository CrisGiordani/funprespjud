<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\StatusHistorico;
use App\Interface\Iris\Repository\App\StatusHistoricoRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;

/**
 * @extends ServiceEntityRepository<StatusHistorico>
 */
class StatusHistoricoRepository extends EntityRepository implements StatusHistoricoRepositoryInterface
{
    public function getAll(): array
    {
        return $this->findAll();
    }

    public function getByCdStatus(int $cdStatus): ?StatusHistorico
    {
        return $this->findOneBy(['cdStatus' => $cdStatus]);
    }
}
