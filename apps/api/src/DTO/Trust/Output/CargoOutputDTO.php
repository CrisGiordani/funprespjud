<?php

namespace App\DTO\Trust\Output;

class CargoOutputDTO
{
    public function __construct(
        public int $idEmpresa,
        public string $idCargo,
        public string $nmCargo,
    ) {
    }

    public function getIdEmpresa(): int
    {
        return $this->idEmpresa;
    }

    public function getIdCargo(): string
    {
        return $this->idCargo;
    }

    public function getNmCargo(): string
    {
        return $this->nmCargo;
    }

    public function toArray(): array
    {
        return [
            'idEmpresa' => $this->idEmpresa,
            'idCargo' => $this->idCargo,
            'nmCargo' => $this->nmCargo,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            idEmpresa: $data['idEmpresa'],
            idCargo: $data['idCargo'],
            nmCargo: $data['nmCargo'],
        );
    }
}
