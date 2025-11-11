<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Validator\Constraints as Assert;

class ContribuicaoFilterDTO
{
    #[Assert\Regex(
        pattern: '/^\d{2}\/\d{4}$/',
        message: 'A data inicial deve estar no formato mm/aaaa'
    )]
    private ?string $dataInicial = null;

    #[Assert\Regex(
        pattern: '/^\d{2}\/\d{4}$/',
        message: 'A data final deve estar no formato mm/aaaa'
    )]
    private ?string $dataFinal = null;

    private int $pageIndex = 0;
    private int $pageSize = 10;
    private ?string $tipo = null;
    private ?string $orgao = null;
    private ?string $autor = null;
    private ?string $patrocinador = null;

    public function __construct(array $data = [])
    {
        $this->dataInicial = $data['dataInicial'] ?? null;
        $this->dataFinal = $data['dataFinal'] ?? null;
        $this->pageIndex = (int) ($data['pageIndex'] ?? 0);
        $this->pageSize = (int) ($data['pageSize'] ?? 10);
        $this->tipo = $data['tipo'] ?? null;
        $this->orgao = $data['orgao'] ?? null;
        $this->autor = $data['autor'] ?? null;
        $this->patrocinador = $data['patrocinador'] ?? null;
    }

    public function getDataInicial(): ?string
    {
        return $this->dataInicial;
    }

    public function setDataInicial(?string $dataInicial): self
    {
        $this->dataInicial = $dataInicial;

        return $this;
    }

    public function getDataFinal(): ?string
    {
        return $this->dataFinal;
    }

    public function setDataFinal(?string $dataFinal): self
    {
        $this->dataFinal = $dataFinal;

        return $this;
    }

    public function getPageIndex(): int
    {
        return $this->pageIndex;
    }

    public function setPageIndex(int|string $pageIndex): self
    {
        $this->pageIndex = (int) $pageIndex;

        return $this;
    }

    public function getPageSize(): int
    {
        return $this->pageSize;
    }

    public function setPageSize(int|string $pageSize): self
    {
        $this->pageSize = (int) $pageSize;

        return $this;
    }

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(?string $tipo): self
    {
        $this->tipo = $tipo;

        return $this;
    }

    public function getOrgao(): ?string
    {
        return $this->orgao;
    }

    public function setOrgao(?string $orgao): self
    {
        $this->orgao = $orgao;

        return $this;
    }

    public function getAutor(): ?string
    {
        return $this->autor;
    }

    public function setAutor(?string $autor): self
    {
        $this->autor = $autor;

        return $this;
    }

    public function getAno(): int
    {
        return date('Y', strtotime($this->dataInicial));
    }

    public function getPatrocinador(): ?string
    {
        return $this->patrocinador;
    }

    public function setPatrocinador(?string $patrocinador): self
    {
        $this->patrocinador = $patrocinador;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'dataInicial' => $this->dataInicial,
            'dataFinal' => $this->dataFinal,
            'pageIndex' => $this->pageIndex,
            'pageSize' => $this->pageSize,
            'tipo' => $this->tipo,
            'orgao' => $this->orgao,
            'autor' => $this->autor,
        ];
    }
}