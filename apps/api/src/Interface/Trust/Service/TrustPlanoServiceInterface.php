<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Output\DadosPlanoOutputDTO;

interface TrustPlanoServiceInterface
{
    /**
     * Retorna todos os planos para um participante por CPF
     *
     * @param string $cpf
     * @return DadosPlanoOutputDTO[]
     */
    public function getPlanosByCpf(string $cpf, bool $allPlanos = false): array;

    /**
     * Retorna um plano específico por ID para um participante
     *
     * @param string $cpf
     * @param int $id
     * @return DadosPlanoOutputDTO|null
     */
    public function getPlanoById(string $cpf, int $id): ?DadosPlanoOutputDTO;
}
