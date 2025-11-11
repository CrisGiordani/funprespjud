<?php

namespace App\Interface\Helpers;

interface PaginationHelperInterface
{
    /**
     * Obtém o índice da página a partir do filtro
     *
     * @param array<string, mixed> $filter Filtros da paginação
     * @return int Índice da página
     */
    public static function getPageIndex(array $filter): int;

    /**
     * Obtém o tamanho da página a partir do filtro
     *
     * @param array<string, mixed> $filter Filtros da paginação
     * @return int Tamanho da página
     */
    public static function getPageSize(array $filter): int;

    /**
     * Calcula o offset para paginação
     *
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @return int Offset calculado
     */
    public static function calculateOffset(int $pageIndex, int $pageSize): int;

    /**
     * Cria resposta de paginação vazia
     *
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @return array<string, mixed> Estrutura de resposta vazia
     */
    public static function createEmptyResponse(int $pageIndex, int $pageSize): array;

    /**
     * Cria resposta de paginação completa
     *
     * @param int $totalRegistros Total de registros
     * @param array $data Dados paginados
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @return array<string, mixed> Estrutura de resposta completa
     */
    public static function createResponse(int $totalRegistros, array $data, int $pageIndex, int $pageSize): array;

    /**
     * Valida e ajusta os parâmetros de paginação
     *
     * @param array<string, mixed> $filter Filtros da paginação
     * @return array<string, int> Parâmetros validados [pageIndex, pageSize]
     */
    public static function validatePaginationParams(array $filter): array;
}
