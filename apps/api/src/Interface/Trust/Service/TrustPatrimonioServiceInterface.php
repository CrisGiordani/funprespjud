<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Input\PatrimonioEvolucaoDTO;
use App\DTO\Trust\Output\PatrimonioOutputDTO;

interface TrustPatrimonioServiceInterface
{

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function buscarDadosAnuais(string $cpf): array;

    /**
     * @param string $cpf
     *
     * @return PatrimonioOutputDTO
     */
    public function getPatrimonio(string $cpf): PatrimonioOutputDTO;

    /**
     * @param string $cpf
     *
     * @return PatrimonioEvolucaoDTO
     */
    public function getPatrimonioEvolucaoAnual(string $cpf): array;

}
