<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\StatusHistoricoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: StatusHistoricoRepository::class)]
#[ORM\Table(name: 'participante_app_status_historico')]
class StatusHistorico
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(name: 'cd_status', type: 'integer')]
    #[Groups(['historico:read'])]
    private ?int $cdStatus = null;

    #[ORM\Column(name: 'descricao', length: 255)]
    #[Groups(['historico:read'])]
    private ?string $descricao = null;

    #[ORM\OneToMany(mappedBy: 'status', targetEntity: Historico::class)]
    private Collection $historicos;

    public function __construct()
    {
        $this->historicos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCdStatus(): ?int
    {
        return $this->cdStatus;
    }

    public function setCdStatus(int $cdStatus): static
    {
        $this->cdStatus = $cdStatus;

        return $this;
    }

    public function getDescricao(): ?string
    {
        return $this->descricao;
    }

    public function setDescricao(string $descricao): static
    {
        $this->descricao = $descricao;

        return $this;
    }

    public function getHistoricos(): Collection
    {
        return $this->historicos;
    }

    public function addHistorico(Historico $historico): static
    {
        if (! $this->historicos->contains($historico)) {
            $this->historicos->add($historico);
            $historico->setStatus($this);
        }

        return $this;
    }
}
