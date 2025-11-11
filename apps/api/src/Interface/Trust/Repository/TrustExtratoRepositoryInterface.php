<?php

namespace App\Interface\Trust\Repository;

interface TrustExtratoRepositoryInterface
{
    /**
     * Busca as contribuições de um participante
     *
     * @param array $filter Filtros para a busca
     * @return array Array contendo as contribuições encontradas
     */
    public function findContribuicoes(array $filter): array;
}
