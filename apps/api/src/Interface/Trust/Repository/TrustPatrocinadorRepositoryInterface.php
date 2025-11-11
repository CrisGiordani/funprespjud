<?php

namespace App\Interface\Trust\Repository;

use App\DTO\Trust\Output\CargoOutputDTO;

interface TrustPatrocinadorRepositoryInterface
{
    /**
     * @param int $idEmpresa
     *
     * @return array<CargoOutputDTO>
     */
    public function listarCargosPatrocinador(int $idEmpresa): array;
}
