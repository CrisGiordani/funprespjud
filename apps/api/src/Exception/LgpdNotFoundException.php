<?php

namespace App\Exception;

use RuntimeException;

class LgpdNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'LGPD não encontrado', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
