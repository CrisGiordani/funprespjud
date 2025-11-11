<?php

namespace App\DTO\Iris\App\Output;

class StatusHistoricoOutputDTO
{
    public function __construct(
        // public int $id,
        public ?string $descricao,
        public ?string $cdStatus,
        public \DateTime|string|null $dt_evento,
        public ?string $urlDocumento,
        public ?string $statusAppPreenchido,
        public ?string $descricaoAppPreenchido
    ) {
        $this->dt_evento = $this->dt_evento instanceof \DateTime ? $this->dt_evento->format('d/m/Y') : $this->dt_evento;
    }
}
