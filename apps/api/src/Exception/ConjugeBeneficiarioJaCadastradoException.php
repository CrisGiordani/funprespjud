<?php

namespace App\Exception;

use RuntimeException;

class ConjugeBeneficiarioJaCadastradoException extends RuntimeException
{
    public function __construct(string $message = 'Participante já possui um beneficiário cônjuge cadastrado', int $code = 400)
    {
        parent::__construct($message, $code);
    }
}
