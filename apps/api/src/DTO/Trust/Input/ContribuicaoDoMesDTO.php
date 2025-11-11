<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Validator\Constraints as Assert;

class ContribuicaoDoMesDTO
{
    #[Assert\Regex(
        pattern: '/^\d{2}\/\d{4}$/',
        message: 'A o mês e ano deve estar no formato mm/aaaa'
    )]
    private string $mesAnoCompetencia;

    private string $contribuicaoTotal;
    private string $contribuicaoParticipante;
    private string $contribuicaoPatrocinador;
    private string $dataUltimoAporte;

    public function __construct(array $data = [])
    {
        $this->mesAnoCompetencia = $data['mesAnoCompetencia'];
        $this->contribuicaoTotal = $data['contribuicaoTotal'];
        $this->contribuicaoParticipante = $data['contribuicaoParticipante'] ?? 0;
        $this->contribuicaoPatrocinador = $data['contribuicaoPatrocinador'] ?? 0;
        $this->dataUltimoAporte = $data['dataUltimoAporte'] ?? null;
    }

    public function getMesAnoCompetencia(): string
    {
        return $this->mesAnoCompetencia;
    }

    public function setMesAnoCompetencia(string $mesAnoCompetencia): self
    {
        $this->mesAnoCompetencia = $mesAnoCompetencia;

        return $this;
    }

    public function getContribuicaoTotal(): string
    {
        return $this->contribuicaoTotal;
    }

    public function getContribuicaoParticipante(): string
    {
        return $this->contribuicaoParticipante;
    }

    public function setContribuicaoParticipante(string $contribuicaoParticipante): self
    {
        $this->contribuicaoParticipante = $contribuicaoParticipante;

        return $this;
    }

    public function getContribuicaoPatrocinador(): string
    {
        return $this->contribuicaoPatrocinador;
    }

    public function setContribuicaoPatrocinador(string $contribuicaoPatrocinador): self
    {
        $this->contribuicaoPatrocinador = $contribuicaoPatrocinador;

        return $this;
    }

    public function getDataUltimoAporte(): ?string
    {
        return $this->dataUltimoAporte;
    }

    public function setDataUltimoAporte(?string $dataUltimoAporte): self
    {
        $this->dataUltimoAporte = $dataUltimoAporte;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'mesAnoCompetencia' => $this->mesAnoCompetencia,
            'contribuicaoTotal' => $this->contribuicaoTotal,
            'contribuicaoParticipante' => $this->contribuicaoParticipante,
            'contribuicaoPatrocinador' => $this->contribuicaoPatrocinador,
            'dataUltimoAporte' => $this->dataUltimoAporte,
        ];
    }
}
