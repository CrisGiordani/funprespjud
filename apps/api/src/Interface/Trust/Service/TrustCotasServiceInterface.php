<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Input\IndexadorValorDTO;

interface TrustCotasServiceInterface
{
    /**
     * @return IndexadorValorDTO | array    
     */
    public function getCotasAtual($cpf): IndexadorValorDTO | array;

    /**
     * @return array
     */
    public function getCotasHistorico(): array;

    /**
     * @param array $filter
     *
     * @return array
     */
    public function getCotasPaginadas(array $filter): array;
}
