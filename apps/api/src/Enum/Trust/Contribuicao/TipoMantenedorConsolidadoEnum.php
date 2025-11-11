<?php

namespace App\Enum\Trust\Contribuicao;

enum TipoMantenedorConsolidadoEnum: string
{
    case PARTICIPANTE = 'PARTICIPANTE';
    case PATROCINADOR = 'PATROCINADOR';
    case AUTOPATROCINADO = 'AUTOPATROCINADO';

    public function getValue(): string
    {
        return $this->value;
    }
}
