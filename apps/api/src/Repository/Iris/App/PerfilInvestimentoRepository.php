<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\PerfilInvestimento;
use App\Interface\Iris\Repository\App\PerfilInvestimentoRepositoryInterface;
use Doctrine\ORM\EntityRepository;

/**
 * @extends EntityRepository<PerfilInvestimento>
 */
class PerfilInvestimentoRepository extends EntityRepository implements PerfilInvestimentoRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->findAll();
    }

    /**
     * @param int $id
     *
     * @return PerfilInvestimento|null
     */
    public function getById(int $id): ?PerfilInvestimento
    {
        return $this->find($id);
    }

    /**
     * @param string $name
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilByName(string $name): ?PerfilInvestimento
    {
        return $this->findOneBy(['descricao' => $name]);
    }

    /**
     * @param int $id
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilByIdTrust(int $id): ?PerfilInvestimento
    {
        return $this->findOneBy(['idPerfil' => $id]);
    }

    //    /**
    //     * @return PerfilInvestimento[] Returns an array of PerfilInvestimento objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?PerfilInvestimento
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
