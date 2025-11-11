<?php

namespace App\Exception;

use RuntimeException;

class ContribuicaoDoMesNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Não foi possível encontrar as contribuições do mês', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
