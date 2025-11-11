<?php

namespace App\Interface\Iris\Service\Core;

use App\Entity\Iris\Core\ParticipanteDiferencaPatrimonioLog;
use App\Interface\Iris\Repository\Core\ParticipanteDiferencaPatrimonioLogRepositoryInterface;
use App\Service\Iris\Core\ParticipanteDiferencaPatrimonioLogServiceInterface;

class ParticipanteDiferencaPatrimonioLogService implements ParticipanteDiferencaPatrimonioLogServiceInterface
{
    public function __construct(
        private ParticipanteDiferencaPatrimonioLogRepositoryInterface $participanteDiferencaPatrimonioLogRepository
    ) {}

    /**
     * @param ParticipanteDiferencaPatrimonioLog $participanteDiferencaPatrimonioLog
     *
     * @return void
     */
    public function save(ParticipanteDiferencaPatrimonioLog $participanteDiferencaPatrimonioLog): void
    {
        $this->participanteDiferencaPatrimonioLogRepository->save($participanteDiferencaPatrimonioLog);
    }

    /**
     * @param string $cpf
     *
     * @return ParticipanteDiferencaPatrimonioLog|null
     */
    public function findByCpf(string $cpf): ?ParticipanteDiferencaPatrimonioLog
    {
        return $this->participanteDiferencaPatrimonioLogRepository->findByCpf($cpf);
    }
}
