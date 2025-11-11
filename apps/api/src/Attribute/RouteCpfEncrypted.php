<?php

namespace App\Attribute;

use Attribute;

/**
 * Atributo para criptografia de CPF em rotas
 *
 * @property bool $encrypt Define se a criptografia está ativa
 * @property string $algorithm Algoritmo de criptografia a ser utilizado
 * @property string $keyFormat Formato da chave: 'hex' ou 'base64'
 * @property string $ivFormat Formato do IV: 'hex' ou 'base64'
 * @property string $outputFormat Formato da saída: 'hex', 'base64' ou 'raw'
 */
#[Attribute(Attribute::TARGET_PARAMETER)]
class RouteCpfEncrypted
{
    public function __construct(
        public readonly bool $encrypt = true,
        public readonly string $algorithm = 'aes-256-cbc',
        public readonly string $keyFormat = 'hex',
        public readonly string $ivFormat = 'hex',
        public readonly string $outputFormat = 'hex'
    ) {
        if (! in_array($algorithm, ['aes-256-cbc', 'aes-192-cbc', 'aes-128-cbc'])) {
            throw new \InvalidArgumentException('Apenas algoritmos AES CBC são permitidos');
        }
        if (! in_array($keyFormat, ['base64', 'hex'])) {
            throw new \InvalidArgumentException('Formato de chave inválido');
        }
        if (! in_array($ivFormat, ['base64', 'hex'])) {
            throw new \InvalidArgumentException('Formato de IV inválido');
        }
        if (! in_array($outputFormat, ['base64', 'hex', 'raw'])) {
            throw new \InvalidArgumentException('Formato de saída inválido');
        }
    }
}
