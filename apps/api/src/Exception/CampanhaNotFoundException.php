<?php

namespace App\Exception;

use RuntimeException;

class CampanhaNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Nenhuma campanha encontrada', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
