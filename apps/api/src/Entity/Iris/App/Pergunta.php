<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\PerguntaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PerguntaRepository::class)]
#[ORM\Table(name: 'participante_app_pergunta')]
class Pergunta
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['pergunta:read', 'bloco:read', 'alternativa:read', 'questionarioResposta:read', 'questionario:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['pergunta:read', 'bloco:read', 'alternativa:read', 'questionarioResposta:read', 'questionario:read'])]
    private ?string $descricao = null;

    #[ORM\ManyToOne(inversedBy: 'perguntas')]
    #[ORM\JoinColumn(name: 'id_app_bloco', referencedColumnName: 'id')]
    private ?Bloco $idBloco = null;

    /**
     * @var Collection<int, Alternativa>
     */
    #[ORM\OneToMany(targetEntity: Alternativa::class, mappedBy: 'pergunta', fetch: 'EAGER')]
    #[Groups(['pergunta:read', 'questionario:read'])]
    private Collection $alternativas;

    /**
     * @var Collection<int, QuestionarioResposta>
     */
    #[ORM\OneToMany(targetEntity: QuestionarioResposta::class, mappedBy: 'pergunta')]
    #[Groups(['pergunta:read'])]
    private Collection $questionarioRespostas;

    public function __construct()
    {
        $this->alternativas = new ArrayCollection();
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

    public function getIdBloco(): ?Bloco
    {
        return $this->idBloco;
    }

    public function setIdBloco(?Bloco $idBloco): static
    {
        $this->idBloco = $idBloco;

        return $this;
    }

    /**
     * @return Collection<int, Alternativa>
     */
    public function getAlternativas(): Collection
    {
        return $this->alternativas;
    }

    public function addAlternativa(Alternativa $alternativa): static
    {
        if (! $this->alternativas->contains($alternativa)) {
            $this->alternativas->add($alternativa);
            $alternativa->setPergunta($this);
        }

        return $this;
    }

    public function removeAlternativa(Alternativa $alternativa): static
    {
        if ($this->alternativas->removeElement($alternativa)) {
            // set the owning side to null (unless already changed)
            if ($alternativa->getPergunta() === $this) {
                $alternativa->setPergunta(null);
            }
        }

        return $this;
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
            $questionarioResposta->setPergunta($this);
        }

        return $this;
    }

    public function removeQuestionarioResposta(QuestionarioResposta $questionarioResposta): static
    {
        if ($this->questionarioRespostas->removeElement($questionarioResposta)) {
            // set the owning side to null (unless already changed)
            if ($questionarioResposta->getPergunta() === $this) {
                $questionarioResposta->setPergunta(null);
            }
        }

        return $this;
    }
}
