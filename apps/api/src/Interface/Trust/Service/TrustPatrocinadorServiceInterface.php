<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Output\CargoOutputDTO;

interface TrustPatrocinadorServiceInterface
{
    /**
     * @param string $cpf
     *
     * @return array<CargoOutputDTO>
     */
    public function listarCargosPatrocinador(string $cpf): array;
}
