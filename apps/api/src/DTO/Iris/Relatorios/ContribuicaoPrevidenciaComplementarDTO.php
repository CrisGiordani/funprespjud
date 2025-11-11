<?php

namespace App\DTO\Iris\Relatorios;

use App\DTO\Trust\Output\ContribuicaoOutputDTO;

class ContribuicaoPrevidenciaComplementarDTO
{
    public const CONTRIBUICAO_ORIGEM_PARTICPANTE = 'PARTICIPANTE';
    public const CONTRIBUICAO_ORIGEM_PATROCINADOR = 'PATROCINADOR';
    public const CONTRIBUICAO_ORIGEM_FUNPRESP = 'FUNPRESP';

    private float $contribuicoesRepassadasOrgaoParticipante = 0;
    private float $contribuicoesRepassadasOrgaoPatrocinador = 0;
    private float $contribuicoesRecolhidasFunprespjudParticipante = 0;
    private float $contribuicoesRecolhidasFunprespjudPatrocinador = 0; //!Zerado Sempre (antigo sistema)

    private float $totalParticipante = 0.0;
    private float $totalPatrocinador = 0.0;

    public function __construct(
        private array $contribuicoes
    ) {
        $this->formatarContribuicoes();
    }

    private function formatarContribuicoes(): void
    {
        $this->validateContribuicoes();

        foreach ($this->contribuicoes as $contribuicao) {
            $this->processContribuicao($contribuicao);
        }

        $this->calculateTotals();
    }

    private function validateContribuicoes(): void
    {
        if (! is_array($this->contribuicoes)) {
            throw new \InvalidArgumentException('Argumento deve ser um array');
        }
    }

    private function processContribuicao(array|ContribuicaoOutputDTO $contribuicao): void
    {
        $mantenedor = $contribuicao->getMantenedorConsolidado() ?? '';
        $origem = $contribuicao->getOrigemRecurso() ?? '';
        $valor = $contribuicao->getValorContribuicao() ?? 0.0;

        $tipoContribuicao = $this->identificarTipoContribuicao($mantenedor, $origem);

        match ($tipoContribuicao) {
            'repassada_participante' => $this->contribuicoesRepassadasOrgaoParticipante += $valor,
            'repassada_patrocinador' => $this->contribuicoesRepassadasOrgaoPatrocinador += $valor,
            'recolhida_participante' => $this->contribuicoesRecolhidasFunprespjudParticipante += $valor,
            default => null
        };
    }

    private function identificarTipoContribuicao(string $mantenedor, string $origem): string|null
    {
        if ($mantenedor === self::CONTRIBUICAO_ORIGEM_PARTICPANTE && $origem === self::CONTRIBUICAO_ORIGEM_PATROCINADOR) {
            return 'repassada_participante';
        }

        if ($mantenedor === self::CONTRIBUICAO_ORIGEM_PATROCINADOR && $origem === self::CONTRIBUICAO_ORIGEM_PATROCINADOR) {
            return 'repassada_patrocinador';
        }

        if ($mantenedor === self::CONTRIBUICAO_ORIGEM_PARTICPANTE &&
            ($origem === self::CONTRIBUICAO_ORIGEM_PARTICPANTE || $origem === self::CONTRIBUICAO_ORIGEM_FUNPRESP)) {
            return 'recolhida_participante';
        }

        return null;
    }

    private function calculateTotals(): void
    {
        $this->totalParticipante = $this->contribuicoesRepassadasOrgaoParticipante + $this->contribuicoesRecolhidasFunprespjudParticipante;
        $this->totalPatrocinador = $this->contribuicoesRepassadasOrgaoPatrocinador;
    }

    public function getContribuicoesRepassadasOrgaoParticipante()
    {
        return $this->contribuicoesRepassadasOrgaoParticipante;
    }

    public function getContribuicoesRepassadasOrgaoPatrocinador()
    {
        return $this->contribuicoesRepassadasOrgaoPatrocinador;
    }

    public function getContribuicoesRecolhidasFunprespjudParticipante()
    {
        return $this->contribuicoesRecolhidasFunprespjudParticipante;
    }

    public function getContribuicoesRecolhidasFunprespjudPatrocinador()
    {
        return $this->contribuicoesRecolhidasFunprespjudPatrocinador;
    }

    public function getTotalParticipante()
    {
        return $this->totalParticipante;
    }

    public function getTotalPatrocinador()
    {
        return $this->totalPatrocinador;
    }

    public function toArray(): array
    {
        return [
            'contribuicoesRepassadasOrgaoParticipante' => $this->getContribuicoesRepassadasOrgaoParticipante(),
            'contribuicoesRepassadasOrgaoPatrocinador' => $this->getContribuicoesRepassadasOrgaoPatrocinador(),
            'contribuicoesRecolhidasFunprespjudParticipante' => $this->getContribuicoesRecolhidasFunprespjudParticipante(),
        ];
    }
}
