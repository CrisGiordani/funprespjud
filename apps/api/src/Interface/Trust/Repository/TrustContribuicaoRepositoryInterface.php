<?php

namespace App\Interface\Trust\Repository;

use App\DTO\Trust\Input\ContribuicaoDoMesDTO;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\Enum\Trust\Contribuicao\TipoMantenedorConsolidadoEnum;

interface TrustContribuicaoRepositoryInterface
{
    /**
     * Obtém as contribuições de um participante por CPF e filtro de data
     *
     * @param string $cpf CPF do participante
     * @param ContribuicaoFilterDTO $filter Filtros para a busca (data inicial e final)
     * @return array Array contendo as contribuições
     */
    public function getContribuicoes(string $cpf, ContribuicaoFilterDTO $filter): array;

    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     * @return array
     */
    public function getContribuicoesPERFIL(string $cpf, ContribuicaoFilterDTO $filter): array;

    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     *
     * @return array
     */
    public function demonstrativoAnaliticoImpostoRenda(string $cpf, ContribuicaoFilterDTO $filter, string $mantenedorConsolidado): array;

    /**
     * @param int $idPessoa
     *
     * @return array|null
     */
    public function getUltimaContribuicaoFacultativaByCpf(int $idPessoa): ?array;

    /**
     * @param string $cpf
     * @param TipoMantenedorConsolidadoEnum $contribuidor
     *
     * @return ContribuicaoDoMesDTO[]|null
     */
    public function getContribuicaoDoMes(string $cpf, TipoMantenedorConsolidadoEnum $contribuidor): array;

    /**
     * @param string $cpf
     * @return array
     */
    public function getContribuicoesSaldo(string $cpf): array;
}