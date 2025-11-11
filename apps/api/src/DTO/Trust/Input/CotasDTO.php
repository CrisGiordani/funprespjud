<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Serializer\Annotation\Groups;

class CotasDTO
{
    #[Groups(['cotas:read'])]
    private ?string $idIndexador = null;

    #[Groups(['cotas:read'])]
    private ?string $dtCota = null;

    #[Groups(['cotas:read'])]
    private ?string $vlCota = null;

    #[Groups(['cotas:read'])]
    private ?string $vlCotaFrm = null;

    #[Groups(['cotas:read'])]
    private ?string $vlVariacao = null;

    #[Groups(['cotas:read'])]
    private ?string $icPrevia = null;

    public function __construct(array $data = [])
    {
        $this->idIndexador = $data['idIndexador'] ?? null;
        $this->dtCota = $data['dtCota'] ?? null;
        $this->vlCota = $data['vlCota'] ?? null;
        $this->vlCotaFrm = $data['vlCotaFrm'] ?? null;
        $this->vlVariacao = $data['vlVariacao'] ?? null;
        $this->icPrevia = $data['icPrevia'] ?? null;
    }

    public function getIdIndexador(): ?string
    {
        return $this->idIndexador;
    }

    public function setIdIndexador(?string $idIndexador): self
    {
        $this->idIndexador = $idIndexador;

        return $this;
    }

    public function getDtCota(): ?string
    {
        return $this->dtCota;
    }

    public function setDtCota(?string $dtCota): self
    {
        $this->dtCota = $dtCota;

        return $this;
    }

    public function getVlCota(): ?string
    {
        return $this->vlCota;
    }

    public function setVlCota(?string $vlCota): self
    {
        $this->vlCota = $vlCota;

        return $this;
    }

    public function getVlCotaFrm(): ?string
    {
        return $this->vlCotaFrm;
    }

    public function setVlCotaFrm(?string $vlCotaFrm): self
    {
        $this->vlCotaFrm = $vlCotaFrm;

        return $this;
    }

    public function getVlVariacao(): ?string
    {
        return $this->vlVariacao;
    }

    public function setVlVariacao(?string $vlVariacao): self
    {
        $this->vlVariacao = $vlVariacao;

        return $this;
    }

    public function getIcPrevia(): ?string
    {
        return $this->icPrevia;
    }

    public function setIcPrevia(?string $icPrevia): self
    {
        $this->icPrevia = $icPrevia;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'idIndexador' => $this->idIndexador,
            'dtCota' => $this->dtCota,
            'vlCota' => $this->vlCota,
            'vlCotaFrm' => $this->vlCotaFrm,
            'vlVariacao' => $this->vlVariacao,
            'icPrevia' => $this->icPrevia,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
