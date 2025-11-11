<?php

namespace App\DTO\Trust\Output;

use Symfony\Component\Serializer\Annotation\Groups;

class DadosPlanoOutputDTO
{
    #[Groups(['plano:output'])]
    private ?string $orgao = null;

    #[Groups(['plano:output'])]
    private ?string $plano = null;

    #[Groups(['plano:output'])]
    private ?string $cnpb = null;

    #[Groups(['plano:output'])]
    private ?string $dtInscricao = null;

    #[Groups(['plano:output'])]
    private ?string $dtInicio = null;

    #[Groups(['plano:output'])]
    private ?string $dtFim = null;

    #[Groups(['plano:output'])]
    private ?string $situacao = null;

    #[Groups(['plano:output'])]
    private ?string $categoria = null;

    #[Groups(['plano:output'])]
    private ?string $regimeTributacao = null;

    #[Groups(['plano:output'])]
    private ?float $percentualContribuicao = null;

    #[Groups(['plano:output'])]
    private ?string $tipoContribuicao = null;

    public function getOrgao(): ?string
    {
        return $this->orgao;
    }

    public function setOrgao(?string $orgao): self
    {
        $this->orgao = $orgao;

        return $this;
    }

    public function getPlano(): ?string
    {
        return $this->plano;
    }

    public function setPlano(?string $plano): self
    {
        $this->plano = $plano;

        return $this;
    }

    public function getCnpb(): ?string
    {
        return $this->cnpb;
    }

    public function setCnpb(?string $cnpb): self
    {
        $this->cnpb = $cnpb;

        return $this;
    }

    public function getDtInscricao(): ?string
    {
        return $this->dtInscricao;
    }

    public function setDtInscricao(?string $dtInscricao): self
    {
        $this->dtInscricao = $dtInscricao;

        return $this;
    }

    public function getDtInicio(): ?string
    {
        return $this->dtInicio;
    }

    public function setDtInicio(?string $dtInicio): self
    {
        $this->dtInicio = $dtInicio;

        return $this;
    }

    public function getDtFim(): ?string
    {
        return $this->dtFim;
    }

    public function setDtFim(?string $dtFim): self
    {
        $this->dtFim = $dtFim;

        return $this;
    }

    public function getSituacao(): ?string
    {
        return $this->situacao;
    }

    public function setSituacao(?string $situacao): self
    {
        $this->situacao = $situacao;

        return $this;
    }

    public function getCategoria(): ?string
    {
        return $this->categoria;
    }

    public function setCategoria(?string $categoria): self
    {
        $this->categoria = $categoria;

        return $this;
    }

    public function getRegimeTributacao(): ?string
    {
        return $this->regimeTributacao;
    }

    public function setRegimeTributacao(?string $regimeTributacao): self
    {
        $this->regimeTributacao = $regimeTributacao;

        return $this;
    }

    public function getPercentualContribuicao(): ?float
    {
        return $this->percentualContribuicao;
    }

    public function setPercentualContribuicao(?float $percentualContribuicao): self
    {
        $this->percentualContribuicao = $percentualContribuicao;

        return $this;
    }

    public function getTipoContribuicao(): ?string
    {
        return $this->tipoContribuicao;
    }

    public function setTipoContribuicao(?string $tipoContribuicao): self
    {
        $this->tipoContribuicao = $tipoContribuicao;

        return $this;
    }
}
