<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\Questinario;
use App\Interface\Iris\Repository\App\QuestinarioRepositoryInterface;
use Doctrine\ORM\EntityRepository;

/**
 * @extends EntityRepository<Questinario>
 */
class QuestinarioRepository extends EntityRepository implements QuestinarioRepositoryInterface
{
    public function getAll(): array
    {
        return $this->findAll();
    }

    public function getById(int $id): ?Questinario
    {
        return $this->find($id);
    }

    // public function __construct(ManagerRegistry $registry)
    // {
    //     parent::__construct($registry, Questinario::class);
    // }

    //    /**
    //     * @return Questinario[] Returns an array of Questinario objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('q')
    //            ->andWhere('q.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('q.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Questinario
    //    {
    //        return $this->createQueryBuilder('q')
    //            ->andWhere('q.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
