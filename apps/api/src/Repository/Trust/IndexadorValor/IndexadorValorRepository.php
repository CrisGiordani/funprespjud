<?php

namespace App\Repository\Trust\IndexadorValor;

use App\Interface\Trust\Repository\IndexadorValorRepositoryInterface;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\DBAL\Connection;

class IndexadorValorRepository implements IndexadorValorRepositoryInterface
{
    public function __construct(
        private readonly Connection $connection,
    ) {
    }

    public function getAll(): array
    {
        $qb = $this->connection->createQueryBuilder();
        $query = $qb->select('iv.*')
            ->from('INDEXADOR_VALOR', 'iv')
            ->orderBy('iv.DT_INDEXADOR', 'DESC');

        return $query->executeQuery()->fetchAllAssociative();
    }

    /**
     *  Pegar o historico de um ou mais indexadores
     * @param string|array $codigo
     *
     * @return array
     */
    public function getByCodigo(string|array $codigo)
    {
        $qb = $this->connection->createQueryBuilder();
        $query = $qb->select(
            'iv.ID_INDEXADOR as indexador',
            'CONVERT(VARCHAR(10),iv.DT_INDEXADOR, 103) as dt_indexador',
            'iv.VL_INDEXADOR as valor',
            'iv.VL_VARIACAO as percentual',
            'iv.IC_PREVIA as previa'
        )
            ->from('INDEXADOR_VALOR', 'iv')
            ->where('iv.ID_INDEXADOR IN (:codes)')
            ->setParameter('codes', $codigo, ArrayParameterType::STRING)
            ->orderBy('iv.DT_INDEXADOR', 'DESC')
            ->executeQuery();

        return $query->fetchAllAssociative();
    }

    /**
     * Pegar o ultimo valor de um indexador
     * @param string|array $codigo
     *
     * @return array
     */
    public function getLastValueByCodigo(string|array $codigo): array
    {
        $codes = is_array($codigo) ? $codigo : [$codigo];

        $qb = $this->connection->createQueryBuilder();
        $qb
            ->select(
                'iv.ID_INDEXADOR as indexador',
                'CONVERT(VARCHAR(10),iv.DT_INDEXADOR, 103) as dt_indexador',
                'iv.VL_INDEXADOR as valor',
                'iv.VL_VARIACAO as percentual',
                'iv.IC_PREVIA as previa'
            )
            ->from('INDEXADOR_VALOR', 'iv')
            ->where('iv.ID_INDEXADOR IN (:codes)')
            ->andWhere('iv.DT_INDEXADOR = (SELECT MAX(iv2.DT_INDEXADOR) FROM INDEXADOR_VALOR iv2 WHERE iv2.ID_INDEXADOR = iv.ID_INDEXADOR)')
            ->setParameter('codes', $codes, ArrayParameterType::STRING);

        return $qb->executeQuery()->fetchAllAssociative();
    }
}
