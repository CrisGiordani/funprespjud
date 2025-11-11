<?php

namespace App\Interface\Trust\Service;

interface TrustLgpdServiceInterface
{
    /**
     * Obtém o aceite do Consentimento LGPD
     *
     * @param int $idTrust
     * @return array
     */
    public function getConsentimentoLgpd(int $idTrust): mixed;

    /**
     * Salva o aceite do Consentimento LGPD
     *
     * @param array $dados
     * @param int $idTrust
     * @return array
     */
    public function saveConsentimentoLgpd(array $dados, int $idTrust): mixed;
}
