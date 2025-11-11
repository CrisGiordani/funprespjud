<?php

namespace App\Attribute;

/**
 * Atributo para marcar parâmetros CPF que devem ser validados
 * contra o CPF presente no token JWT do usuário autenticado.
 * 
 * Garante que um participante só possa acessar seus próprios dados,
 * prevenindo acesso indevido a informações de outros participantes.
 */
#[\Attribute(\Attribute::TARGET_PARAMETER)]
class ValidateCpfOwnership
{
    /**
     * @param bool $required Se true, a validação é obrigatória. Se false, a validação é ignorada.
     */
    public function __construct(
        public readonly bool $required = true
    ) {}
}

