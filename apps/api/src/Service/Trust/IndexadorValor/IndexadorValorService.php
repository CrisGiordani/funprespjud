<?php

namespace App\Service\Trust\IndexadorValor;

use App\DTO\Trust\Input\IndexadorValorDTO;
use App\Interface\Trust\Repository\IndexadorValorRepositoryInterface;
use App\Interface\Trust\Service\IndexadorValorServiceInterface;

class IndexadorValorService implements IndexadorValorServiceInterface
{
    public function __construct(
        private readonly IndexadorValorRepositoryInterface $indexadorValorRepository
    ) {
    }

    public function getAll(): array
    {
        return $this->indexadorValorRepository->getAll();
    }

    /**
     *  Pegar o historico de um ou mais indexadores
     * @param string|array $codigo
     *
     * @return array
     */
    public function getByCodigo(string|array $codigo): array
    {
        if (is_string($codigo)) {
            $codigo = explode(',', $codigo);
        }

        $indexadorValues = $this->indexadorValorRepository->getByCodigo($codigo);

        return array_map(function ($indexadorValue)
        {
            return new IndexadorValorDTO(
                $indexadorValue['indexador'],
                $indexadorValue['dt_indexador'],
                $indexadorValue['valor'],
                $indexadorValue['percentual'],
                $indexadorValue['previa']
            );
        }, $indexadorValues);
    }

    /**
     * @param string|array $codigo
     *
     * @return array
     */
    public function getLastValueByCodigo(string|array $codigo): array
    {
        $indexadorValues = $this->indexadorValorRepository->getLastValueByCodigo($codigo);

        return array_map(function ($indexadorValue)
        {
            return new IndexadorValorDTO(
                $indexadorValue['indexador'],
                $indexadorValue['dt_indexador'],
                $indexadorValue['valor'],
                $indexadorValue['percentual'],
                $indexadorValue['previa']
            );
        }, $indexadorValues);
    }
}
