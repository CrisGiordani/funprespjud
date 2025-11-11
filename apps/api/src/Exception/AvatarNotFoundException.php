<?php

namespace App\Exception;

use RuntimeException;

class AvatarNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Avatar não encontrado', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
