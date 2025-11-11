<?php

namespace App\Repository\Iris\Core;

use App\Entity\Iris\Core\Cobranca;
use App\Interface\Iris\Repository\Core\CobrancaRepositoryInterface;
use Doctrine\ORM\EntityRepository;

/**
 * @extends EntityRepository<Cobranca>
 */
class CobrancaRepository extends EntityRepository implements CobrancaRepositoryInterface
{
    public function save(Cobranca $cobranca): Cobranca
    {
        $this->getEntityManager()->persist($cobranca);
        $this->getEntityManager()->flush();

        return $cobranca;
    }

    public function update(Cobranca $cobranca): Cobranca
    {
        $this->getEntityManager()->persist($cobranca);
        $this->getEntityManager()->flush();

        return $cobranca;
    }

    public function cancelarCobranca(Cobranca $cobranca): void
    {
        $cobranca->setStatusBoleto('CANCELADO');
        $this->update($cobranca);
    }

    public function findOneByNossoNumero(string $nossoNumero): ?Cobranca
    {
        return $this->findOneBy(['nossoNumero' => $nossoNumero]);
    }

    /**
     * @param array<string, mixed> $filter
     * @return PaginationInterface
     */
    public function findAll(array $filter = []): array
    {
        $qb = $this->createQueryBuilder('c');
        $qb->orderBy('c.id', 'DESC');
        if (isset($filter['pageIndex']) && isset($filter['pageSize'])) {
            $qb->setFirstResult($filter['pageIndex'] * $filter['pageSize']);
            $qb->setMaxResults($filter['pageSize']);
        }

        return $qb->getQuery()->getResult();
    }
}
