<?php

namespace App\Enum\Trust\Contribuicao;

enum ContribuicaoEnum: string
{
    case CONTRIBUICAO_PARTICIPANTE = 'PARTICIPANTE';
    case CONTRIBUICAO_PARTICIPANTE_DESTINO = "'A','P'";

    case CONTRIBUICAO_PATROCINADOR = 'ORGAO';
    case CONTRIBUICAO_PATROCINADOR_DESTINO = "'E'";

    case CNPJ_CPF_NOT_IN = "'00000000000','00000000191'";
    case CONTA_PARTICIPANTE = '1,2,7,8,9,11,10,16,17';

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    public static function getAnoContribuicaoAtual(): int
    {
        return date('Y');
    }
}
