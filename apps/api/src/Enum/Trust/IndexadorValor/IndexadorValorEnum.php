<?php

namespace App\Enum\Trust\IndexadorValor;

enum IndexadorValorEnum: string
{
    case TX_CARR_AD = 'TX_CARR_AD';
    case TX_FCBE = 'TX_FCBE';
    case IPCA = 'IPCA';
    case TETO_RGPS = 'TETO RGPS';
    case URP = 'URP';

        //Perfils de investimento
    case HORIZONTE_2040 = 'CT-2040';
    case HORIZONTE_2050 = 'CT-2050';
    case HORIZONTE_PROTEGIDO = 'CT-PROT';

    /**
     * @param string $value
     *
     * @return IndexadorValorEnum
     */
    public static function getCodigoByValue(string $value): IndexadorValorEnum
    {
        return self::from($value);
    }

    /**
     *  Pegar o historico de um ou mais indexadores
     * @return array
     */
    public static function getAllCodigos(): array
    {
        return array_map(fn(IndexadorValorEnum $indexador) => $indexador->value, IndexadorValorEnum::cases());
    }

    /**
     * * Filtrar os codigos de indexadores validos
     * @param array $codigos
     *
     * @return array
     */
    public static function filterValidCodigos(array $codigos): array
    {
        $validValues = self::getAllCodigos();

        return array_values(array_intersect($validValues, $codigos));
    }

    public static function getCodigoPerfilInvestimentoByIdIndexadorTrust(int $idIndexadorTrust): string
    {
        return match ($idIndexadorTrust) {
            5 => self::HORIZONTE_2040->value,
            6 => self::HORIZONTE_2050->value,
            7 => self::HORIZONTE_PROTEGIDO->value,
            default => throw new \Exception('Indexador não encontrado'),
        };
    }

    public static function getBenchmarkPerfilInvestimentoByIdPerfilTrust(int $idPerfilTrust): string
    {
        return match ($idPerfilTrust) {
            5 => 'TAXA_2040' ,
            6 => 'TAXA_2050' ,
            7 => 'TAXA_PROT' ,
            default => throw new \Exception('Taxa de benchmark não encontrado'),
        };
    }
}
