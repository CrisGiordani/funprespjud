<?php

namespace App\Service\Trust\Beneficiario;

class TrustBeneficiarioConstants
{
    /**
     * IDs de grau de parentesco que representam cônjuge na tabela PARENTESCO
     * 
     * Geralmente:
     * 1 = Cônjuge/Esposa
     * 2 = Companheiro(a)
     * 
     * IMPORTANTE: Ajuste estes valores conforme a tabela PARENTESCO do seu banco de dados
     */
    public const IDS_CONJUGE = ['1', '2'];

    /**
     * Verifica se o grau de parentesco é de cônjuge
     * 
     * @param string $grauParentesco
     * @return bool
     */
    public static function isConjuge(string $grauParentesco): bool
    {
        return in_array($grauParentesco, self::IDS_CONJUGE, true);
    }
}
