<?php

namespace App\DTO\Trust\Output;

use App\Helper\NumberHelper;
use Symfony\Component\Serializer\Annotation\Groups;

class SaldoOutputDTO
{
    #[Groups(['saldo:read'])]
    private ?float $saldo = null;

    #[Groups(['saldoPatrimonio:read'])]
    private ?float $contribuicaoNormalParticipanteRAN = null;

    #[Groups(['saldoPatrimonio:read'])]
    private ?float $contribuicaoNormalParticipanteRentabilizadoRAN = null;

    #[Groups(['saldoPatrimonio:read'])]
    private ?float $contribuicaoNormalParticipanteRAS = null;

    #[Groups(['saldoPatrimonio:read'])]
    private ?float $contribuicaoNormalParticipanteRentabilizadoRAS = null;

    #[Groups(['saldoPatrimonio:read'])]
    private ?float $contribuicaoNormalPatrocinadorRAN = null;

    #[Groups(['saldoPatrimonio:read'])]
    private ?float $contribuicaoNormalPatrocinadorRentabilizadoRAN = null;


    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $this->saldo = $data['saldo'] ?? null;
        $this->contribuicaoNormalParticipanteRAN = $data['contribuicaoNormalParticipanteRan']['totalContribuido'] ?? null;
        $this->contribuicaoNormalParticipanteRentabilizadoRAN = $data['contribuicaoNormalParticipanteRan']['totalRentabilizado'] ?? null;
        $this->contribuicaoNormalParticipanteRAS = $data['contribuicaoNormalParticipanteRas']['totalContribuido'] ?? null;
        $this->contribuicaoNormalParticipanteRentabilizadoRAS = $data['contribuicaoNormalParticipanteRas']['totalRentabilizado'] ?? null;
        $this->contribuicaoNormalPatrocinadorRAN = $data['contribuicaoNormalPatrocinadorRan']['totalContribuido'] ?? null;
        $this->contribuicaoNormalPatrocinadorRentabilizadoRAN = $data['contribuicaoNormalPatrocinadorRan']['totalRentabilizado'] ?? null;
    }

    public function getSaldo(): ?float
    {
        return $this->saldo;
    }

    public function setSaldo(?float $saldo): self
    {
        $this->saldo = $saldo;

        return $this;
    }

    public function getContribuicaoNormalParticipanteRAN(): ?float
    {
        return $this->contribuicaoNormalParticipanteRAN;
    }

    public function setContribuicaoNormalParticipanteRAN(?float $contribuicaoNormalParticipanteRAN): self
    {
        $this->contribuicaoNormalParticipanteRAN = $contribuicaoNormalParticipanteRAN;

        return $this;
    }

    public function getContribuicaoNormalParticipanteRentabilizadoRAN(): ?float
    {
        return $this->contribuicaoNormalParticipanteRentabilizadoRAN;
    }

    public function setContribuicaoNormalParticipanteRentabilizadoRAN(?float $contribuicaoNormalParticipanteRentabilizadoRAN): self
    {
        $this->contribuicaoNormalParticipanteRentabilizadoRAN = $contribuicaoNormalParticipanteRentabilizadoRAN;

        return $this;
    }

    public function getContribuicaoNormalParticipanteRAS(): ?float
    {
        return $this->contribuicaoNormalParticipanteRAS;
    }

    public function setContribuicaoNormalParticipanteRAS(?float $contribuicaoNormalParticipanteRAS): self
    {
        $this->contribuicaoNormalParticipanteRAS = $contribuicaoNormalParticipanteRAS;

        return $this;
    }

    public function getContribuicaoNormalParticipanteRentabilizadoRAS(): ?float
    {
        return $this->contribuicaoNormalParticipanteRentabilizadoRAS;
    }

    public function setContribuicaoNormalParticipanteRentabilizadoRAS(?float $contribuicaoNormalParticipanteRentabilizadoRAS): self
    {
        $this->contribuicaoNormalParticipanteRentabilizadoRAS = $contribuicaoNormalParticipanteRentabilizadoRAS;

        return $this;
    }

    public function getContribuicaoNormalPatrocinadorRAN(): ?float
    {
        return $this->contribuicaoNormalPatrocinadorRAN;
    }

    public function setContribuicaoNormalPatrocinadorRAN(?float $contribuicaoNormalPatrocinadorRAN): self
    {
        $this->contribuicaoNormalPatrocinadorRAN = $contribuicaoNormalPatrocinadorRAN;

        return $this;
    }

    public function getContribuicaoNormalPatrocinadorRentabilizadoRAN(): ?float
    {
        return $this->contribuicaoNormalPatrocinadorRentabilizadoRAN;
    }

    public function setContribuicaoNormalPatrocinadorRentabilizadoRAN(?float $contribuicaoNormalPatrocinadorRentabilizadoRAN): self
    {
        $this->contribuicaoNormalPatrocinadorRentabilizadoRAN = $contribuicaoNormalPatrocinadorRentabilizadoRAN;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'saldo' => $this->saldo,
            'contribuicaoNormalParticipanteRAN' => NumberHelper::round($this->contribuicaoNormalParticipanteRAN),
            'contribuicaoNormalParticipanteRentabilizadoRAN' => NumberHelper::round($this->contribuicaoNormalParticipanteRentabilizadoRAN),
            'contribuicaoNormalParticipanteRAS' => NumberHelper::round($this->contribuicaoNormalParticipanteRAS),
            'contribuicaoNormalParticipanteRentabilizadoRAS' => NumberHelper::round($this->contribuicaoNormalParticipanteRentabilizadoRAS),
            'contribuicaoNormalPatrocinadorRAN' => NumberHelper::round($this->contribuicaoNormalPatrocinadorRAN),
            'contribuicaoNormalPatrocinadorRentabilizadoRAN' => NumberHelper::round($this->contribuicaoNormalPatrocinadorRentabilizadoRAN),

        ];
    }
}
