<?php

namespace App\DTO\Trust\Output;

class CoberturaOutputDTO
{
    public string $tipoContribuicao;
    public float $valorSeguro;
    public float $mensalidade;

    public function __construct(array $data)
    {
        $this->tipoContribuicao = $data['tipoContribuicao'];
        $this->valorSeguro = $data['valorSeguro'];
        $this->mensalidade = $data['mensalidade'];
    }

    public function getTipoContribuicao(): string
    {
        return $this->tipoContribuicao;
    }

    public function setTipoContribuicao(string $tipoContribuicao): self
    {
        $this->tipoContribuicao = $tipoContribuicao;

        return $this;
    }

    public function getValorSeguro(): float
    {
        return $this->valorSeguro;
    }

    public function setValorSeguro(float $valorSeguro): self
    {
        $this->valorSeguro = $valorSeguro;

        return $this;
    }

    public function getMensalidade(): float
    {
        return $this->mensalidade;
    }

    public function setMensalidade(float $mensalidade): self
    {
        $this->mensalidade = $mensalidade;

        return $this;
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
