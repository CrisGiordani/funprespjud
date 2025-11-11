<?php

namespace App\Exception;

use RuntimeException;

class ParticipanteNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Participante não encontrado', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
