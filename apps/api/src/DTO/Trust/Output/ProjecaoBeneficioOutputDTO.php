<?php

namespace App\DTO\Trust\Output;

class ProjecaoBeneficioOutputDTO
{
    public float $projecaoAtual;
    public string $idadeAposentadoria;
    public string $regimeTributacao;
    public string|null $regimeTributacaoDataOpcao;

    public function __construct(array $data)
    {
        $this->projecaoAtual = $data['projecaoAtual'];
        $this->idadeAposentadoria = $data['idadeAposentadoria'];
        $this->regimeTributacao = $data['regimeTributacao'];
        $this->regimeTributacaoDataOpcao = $data['regimeTributacaoDataOpcao'];
    }

    public function getProjecaoAtual(): float
    {
        return $this->projecaoAtual;
    }

    public function setProjecaoAtual(float $projecaoAtual): self
    {
        $this->projecaoAtual = $projecaoAtual;

        return $this;
    }

    public function getIdadeAposentadoria(): string
    {
        return $this->idadeAposentadoria;
    }

    public function setIdadeAposentadoria(string $idadeAposentadoria): self
    {
        $this->idadeAposentadoria = $idadeAposentadoria;

        return $this;
    }

    public function getRegimeTributacao(): string
    {
        return $this->regimeTributacao;
    }

    public function setRegimeTributacao(string $regimeTributacao): self
    {
        $this->regimeTributacao = $regimeTributacao;

        return $this;
    }

    public function getRegimeTributacaoDataOpcao(): string
    {
        return $this->regimeTributacaoDataOpcao;
    }

    public function setRegimeTributacaoDataOpcao(string $regimeTributacaoDataOpcao): self
    {
        $this->regimeTributacaoDataOpcao = $regimeTributacaoDataOpcao;

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
