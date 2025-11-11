<?php

namespace App\Entity\Iris\App;

use App\Enum\Iris\App\StatusCampanhaEnum;
use App\Repository\Iris\App\CampanhaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CampanhaRepository::class)]
#[ORM\Table(name: 'participante_campanha')]
class Campanha
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['campanha:read', 'perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['campanha:read', 'perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read'])]
    private ?string $descricao = null;

    #[ORM\Column(name: 'usuario_criador')]
    #[Groups(['campanha:read', 'perfilInvestimentoAlteracao:read'])]
    private int|string|null $usuarioCriador = null;

    #[ORM\Column(name: 'dt_inicio')]
    #[Groups(['campanha:read', 'perfilInvestimentoAlteracao:read'])]
    private string|null $dt_inicio = null;

    #[ORM\Column(name: 'dt_fim')]
    #[Groups(['campanha:read', 'perfilInvestimentoAlteracao:read'])]
    private string|null $dt_fim = null;

    #[ORM\OneToMany(targetEntity: PerfilRecomendado::class, mappedBy: 'campanha', fetch: 'LAZY')]
    #[Groups(['perfilRecomendado:read'])]
    private Collection $perfisRecomendados;


    /**
     * Propriedade virtual para o status calculado
     */
    #[Groups(['campanha:read'])]
    private ?string $status = null;

    // #[ORM\OneToOne(mappedBy: 'idCampanha', cascade: ['persist', 'remove'])]
    // private ?PerfilInvestimentoAlteracao $idTrust = null;

    public function __construct()
    {
        $this->perfisRecomendados = new ArrayCollection();
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

    public function getUsuarioCriador(): int|string|null
    {
        return $this->usuarioCriador;
    }

    public function setUsuarioCriador(int|string $usuarioCriador): static
    {
        $this->usuarioCriador = $usuarioCriador;

        return $this;
    }

    public function getDtInicio(): string|null
    {
        return (new \DateTime($this->dt_inicio))->format('c');
    }

    public function setDtInicio(string|null $dt_inicio): static
    {
        $this->dt_inicio = (new \DateTime($dt_inicio))->format('c');

        return $this;
    }

    public function getDtFim(): string|null
    {
        return (new \DateTime($this->dt_fim))->format('c');
    }

    public function setDtFim(string|null $dt_fim): static
    {
        if ($dt_fim) {
            // Define a data de fim com horário 23:59:59
            $dateTime = new \DateTime($dt_fim);
            $dateTime->setTime(23, 59, 59);
            $this->dt_fim = $dateTime->format('c');
        } else {
            $this->dt_fim = null;
        }

        return $this;
    }

    /**
     * @return Collection<int, PerfilRecomendado>
     */
    public function getPerfisRecomendados(): Collection
    {
        return $this->perfisRecomendados;
    }

    public function addPerfilRecomendado(PerfilRecomendado $perfilRecomendado): static
    {
        if (! $this->perfisRecomendados->contains($perfilRecomendado)) {
            $this->perfisRecomendados->add($perfilRecomendado);
            $perfilRecomendado->setCampanha($this);
        }

        return $this;
    }

    public function removePerfilRecomendado(PerfilRecomendado $perfilRecomendado): static
    {
        if ($this->perfisRecomendados->removeElement($perfilRecomendado)) {
            // set the owning side to null (unless already changed)
            if ($perfilRecomendado->getCampanha() === $this) {
                $perfilRecomendado->setCampanha(null);
            }
        }

        return $this;
    }

    public function isActive(): bool
    {
        $hoje = new \DateTime();

        return $hoje >= $this->getDtInicio() && $hoje <= $this->getDtFim();
    }



    /**
     * Calcula o status da campanha baseado nas datas de início e fim.
     * 
     * @return string O status da campanha: 'agendada', 'andamento' ou 'finalizada' || Não existe status no banco é feito o calculo das datas
     */
    public function getStatus(): string
    {
        if ($this->status) {
            return $this->status;
        }
        $now = new \DateTime();
        $dataInicio = new \DateTime($this->dt_inicio);
        $dataFim = new \DateTime($this->dt_fim);

        // Campanha ainda não iniciou
        if ($dataInicio > $now) {
            return StatusCampanhaEnum::AGENDADA->value;
        }

        // Campanha está em andamento
        if ($dataInicio <= $now && $dataFim >= $now) {
            return StatusCampanhaEnum::ANDAMENTO->value;
        }

        // Campanha já finalizou
        return StatusCampanhaEnum::FINALIZADA->value;
    }

    /**
     * @param string $status
     * 
     * @return static
     */
    public function setStatus(?string $status): static
    {
        $this->status = $status;
        return $this;
    }
}
