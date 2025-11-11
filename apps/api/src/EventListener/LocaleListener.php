<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Listener para garantir que o locale esteja sempre definido
 * e evitar erros no LocaleAwareListener
 */
class LocaleListener implements EventSubscriberInterface
{
    public function __construct(
        private string $defaultLocale = 'pt_BR'
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Prioridade alta para executar antes do LocaleAwareListener
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        
        // Garante que o locale esteja sempre definido
        if (!$request->getLocale()) {
            $request->setLocale($this->defaultLocale);
        }
        
        // Garante que o locale seja válido
        $locale = $request->getLocale();
        if (!in_array($locale, ['pt_BR', 'pt', 'en'])) {
            $request->setLocale($this->defaultLocale);
        }
    }
}

