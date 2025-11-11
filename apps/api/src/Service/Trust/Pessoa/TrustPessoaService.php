<?php

namespace App\Service\Trust\Pessoa;

use App\DTO\Trust\Input\PessoaDTO;
use App\Exception\PessoaNotFoundException;
use App\Interface\Trust\Repository\TrustPessoaRepositoryInterface;
use App\Interface\Trust\Service\TrustPessoaServiceInterface;

class TrustPessoaService implements TrustPessoaServiceInterface
{
    public function __construct(
        private TrustPessoaRepositoryInterface $pessoaRepository
    ) {
    }

    public function getPessoaByCpf(string $cpf): PessoaDTO|null
    {
        try {
            $pessoa = $this->pessoaRepository->getPessoaByCpf($cpf);

            if (! $pessoa) {
                throw new PessoaNotFoundException();
            }

            return $pessoa;
        } catch (PessoaNotFoundException $exception) {
            throw $exception;
        } catch (\Exception $exception) {
            throw $exception;
        }
    }
}
