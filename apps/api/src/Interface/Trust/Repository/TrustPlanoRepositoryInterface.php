<?php

namespace App\Interface\Trust\Repository;

use App\DTO\Trust\Output\DadosPlanoOutputDTO;

interface TrustPlanoRepositoryInterface
{
    /**
     * Retorna todos os planos para um participante por CPF
     *
     * @param string $cpf
     * @return DadosPlanoOutputDTO[]
     */
    public function getPlanosByCpf(string $cpf): array;

    /**
     * Retorna um plano específico por ID para um participante
     *
     * @param string $cpf
     * @param int $id
     * @return DadosPlanoOutputDTO|null
     */
    public function getPlanoById(string $cpf, int $id): ?DadosPlanoOutputDTO;
}
