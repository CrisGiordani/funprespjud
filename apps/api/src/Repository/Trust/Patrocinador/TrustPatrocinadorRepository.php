<?php

namespace App\Repository\Trust\Patrocinador;

use App\DTO\Trust\Output\CargoOutputDTO;
use App\Interface\Trust\Repository\TrustPatrocinadorRepositoryInterface;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;

final class TrustPatrocinadorRepository implements TrustPatrocinadorRepositoryInterface
{
    public function __construct(
        private Connection $connection,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * @param int $idEmpresa
     *
     * @return array<CargoOutputDTO>
     */
    public function listarCargosPatrocinador(int $idEmpresa): array
    {
        try {
            $qb = $this->connection->createQueryBuilder('c');
            $qb->select('c.ID_EMP as idEmpresa', 'c.ID_CARGO as idCargo', 'c.NM_CARGO as nmCargo')
                ->from('CARGO', 'c')
                ->where('c.ID_EMP = :idEmpresa')
                ->andWhere('c.ID_CARGO != :idCargo')
                ->setParameter('idEmpresa', $idEmpresa)
                ->setParameter('idCargo', '0000000000')
                ->orderBy('c.NM_CARGO', 'ASC');

            $cargos = $qb->executeQuery()->fetchAllAssociative();

            return array_map(function ($dado)
            {
                return CargoOutputDTO::fromArray($dado);
            }, $cargos);
        } catch (\Exception $exception) {
            throw $exception;
        }
    }
}
