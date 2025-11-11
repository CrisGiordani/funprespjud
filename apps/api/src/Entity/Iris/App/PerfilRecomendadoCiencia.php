<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\PerfilRecomendadoCienciaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PerfilRecomendadoCienciaRepository::class)]
class PerfilRecomendadoCiencia
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // #[ORM\OneToOne(inversedBy: 'perfilRecomendadoCiencia', cascade: ['persist', 'remove'])]
    // private ?PerfilRecomendado $idPerfilRecomendado = null;

    #[ORM\Column(length: 255)]
    private ?string $ipMaquina = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $dt_ciencia = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    // public function getIdPerfilRecomendado(): ?PerfilRecomendado
    // {
    //     return $this->idPerfilRecomendado;
    // }

    // public function setIdPerfilRecomendado(?PerfilRecomendado $idPerfilRecomendado): static
    // {
    //     $this->idPerfilRecomendado = $idPerfilRecomendado;

    //     return $this;
    // }

    public function getIpMaquina(): ?string
    {
        return $this->ipMaquina;
    }

    public function setIpMaquina(string $ipMaquina): static
    {
        $this->ipMaquina = $ipMaquina;

        return $this;
    }

    public function getDtCiencia(): ?\DateTimeInterface
    {
        return $this->dt_ciencia;
    }

    public function setDtCiencia(\DateTimeInterface $dt_ciencia): static
    {
        $this->dt_ciencia = $dt_ciencia;

        return $this;
    }
}
