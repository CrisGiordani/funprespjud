<?php

namespace App\Exception;

use RuntimeException;

class QuestionarioException extends RuntimeException
{
    public function __construct(string $message = 'Erro ao processar o questionário', int $code = 400)
    {
        parent::__construct($message, $code);
    }
}
