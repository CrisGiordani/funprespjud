<?php

namespace App\Interface\Security;

use Symfony\Component\HttpFoundation\Request;

interface JwtValidatorServiceInterface
{
    /**
     * @param string $token
     *
     * @return array
     */
    public function validateToken(string $token): array;

    /**
     * @param Request $request
     *
     * @return ?string
     */
    public function extractTokenFromRequest(Request $request): ?string;

    /**
     * @param string $token
     *
     * @return array
     */
    public function getPayload(string $token): array;

    /**
     * @param string $cpf
     * @param array $payload
     *
     * @return bool
     */
    public function verifyCpfAndPayLoadJWT(string $cpf, array $payload): bool;
}
