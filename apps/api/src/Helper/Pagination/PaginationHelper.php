<?php

namespace App\Helper\Pagination;

use App\Enum\Pagination\PaginationEnum;
use App\Interface\Helpers\PaginationHelperInterface;

/**
 * Helper para manipulação de paginação
 */
class PaginationHelper implements PaginationHelperInterface
{
    /**
     * Obtém o índice da página a partir do filtro
     *
     * @param array<string, mixed> $filter Filtros da paginação
     * @return int Índice da página
     */
    public static function getPageIndex(array $filter): int
    {
        return (int) ($filter[PaginationEnum::PAGE_INDEX_KEY->value] ?? PaginationEnum::DEFAULT_PAGE_INDEX->getIntValue());
    }

    /**
     * Obtém o tamanho da página a partir do filtro
     *
     * @param array<string, mixed> $filter Filtros da paginação
     * @return int Tamanho da página
     */
    public static function getPageSize(array $filter): int
    {
        return (int) ($filter[PaginationEnum::PAGE_SIZE_KEY->value] ?? PaginationEnum::DEFAULT_PAGE_SIZE->getIntValue());
    }

    /**
     * Calcula o offset para paginação
     *
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @return int Offset calculado
     */
    public static function calculateOffset(int $pageIndex, int $pageSize): int
    {
        return $pageIndex * $pageSize;
    }

    /**
     * Cria resposta de paginação vazia
     *
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @return array<string, mixed> Estrutura de resposta vazia
     */
    public static function createEmptyResponse(int $pageIndex, int $pageSize): array
    {
        return [
            'success' => true,
            'data' => [
                PaginationEnum::DATA_KEY->value => [],
                PaginationEnum::TOTAL_RECORDS_KEY->value => 0,
                PaginationEnum::PAGE_INDEX_KEY->value => $pageIndex,
                PaginationEnum::PAGE_SIZE_KEY->value => $pageSize,
                PaginationEnum::TOTAL_PAGES_KEY->value => 0,
            ],
        ];
    }

    /**
     * Cria resposta de paginação completa
     *
     * @param int $totalRegistros Total de registros
     * @param array $data Dados paginados
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @return array<string, mixed> Estrutura de resposta completa
     */
    public static function createResponse(int $totalRegistros, array $data, int $pageIndex, int $pageSize): array
    {
        return [
            'success' => true,
            'data' => [
                PaginationEnum::DATA_KEY->value => $data,
                PaginationEnum::TOTAL_RECORDS_KEY->value => $totalRegistros,
                PaginationEnum::PAGE_INDEX_KEY->value => $pageIndex,
                PaginationEnum::PAGE_SIZE_KEY->value => $pageSize,
                PaginationEnum::TOTAL_PAGES_KEY->value => ceil($totalRegistros / $pageSize),
            ],
        ];
    }

    /**
     * Valida e ajusta os parâmetros de paginação
     *
     * @param array<string, mixed> $filter Filtros da paginação
     * @return array<string, int> Parâmetros validados [pageIndex, pageSize]
     */
    public static function validatePaginationParams(array $filter): array
    {
        $pageIndex = max(0, self::getPageIndex($filter));
        $pageSize = max(1, self::getPageSize($filter));

        return [
            PaginationEnum::PAGE_INDEX_KEY->value => $pageIndex,
            PaginationEnum::PAGE_SIZE_KEY->value => $pageSize,
        ];
    }
}
