<?php

namespace App\Exception;

use RuntimeException;

/**
 * [Description PatrocinadorException]
 */
class PatrocinadorException extends RuntimeException
{
    public function __construct(string $message = 'Patrocinador não encontrado', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
