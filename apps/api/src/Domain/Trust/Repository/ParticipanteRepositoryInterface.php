<?php

namespace App\Domain\Trust\Repository;

use App\Domain\Trust\Entity\Participante;
use App\Domain\Trust\ValueObject\CPF;

interface ParticipanteRepositoryInterface {
    public function findByCpf(CPF $cpf): ?Participante;

    public function save(Participante $participante): void;

    public function update(Participante $participante): void;

    public function remove(Participante $participante): void;
}
