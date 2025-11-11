<?php

namespace App\Controller;

use App\Attribute\RequiresJwtAuth;
use App\Attribute\ViewMode;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    #[Route('/validate', name: 'api_auth_validate', methods: ['GET'])]
    #[RequiresJwtAuth]
    public function validateToken(Request $request): JsonResponse
    {
        // O token já foi validado pelo listener
        $payload = $request->attributes->get('jwt_payload');

        return $this->json([
            'message' => 'Token válido',
            'user_id' => $payload['sub'] ?? null,
            'expires_at' => $payload['exp'] ?? null,
            'issued_at' => $payload['iat'] ?? null,
        ]);
    }

    #[Route('/user-info', name: 'api_auth_user_info', methods: ['GET'])]
    #[RequiresJwtAuth]
    #[ViewMode(roles: ['USER_ADMIN', 'USER_PARTICIPANT'])]
    public function getUserInfo(Request $request): JsonResponse
    {
        $payload = $request->attributes->get('jwt_payload');

        return $this->json([
            'user_info' => [
                'user_id' => $payload['sub'] ?? null,
                'email' => $payload['email'] ?? null,
                'name' => $payload['name'] ?? null,
                'roles' => $payload['roles'] ?? [],
                'permissions' => $payload['permissions'] ?? [],
            ],
            'token_info' => [
                'issued_at' => $payload['iat'] ?? null,
                'expires_at' => $payload['exp'] ?? null,
                'issuer' => $payload['iss'] ?? null,
                'audience' => $payload['aud'] ?? null,
            ],
        ]);
    }

    #[Route('/admin-only', name: 'api_auth_admin_only', methods: ['GET'])]
    #[RequiresJwtAuth]
    #[ViewMode(roles: ['USER_ADMIN'])]
    public function adminOnlyEndpoint(Request $request): JsonResponse
    {
        return $this->json([
            'message' => 'Este endpoint é acessível apenas para administradores',
            'user_roles' => $request->attributes->get('jwt_payload')['roles'] ?? [],
        ]);
    }

    #[Route('/create-user', name: 'api_auth_create_user', methods: ['POST'])]
    #[RequiresJwtAuth]
    #[ViewMode(roles: ['USER_ADMIN'])]
    public function createUser(Request $request): JsonResponse
    {
        // Apenas admins podem criar usuários
        return $this->json([
            'message' => 'Usuário criado com sucesso',
            'method' => 'POST',
            'required_role' => 'USER_ADMIN',
        ]);
    }

    #[Route('/public', name: 'api_auth_public', methods: ['GET'])]
    public function publicEndpoint(): JsonResponse
    {
        return $this->json([
            'message' => 'Este endpoint é público e não requer autenticação',
        ]);
    }
}
