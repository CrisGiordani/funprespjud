<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\PerfilRecomendadoCiencia;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;

/**
 * @extends ServiceEntityRepository<PerfilRecomendadoCiencia>
 */
class PerfilRecomendadoCienciaRepository extends EntityRepository
{
    //    /**
    //     * @return PerfilRecomendadoCiencia[] Returns an array of PerfilRecomendadoCiencia objects
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

    //    public function findOneBySomeField($value): ?PerfilRecomendadoCiencia
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
