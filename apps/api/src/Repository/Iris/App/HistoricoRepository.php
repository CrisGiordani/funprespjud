<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\Historico;
use App\Interface\Iris\Repository\App\HistoricoRepositoryInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;

/**
 * @extends ServiceEntityRepository<Historico>
 */
class HistoricoRepository extends EntityRepository implements HistoricoRepositoryInterface
{
    public function getAll(): array
    {
        return $this->findAll();
    }

    public function getById(int $id): array
    {
        return $this->findBy(['id' => $id]);
    }

    public function getByCpf(string $cpf): Query
    {
        return $this->getEntityManager()->createQueryBuilder()
            ->select('h, s')
            ->from(Historico::class, 'h')
            ->leftJoin('h.status', 's')
            ->where('h.cpf = :cpf')
            ->orderBy('h.dt_evento', 'DESC')
            ->setParameter('cpf', $cpf)
            ->getQuery();
        // ->getResult();
    }

    /**
    * @param string $cpf
    *
    * @return Historico|null
    */
    public function findByCpfLastresult(string $cpf): ?Historico
    {
        return $this->createQueryBuilder('h')
            ->select('h')
            ->leftJoin('h.status', 's')
            ->where('h.cpf = :cpf')
            ->setParameter('cpf', $cpf)
            ->orderBy('h.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function save(Historico $historico): void
    {
        $this->getEntityManager()->persist($historico);
        $this->getEntityManager()->flush();
    }
}
