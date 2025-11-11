<?php

namespace App\Exception;

use RuntimeException;

class CpfBeneficiarioJaCadastradoException extends RuntimeException
{
    public function __construct(string $message = 'Este CPF já está cadastrado como beneficiário para este participante', int $code = 400)
    {
        parent::__construct($message, $code);
    }
}