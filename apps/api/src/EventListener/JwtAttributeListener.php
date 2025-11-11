<?php

namespace App\EventListener;

use App\Attribute\RequiresJwtAuth;
use App\Service\Security\JwtValidatorService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class JwtAttributeListener implements EventSubscriberInterface
{
    public function __construct(
        private JwtValidatorService $jwtValidator
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => ['onKernelController', 10],
        ];
    }

    public function onKernelController(ControllerEvent $event): void
    {
        $request = $event->getRequest();

        // Ignora requisições OPTIONS (preflight CORS) - deixa o nelmio_cors tratar
        if ($request->getMethod() === 'OPTIONS') {
            return;
        }

        $controller = $event->getController();

        if (! is_array($controller)) {
            return;
        }

        $method = $controller[1];
        $reflectionMethod = new \ReflectionMethod($controller[0], $method);

        // Verifica se o método tem o atributo RequiresJwtAuth
        $attributes = $reflectionMethod->getAttributes(RequiresJwtAuth::class);

        if (empty($attributes)) {
            // Verifica se a classe tem o atributo
            $reflectionClass = new \ReflectionClass($controller[0]);
            $attributes = $reflectionClass->getAttributes(RequiresJwtAuth::class);
        }

        //verica se quer que a rota seja protegida ou não
        if (! empty($attributes) && (isset($attributes[0]?->getArguments()['required']) && $attributes[0]->getArguments()['required'] === false)) {
            return;
        }

        if (empty($attributes)) {
            return;
        }

        // Extrai o token da requisição
        $token = $this->jwtValidator->extractTokenFromRequest($request);

        if (! $token) {
            $this->sendUnauthorizedResponse($event, 'Token não fornecido');

            return;
        }

        try {
            // Valida o token
            $payload = $this->jwtValidator->validateToken($token);

            // Armazena os dados do payload na requisição para uso posterior
            $request->attributes->set('jwt_payload', $payload);
        } catch (AuthenticationException $e) {
            $this->sendUnauthorizedResponse($event, $e->getMessage());

            return;
        }
    }

    /**
     * @param ControllerEvent $event
     * @param string $message
     *
     * @return void
     */
    private function sendUnauthorizedResponse(ControllerEvent $event, string $message): void
    {
        $response = new Response(
            json_encode(['error' => 'Unauthorized', 'message' => $message]),
            Response::HTTP_UNAUTHORIZED,
            ['Content-Type' => 'application/json']
        );

        // Permite que o nelmio_cors adicione os headers CORS depois
        $event->setController(function () use ($response)
        {
            return $response;
        });
    }
}
