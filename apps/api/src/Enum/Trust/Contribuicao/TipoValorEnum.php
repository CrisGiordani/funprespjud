<?php

namespace App\Enum\Trust\Contribuicao;

/**
 * Enum para os tipos de valores de contribuição
 */
enum TipoValorEnum: string
{
    case RAN = 'RAN';
    case RAS = 'RAS';
    case FCBE = 'FCBE';
    case CARREGAMENTO = 'TAXA CARREGAMENTO';
    case JURO = 'JURO';
    case MULTA = 'MULTA';
    case PORTABILIDADE = 'PORTABILIDADE';
    case SEGURO = 'SEGURO';
    case ESTORNO = 'ESTORNO';
    case RESGATE_RAN = 'RESGATE - RAN';
    case RESGATE_RAS = 'RESGATE - RAS';
    case CONCESSAO = 'CONCESSÃO';
    case BAIXA = 'BAIXA';
    case BENEFICIO_CONCEDIDO = 'BENEFÍCIO CONCEDIDO';

    /**
     * Verifica se o valor é do tipo SEGURO
     * @param string $valor
     * @return bool
     */
    public static function isSeguro(string $valor): bool
    {
        return stripos($valor, self::SEGURO->value) !== false;
    }

    /**
     * Verifica se o valor é RAN ou RAS
     * @param string $valor
     * @return bool
     */
    public static function isRanOrRas(string $valor): bool
    {
        return $valor === self::RAN->value || $valor === self::RAS->value;
    }

    /**
     * Verifica se o valor é uma contribuição associada
     * @param string $valor
     * @return bool
     */
    public static function isContribuicaoAssociada(string $valor): bool
    {
        return $valor === self::FCBE->value ||
            $valor === self::CARREGAMENTO->value ||
            $valor === self::JURO->value ||
            $valor === self::MULTA->value ||
            $valor === self::PORTABILIDADE->value ||
            $valor === self::ESTORNO->value;
    }
}
