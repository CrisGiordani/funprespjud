<?php

namespace App\DTO\Trust\Output;

use Symfony\Component\Serializer\Annotation\Groups;

class PatrimonioOutputDTO
{
    #[Groups(['patrimonio:read'])]
    private ?float $totalContribuidoParticipanteRan = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalRentabilizadoParticipanteRan = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalContribuidoPatrocinadorRan = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalRentabilizadoPatrocinadorRan = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalContribuidoParticipanteRas = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalRentabilizadoParticipanteRas = null;

    #[Groups(['patrimonio:read'])]
    private ?float $rentabilidade = null;

    #[Groups(['patrimonio:read'])]
    private ?float $rentabilidadePercentual = null;

    #[Groups(['patrimonio:read'])]
    private ?float $patrimonioTotal = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalContribuidoParticipante = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalContribuidoPatrocinador = null;

    #[Groups(['patrimonio:read'])]
    private ?float $totalContribuido = null;

    #[Groups(['patrimonio:read'])]
    private ?float $aumentoPatrimonialParticipante = null;

    #[Groups(['patrimonio:read'])]
    private ?float $aumentoPatrimonialParticipantePercentual = null;

    #[Groups(['patrimonio:read'])]
    private ?float $percentualRentabilidadeParticipanteRan = null;

    #[Groups(['patrimonio:read'])]
    private ?float $percentualRentabilidadePatrocinadorRan = null;

    #[Groups(['patrimonio:read'])]
    private ?float $percentualRentabilidadeParticipanteRas = null;

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $this->patrimonioTotal = $data['patrimonioTotal'] ?? null;
        $this->totalContribuidoParticipante = $data['totalContribuidoParticipante'] ?? null;
        $this->totalContribuidoPatrocinador = $data['contribuicaoNormalPatrocinadorRan']['totalContribuido'] ?? null;
        $this->totalContribuido = $data['totalContribuido'] ?? null;
        $this->rentabilidade = $data['rentabilidade'] ?? null;
        $this->rentabilidadePercentual = $data['rentabilidadePercentual'] ?? null;
        $this->aumentoPatrimonialParticipante = $data['aumentoPatrimonialParticipante'] ?? null;
        $this->aumentoPatrimonialParticipantePercentual = $data['aumentoPatrimonialParticipantePercentual'] ?? null;
        $this->totalContribuidoParticipanteRan = $data['contribuicaoNormalParticipanteRan']['totalContribuido'] ?? null;
        $this->totalRentabilizadoParticipanteRan = $data['contribuicaoNormalParticipanteRan']['totalRentabilizado'] ?? null;
        $this->percentualRentabilidadeParticipanteRan = $data['contribuicaoNormalParticipanteRan']['percentualRentabilidade'] ?? null;
        $this->totalContribuidoPatrocinadorRan = $data['contribuicaoNormalPatrocinadorRan']['totalContribuido'] ?? null;
        $this->totalRentabilizadoPatrocinadorRan = $data['contribuicaoNormalPatrocinadorRan']['totalRentabilizado'] ?? null;
        $this->percentualRentabilidadePatrocinadorRan = $data['contribuicaoNormalPatrocinadorRan']['percentualRentabilidade'] ?? null;
        $this->totalContribuidoParticipanteRas = $data['contribuicaoNormalParticipanteRas']['totalContribuido'] ?? null;
        $this->totalRentabilizadoParticipanteRas = $data['contribuicaoNormalParticipanteRas']['totalRentabilizado'] ?? null;
        $this->percentualRentabilidadeParticipanteRas = $data['contribuicaoNormalParticipanteRas']['percentualRentabilidade'] ?? null;
    }

    public function getTotalContribuidoParticipanteRan(): ?float
    {
        return $this->totalContribuidoParticipanteRan;
    }

    public function setTotalContribuidoParticipanteRan(?float $totalContribuidoParticipanteRan): self
    {
        $this->totalContribuidoParticipanteRan = $totalContribuidoParticipanteRan;

        return $this;
    }

    public function getTotalRentabilizadoParticipanteRan(): ?float
    {
        return $this->totalRentabilizadoParticipanteRan;
    }

    public function setTotalRentabilizadoParticipanteRan(?float $totalRentabilizadoParticipanteRan): self
    {
        $this->totalRentabilizadoParticipanteRan = $totalRentabilizadoParticipanteRan;

        return $this;
    }

    public function getTotalContribuidoPatrocinadorRan(): ?float
    {
        return $this->totalContribuidoPatrocinadorRan;
    }

    public function setTotalContribuidoPatrocinadorRan(?float $totalContribuidoPatrocinadorRan): self
    {
        $this->totalContribuidoPatrocinadorRan = $totalContribuidoPatrocinadorRan;

        return $this;
    }

    public function getTotalRentabilizadoPatrocinadorRan(): ?float
    {
        return $this->totalRentabilizadoPatrocinadorRan;
    }

    public function setTotalRentabilizadoPatrocinadorRan(?float $totalRentabilizadoPatrocinadorRan): self
    {
        $this->totalRentabilizadoPatrocinadorRan = $totalRentabilizadoPatrocinadorRan;

        return $this;
    }

    public function getTotalContribuidoParticipanteRas(): ?float
    {
        return $this->totalContribuidoParticipanteRas;
    }

    public function setTotalContribuidoParticipanteRas(?float $totalContribuidoParticipanteRas): self
    {
        $this->totalContribuidoParticipanteRas = $totalContribuidoParticipanteRas;

        return $this;
    }

    public function getTotalRentabilizadoParticipanteRas(): ?float
    {
        return $this->totalRentabilizadoParticipanteRas;
    }

    public function setTotalRentabilizadoParticipanteRas(?float $totalRentabilizadoParticipanteRas): self
    {
        $this->totalRentabilizadoParticipanteRas = $totalRentabilizadoParticipanteRas;

        return $this;
    }

    public function getRentabilidade(): ?float
    {
        return $this->rentabilidade;
    }

    public function setRentabilidade(?float $rentabilidade): self
    {
        $this->rentabilidade = $rentabilidade;

        return $this;
    }

    public function getRentabilidadePercentual(): ?float
    {
        return $this->rentabilidadePercentual;
    }

    public function setRentabilidadePercentual(?float $rentabilidadePercentual): self
    {
        $this->rentabilidadePercentual = $rentabilidadePercentual;

        return $this;
    }

    public function getPatrimonioTotal(): ?float
    {
        return $this->patrimonioTotal;
    }

    public function setPatrimonioTotal(?float $patrimonioTotal): self
    {
        $this->patrimonioTotal = $patrimonioTotal;

        return $this;
    }

    public function getTotalContribuidoParticipante(): ?float
    {
        return $this->totalContribuidoParticipante;
    }

    public function setTotalContribuidoParticipante(?float $totalContribuidoParticipante): self
    {
        $this->totalContribuidoParticipante = $totalContribuidoParticipante;

        return $this;
    }

    public function getTotalContribuidoPatrocinador(): ?float
    {
        return $this->totalContribuidoPatrocinador;
    }

    public function setTotalContribuidoPatrocinador(?float $totalContribuidoPatrocinador): self
    {
        $this->totalContribuidoPatrocinador = $totalContribuidoPatrocinador;

        return $this;
    }

    public function getTotalContribuido(): ?float
    {
        return $this->totalContribuido;
    }

    public function setTotalContribuido(?float $totalContribuido): self
    {
        $this->totalContribuido = $totalContribuido;

        return $this;
    }

    public function getAumentoPatrimonialParticipante(): ?float
    {
        return $this->aumentoPatrimonialParticipante;
    }

    public function setAumentoPatrimonialParticipante(?float $aumentoPatrimonialParticipante): self
    {
        $this->aumentoPatrimonialParticipante = $aumentoPatrimonialParticipante;

        return $this;
    }

    public function getAumentoPatrimonialParticipantePercentual(): ?float
    {
        return $this->aumentoPatrimonialParticipantePercentual;
    }

    public function setAumentoPatrimonialParticipantePercentual(?float $aumentoPatrimonialParticipantePercentual): self
    {
        $this->aumentoPatrimonialParticipantePercentual = $aumentoPatrimonialParticipantePercentual;

        return $this;
    }

    public function getPercentualRentabilidadeParticipanteRan(): ?float
    {
        return $this->percentualRentabilidadeParticipanteRan;
    }

    public function setPercentualRentabilidadeParticipanteRan(?float $percentualRentabilidadeParticipanteRan): self
    {
        $this->percentualRentabilidadeParticipanteRan = $percentualRentabilidadeParticipanteRan;

        return $this;
    }

    public function getPercentualRentabilidadePatrocinadorRan(): ?float
    {
        return $this->percentualRentabilidadePatrocinadorRan;
    }

    public function setPercentualRentabilidadePatrocinadorRan(?float $percentualRentabilidadePatrocinadorRan): self
    {
        $this->percentualRentabilidadePatrocinadorRan = $percentualRentabilidadePatrocinadorRan;

        return $this;
    }

    public function getPercentualRentabilidadeParticipanteRas(): ?float
    {
        return $this->percentualRentabilidadeParticipanteRas;
    }

    public function setPercentualRentabilidadeParticipanteRas(?float $percentualRentabilidadeParticipanteRas): self
    {
        $this->percentualRentabilidadeParticipanteRas = $percentualRentabilidadeParticipanteRas;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'patrimonioTotal' => $this->patrimonioTotal,
            'totalContribuidoParticipante' => $this->totalContribuidoParticipante,
            'totalContribuidoPatrocinador' => $this->totalContribuidoPatrocinador,
            'totalContribuido' => $this->totalContribuido,
            'rentabilidade' => $this->rentabilidade,
            'rentabilidadePercentual' => $this->rentabilidadePercentual,
            'aumentoPatrimonialParticipante' => $this->aumentoPatrimonialParticipante,
            'aumentoPatrimonialParticipantePercentual' => $this->aumentoPatrimonialParticipantePercentual,
            'contribuicaoNormalParticipanteRan' => [
                'totalContribuido' => $this->totalContribuidoParticipanteRan,
                'totalRentabilizado' => $this->totalRentabilizadoParticipanteRan,
                'percentualRentabilidade' => $this->percentualRentabilidadeParticipanteRan,
            ],
            'contribuicaoNormalPatrocinadorRan' => [
                'totalContribuido' => $this->totalContribuidoPatrocinadorRan,
                'totalRentabilizado' => $this->totalRentabilizadoPatrocinadorRan,
                'percentualRentabilidade' => $this->percentualRentabilidadePatrocinadorRan,
            ],
            'contribuicaoNormalParticipanteRas' => [
                'totalContribuido' => $this->totalContribuidoParticipanteRas,
                'totalRentabilizado' => $this->totalRentabilizadoParticipanteRas,
                'percentualRentabilidade' => $this->percentualRentabilidadeParticipanteRas,
            ],
        ];
    }
}
