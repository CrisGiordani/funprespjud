<?php

namespace App\DTO\Trust\Input;

class ContribuicaoMesOrigemDTO
{
    private const CONTRIBUICAO_ORIGEM_PARTICPANTE = 'PARTICIPANTE';
    private const CONTRIBUICAO_ORIGEM_PATROCINADOR = 'PATROCINADOR';
    private const CONTRIBUICAO_ORIGEM_FUNPRESP = 'FUNPRESP';

    private $contribuicoes = [];

    public function __construct(
        array $contribuicoes = []
    ) {
        $this->contribuicoes = $contribuicoes;
    }

    public function getContribuicoes(): array
    {
        return $this->contribuicoes;
    }

    public function setContribuicoes(array $contribuicoes): void
    {
        $this->contribuicoes = $contribuicoes;
    }

    private function identificarTipoContribuicao(string $mantenedor, string $origem): string|null
    {
        if ($mantenedor === self::CONTRIBUICAO_ORIGEM_PARTICPANTE && $origem === self::CONTRIBUICAO_ORIGEM_PATROCINADOR) {
            return 'repassada_participante';
        }

        if ($mantenedor === self::CONTRIBUICAO_ORIGEM_PATROCINADOR && $origem === self::CONTRIBUICAO_ORIGEM_PATROCINADOR) {
            return 'repassada_patrocinador';
        }

        if (
            $mantenedor === self::CONTRIBUICAO_ORIGEM_PARTICPANTE &&
            ($origem === self::CONTRIBUICAO_ORIGEM_PARTICPANTE || $origem === self::CONTRIBUICAO_ORIGEM_FUNPRESP)
        ) {
            return 'recolhida_participante';
        }

        return null;
    }

    public function organizarContribuicoes(): array
    {
        $resultado = [];

        foreach ($this->contribuicoes as $contribuicao) {
            $mesCompetencia = $contribuicao->getMesCompetencia();
            $mantenedor = $contribuicao->getMantenedorConsolidado();
            $origem = $contribuicao->getOrigemRecurso();
            $valorContribuicao = $contribuicao->getValorContribuicao();

            if (empty($mesCompetencia)) {
                continue;
            }

            $tipoContribuicao = $this->identificarTipoContribuicao($mantenedor, $origem);

            if ($tipoContribuicao === null) {
                continue;
            }

            if (! isset($resultado[$mesCompetencia])) {
                $resultado[$mesCompetencia] = [
                    'repassada_participante' => 0,
                    'repassada_patrocinador' => 0,
                ];
            };
            $resultado[$mesCompetencia][$tipoContribuicao] += $valorContribuicao;
        }

        return $resultado;
    }
}
