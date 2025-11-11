<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\PerfilRecomendadoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: PerfilRecomendadoRepository::class)]
#[ORM\Table(name: 'participante_perfil_recomendado')]
class PerfilRecomendado
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Campanha::class, inversedBy: 'perfisRecomendados',  fetch: 'EAGER')]
    // #[ORM\JoinColumn(name: 'id_campanha', referencedColumnName: 'id')]
    #[ORM\JoinColumn(name: 'id_campanha', referencedColumnName: 'id', nullable: true)]
    #[Groups(['perfilRecomendado'])]
    #[MaxDepth(1)]
    #[Ignore]
    private ?Campanha $campanha = null;

    #[ORM\Column(length: 255)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?string $nome = null;

    #[ORM\Column(length: 255)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?string $cpf = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?\DateTimeInterface $dt_nascimento = null;

    #[ORM\Column(length: 255)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?string $sexo = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?\DateTimeInterface $dt_aposentadoria_calculada = null;

    #[ORM\Column(name: 'elegibilidade_calculada_meses', length: 255)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?int $elegibilidadeCalculadaMeses = null;

    #[ORM\Column(name: 'perfil_recomendado', length: 255)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?string $perfilRecomendado = null;

    #[ORM\Column]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?bool $status = null;

    #[ORM\Column(name: 'dt_ciencia', type: Types::DATETIME_MUTABLE)]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?\DateTimeInterface $dtCiencia = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true, options: ['default' => 0])]
    #[Groups(['campanha:read', 'perfilRecomendado'])]
    private ?bool $ciente = null;

    // #[ORM\OneToOne(mappedBy: 'perfilRecomendado', cascade: ['persist', 'remove'])]
    // private ?PerfilRecomendadoCiencia $perfilRecomendadoCiencia = null;

    public function __construct() {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCampanha(): ?Campanha
    {
        return $this->campanha;
    }

    public function setCampanha(?Campanha $campanha): static
    {
        $this->campanha = $campanha;

        return $this;
    }

    public function getNome(): ?string
    {
        return $this->nome;
    }

    public function setNome(string $nome): static
    {
        $this->nome = $nome;

        return $this;
    }

    public function getCpf(): ?string
    {
        return $this->cpf;
    }

    public function setCpf(string $cpf): static
    {
        $this->cpf = $cpf;

        return $this;
    }

    public function getDtNascimento(): ?\DateTimeInterface
    {
        return $this->dt_nascimento;
    }

    public function setDtNascimento(\DateTimeInterface $dt_nascimento): static
    {
        $this->dt_nascimento = $dt_nascimento;

        return $this;
    }

    public function getSexo(): ?string
    {
        return $this->sexo;
    }

    public function setSexo(string $sexo): static
    {
        $this->sexo = $sexo;

        return $this;
    }

    public function getDtAposentadoriaCalculada(): ?\DateTimeInterface
    {
        return $this->dt_aposentadoria_calculada;
    }

    public function setDtAposentadoriaCalculada(\DateTimeInterface $dt_aposentadoria_calculada): static
    {
        $this->dt_aposentadoria_calculada = $dt_aposentadoria_calculada;

        return $this;
    }

    public function getElegibilidadeCalculadaMeses(): ?string
    {
        return $this->elegibilidadeCalculadaMeses;
    }

    public function setElegibilidadeCalculadaMeses(string $elegibilidadeCalculadaMeses): static
    {
        $this->elegibilidadeCalculadaMeses = $elegibilidadeCalculadaMeses;

        return $this;
    }

    public function getPerfilRecomendado(): ?string
    {
        return $this->perfilRecomendado;
    }

    public function setPerfilRecomendado(string $perfilRecomendado): static
    {
        $this->perfilRecomendado = $perfilRecomendado;

        return $this;
    }

    public function isStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(bool $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDtCiencia(): ?\DateTimeInterface
    {
        return $this->dtCiencia;
    }

    public function setDtCiencia(\DateTimeInterface $dtCiencia): static
    {
        $this->dtCiencia = $dtCiencia;

        return $this;
    }

    public function getCiente(): ?bool
    {
        return $this->ciente;
    }

    public function setCiente(?bool $ciente): static
    {
        $this->ciente = $ciente;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'dtNascimento' => $this->getDtNascimento()->format('Y-m-d'),
            'sexo' => $this->getSexo(),
            'dtAposentadoriaCalculada' => $this->getDtAposentadoriaCalculada()->format('Y-m-d'),
            'elegibilidadeCalculadaMeses' => $this->getElegibilidadeCalculadaMeses(),
            'perfilRecomendado' => $this->getPerfilRecomendado(),
            'status' => $this->isStatus(),
            'dtCiencia' => $this->getDtCiencia() ? $this->getDtCiencia()->format('Y-m-d') : null,
            'ciente' => $this->getCiente(),
        ];
    }

    // public function getperfilRecomendadoCiencia(): ?PerfilRecomendadoCiencia
    // {
    //     return $this->perfilRecomendadoCiencia;
    // }

    // public function setperfilRecomendadoCiencia(?PerfilRecomendadoCiencia $perfilRecomendadoCiencia): static
    // {
    //     // unset the owning side of the relation if necessary
    //     if ($perfilRecomendadoCiencia === null && $this->perfilRecomendadoCiencia !== null) {
    //         $this->perfilRecomendadoCiencia->setIdPerfilRecomendado(null);
    //     }

    //     // set the owning side of the relation if necessary
    //     if ($perfilRecomendadoCiencia !== null && $perfilRecomendadoCiencia->getIdPerfilRecomendado() !== $this) {
    //         $perfilRecomendadoCiencia->setIdPerfilRecomendado($this);
    //     }

    //     $this->perfilRecomendadoCiencia = $perfilRecomendadoCiencia;

    //     return $this;
    // }
}
