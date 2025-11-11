<?php

namespace App\Exception;

use Symfony\Component\HttpFoundation\Response;

class ApiException extends \Exception
{
    private int $statusCode;
    private ?array $errors;
    private array $metadata;

    public function __construct(
        string $message,
        int $statusCode = Response::HTTP_BAD_REQUEST,
        ?array $errors = null,
        array $metadata = []
    ) {
        parent::__construct($message);
        $this->statusCode = $statusCode;
        $this->errors = $errors;
        $this->metadata = $metadata;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrors(): ?array
    {
        return $this->errors;
    }

    public function getMetadata(): array
    {
        return $this->metadata;
    }
}
