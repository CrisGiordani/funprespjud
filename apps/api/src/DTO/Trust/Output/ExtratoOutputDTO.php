<?php

namespace App\DTO\Trust\Output;

use Symfony\Component\Serializer\Annotation\Groups;

class ExtratoOutputDTO
{
    #[Groups(['extrato:read'])]
    private ?string $contribuidor = null;

    #[Groups(['extrato:read'])]
    private ?string $patrocinador = null;

    #[Groups(['extrato:read'])]
    private ?string $dtRecolhimento = null;

    #[Groups(['extrato:read'])]
    private ?string $tipoContribuicao = null;

    #[Groups(['extrato:read'])]
    private ?float $valorContribuicao = null;

    #[Groups(['extrato:read'])]
    private ?float $taxaCarregamento = null;

    #[Groups(['extrato:read'])]
    private ?float $fcbe = null;

    #[Groups(['extrato:read'])]
    private ?float $car = null;

    #[Groups(['extrato:read'])]
    private ?float $ran = null;

    #[Groups(['extrato:read'])]
    private ?float $ras = null;

    #[Groups(['extrato:read'])]
    private ?float $ranCotas = null;

    #[Groups(['extrato:read'])]
    private ?float $rasCotas = null;

    #[Groups(['extrato:read'])]
    private ?float $rentabilidade = null;

    #[Groups(['extrato:read'])]
    private ?string $competencia = null;

    #[Groups(['extrato:read'])]
    private ?string $mesCompetencia = null;

    #[Groups(['extrato:read'])]
    private ?string $anoCompetencia = null;

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $this->contribuidor = $data['contribuidor'] ?? null;
        $this->patrocinador = $data['patrocinador'] ?? null;
        $this->dtRecolhimento = $data['dtRecolhimento'] ?? null;
        $this->tipoContribuicao = $data['tipoContribuicao'] ?? null;
        $this->valorContribuicao = $data['valorContribuicao'] ?? null;
        $this->taxaCarregamento = $data['taxaCarregamento'] ?? null;
        $this->fcbe = $data['fcbe'] ?? null;
        $this->car = $data['car'] ?? null;
        $this->ran = $data['ran'] ?? null;
        $this->ras = $data['ras'] ?? null;
        $this->ranCotas = $data['ranCotas'] ?? null;
        $this->rasCotas = $data['rasCotas'] ?? null;
        $this->rentabilidade = $data['rentabilidade'] ?? null;
        $this->competencia = $data['competencia'] ?? null;
        $this->mesCompetencia = $data['mesCompetencia'] ?? null;
        $this->anoCompetencia = $data['anoCompetencia'] ?? null;
    }

    public function getContribuidor(): ?string
    {
        return $this->contribuidor;
    }

    public function setContribuidor(?string $contribuidor): self
    {
        $this->contribuidor = $contribuidor;

        return $this;
    }

    public function getPatrocinador(): ?string
    {
        return $this->patrocinador;
    }

    public function setPatrocinador(?string $patrocinador): self
    {
        $this->patrocinador = $patrocinador;

        return $this;
    }

    public function getDtRecolhimento(): ?string
    {
        return $this->dtRecolhimento;
    }

    public function setDtRecolhimento(?string $dtRecolhimento): self
    {
        $this->dtRecolhimento = $dtRecolhimento;

        return $this;
    }

    public function getTipoContribuicao(): ?string
    {
        return $this->tipoContribuicao;
    }

    public function setTipoContribuicao(?string $tipoContribuicao): self
    {
        $this->tipoContribuicao = $tipoContribuicao;

        return $this;
    }

    public function getValorContribuicao(): ?float
    {
        return $this->valorContribuicao;
    }

    public function setValorContribuicao(?float $valorContribuicao): self
    {
        $this->valorContribuicao = $valorContribuicao;

        return $this;
    }

    public function getTaxaCarregamento(): ?float
    {
        return $this->taxaCarregamento;
    }

    public function setTaxaCarregamento(?float $taxaCarregamento): self
    {
        $this->taxaCarregamento = $taxaCarregamento;

        return $this;
    }

    public function getFcbe(): ?float
    {
        return $this->fcbe;
    }

    public function setFcbe(?float $fcbe): self
    {
        $this->fcbe = $fcbe;

        return $this;
    }

    public function getCar(): ?float
    {
        return $this->car;
    }

    public function setCar(?float $car): self
    {
        $this->car = $car;

        return $this;
    }

    public function getRan(): ?float
    {
        return $this->ran;
    }

    public function setRan(?float $ran): self
    {
        $this->ran = $ran;

        return $this;
    }

    public function getRas(): ?float
    {
        return $this->ras;
    }

    public function setRas(?float $ras): self
    {
        $this->ras = $ras;

        return $this;
    }

    public function getRanCotas(): ?float
    {
        return $this->ranCotas;
    }

    public function setRanCotas(?float $ranCotas): self
    {
        $this->ranCotas = $ranCotas;

        return $this;
    }

    public function getRasCotas(): ?float
    {
        return $this->rasCotas;
    }

    public function setRasCotas(?float $rasCotas): self
    {
        $this->rasCotas = $rasCotas;

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

    public function getCompetencia(): ?string
    {
        return $this->competencia;
    }

    public function setCompetencia(?string $competencia): self
    {
        $this->competencia = $competencia;

        return $this;
    }

    public function getMesCompetencia(): ?string
    {
        return $this->mesCompetencia;
    }

    public function setMesCompetencia(?string $mesCompetencia): self
    {
        $this->mesCompetencia = $mesCompetencia;

        return $this;
    }

    public function getAnoCompetencia(): ?string
    {
        return $this->anoCompetencia;
    }

    public function setAnoCompetencia(?string $anoCompetencia): self
    {
        $this->anoCompetencia = $anoCompetencia;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'contribuidor' => $this->contribuidor,
            'patrocinador' => $this->patrocinador,
            'dtRecolhimento' => $this->dtRecolhimento,
            'tipoContribuicao' => $this->tipoContribuicao,
            'valorContribuicao' => $this->valorContribuicao,
            'taxaCarregamento' => $this->taxaCarregamento,
            'fcbe' => $this->fcbe,
            'car' => $this->car,
            'ran' => $this->ran,
            'ras' => $this->ras,
            'ranCotas' => $this->ranCotas,
            'rasCotas' => $this->rasCotas,
            'rentabilidade' => $this->rentabilidade,
            'competencia' => $this->competencia,
            'mesCompetencia' => $this->mesCompetencia,
            'anoCompetencia' => $this->anoCompetencia,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
