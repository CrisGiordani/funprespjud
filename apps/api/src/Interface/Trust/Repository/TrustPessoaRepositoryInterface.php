<?php

namespace App\Interface\Trust\Repository;

use App\DTO\Trust\Input\BeneficiarioDTO;
use App\DTO\Trust\Input\PessoaDTO;

interface TrustPessoaRepositoryInterface
{
    /**
     * Obtém uma pessoa pelo CPF
     *
     * @param string $cpf
     * @return PessoaDTO|null
     */
    public function getPessoaByCpf(string $cpf): PessoaDTO|null;


    /**
     * @param BeneficiarioDTO $dados
     * 
     * @return bool
     */
    public function insertPessoaBeneficiario(BeneficiarioDTO $dados): bool;
}
