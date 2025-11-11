<?php

namespace App\EventListener;

use App\Attribute\ValidateCpfOwnership;
use App\Http\Response\ApiResponse;
use App\Helper\RequestPathHelper;
use App\Interface\Security\JwtValidatorServiceInterface;
use App\Service\Cpf\CpfEncryptionService;
use ReflectionMethod;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Listener responsável por validar se o CPF presente no token JWT
 * corresponde ao CPF sendo acessado na rota.
 *
 * Previne que um participante autenticado acesse dados de outro participante.
 *
 * Nota: ADMIN e OPERATOR têm bypass apenas para métodos GET (leitura).
 * Para métodos não-GET, o ViewModeListener bloqueia quando não são donos.
 */
#[AsEventListener(event: KernelEvents::CONTROLLER_ARGUMENTS, priority: -10)]
class CpfOwnershipValidationListener
{
    /**
     * Roles que têm permissão para acessar CPFs de outros usuários
     */
    private const BYPASS_ROLES = [
        'USER_OPERATOR',
        'USER_ADMIN'
    ];

    public function __construct(
        private readonly JwtValidatorServiceInterface $jwtValidator,
        private readonly CpfEncryptionService $cpfEncryptionService
    ) {}

    public function onKernelControllerArguments(ControllerArgumentsEvent $event): void
    {
        $controller = $event->getController();
        if (! is_array($controller)) {
            return;
        }

        [$class, $method] = $controller;
        $reflectionMethod = new ReflectionMethod($class, $method);
        $arguments = $event->getArguments();
        $request = $event->getRequest();

        // Exceção: permitir acesso sem validar CPF para caminhos liberados
        if (RequestPathHelper::isExceptionPath($request->getPathInfo())) {
            return;
        }

        // Obtém o payload JWT da requisição (adicionado pelo JwtAttributeListener)
        $jwtPayload = $request->attributes->get('jwt_payload');

        if (! $jwtPayload) {
            // Se não há payload JWT, não há como validar
            // O JwtAttributeListener deve ter bloqueado antes se a rota requer autenticação
            return;
        }

        // Verifica se o usuário tem uma role que permite bypass da validação
        // Bypass é permitido apenas para métodos GET (leitura)
        // Para métodos não-GET, o ViewModeListener já bloqueia quando não são donos
        if ($this->hasBypassRole($jwtPayload) && $request->getMethod() === 'GET') {
            return;
        }

        // Itera pelos parâmetros do método para encontrar os que têm o atributo ValidateCpfOwnership
        foreach ($reflectionMethod->getParameters() as $index => $parameter) {
            $attributes = $parameter->getAttributes(ValidateCpfOwnership::class);
            if (empty($attributes)) {
                continue;
            }

            $attribute = $attributes[0]->newInstance();
            if (! $attribute->required) {
                continue;
            }

            // Obtém o CPF do parâmetro da rota (já descriptografado pelo RouteCpfEncryptionListener)
            $cpfFromRoute = $arguments[$index] ?? null;

            if (! $cpfFromRoute) {
                continue;
            }

            // Criptografa o CPF da rota para comparar com o CPF do token (que está criptografado)
            $cpfEncrypted = $this->cpfEncryptionService->encrypt($cpfFromRoute);

            // Valida se o CPF do token corresponde ao CPF da rota
            if (! $this->jwtValidator->verifyCpfAndPayLoadJWT($cpfEncrypted, $jwtPayload)) {
                // Bloqueia a requisição
                $response = ApiResponse::forbidden(
                    message: 'Você não tem permissão para acessar dados de outro participante',
                    metadata: [
                        'requestId' => $request->headers->get('X-Request-ID'),
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                        'version' => '1.0',
                        'type' => 'authorization_error',
                        'reason' => 'cpf_mismatch'
                    ]
                );

                $event->setController(fn() => $response);

                return;
            }
        }
    }

    /**
     * Verifica se o usuário tem uma role que permite bypass da validação de CPF
     */
    private function hasBypassRole(array $jwtPayload): bool
    {
        $userRoles = $jwtPayload['roles'] ?? [];

        if (! is_array($userRoles)) {
            return false;
        }

        foreach (self::BYPASS_ROLES as $bypassRole) {
            if (in_array($bypassRole, $userRoles, true)) {
                return true;
            }
        }

        return false;
    }
}
