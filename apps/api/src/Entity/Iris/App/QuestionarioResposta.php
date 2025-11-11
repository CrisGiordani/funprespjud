<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\QuestionarioRespostaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: QuestionarioRespostaRepository::class)]
#[ORM\Table(name: 'participante_app_questionario_resposta')]
class QuestionarioResposta
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['questionarioResposta:read', 'questionario:read', 'historico:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['questionarioResposta:read', 'questionario:read', 'historico:read'])]
    private ?string $cpf = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['questionarioResposta:read', 'questionario:read', 'historico:read'])]
    private ?\DateTimeInterface $dt_resposta = null;

    #[ORM\ManyToOne(inversedBy: 'questionarioRespostas')]
    #[ORM\JoinColumn(name: 'id_app_questionario', referencedColumnName: 'id')]
    #[Groups(['questionarioResposta:read'])]
    private ?Questinario $questionario = null;

    #[ORM\ManyToOne(inversedBy: 'questionarioRespostas')]
    #[ORM\JoinColumn(name: 'id_app_pergunta', referencedColumnName: 'id')]
    #[Groups(['questionarioResposta:read'])]
    private ?Pergunta $pergunta = null;

    #[ORM\ManyToOne(inversedBy: 'questionarioRespostas')]
    #[ORM\JoinColumn(name: 'id_app_alternativa', referencedColumnName: 'id')]
    #[Groups(['questionarioResposta:read'])]
    private ?Alternativa $alternativa = null;

    public function __construct()
    {
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDtResposta(): ?\DateTimeInterface
    {
        return $this->dt_resposta;
    }

    public function setDtResposta(\DateTimeInterface $dt_resposta): static
    {
        $this->dt_resposta = $dt_resposta;

        return $this;
    }

    public function getQuestionario(): ?Questinario
    {
        return $this->questionario;
    }

    public function setQuestionario(?Questinario $questionario): static
    {
        $this->questionario = $questionario;

        return $this;
    }

    public function getPergunta(): ?Pergunta
    {
        return $this->pergunta;
    }

    public function setPergunta(?Pergunta $pergunta): static
    {
        $this->pergunta = $pergunta;

        return $this;
    }

    public function getAlternativa(): ?Alternativa
    {
        return $this->alternativa;
    }

    public function setAlternativa(?Alternativa $alternativa): static
    {
        $this->alternativa = $alternativa;

        return $this;
    }

    // public function addHistorico(Historico $historico): static
    // {
    //     if (!$this->historicos->contains($historico)) {
    //         $this->historicos->add($historico);
    //         $historico->setQuestionarioResposta($this);
    //     }

    //     return $this;
    // }

    // public function removeHistorico(Historico $historico): static
    // {
    //     if ($this->historicos->removeElement($historico)) {
    //         // set the owning side to null (unless already changed)
    //         if ($historico->getQuestionarioResposta() === $this) {
    //             $historico->setQuestionarioResposta(null);
    //         }
    //     }

    //     return $this;
    // }
}
