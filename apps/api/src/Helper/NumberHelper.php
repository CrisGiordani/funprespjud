<?php

namespace App\Helper;

use App\Interface\Helpers\NumberHelperInterface;

class NumberHelper implements NumberHelperInterface
{
    /**
     * Arredonda um número para o número de casas decimais especificado
     *
     * @param float $number Número a ser arredondado
     * @param int $decimals Número de casas decimais
     * @return float
     */
    public static function round(float $number, int $decimals = 2): float
    {
        return round($number, $decimals);
    }

    /**
     * Arredonda um número para cima
     *
     * @param float $number Número a ser arredondado
     * @param int $decimals Número de casas decimais
     * @return float
     */
    public static function roundUp(float $number, int $decimals = 2): float
    {
        return ceil($number * pow(10, $decimals)) / pow(10, $decimals);
    }

    /**
     * Arredonda um número para baixo
     *
     * @param float $number Número a ser arredondado
     * @param int $decimals Número de casas decimais
     * @return float
     */
    public static function roundDown(float $number, int $decimals = 2): float
    {
        return floor($number * pow(10, $decimals)) / pow(10, $decimals);
    }

    /**
     * Formata um número como moeda no padrão brasileiro (R$)
     *
     * @param float $number Número a ser formatado
     * @param bool $showSymbol Se deve mostrar o símbolo da moeda
     * @return string
     */
    public static function formatCurrency(float $number, bool $showSymbol = true): string
    {
        $formatted = self::formatNumber($number, 2);

        return $showSymbol ? "R$ {$formatted}" : $formatted;
    }

    /**
     * Converte uma string de moeda no padrão brasileiro para float
     *
     * @param string $currency String no formato "R$ 1.234,56"
     * @return float
     */
    public static function parseCurrency(string $currency): float
    {
        // Remove o símbolo R$ e espaços
        $currency = str_replace(['R$', ' '], '', $currency);

        // Substitui pontos por vazios e vírgula por ponto
        $currency = str_replace('.', '', $currency);
        $currency = str_replace(',', '.', $currency);

        return (float) $currency;
    }

    /**
     * Formata um número com separador de milhares
     *
     * @param float $number Número a ser formatado
     * @param int $decimals Número de casas decimais
     * @return string
     */
    public static function formatNumber(float $number, int $decimals = 2): string
    {
        return number_format($number, $decimals, ',', '.');
    }

    /**
     * Converte uma string formatada com separador de milhares para float
     *
     * @param string $number String no formato "1.234,56"
     * @return float
     */
    public static function parseNumber(string $number): float
    {
        // Remove pontos e substitui vírgula por ponto
        $number = str_replace('.', '', $number);
        $number = str_replace(',', '.', $number);

        return (float) $number;
    }
}
