<?php

namespace App\Enum\Trust\Cotas;

use App\Interface\Enum\TrustCotasEnumInterface;

/**
 * Enumeração que define as constantes utilizadas no repositório de cotas.
 *
 * Este enum centraliza todas as constantes utilizadas nas queries do repositório,
 * facilitando a manutenção e evitando duplicação de valores.
 *
 * @package App\Enum\Trust\Cotas
 */
enum TrustCotasEnum: string implements TrustCotasEnumInterface
{
    /**
         * Identificador do indexador de cotas no banco de dados
         */
    case ID_INDEXADOR = 'COTA';

    /**
         * Nome da tabela que armazena os valores dos indexadores
         */
    case TABLE_NAME = 'INDEXADOR_VALOR';

    /**
         * Alias usado nas queries para a tabela de indexadores
         */
    case ALIAS = 'iv';

    /**
         * Tamanho padrão da página para paginação
         */
    case DEFAULT_PAGE_SIZE = '10';

    /**
         * Índice padrão da página para paginação
         */
    case DEFAULT_PAGE_INDEX = '0';

    /**
     * Obtém o valor do enum como string
     *
     * @return string Valor do enum
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * Obtém o valor do enum como inteiro
     *
     * @return int Valor do enum convertido para inteiro
     */
    public function getIntValue(): int
    {
        return (int) $this->value;
    }

    /**
     * Obtém o nome do campo formatado com o alias da tabela
     *
     * @param string $field Nome do campo
     * @return string Campo formatado com o alias
     */
    public static function getFieldWithAlias(string $field): string
    {
        return sprintf('%s.%s', self::ALIAS->value, $field);
    }

    /**
     * Obtém o nome do campo formatado com o alias e um alias personalizado
     *
     * @param string $field Nome do campo
     * @param string $alias Alias personalizado
     * @return string Campo formatado com o alias
     */
    public static function getFieldWithAliasAs(string $field, string $alias): string
    {
        return sprintf('%s.%s as %s', self::ALIAS->value, $field, $alias);
    }

    /**
     * Obtém a string formatada para a função STR do banco de dados
     *
     * @param string $field Nome do campo
     * @param int $length Comprimento total
     * @param int $decimals Número de casas decimais
     * @return string String formatada para a função STR
     */
    public static function getStrFunction(string $field, int $length, int $decimals): string
    {
        return sprintf('str(%s.%s, %d, %d)', self::ALIAS->value, $field, $length, $decimals);
    }

    public static function getIdIndexador(): string
    {
        return self::ID_INDEXADOR->value;
    }

    public static function getTableName(): string
    {
        return self::TABLE_NAME->value;
    }

    public static function getAlias(): string
    {
        return self::ALIAS->value;
    }

    public static function getDefaultPageSize(): string
    {
        return self::DEFAULT_PAGE_SIZE->value;
    }

    public static function getDefaultPageIndex(): string
    {
        return self::DEFAULT_PAGE_INDEX->value;
    }
}
