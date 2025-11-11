<?php

namespace App\Interface\Iris\Service\App;

use App\Entity\Iris\App\PerfilInvestimento;

interface PortalPerfilInvestimentoServiceInterface
{
    /**
     * @return PerfilInvestimento[]
     */
    public function getAll();

    /**
     * @param int $id
     *
     * @return PerfilInvestimento
     */
    public function getById(int $id);

    public function getPerfilByName(string $name): ?PerfilInvestimento;

    /**
     * @param int $id
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilByIdTrust(int $id): ?PerfilInvestimento;

    // public function create(array $data);

    // public function update(int $id, array $data);

    // public function delete(int $id);
}
