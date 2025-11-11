<?php

namespace App\Interface\Trust\Repository;

interface IndexadorValorRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array; //Pegar todos os dados da tabela

    /**
     * @param string|array $codigo
     *
     * @param string|array $codigo
     * @return [type]
     */
    public function getByCodigo(string|array $codigo); // pegar todos os dados da tabela por codigo

    /**
     * @param string|array $codigo
     *
     * @return [type]
     */
    public function getLastValueByCodigo(string|array $codigo); //pegar o ultimo valor da tabela por codigo
}
