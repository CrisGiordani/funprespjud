<?php

namespace App\Interface\Iris\Service\App;

use App\Entity\Iris\App\PerfilInvestimento;
use App\Entity\Iris\App\PerfilRecomendado;

interface PerfilRecomendadoServiceInterface
{
    /**
     * @param string $cpf
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilRecomendadoByCpf(string $cpf): ?PerfilInvestimento;

    /**
     * @return array
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
