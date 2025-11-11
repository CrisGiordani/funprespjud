<?php

namespace App\DTO\Iris\App\Input;

class ResumoSolicitacoesDTO
{
    public int $contagemSolicitacoes;
    public int $processadas;
    public int $canceladas;
    public int $nconfirmadas;

    /**
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->contagemSolicitacoes = $data['contagemSolicitacoes'] ?? 0;
        $this->processadas = $data['processadas'] ?? 0;
        $this->canceladas = $data['canceladas'] ?? 0;
        $this->nconfirmadas = $data['nconfirmadas'] ?? 0;
    }

    /**
     * @return int
     */
    public function getContagemSolicitacoes(): int
    {
        return $this->contagemSolicitacoes;
    }

    /**
     * @return int
     */
    public function getProcessadas(): int
    {
        return $this->processadas;
    }

    /**
     * @return int
     */
    public function getCanceladas(): int
    {
        return $this->canceladas;
    }

    /**
     * @return int
     */
    public function getNconfirmadas(): int
    {
        return $this->nconfirmadas;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'contagemSolicitacoes' => $this->contagemSolicitacoes,
            'processadas' => $this->processadas,
            'canceladas' => $this->canceladas,
            'nconfirmadas' => $this->nconfirmadas,
        ];
    }

    /**
     * @param array $data
     * 
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
