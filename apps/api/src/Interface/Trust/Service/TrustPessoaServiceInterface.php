<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Input\PessoaDTO;

interface TrustPessoaServiceInterface
{
    /**
     * Obtém uma pessoa pelo CPF
     *
     * @param string $cpf
     * @return PessoaDTO|null
     */
    public function getPessoaByCpf(string $cpf): PessoaDTO|null;
}
