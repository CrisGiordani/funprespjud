<?php

namespace App\Interface\Iris\Repository\Core;

use App\Entity\Iris\Core\ParticipanteDiferencaPatrimonioLog;

interface ParticipanteDiferencaPatrimonioLogRepositoryInterface
{
    /**
     * @param string $cpf
     * 
     * @return ParticipanteDiferencaPatrimonioLog|null
     */
    public function findByCpf(string $cpf): ?ParticipanteDiferencaPatrimonioLog;

    /**
     * @param ParticipanteDiferencaPatrimonioLog $participanteDiferencaPatrimonioLog
     * 
     * @return void
     */
    public function save(ParticipanteDiferencaPatrimonioLog $participanteDiferencaPatrimonioLog): void;
}
