<?php

namespace App\Trait;

use App\Exception\ApiException;
use App\Http\Response\ApiResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\ConstraintViolationListInterface;

trait ApiTrait
{
    protected function handleApiException(\Exception $e, Request $request): JsonResponse
    {
        if ($e instanceof ApiException) {
            return ApiResponse::error(
                $e->getMessage(),
                $e->getStatusCode(),
                $e->getErrors(),
                array_merge($e->getMetadata(), [
                    'requestId' => $request->headers->get('X-Request-ID'),
                ])
            );
        }

        return ApiResponse::error(
            'Erro interno do servidor',
            Response::HTTP_INTERNAL_SERVER_ERROR,
            null,
            [
                'requestId' => $request->headers->get('X-Request-ID'),
            ]
        );
    }

    protected function handleValidationErrors(
        ConstraintViolationListInterface $violations,
        Request $request
    ): JsonResponse {
        $errors = [];
        foreach ($violations as $violation) {
            $errors[] = [
                'field' => $violation->getPropertyPath(),
                'message' => $violation->getMessage(),
            ];
        }

        return ApiResponse::validationError(
            $errors,
            'Erro de validação',
            [
                'requestId' => $request->headers->get('X-Request-ID'),
            ]
        );
    }

    protected function validateRequestData(array $data, array $requiredFields, Request $request): void
    {
        $missingFields = [];
        foreach ($requiredFields as $field) {
            if (! isset($data[$field])) {
                $missingFields[] = $field;
            }
        }

        if (! empty($missingFields)) {
            throw new ApiException('Campos obrigatórios não preenchidos', Response::HTTP_UNPROCESSABLE_ENTITY, array_map(fn ($field) => ['field' => $field, 'message' => "O campo {$field} é obrigatório"], $missingFields), ['requestId' => $request->headers->get('X-Request-ID')]);
        }
    }

    protected function getPaginationParams(Request $request): array
    {
        $page = max(1, $request->query->getInt('page', 1));
        $perPage = min(100, max(1, $request->query->getInt('per_page', 10)));

        return [$page, $perPage];
    }
}
