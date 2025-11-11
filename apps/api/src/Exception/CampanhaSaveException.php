<?php

namespace App\Exception;

use RuntimeException;

class CampanhaSaveException extends RuntimeException
{
    public function __construct(string $message = 'Erro ao salvar campanha', int $code = 500)
    {
        parent::__construct($message, $code);
    }
}
