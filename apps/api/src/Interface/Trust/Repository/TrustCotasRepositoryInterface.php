<?php

namespace App\Interface\Trust\Repository;

interface TrustCotasRepositoryInterface
{
    /**
     * @return array
     */
    public function getCotasAtual(): array;

    /**
     * @return array
     */
    public function getCotasHistorico(): array;

    /**
     * @param array $filter
     * @return array
     */
    public function getCotasPaginadas(array $filter): array;

    /**
     * Obtém a data da última cota disponível no banco de dados
     *
     * @return string|null Data da última cota ou null se não houver cotas
     * @throws \Exception Quando ocorre um erro ao buscar a data
     */
    public function getDataUltimaCota(): ?string;
}
