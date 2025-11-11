<?php

namespace App\Exception;

use RuntimeException;

class CotasNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Cotas não encontradas', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
