<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\PerfilRecomendado;
use App\Interface\Iris\Repository\App\PerfilRecomendadoRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;

/**
 * @extends ServiceEntityRepository<PerfilRecomendado>
 */
class PerfilRecomendadoRepository extends EntityRepository implements PerfilRecomendadoRepositoryInterface
{
    //    /**
    //     * @return PerfilRecomendado[] Returns an array of PerfilRecomendado objects
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

    //    public function findOneBySomeField($value): ?PerfilRecomendado
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    /**
     * @param string $cpf
     *
     * @return PerfilRecomendado|null
     */
    public function getPerfilRecomendadoByCpf(string $cpf): ?array
    {
        return $this->createQueryBuilder('p')
            ->select('p.perfilRecomendado as descricao')
            ->andWhere('p.cpf = :cpf')
            ->setParameter('cpf', $cpf)
            ->orderBy('p.campanha', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getAll(): array
    {
        return $this->findAll();
    }

    public function getById(int $id): ?PerfilRecomendado
    {
        return $this->find($id);
    }


    public function getByCpf(string $cpf): ?PerfilRecomendado
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.cpf = :cpf')
            ->setParameter('cpf', $cpf)
            ->orderBy('p.campanha', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function update(PerfilRecomendado $perfilRecomendado): void
    {
        $this->getEntityManager()->persist($perfilRecomendado);
        $this->getEntityManager()->flush();
    }
}
