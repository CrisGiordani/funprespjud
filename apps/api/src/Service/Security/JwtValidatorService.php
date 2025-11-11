<?php

namespace App\Service\Security;

use App\Interface\Security\JwtValidatorServiceInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class JwtValidatorService implements JwtValidatorServiceInterface
{
    public function __construct(
        private JWTEncoderInterface $jwtEncoder,
        private string $hs256Secret = '%env(JWT_SECRET)%'
    ) {
        // Remove o prefixo %env() se estiver presente
        if (str_starts_with($this->hs256Secret, '%env(') && str_ends_with($this->hs256Secret, ')%')) {
            $this->hs256Secret = substr($this->hs256Secret, 5, -2);
        }

        // Se a chave ainda estiver vazia ou for o valor padrão, tenta pegar do ambiente
        if (empty($this->hs256Secret) || $this->hs256Secret === 'JWT_SECRET') {
            $this->hs256Secret = $_ENV['JWT_SECRET'] ?? 'default-secret-key';
        }
    }

    /**
     * @param string $token
     *
     * Valida um token JWT e retorna os dados do payload
     * @return array
     */
    public function validateToken(string $token): array
    {
        try {
            return $this->validateHS256Token($token);
        } catch (\Exception $e) {
            throw new AuthenticationException('Token JWT inválido: ' . $e->getMessage());
        }
    }

    /**
     * @param string $token
     *
     * @return array
     */
    public function getPayload(string $token): array
    {
        return $this->validateToken($token);
    }

    /**
     * @param string $cpf
     * @param array $payload
     *
     * @return bool
     */
    public function verifyCpfAndPayLoadJWT(string $cpf, array $payload): bool
    {
        if (! $cpf || ! $payload['cpf']) {
            return false;
        }

        return $payload['cpf'] === $cpf;
    }

    /**
     * @param string $token
     * Valida token HS256Valida token HS256
     * @return array
     */
    private function validateHS256Token(string $token): array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->hs256Secret, 'HS256'));

            $payload = (array) $decoded;

            // Validações adicionais
            $this->validatePayload($payload);

            return $payload;
        } catch (\Exception $e) {
            throw new AuthenticationException('Token HS256 inválido: ' . $e->getMessage());
        }
    }

    /**
     * Extrai o token do header Authorization
     *
     * @param Request $request
     *
     * @return ?string
     */
    public function extractTokenFromRequest(Request $request): ?string
    {
        $authorizationHeader = $request->headers->get('Authorization');

        if (! $authorizationHeader) {
            return null;
        }

        // Remove 'Bearer ' do início do token
        if (str_starts_with($authorizationHeader, 'Bearer ')) {
            return substr($authorizationHeader, 7);
        }

        return $authorizationHeader;
    }

    /**
     * Validações adicionais do payload do token
     *
     * @param array $payload
     *
     * @return void
     */
    private function validatePayload(array $payload): void
    {
        // Verifica se o token não expirou
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new AuthenticationException('Token JWT expirado');
        }
    }
}
