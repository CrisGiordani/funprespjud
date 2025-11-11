<?php

namespace App\Interface\Trust\Repository;

interface TrustLgpdRepositoryInterface
{
    /**
     * Obtém o Consentimento LGPD
     *
     * @param int $idTrust
     * @return array
     */
    public function getConsentimentoLgpd(int $idTrust): array;

    /**
     * Salva o aceite do Consentimento LGPD
     *
     * @param array $dados
     * @param int $idTrust
     * @return array
     */
    public function saveConsentimentoLgpd(array $dados, int $idTrust): array;

    /**
     * Obtém a sequência do Consentimento LGPD
     *
     * @return int
     */
    public function findSequenceConsentimentoLgpd(): int;
}
