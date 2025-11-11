<?php

namespace App\Interface\Enum;

/**
 * Interface para definir o contrato de paginação
 */
interface PaginationEnumInterface
{
    /**
     * Retorna o valor do enum como string
     *
     * @return string
     */
    public function getValue(): string;

    /**
     * Retorna o valor do enum como inteiro
     *
     * @return int
     */
    public function getIntValue(): int;

    /**
     * Retorna o tamanho padrão da página
     *
     * @return string
     */
    public static function getDefaultPageSize(): string;

    /**
     * Retorna o índice padrão da página
     *
     * @return string
     */
    public static function getDefaultPageIndex(): string;

    /**
     * Retorna a chave para o índice da página
     *
     * @return string
     */
    public static function getPageIndexKey(): string;

    /**
     * Retorna a chave para o tamanho da página
     *
     * @return string
     */
    public static function getPageSizeKey(): string;

    /**
     * Retorna a chave para o total de registros
     *
     * @return string
     */
    public static function getTotalRecordsKey(): string;

    /**
     * Retorna a chave para os dados
     *
     * @return string
     */
    public static function getDataKey(): string;

    /**
     * Retorna a chave para o total de páginas
     *
     * @return string
     */
    public static function getTotalPagesKey(): string;
}
