<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\Bloco;
use App\Interface\Iris\Repository\App\BlocoRepositoryInterface;
use Doctrine\ORM\EntityRepository;

/**
 * Repository class for managing Bloco entities
 *
 * This repository provides methods to retrieve and manage Bloco entities
 * from the database.
 *
 * @extends EntityRepository<Bloco>
 */
class BlocoRepository extends EntityRepository implements BlocoRepositoryInterface
{
    /**
     * Get all Bloco entities
     *
     * @return array<Bloco> Array of all Bloco entities
     */
    public function getAll(): array
    {
        return $this->findAll();
    }

    /**
     * Get a Bloco entity by its ID
     *
     * @param int $id The ID of the Bloco to retrieve
     * @return Bloco The found Bloco entity
     */
    public function getById(int $id): Bloco
    {
        return $this->find($id);
    }

    //    /**
    //     * @return Bloco[] Returns an array of Bloco objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Bloco
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
