<?php

namespace App\DTO\Trust\Input;

use App\Helper\NumberHelper;

class ContribuicaoAnaliticaImpostoRendaDTO
{
    public function __construct(
        private int $anoCompetencia,
        private int $mesCompetencia,
        private string $dtRecebimento,
        private string $dtAporte,
        private float|string $valorRecebido,
        private string|null $competenciaFormatada = null,
        private string $dtIndexador
    ) {
        $this->valorRecebido = NumberHelper::formatCurrency($this->valorRecebido);
        $this->competenciaFormatada = $this->getMesCompetencia() . '/' . $this->getAnoCompetencia();
    }

    public static function fromArray(array $data): self
    {
        return new self($data['anoCompetencia'], $data['mesCompetencia'], $data['dtRecebimento'], $data['dtAporte'], $data['valorRecebido'], $data['competenciaFormatada'] ?? null, $data['dtIndexador'] ?? null);
    }

    public function getAnoCompetencia(): int
    {
        return $this->anoCompetencia;
    }

    public function getMesCompetencia(): int
    {
        return $this->mesCompetencia;
    }

    public function getDtRecebimento(): string
    {
        return $this->dtRecebimento;
    }

    public function getValorRecebido(): float|string
    {
        return $this->valorRecebido;
    }

    public function getDtAporte(): string
    {
        return $this->dtAporte;
    }

    public function getCompetenciaFormatada(): string
    {
        return $this->competenciaFormatada;
    }

    public function setCompetenciaFormatada(): void
    {
        $this->competenciaFormatada = $this->getMesCompetencia() . '/' . $this->getAnoCompetencia();
    }

    public function getDtIndexador(): string
    {
        return $this->dtIndexador;
    }

    public function toArray(): array
    {
        return [
            'anoCompetencia' => $this->getAnoCompetencia(),
            'mesCompetencia' => $this->getMesCompetencia(),
            'dtRecebimento' => $this->getDtRecebimento(),
            'dtAporte' => $this->getDtAporte(),
            'valorRecebido' => $this->getValorRecebido(),
            'competenciaFormatada' => $this->getCompetenciaFormatada(),
            'dtIndexador' => $this->getDtIndexador(),
        ];
    }
}
