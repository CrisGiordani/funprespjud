<?php

namespace App\Interface\Trust\Service;

interface IndexadorValorServiceInterface
{
    public function getAll(): array;

    /**
     * @param string|array $codigo
     *
     * @return array
     */
    public function getByCodigo(string|array $codigo): array;

    /**
     * @param string|array $codigo
     *
     * @return array
     */
    public function getLastValueByCodigo(string|array $codigo): array;
}
