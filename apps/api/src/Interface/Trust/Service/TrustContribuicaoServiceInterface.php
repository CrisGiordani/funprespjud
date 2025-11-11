<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Input\ContribuicaoDoMesDTO;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;

interface TrustContribuicaoServiceInterface
{
    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO|null $filter
     * @return array
     */
    public function getContribuicoes(string $cpf, ?ContribuicaoFilterDTO $filter): array;

    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO|null $filter
     *
     * @return array
     */
    public function getContribuicoesPERFIL(string $cpf, ?ContribuicaoFilterDTO $filter): array;

    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     *
     * @return array
     */
    public function demonstrativoAnaliticoImpostoRenda(string $cpf, ContribuicaoFilterDTO $filter): array;

    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     *
     * @return array
     */
    public function organizarContribuicoes(string $cpf, ContribuicaoFilterDTO $filter): array;

    /**
     * @param int $idPessoa
     *
     * @return array|null
     */
    public function getUltimaContribuicaoFacultativaByCpf(int $idPessoa): ?array;

    /**
     * @param string $cpf
     *
     * @return ContribuicaoDoMesDTO
     */
    public function getContribuicaoDoMes(string $cpf): ContribuicaoDoMesDTO;

    /**
     * @param string $cpf
     * @return array
     */
    public function getContribuicoesSaldo(string $cpf): array;

    /**
     * @param string $cpf
     * @return array
     */
    public function getPercentualContribuicaoAtual(string $idParticipante): array;
}
