<?php

namespace App\DTO\Trust\Input;

class MigracaoSolicitacoesDTO
{
    public array $solicitacoesProcessadas;
    public int $solicitacoesProcessadasTotal;
    public array $solicitacoesInconsistentes;
    public int $solicitacoesInconsistentesTotal;


    public function __construct(array $data)
    {
        $this->solicitacoesProcessadas = $data['solicitacoesProcessadas'] ?? [];
        $this->solicitacoesProcessadasTotal = $data['solicitacoesProcessadasTotal'] ?? 0;
        $this->solicitacoesInconsistentes = $data['solicitacoesInconsistentes'] ?? [];
        $this->solicitacoesInconsistentesTotal = $data['solicitacoesInconsistentesTotal'] ?? 0;
    }


    public function getSolicitacoesProcessadas(): array
    {
        return $this->solicitacoesProcessadas;
    }

    public function getSolicitacoesProcessadasTotal(): int
    {
        return $this->solicitacoesProcessadasTotal;
    }

    public function getSolicitacoesInconsistentes(): array
    {
        return $this->solicitacoesInconsistentes;
    }

    public function getSolicitacoesInconsistentesTotal(): int
    {
        return $this->solicitacoesInconsistentesTotal;
    }

    public function toArray(): array
    {
        return [
            'solicitacoesProcessadas' => $this->solicitacoesProcessadas,
            'solicitacoesProcessadasTotal' => $this->solicitacoesProcessadasTotal,
            'solicitacoesInconsistentes' => $this->solicitacoesInconsistentes,
            'solicitacoesInconsistentesTotal' => $this->solicitacoesInconsistentesTotal,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
