<?php

namespace App\EventListener;

use App\Attribute\RouteCpfEncrypted;
use App\Exception\CpfEncryptionException;
use App\Http\Response\ApiResponse;
use App\Service\Cpf\CpfEncryptionService;
use ReflectionMethod;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RouteCpfEncryptionListener implements EventSubscriberInterface
{
    public function __construct(
        private CpfEncryptionService $encryptionService
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER_ARGUMENTS => 'onControllerArguments',
        ];
    }

    public function onControllerArguments(ControllerArgumentsEvent $event): void
    {
        $controller = $event->getController();
        if (! is_array($controller)) {
            return;
        }

        [$class, $method] = $controller;
        $reflectionMethod = new ReflectionMethod($class, $method);
        $arguments = $event->getArguments();
        $request = $event->getRequest();

        foreach ($reflectionMethod->getParameters() as $index => $parameter) {
            $attributes = $parameter->getAttributes(RouteCpfEncrypted::class);
            if (empty($attributes)) {
                continue;
            }

            $attribute = $attributes[0]->newInstance();
            if (! $attribute->encrypt) {
                continue;
            }

            $value = $arguments[$index] ?? null;

            try {
                // Descriptografa o CPF da rota
                $decryptedValue = $this->encryptionService->decrypt($value);
                $arguments[$index] = $decryptedValue;
            } catch (CpfEncryptionException $e) {
                $response = ApiResponse::error(
                    message: $e->getMessage(),
                    statusCode: $e->getStatusCode(),
                    errors: $e->getErrors(),
                    metadata: [
                        'requestId' => $request->headers->get('X-Request-ID'),
                        'endpoint' => $request->getPathInfo(),
                        'method' => $request->getMethod(),
                        'version' => '1.0',
                        'parameter' => $parameter->getName(),
                        'type' => 'validation_error',
                    ]
                );
                $event->setController(fn () => $response);

                return;
            }
        }

        $event->setArguments($arguments);
    }
}
