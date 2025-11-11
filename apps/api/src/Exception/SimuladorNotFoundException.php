<?php

namespace App\Exception;

use RuntimeException;

class SimuladorNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Simulação não encontrada.', int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
