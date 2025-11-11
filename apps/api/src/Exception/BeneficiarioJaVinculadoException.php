<?php

namespace App\Exception;

use RuntimeException;

class BeneficiarioJaVinculadoException extends RuntimeException
{
    public function __construct(string $message = 'Beneficiário já vinculado ao participante', int $code = 400)
    {
        parent::__construct($message, $code);
    }
}
