<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\BlocoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BlocoRepository::class)]
#[ORM\Table(name: 'participante_app_bloco')]
class Bloco
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['bloco:read', 'questionario:read', 'pergunta:read'])]
    private ?int $id = null;

    #[ORM\Column(name: 'nm_bloco', length: 255)]
    #[Groups(['bloco:read', 'questionario:read', 'pergunta:read'])]
    private ?string $nomeBloco = null;

    #[ORM\Column(name: 'descricao', length: 255)]
    #[Groups(['bloco:read', 'questionario:read', 'pergunta:read'])]
    private ?string $descricao = null;

    #[ORM\ManyToMany(targetEntity: Questinario::class, inversedBy: 'blocos')]
    #[ORM\JoinTable(
        name: 'participante_app_questionario_bloco',
        joinColumns: [new ORM\JoinColumn(name: 'id_app_bloco', referencedColumnName: 'id')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'id_app_questionario', referencedColumnName: 'id')]
    )]
    #[Groups(['bloco:read', 'pergunta:read'])]
    private ?Collection $questionarios = null;

    /**
     * @var Collection<int, Pergunta>
     */
    #[ORM\OneToMany(targetEntity: Pergunta::class, mappedBy: 'idBloco')]
    #[Groups(['bloco:read', 'questionario:read'])]
    private Collection $perguntas;

    public function __construct()
    {
        $this->questionarios = new ArrayCollection();
        $this->perguntas = new ArrayCollection();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomeBloco(): ?string
    {
        return $this->nomeBloco;
    }

    public function setNomeBloco(string $nomeBloco): static
    {
        $this->nomeBloco = $nomeBloco;

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

    public function addQuestionario(Questinario $questionario): static
    {
        if (! $this->questionarios->contains($questionario)) {
            $this->questionarios->add($questionario);
        }

        return $this;
    }

    public function removeQuestionario(Questinario $questionario): static
    {
        if ($this->questionarios->contains($questionario)) {
            $this->questionarios->removeElement($questionario);
        }

        return $this;
    }

    public function getQuestionarios(): Collection
    {
        return $this->questionarios;
    }

    public function getQuestionariosCount(): int
    {
        return $this->questionarios->count();
    }

    /**
     * @return Collection<int, Pergunta>
     */
    public function getPerguntas(): Collection
    {
        return $this->perguntas;
    }

    public function addPergunta(Pergunta $pergunta): static
    {
        if (! $this->perguntas->contains($pergunta)) {
            $this->perguntas->add($pergunta);
            $pergunta->setIdBloco($this);
        }

        return $this;
    }

    public function removePergunta(Pergunta $pergunta): static
    {
        if ($this->perguntas->removeElement($pergunta)) {
            // set the owning side to null (unless already changed)
            if ($pergunta->getIdBloco() === $this) {
                $pergunta->setIdBloco(null);
            }
        }

        return $this;
    }
}
