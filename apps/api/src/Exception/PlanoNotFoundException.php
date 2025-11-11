<?php

namespace App\Exception;

use RuntimeException;

class PlanoNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Plano não encontrado', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
