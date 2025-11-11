<?php

namespace App\Exception;

use RuntimeException;

class CoberturasNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Nenhuma cobertura encontrada', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
