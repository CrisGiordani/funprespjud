<?php

namespace App\Interface\Enum;

/**
 * Interface para o enum de cotas do Trust
 */
interface TrustCotasEnumInterface
{
    /**
     * Obtém o valor do enum como string
     *
     * @return string Valor do enum
     */
    public function getValue(): string;

    /**
     * Obtém o valor do enum como inteiro
     *
     * @return int Valor do enum convertido para inteiro
     */
    public function getIntValue(): int;

    /**
     * Obtém o nome do campo formatado com o alias da tabela
     *
     * @param string $field Nome do campo
     * @return string Campo formatado com o alias
     */
    public static function getFieldWithAlias(string $field): string;

    /**
     * Obtém o nome do campo formatado com o alias e um alias personalizado
     *
     * @param string $field Nome do campo
     * @param string $alias Alias personalizado
     * @return string Campo formatado com o alias
     */
    public static function getFieldWithAliasAs(string $field, string $alias): string;

    /**
     * Obtém a string formatada para a função STR do banco de dados
     *
     * @param string $field Nome do campo
     * @param int $length Comprimento total
     * @param int $decimals Número de casas decimais
     * @return string String formatada para a função STR
     */
    public static function getStrFunction(string $field, int $length, int $decimals): string;

    /**
     * Obtém o identificador do indexador
     *
     * @return string
     */
    public static function getIdIndexador(): string;

    /**
     * Obtém o nome da tabela
     *
     * @return string
     */
    public static function getTableName(): string;

    /**
     * Obtém o alias da tabela
     *
     * @return string
     */
    public static function getAlias(): string;

    /**
     * Obtém o tamanho padrão da página
     *
     * @return string
     */
    public static function getDefaultPageSize(): string;

    /**
     * Obtém o índice padrão da página
     *
     * @return string
     */
    public static function getDefaultPageIndex(): string;
}
