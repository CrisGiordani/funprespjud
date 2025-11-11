<?php

namespace App\EventListener;

use App\Enum\Security\RoleEnum;
use App\Helper\RequestPathHelper;
use App\Interface\Security\JwtValidatorServiceInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * ViewModeListener
 *
 * Listener responsável por validar permissões de acesso baseado em roles e CPF.
 * Implementa regras de negócio para diferentes tipos de usuários:
 * - ADMIN: Acesso a qualquer CPF (apenas leitura GET)
 * - OPERATOR: Acesso a qualquer CPF (apenas leitura GET)
 * - PARTICIPANT: Acesso apenas ao próprio CPF (todas operações se for dono)
 *
 * Regras de segurança:
 * - Se é dono do CPF → permite todas operações (GET, POST, PUT, DELETE)
 * - Se não é dono mas é ADMIN/OPERATOR → permite apenas GET
 * - Se não é dono nem ADMIN/OPERATOR → bloqueia tudo
 */
class ViewModeListener implements EventSubscriberInterface
{
    public function __construct(
        private JwtValidatorServiceInterface $jwtValidatorService
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => ['onKernelController', 10],
        ];
    }

    public function onKernelController(ControllerEvent $event): void
    {
        // Verifica se é um controller válido
        if (!is_array($event->getController())) {
            return;
        }

        $request = $event->getRequest();
        $cpf = $request->get('cpf');

        // Se não há CPF na requisição, não precisa validar
        if (!$cpf) {
            return;
        }

        // Valida token JWT
        $payloadJWT = $this->validateJwtToken($event, $request);
        if (!$payloadJWT) {
            return; // Erro já foi tratado
        }

        // Valida permissões baseado no método HTTP e role
        $this->validatePermissions($event, $request, $cpf, $payloadJWT);
    }

    /**
     * Valida o token JWT e retorna o payload
     */
    private function validateJwtToken(ControllerEvent $event, $request): ?array
    {
        $token = $this->jwtValidatorService->extractTokenFromRequest($request);

        if (!$token) {
            $this->sendUnauthorizedResponse($event, 'Token JWT não fornecido');
            return null;
        }

        try {
            return $this->jwtValidatorService->getPayload($token);
        } catch (\Exception $e) {
            $this->sendUnauthorizedResponse($event, 'Token JWT inválido');
            return null;
        }
    }

    /**
     * Valida permissões baseado no método HTTP e role do usuário
     */
    private function validatePermissions(ControllerEvent $event, $request, string $cpf, array $payloadJWT): void
    {
        $routeMethod = $request->getMethod();
        $userRoles = $payloadJWT['roles'];
        $cpfMatches = $this->jwtValidatorService->verifyCpfAndPayLoadJWT($cpf, $payloadJWT);

        // Para métodos GET, apenas verifica se tem role válida
        if ($routeMethod === 'GET') {
            $this->validateGetPermissions($event, $userRoles);
            return;
        }

        // Para métodos não-GET, valida CPF e roles
        $this->validateNonGetPermissions($event, $userRoles, $cpfMatches);
    }

    /**
     * Valida permissões para métodos GET
     */
    private function validateGetPermissions(ControllerEvent $event, array $userRoles): void
    {
        if ($this->hasParticipantRole($userRoles) || $this->hasOperatorRole($userRoles) || $this->hasAdminRole($userRoles)) {
            return; // Permite acesso
        }

        $this->sendUnauthorizedResponse($event, 'Você não tem permissão para acessar este recurso');
    }

    /**
     * Valida permissões para métodos não-GET (POST, PUT, DELETE)
     *
     * Regra: Apenas o dono do CPF pode executar operações de modificação.
     * ADMIN e OPERATOR não podem executar operações não-GET mesmo tendo acesso de leitura.
     */
    private function validateNonGetPermissions(ControllerEvent $event, array $userRoles, bool $cpfMatches): void
    {
        // Exceção: permitir acesso se o caminho for um dos prefixos liberados
        $pathInfo = $event->getRequest()->getPathInfo();
        if (RequestPathHelper::isExceptionPath($pathInfo)) {
            return;
        }

        // PARTICIPANT deve ser dono do CPF para executar operações não-GET
        if ($this->hasParticipantRole($userRoles)) {
            if ($cpfMatches) {
                return; // É dono, permite acesso
            }
            $this->sendUnauthorizedResponse($event, 'Você não tem permissão para acessar este recurso');
            return;
        }

        // ADMIN e OPERATOR não podem executar operações não-GET quando não são donos
        // Eles têm acesso apenas para leitura (GET)
        if ($this->hasOperatorRole($userRoles) || $this->hasAdminRole($userRoles)) {
            $this->sendUnauthorizedResponse($event, 'Operadores e administradores têm acesso apenas para leitura. Apenas o dono do CPF pode executar esta operação.');
            return;
        }

        // Se não tem role válida, nega acesso
        $this->sendUnauthorizedResponse($event, 'Você não tem permissão para acessar este recurso');
    }

    /**
     * Verifica se o usuário tem role ADMIN (Acesso a qualquer CPF, apenas leitura GET)
     */
    private function hasAdminRole(array $userRoles): bool
    {
        return in_array(RoleEnum::USER_ADMIN->value, $userRoles);
    }

    /**
     * Verifica se o usuário tem role OPERATOR (Acesso a qualquer CPF, apenas leitura GET)
     */
    private function hasOperatorRole(array $userRoles): bool
    {
        return in_array(RoleEnum::USER_OPERATOR->value, $userRoles);
    }

    /**
     * Verifica se o usuário tem role PARTICIPANT (Acesso apenas ao próprio CPF)
     */
    private function hasParticipantRole(array $userRoles): bool
    {
        return in_array(RoleEnum::USER_PARTICIPANT->value, $userRoles);
    }

    /**
     * Envia resposta de não autorizado
     */
    private function sendUnauthorizedResponse(ControllerEvent $event, string $message): void
    {
        $response = new Response(
            json_encode([
                'error' => 'Unauthorized',
                'message' => $message,
                'timestamp' => (new \DateTime())->format('Y-m-d H:i:s')
            ]),
            Response::HTTP_UNAUTHORIZED,
            ['Content-Type' => 'application/json']
        );

        $event->setController(fn() => $response);
    }
}
