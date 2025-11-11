<?php

namespace App\Entity\Iris\Core;

use App\Repository\Iris\Core\ParticipanteDiferencaPatrimonioLogRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ParticipanteDiferencaPatrimonioLogRepository::class)]
#[ORM\Table(name: 'participante_diferenca_patrimonio_log')]
class ParticipanteDiferencaPatrimonioLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id')]
    private ?int $id = null;

    #[ORM\Column(length: 255, name: 'cpf')]
    private ?string $cpf = null;

    #[ORM\Column(name: 'vl_patrimonio_composicao')]
    private ?float $vlPatrimonioComposicao = null;

    #[ORM\Column(name: 'vl_patrimonio_evolucao')]
    private ?float $vlPatrimonioEvolucao = null;

    #[ORM\Column(name: 'dt_log')]
    private ?\DateTime $dtLog = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

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

    public function getVlPatrimonioComposicao(): ?float
    {
        return $this->vlPatrimonioComposicao;
    }

    public function setVlPatrimonioComposicao(float $vlPatrimonioComposicao): static
    {
        $this->vlPatrimonioComposicao = $vlPatrimonioComposicao;

        return $this;
    }

    public function getVlPatrimonioEvolucao(): ?float
    {
        return $this->vlPatrimonioEvolucao;
    }

    public function setVlPatrimonioEvolucao(float $vlPatrimonioEvolucao): static
    {
        $this->vlPatrimonioEvolucao = $vlPatrimonioEvolucao;

        return $this;
    }

    public function getDtLog(): ?\DateTime
    {
        return $this->dtLog;
    }

    public function setDtLog(\DateTime $dtLog): static
    {
        $this->dtLog = $dtLog;

        return $this;
    }
}
