<?php

namespace App\Interface\Trust\Repository;

interface TrustPatrimonioRepositoryInterface
{
    /**
     * @param string $cpf
     * 
     * @return array
     */
    public function getPatrimonioEvolucaoAnual(string $cpf): array;

    /**
     * @param string $cpf
     * 
     * @return array
     */
    public function getMeuInvestimento(string $cpf, string $perfilPlanoParticipante): array;
}
