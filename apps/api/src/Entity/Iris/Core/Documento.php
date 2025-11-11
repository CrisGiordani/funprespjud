<?php

namespace App\Entity\Iris\Core;

use App\Repository\Iris\Core\DocumentoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentoRepository::class)]
#[ORM\Table(name: 'core_documentos')]
class Documento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nome = null;

    #[ORM\Column(length: 255)]
    private ?string $tipo = null;

    #[ORM\Column(length: 255)]
    private ?string $link = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $dt_documento = null;

    #[ORM\Column]
    private ?int $usuario_id = null;

    #[ORM\Column(nullable: true)]
    private \DateTime|null $dt_criacao = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $dt_atualizacao = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $dt_delecao = null;

    public function __construct()
    {
        // $this->dt_criacao = new \DateTime((new \DateTime())->format(\DateTime::ATOM));
        $this->dt_criacao = (new \DateTime());
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;

        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(string $link): static
    {
        $this->link = $link;

        return $this;
    }

    public function getDtDocumento(): ?\DateTime
    {
        return $this->dt_documento;
    }

    public function setDtDocumento(\DateTime $dt_documento): static
    {
        $this->dt_documento = $dt_documento;

        return $this;
    }

    public function getUsuarioId(): ?int
    {
        return $this->usuario_id;
    }

    public function setUsuarioId(int $usuario_id): static
    {
        $this->usuario_id = $usuario_id;

        return $this;
    }

    public function getDtCriacao(): ?\DateTime
    {
        return $this->dt_criacao;
    }

    public function setDtCriacao(\DateTime $dt_criacao): static
    {
        $this->dt_criacao = $dt_criacao;

        return $this;
    }

    public function getDtAtualizacao(): ?\DateTime
    {
        return $this->dt_atualizacao;
    }

    public function setDtAtualizacao(?\DateTime $dt_atualizacao): static
    {
        $this->dt_atualizacao = $dt_atualizacao;

        return $this;
    }

    public function getDtDelecao(): ?\DateTime
    {
        return $this->dt_delecao;
    }

    public function setDtDelecao(?\DateTime $dt_delecao): static
    {
        $this->dt_delecao = $dt_delecao;

        return $this;
    }
}
