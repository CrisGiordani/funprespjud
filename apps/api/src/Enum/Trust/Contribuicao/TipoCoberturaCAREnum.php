<?php

namespace App\Enum\Trust\Contribuicao;

enum TipoCoberturaCAREnum: int
{
    case CAPITAL_SEGURADO_MORTE = 475;
    case MORTE = 471;
    case MORTE_AUTOPATROCINADO = 555;

    case CAPITAL_SEGURADO_INVALIDEZ = 476;
    case INVALIDEZ = 477;
    case INVALIDEZ_AUTOPATROCINADO = 554;

    /**
     * @return int
     */
    public function getValue(): int
    {
        return $this->value;
    }
}
