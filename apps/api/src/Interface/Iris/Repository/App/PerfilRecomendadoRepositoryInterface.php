<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\PerfilRecomendado;

interface PerfilRecomendadoRepositoryInterface
{
    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getPerfilRecomendadoByCpf(string $cpf): ?array;

    /**
     * @return PerfilRecomendado[]
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return PerfilRecomendado|null
     */
    public function getById(int $id): ?PerfilRecomendado;

    /**
     * @param string $cpf
     *
     * @return PerfilRecomendado|null
     */
    public function getByCpf(string $cpf): ?PerfilRecomendado;

    /**
     * @param PerfilRecomendado $perfilRecomendado
     *
     * @return void
     */
    public function update(PerfilRecomendado $perfilRecomendado): void;
}
