<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\QuestinarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: QuestinarioRepository::class)]
#[ORM\Table(name: 'participante_app_questionario')]
class Questinario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['bloco:read', 'questionario:read', 'pergunta:read', 'questionarioResposta:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['bloco:read', 'questionario:read', 'pergunta:read', 'questionarioResposta:read'])]
    private ?string $descricao = null;

    #[ORM\Column]
    #[Groups(['bloco:read', 'questionario:read', 'questionarioResposta:read'])]
    private ?bool $ativo = null;

    #[ORM\ManyToMany(targetEntity: Bloco::class, inversedBy: 'questionarios')]
    #[ORM\JoinTable(
        name: 'participante_app_questionario_bloco',
        joinColumns: [new ORM\JoinColumn(name: 'id_app_questionario', referencedColumnName: 'id')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'id_app_bloco', referencedColumnName: 'id')]
    )]
    #[Groups(['questionario:read'])]
    private ?Collection $blocos = null;

    /**
     * @var Collection<int, QuestionarioResposta>
     */
    #[ORM\OneToMany(targetEntity: QuestionarioResposta::class, mappedBy: 'questionario')]
    private Collection $questionarioRespostas;

    public function __construct()
    {
        $this->blocos = new ArrayCollection();
        $this->questionarioRespostas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function isAtivo(): ?bool
    {
        return $this->ativo;
    }

    public function setAtivo(bool $ativo): static
    {
        $this->ativo = $ativo;

        return $this;
    }

    public function addBloco(Bloco $bloco): static
    {
        if (! $this->blocos->contains($bloco)) {
            $this->blocos->add($bloco);
        }

        return $this;
    }

    public function removeBloco(Bloco $bloco): static
    {
        if ($this->blocos->contains($bloco)) {
            $this->blocos->removeElement($bloco);
        }

        return $this;
    }

    public function getBlocos(): Collection
    {
        return $this->blocos;
    }

    public function getBlocosCount(): int
    {
        return $this->blocos->count();
    }

    /**
     * @return Collection<int, QuestionarioResposta>
     */
    public function getQuestionarioRespostas(): Collection
    {
        return $this->questionarioRespostas;
    }

    public function addQuestionarioResposta(QuestionarioResposta $questionarioResposta): static
    {
        if (! $this->questionarioRespostas->contains($questionarioResposta)) {
            $this->questionarioRespostas->add($questionarioResposta);
            $questionarioResposta->setQuestionario($this);
        }

        return $this;
    }

    public function removeQuestionarioResposta(QuestionarioResposta $questionarioResposta): static
    {
        if ($this->questionarioRespostas->removeElement($questionarioResposta)) {
            // set the owning side to null (unless already changed)
            if ($questionarioResposta->getQuestionario() === $this) {
                $questionarioResposta->setQuestionario(null);
            }
        }

        return $this;
    }
}
