<?php

namespace App\Enum\Trust\Simulador;

enum ContribuicaoAdministrativaEnum: string
{
    case CONTRIBUICAO_ADMINISTRATIVA = '0.3';

    public function getValue(): string
    {
        return $this->value;
    }
}
