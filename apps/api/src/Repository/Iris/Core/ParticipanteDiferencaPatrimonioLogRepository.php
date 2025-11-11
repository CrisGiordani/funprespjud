<?php

namespace App\Repository\Iris\Core;

use App\Entity\Iris\Core\ParticipanteDiferencaPatrimonioLog;
use App\Exception\ParticipanteDiferencaPatrimonioLogException;
use App\Interface\Iris\Repository\Core\ParticipanteDiferencaPatrimonioLogRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;

/**
 * @extends ServiceEntityRepository<ParticipanteDiferencaPatrimonioLog>
 */
class ParticipanteDiferencaPatrimonioLogRepository extends EntityRepository implements ParticipanteDiferencaPatrimonioLogRepositoryInterface
{
    /**
     * @param string $cpf
     * 
     * @return ParticipanteDiferencaPatrimonioLog|null
     */
    public function findByCpf(string $cpf): ?ParticipanteDiferencaPatrimonioLog
    {
        return $this->findOneBy(['cpf' => $cpf]);
    }

    /**
     * @param ParticipanteDiferencaPatrimonioLog $participanteDiferencaPatrimonioLog
     * 
     * @return void
     */
    public function save(ParticipanteDiferencaPatrimonioLog $participanteDiferencaPatrimonioLog): void
    {
        try {
            $this->getEntityManager()->persist($participanteDiferencaPatrimonioLog);
            $this->getEntityManager()->flush();
        } catch (ParticipanteDiferencaPatrimonioLogException $e) {
            throw new ParticipanteDiferencaPatrimonioLogException();
        }
    }
}
