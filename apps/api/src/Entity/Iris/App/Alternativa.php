<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\AlternativaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AlternativaRepository::class)]
#[ORM\Table(name: 'participante_app_alternativa')]
class Alternativa
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['pergunta:read', 'alternativa:read', 'questionarioResposta:read', 'questionario:read'])]
    private ?int $id = null;

    #[ORM\Column(name:'letra_opcao', length: 255)]
    #[Groups(['pergunta:read', 'alternativa:read', 'questionarioResposta:read', 'questionario:read'])]
    private ?string $letraOpcao = null;

    #[ORM\Column(length: 255)]
    #[Groups(['pergunta:read', 'alternativa:read', 'questionarioResposta:read', 'questionario:read'])]
    private ?string $descricao = null;

    #[ORM\Column]
    #[Groups(['pergunta:read', 'alternativa:read', 'questionarioResposta:read', 'questionario:read'])]
    private ?float $pontuacao = null;

    #[ORM\ManyToOne(targetEntity: Pergunta::class, inversedBy: 'alternativas', fetch: 'EAGER')]
    #[ORM\JoinColumn(name: 'id_app_pergunta', referencedColumnName: 'id')]
    #[Groups(['alternativa:read'])]
    private ?Pergunta $pergunta = null;

    /**
     * @var Collection<int, QuestionarioResposta>
     */
    #[ORM\OneToMany(targetEntity: QuestionarioResposta::class, mappedBy: 'idAlternativa')]
    private Collection $questionarioRespostas;

    public function __construct()
    {
        $this->questionarioRespostas = new ArrayCollection();
    }

    /**
     * Get the ID of the alternativa
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get the letter option of the alternativa
     *
     * @return string|null
     */
    public function getLetraOpcao(): ?string
    {
        return $this->letraOpcao;
    }

    /**
     * Set the letter option of the alternativa
     *
     * @param string $letraOpcao
     * @return $this
     */
    public function setLetraOpcao(string $letraOpcao): static
    {
        $this->letraOpcao = $letraOpcao;

        return $this;
    }

    /**
     * Get the description of the alternativa
     *
     * @return string|null
     */
    public function getDescricao(): ?string
    {
        return $this->descricao;
    }

    /**
     * Set the description of the alternativa
     *
     * @param string $descricao
     * @return $this
     */
    public function setDescricao(string $descricao): static
    {
        $this->descricao = $descricao;

        return $this;
    }

    /**
     * Get the score of the alternativa
     *
     * @return float|null
     */
    public function getPontuacao(): ?float
    {
        return $this->pontuacao;
    }

    /**
     * Set the score of the alternativa
     *
     * @param float $pontuacao
     * @return $this
     */
    public function setPontuacao(float $pontuacao): static
    {
        $this->pontuacao = $pontuacao;

        return $this;
    }

    /**
     * Get the associated question
     *
     * @return Pergunta|null
     */
    public function getPergunta(): ?Pergunta
    {
        return $this->pergunta;
    }

    /**
     * Set the associated question
     *
     * @param Pergunta|null $pergunta
     * @return $this
     */
    public function setPergunta(?Pergunta $pergunta): static
    {
        $this->pergunta = $pergunta;

        return $this;
    }

    /**
     * Get all questionnaire responses associated with this alternativa
     *
     * @return Collection<int, QuestionarioResposta>
     */
    public function getQuestionarioRespostas(): Collection
    {
        return $this->questionarioRespostas;
    }

    /**
     * Add a questionnaire response to this alternativa
     *
     * @param QuestionarioResposta $questionarioResposta
     * @return $this
     */
    public function addQuestionarioResposta(QuestionarioResposta $questionarioResposta): static
    {
        if (! $this->questionarioRespostas->contains($questionarioResposta)) {
            $this->questionarioRespostas->add($questionarioResposta);
            $questionarioResposta->setAlternativa($this);
        }

        return $this;
    }

    /**
     * Remove a questionnaire response from this alternativa
     *
     * @param QuestionarioResposta $questionarioResposta
     * @return $this
     */
    public function removeQuestionarioResposta(QuestionarioResposta $questionarioResposta): static
    {
        if ($this->questionarioRespostas->removeElement($questionarioResposta)) {
            // set the owning side to null (unless already changed)
            if ($questionarioResposta->getAlternativa() === $this) {
                $questionarioResposta->setAlternativa(null);
            }
        }

        return $this;
    }
}
