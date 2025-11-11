<?php

namespace App\Service\Iris\Core;

use App\Entity\Iris\Core\ParticipanteDiferencaPatrimonioLog;

interface ParticipanteDiferencaPatrimonioLogServiceInterface
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
