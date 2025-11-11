<?php

namespace App\Exception;

use Symfony\Component\HttpFoundation\File\Exception\FileException as ExceptionFileException;

class FileException extends ExceptionFileException
{
    public function __construct(string $message = 'Nenhum arquivo encontrado', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
