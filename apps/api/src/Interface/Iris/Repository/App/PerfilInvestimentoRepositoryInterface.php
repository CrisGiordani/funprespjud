<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\PerfilInvestimento;

interface PerfilInvestimentoRepositoryInterface
{
    /**
     * @return PerfilInvestimento[]
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return PerfilInvestimento|null
     */
    public function getById(int $id): ?PerfilInvestimento;

    /**
     * @param string $name
     *
     * @return PerfilInvestimento|null
     */
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
