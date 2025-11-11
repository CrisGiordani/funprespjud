<?php

namespace App\Enum\Trust\Contribuicao;

enum TipoContribuicaoEnum: int
{
    case CONTRIBUICAO_PATROCINADOR = 1;
    case CONTRIBUICAO_VINCULADO = 7;
    case CONTRIBUICAO_FACULTATIVA = 8;

    public function getValue(): int
    {
        return $this->value;
    }
}
