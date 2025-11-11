<?php

namespace App\Interface\Helpers;

interface NumberHelperInterface
{
    /**
     * Arredonda um número para o número de casas decimais especificado
     *
     * @param float $number Número a ser arredondado
     * @param int $decimals Número de casas decimais
     * @return float
     */
    public static function round(float $number, int $decimals = 2): float;

    /**
     * Arredonda um número para cima
     *
     * @param float $number Número a ser arredondado
     * @param int $decimals Número de casas decimais
     * @return float
     */
    public static function roundUp(float $number, int $decimals = 2): float;

    /**
     * Arredonda um número para baixo
     *
     * @param float $number Número a ser arredondado
     * @param int $decimals Número de casas decimais
     * @return float
     */
    public static function roundDown(float $number, int $decimals = 2): float;

    /**
     * Formata um número como moeda no padrão brasileiro (R$)
     *
     * @param float $number Número a ser formatado
     * @param bool $showSymbol Se deve mostrar o símbolo da moeda
     * @return string
     */
    public static function formatCurrency(float $number, bool $showSymbol = true): string;

    /**
     * Converte uma string de moeda no padrão brasileiro para float
     *
     * @param string $currency String no formato "R$ 1.234,56"
     * @return float
     */
    public static function parseCurrency(string $currency): float;

    /**
     * Formata um número com separador de milhares
     *
     * @param float $number Número a ser formatado
     * @param int $decimals Número de casas decimais
     * @return string
     */
    public static function formatNumber(float $number, int $decimals = 2): string;

    /**
     * Converte uma string formatada com separador de milhares para float
     *
     * @param string $number String no formato "1.234,56"
     * @return float
     */
    public static function parseNumber(string $number): float;
}
