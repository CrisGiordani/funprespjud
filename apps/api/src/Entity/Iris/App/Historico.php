<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\HistoricoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Entity class representing the history of participant actions
 *
 * This class stores information about participant activities including
 * document access and event timestamps.
 * @attribute Historico
 * @attribute Historico::id
 * @attribute Historico::cpf
 * @attribute Historico::status
 * @attribute Historico::dt_evento
 * @attribute Historico::url_documento
 */
#[ORM\Entity(repositoryClass: HistoricoRepository::class)]
#[ORM\Table(name: 'participante_app_historico')]
class Historico
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['historico:read'])]
    /**
     * @var int|null|null
     */
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    // #[Groups(['historico:read'])]
    /**
     * @var string|null|null
     */
    private ?string $cpf = null;

    #[ORM\ManyToOne(targetEntity: StatusHistorico::class, inversedBy: 'historicos', fetch: 'EAGER')]
    #[ORM\JoinColumn(name: 'cd_status', referencedColumnName: 'id')]
    #[Groups(['historico:read'])]
    /**
     * @var StatusHistorico|int|null
     */
    private StatusHistorico|int|null $status = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['historico:read'])]
    /**
     * @var \DateTimeInterface|null|null
     */
    private ?\DateTimeInterface $dt_evento = null;

    #[ORM\Column(name:'url_documento', length: 255)]
    #[Groups(['historico:read'])]
    /**
     * @var string|null|null
     */
    private ?string $urlDocumento = null;

    public function __construct(
        string $cpf,
        StatusHistorico|int $status,
        \DateTimeInterface $dt_evento,
        string $urlDocumento
    ) {
        $this->cpf = $cpf;
        $this->status = $status;
        $this->dt_evento = $dt_evento;
        $this->urlDocumento = $urlDocumento;
    }

    /**
     * Get the unique identifier of the history record
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get the CPF (tax ID) of the participant
     *
     * @return string|null
     */
    public function getCpf(): ?string
    {
        return $this->cpf;
    }

    /**
     * Set the CPF (tax ID) of the participant
     *
     * @param string $cpf
     * @return $this
     */
    public function setCpf(string $cpf): static
    {
        $this->cpf = $cpf;

        return $this;
    }

    /**
     * @return StatusHistorico|null
     */
    public function getStatus(): StatusHistorico|int|null
    {
        return $this->status;
    }

    /**
     * @param StatusHistorico|int $status
     *
     * @return static
     */
    public function setStatus(StatusHistorico|int $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get the date and time of the event
     *
     * @return \DateTimeInterface|null
     */
    public function getDtEvento(): ?\DateTimeInterface
    {
        return $this->dt_evento;
    }

    /**
     * Set the date and time of the event
     *
     * @param \DateTimeInterface $dt_evento
     * @return $this
     */
    public function setDtEvento(\DateTimeInterface $dt_evento): static
    {
        $this->dt_evento = $dt_evento;

        return $this;
    }

    /**
     * Get the URL of the accessed document
     *
     * @return string|null
     */
    public function getUrlDocumento(): ?string
    {
        return $this->urlDocumento;
    }

    /**
     * Set the URL of the accessed document
     *
     * @param string $urlDocumento
     * @return $this
     */
    public function setUrlDocumento(string $urlDocumento): static
    {
        $this->urlDocumento = $urlDocumento;

        return $this;
    }
}
