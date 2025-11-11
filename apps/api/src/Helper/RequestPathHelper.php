<?php

namespace App\Helper;

class RequestPathHelper
{
    /**
     * Prefixos de caminhos que devem ter acesso liberado / pular validações
     * Utilize prefixos absolutos iniciados por "/".
     */
    public const EXCEPTION_PATH_PREFIXES = [
        '/api/v1/simulacoes/parametros/',
    ];

    /**
     * Retorna true se o path começar com algum dos prefixos de exceção
     */
    public static function isExceptionPath(string $path): bool
    {
        foreach (self::EXCEPTION_PATH_PREFIXES as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return true;
            }
        }
        return false;
    }
}
