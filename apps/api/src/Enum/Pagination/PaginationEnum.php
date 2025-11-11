<?php

namespace App\Enum\Pagination;

use App\Interface\Enum\PaginationEnumInterface;

/**
 * Enum para constantes de paginação
 */
enum PaginationEnum: string implements PaginationEnumInterface
{
    /**
         * Tamanho padrão da página
         */
    case DEFAULT_PAGE_SIZE = '10';

    /**
         * Índice padrão da página
         */
    case DEFAULT_PAGE_INDEX = '0';

    /**
         * Chave para o índice da página no array de filtros
         */
    case PAGE_INDEX_KEY = 'pageIndex';

    /**
         * Chave para o tamanho da página no array de filtros
         */
    case PAGE_SIZE_KEY = 'pageSize';

    /**
         * Chave para o total de registros na resposta
         */
    case TOTAL_RECORDS_KEY = 'totalRegistros';

    /**
         * Chave para os dados na resposta
         */
    case DATA_KEY = 'COTAS';

    /**
         * Chave para o total de páginas na resposta
         */
    case TOTAL_PAGES_KEY = 'totalPages';

    /**
     * Retorna o valor do enum como string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * Retorna o valor do enum como inteiro
     */
    public function getIntValue(): int
    {
        return (int) $this->value;
    }

    public static function getDefaultPageSize(): string
    {
        return self::DEFAULT_PAGE_SIZE->value;
    }

    public static function getDefaultPageIndex(): string
    {
        return self::DEFAULT_PAGE_INDEX->value;
    }

    public static function getPageIndexKey(): string
    {
        return self::PAGE_INDEX_KEY->value;
    }

    public static function getPageSizeKey(): string
    {
        return self::PAGE_SIZE_KEY->value;
    }

    public static function getTotalRecordsKey(): string
    {
        return self::TOTAL_RECORDS_KEY->value;
    }

    public static function getDataKey(): string
    {
        return self::DATA_KEY->value;
    }

    public static function getTotalPagesKey(): string
    {
        return self::TOTAL_PAGES_KEY->value;
    }
}
