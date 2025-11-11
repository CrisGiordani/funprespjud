<?php

namespace App\Repository\Iris\Core;

use App\Entity\Iris\Core\Documento;
use App\Interface\Iris\Repository\Core\DocumentoRepositoryInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;

/**
 * @extends EntityRepository<Documento>
 */
class DocumentoRepository extends EntityRepository implements DocumentoRepositoryInterface
{
    /**
     * @return \Doctrine\ORM\Query
     */
    public function getAll(array $filter = []): Query
    {
        $qb = $this->createQueryBuilder('d')
                    ->select([
                        'd.nome as nome',
                        'd.tipo as tipo',
                        'd.dt_documento as dtDocumento',
                        'd.link as link',
                    ])
                    ->where('d.dt_delecao IS NULL')
                    ->orderBy('d.dt_criacao', 'DESC');

        if (isset($filter['tipo']) && $filter['tipo']) {
            $qb->andWhere('d.tipo = :tipo')
                ->setParameter('tipo', $filter['tipo']);
        }
        if (isset($filter['ano']) && $filter['ano']) {
            $anoInicio = $filter['ano'] . '-01-01 00:00:00.000';
            $anoFim = $filter['ano'] . '-12-31 23:59:59.999';
            $qb->andWhere('d.dt_documento >= :anoInicio')
                ->andWhere('d.dt_documento <= :anoFim')
                ->setParameter('anoInicio', $anoInicio)
                ->setParameter('anoFim', $anoFim);
        }

        return $qb->getQuery();
    }

    public function getByUsuarioId(int $usuarioId)
    {
        return $this->createQueryBuilder('d')
                    ->where('d.dt_delecao IS NULL')
                    ->andWhere('d.usuario_id = :usuarioId')
                    ->setParameter('usuarioId', $usuarioId)
                    ->orderBy('d.dt_criacao', 'DESC')
                    ->getQuery()
                    ->getResult();
    }

    public function getById(int $id)
    {
        return $this->createQueryBuilder('d')
                    ->where('d.dt_delecao IS NULL')
                    ->andWhere('d.id = :id')
                    ->setParameter('id', $id)
                    ->getQuery()
                    ->getOneOrNullResult();
    }

    public function save(Documento $documento): Documento
    {
        $this->getEntityManager()->persist($documento);

        $this->getEntityManager()->flush();

        return $documento;
    }

    public function update(Documento $documento): Documento
    {
        $this->getEntityManager()->persist($documento);
        $this->getEntityManager()->flush();

        return $documento;
    }

    public function softDelete(Documento $documento, bool $flush = true): void
    {
        $documento->setDtDelecao(new \DateTime());

        $this->getEntityManager()->persist($documento);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function restore(Documento $documento, bool $flush = true): void
    {
        $documento->setDtDelecao(null);

        $this->getEntityManager()->persist($documento);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
