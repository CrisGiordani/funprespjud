<?php

namespace App\Exception;

use RuntimeException;

class SolicitacaoAlteracaoPerfilNotFoundException extends RuntimeException
{
    public function __construct(string $message = 'Solicitação de alteração de perfil não encontrada', int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
