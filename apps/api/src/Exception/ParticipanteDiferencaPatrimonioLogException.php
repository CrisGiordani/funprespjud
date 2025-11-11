<?php

namespace App\Exception;

use RuntimeException;

class ParticipanteDiferencaPatrimonioLogException extends RuntimeException
{
    public function __construct(string $message = 'Erro ao salvar participante diferenca patrimonio log', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
