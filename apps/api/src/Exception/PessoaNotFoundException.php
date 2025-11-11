<?php

namespace App\Exception;

use RuntimeException;

class PessoaNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Pessoa não encontrada', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
