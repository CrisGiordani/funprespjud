<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\Pergunta;
use App\Interface\Iris\Repository\App\PerguntaRepositoryInterface;
use Doctrine\ORM\EntityRepository;

/**
 * @extends ServiceEntityRepository<Pergunta>
 */
class PerguntaRepository extends EntityRepository implements PerguntaRepositoryInterface
{
    public function getAll(): array
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.alternativas', 'a')
            ->addSelect('a')
            ->getQuery()
            ->getResult();
    }

    public function findById(int $id): ?Pergunta
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.alternativas', 'a')
            ->addSelect('a')
            ->where('p.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getById(int $id): ?Pergunta
    {
        return $this->find($id);
    }

    //    /**
    //     * @return Pergunta[] Returns an array of Pergunta objects
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

    //    public function findOneBySomeField($value): ?Pergunta
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
