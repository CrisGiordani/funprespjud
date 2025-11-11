<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Input\BeneficiarioDTO;
use App\DTO\Trust\Input\BeneficiarioUpdateDTO;

interface TrustBeneficiarioServiceInterface
{
    /**
     * @param string $cpf
     *
     * @return BeneficiarioDTO[]|null
     */
    public function getBeneficiarios(string $cpf): array|null;

    /**
     * @param string $cpf
     *
     * @return bool
     */
    public function insertBeneficiario(string $cpf, BeneficiarioDTO $dados): bool;

    /**
     * @param string $cpf
     *
     * @return bool
     */
    public function deleteBeneficiario(string $id): bool;

    /**
     * @param string $cpf
     *
     * @return bool
     */
    public function updateBeneficiario(string $cpf, string $id, BeneficiarioDTO|BeneficiarioUpdateDTO $dados): bool;
}
