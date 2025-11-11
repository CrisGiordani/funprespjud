<?php

namespace App\Http\Response;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ApiResponse extends JsonResponse
{
    private function __construct(
        array $data,
        int $status = Response::HTTP_OK,
        array $headers = []
    ) {
        parent::__construct($data, $status, $headers);
    }

    public static function success(
        mixed $data = null,
        ?string $message = null,
        array $metadata = []
    ): self {
        return new self([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'metadata' => array_merge([
                'timestamp' => (new \DateTime())->format('c'),
            ], $metadata),
        ]);
    }

    public static function created(
        mixed $data = null,
        ?string $message = null,
        array $metadata = []
    ): self {
        return new self([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'metadata' => array_merge([
                'timestamp' => (new \DateTime())->format('c'),
            ], $metadata),
        ], Response::HTTP_CREATED);
    }

    public static function noContent(): self
    {
        return new self([], Response::HTTP_NO_CONTENT);
    }

    public static function error(
        string $message,
        int $statusCode = Response::HTTP_BAD_REQUEST,
        array|string|null $errors = null,
        array $metadata = []
    ): self {
        return new self([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'metadata' => array_merge([
                'timestamp' => (new \DateTime())->format('c'),
            ], $metadata),
        ], $statusCode);
    }

    public static function validationError(
        array $errors,
        ?string $message = 'Erro de validação',
        array $metadata = []
    ): self {
        return self::error(
            $message,
            Response::HTTP_UNPROCESSABLE_ENTITY,
            $errors,
            $metadata
        );
    }

    public static function notFound(
        string $message = 'Recurso não encontrado',
        array $metadata = []
    ): self {
        return self::error(
            $message,
            Response::HTTP_NOT_FOUND,
            null,
            $metadata
        );
    }

    public static function unauthorized(
        string $message = 'Não autorizado',
        array $metadata = []
    ): self {
        return self::error(
            $message,
            Response::HTTP_UNAUTHORIZED,
            null,
            $metadata
        );
    }

    public static function forbidden(
        string $message = 'Acesso proibido',
        array $metadata = []
    ): self {
        return self::error(
            $message,
            Response::HTTP_FORBIDDEN,
            null,
            $metadata
        );
    }

    public static function paginated(
        array $items,
        int $total,
        int $page,
        int $perPage,
        ?string $message = null,
        array $metadata = []
    ): self {
        return self::success($items, $message, array_merge($metadata, [
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'perPage' => $perPage,
                'totalPages' => ceil($total / $perPage),
            ],
        ]));
    }
}
