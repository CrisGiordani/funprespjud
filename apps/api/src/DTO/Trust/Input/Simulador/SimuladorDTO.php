<?php

namespace App\DTO\Trust\Input\Simulador;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class SimuladorDTO
{
    #[Groups(['simulador:read'])]
    #[Assert\NotBlank(message: 'O CPF é obrigatório')]
    #[Assert\Regex(
        pattern: '/^\d{11}$/',
        message: 'O CPF deve conter 11 dígitos'
    )]
    private ?string $cpf = null;

    #[Groups(['simulador:read'])]
    #[Assert\NotBlank(message: 'A data de nascimento é obrigatória')]
    private ?string $dataNascimento = null;

    #[Groups(['simulador:read'])]
    #[Assert\NotBlank(message: 'O sexo é obrigatório')]
    #[Assert\Choice(['M', 'F'], message: 'O sexo deve ser M ou F')]
    private ?string $sexo = null;

    #[Groups(['simulador:read'])]
    #[Assert\NotBlank(message: 'A idade de aposentadoria é obrigatória')]
    #[Assert\Range(
        min: 48,
        max: 75,
        notInRangeMessage: 'A idade de aposentadoria deve estar entre {{ min }} e {{ max }} anos'
    )]
    private ?int $idadeAposentadoria = null;

    #[Groups(['simulador:read'])]
    #[Assert\NotBlank(message: 'A rentabilidade projetada é obrigatória')]
    #[Assert\Range(
        min: 0,
        max: 100,
        notInRangeMessage: 'A rentabilidade projetada deve estar entre {{ min }}% e {{ max }}%'
    )]
    private ?float $rentabilidadeProjetada = null;

    #[Groups(['simulador:read'])]
    private ?float $novaRentabilidadeProjetada = null;

    #[Groups(['simulador:read'])]
    private ?float $percentualContribuicaoNormal = null;

    #[Groups(['simulador:read'])]
    private ?float $percentualContribuicaoFacultativa = null;

    #[Groups(['simulador:read'])]
    private ?float $aporteExtraordinario = null;

    #[Groups(['simulador:read'])]
    private ?int $prazoRecebimento = null;

    #[Groups(['simulador:read'])]
    private ?float $saqueReserva = null;

    #[Groups(['simulador:read'])]
    private ?float $salarioParticipante = null;

    #[Groups(['simulador:read'])]
    private ?string $perfilDeInvestimentoRecomendadoSimulador = null;

    #[Groups(['simulador:read'])]
    private ?string $novoPerfilDeInvestimentoSimulador = null;

    public function __construct(array $data = [])
    {
        $this->cpf = $data['cpf'] ?? null;
        $this->dataNascimento = $data['dataNascimento'] ?? null;
        $this->sexo = $data['sexo'] ?? null;
        $this->idadeAposentadoria = isset($data['idadeAposentadoria']) ? (int)$data['idadeAposentadoria'] : null;
        $this->rentabilidadeProjetada = isset($data['rentabilidadeProjetada']) ? (float)$data['rentabilidadeProjetada'] : null;
        $this->novaRentabilidadeProjetada = isset($data['novaRentabilidadeProjetada']) ? (float)$data['novaRentabilidadeProjetada'] : null;
        $this->percentualContribuicaoNormal = isset($data['percentualContribuicaoNormal']) ? (float)$data['percentualContribuicaoNormal'] : null;
        $this->percentualContribuicaoFacultativa = isset($data['percentualContribuicaoFacultativa']) ? (float)$data['percentualContribuicaoFacultativa'] : null;
        $this->aporteExtraordinario = isset($data['aporteExtraordinario']) ? (float)$data['aporteExtraordinario'] : null;
        $this->prazoRecebimento = isset($data['prazoRecebimento']) ? (int)$data['prazoRecebimento'] : null;
        $this->saqueReserva = isset($data['saqueReserva']) ? (float)$data['saqueReserva'] : null;
        $this->salarioParticipante = isset($data['salarioParticipante']) ? (float)$data['salarioParticipante'] : null;
        $this->perfilDeInvestimentoRecomendadoSimulador = $data['perfilDeInvestimentoRecomendadoSimulador'] ?? null;
        $this->novoPerfilDeInvestimentoSimulador = $data['novoPerfilDeInvestimentoSimulador'] ?? null;
    }

    public function getCpf(): ?string
    {
        return $this->cpf;
    }

    public function setCpf(?string $cpf): self
    {
        $this->cpf = $cpf;

        return $this;
    }

    public function getDataNascimento(): ?string
    {
        return $this->dataNascimento;
    }

    public function setDataNascimento(?string $dataNascimento): self
    {
        $this->dataNascimento = $dataNascimento;

        return $this;
    }

    public function getSexo(): ?string
    {
        return $this->sexo;
    }

    public function setSexo(?string $sexo): self
    {
        $this->sexo = $sexo;

        return $this;
    }

    public function getIdadeAposentadoria(): ?int
    {
        return $this->idadeAposentadoria;
    }

    public function setIdadeAposentadoria(?int $idadeAposentadoria): self
    {
        $this->idadeAposentadoria = $idadeAposentadoria;

        return $this;
    }

    public function getRentabilidadeProjetada(): ?float
    {
        return $this->rentabilidadeProjetada;
    }

    public function setRentabilidadeProjetada(?float $rentabilidadeProjetada): self
    {
        $this->rentabilidadeProjetada = $rentabilidadeProjetada;

        return $this;
    }

    public function getNovaRentabilidadeProjetada(): ?float
    {
        return $this->novaRentabilidadeProjetada;
    }

    public function setNovaRentabilidadeProjetada(?float $novaRentabilidadeProjetada): self
    {
        $this->novaRentabilidadeProjetada = $novaRentabilidadeProjetada;

        return $this;
    }

    public function getPercentualContribuicaoNormal(): ?float
    {
        return $this->percentualContribuicaoNormal;
    }

    public function setPercentualContribuicaoNormal(?float $percentualContribuicaoNormal): self
    {
        $this->percentualContribuicaoNormal = $percentualContribuicaoNormal;

        return $this;
    }

    public function getPercentualContribuicaoFacultativa(): ?float
    {
        return $this->percentualContribuicaoFacultativa;
    }

    public function setPercentualContribuicaoFacultativa(?float $percentualContribuicaoFacultativa): self
    {
        $this->percentualContribuicaoFacultativa = $percentualContribuicaoFacultativa;

        return $this;
    }

    public function getAporteExtraordinario(): ?float
    {
        return $this->aporteExtraordinario;
    }

    public function setAporteExtraordinario(?float $aporteExtraordinario): self
    {
        $this->aporteExtraordinario = $aporteExtraordinario;

        return $this;
    }

    public function getPrazoRecebimento(): ?int
    {
        return $this->prazoRecebimento;
    }

    public function setPrazoRecebimento(?int $prazoRecebimento): self
    {
        $this->prazoRecebimento = $prazoRecebimento;

        return $this;
    }

    public function getSaqueReserva(): ?float
    {
        return $this->saqueReserva;
    }

    public function setSaqueReserva(?float $saqueReserva): self
    {
        $this->saqueReserva = $saqueReserva;

        return $this;
    }

    public function getSalarioParticipante(): ?float
    {
        return $this->salarioParticipante;
    }

    public function setSalarioParticipante(?float $salarioParticipante): self
    {
        $this->salarioParticipante = $salarioParticipante;

        return $this;
    }

    public function getPerfilDeInvestimentoRecomendadoSimulador(): ?string
    {
        return $this->perfilDeInvestimentoRecomendadoSimulador;
    }

    public function setPerfilDeInvestimentoRecomendadoSimulador(?string $perfil): self
    {
        $this->perfilDeInvestimentoRecomendadoSimulador = $perfil;

        return $this;
    }

    public function getNovoPerfilDeInvestimentoSimulador(): ?string
    {
        return $this->novoPerfilDeInvestimentoSimulador;
    }

    public function setNovoPerfilDeInvestimentoSimulador(?string $novoPerfil): self
    {
        $this->novoPerfilDeInvestimentoSimulador = $novoPerfil;

        return $this;
    }

    /**
     * Valida os dados do DTO
     * @throws \InvalidArgumentException
     */
    public function validate(): void
    {
        $this->validarInput();
    }

    /**
     * Valida os dados de entrada
     * @throws \InvalidArgumentException
     */
    private function validarInput(): void
    {
        $this->validarIdadeAposentadoria($this->idadeAposentadoria);
        $this->validarRentabilidade($this->rentabilidadeProjetada);
    }

    /**
     * Valida a idade de aposentadoria
     * @throws \InvalidArgumentException
     */
    private function validarIdadeAposentadoria(?int $idade): void
    {
        if ($idade === null) {
            throw new \InvalidArgumentException('A idade de aposentadoria é obrigatória');
        }

        if ($idade < 48 || $idade > 75) {
            throw new \InvalidArgumentException('A idade de aposentadoria deve estar entre 48 e 75 anos');
        }
    }

    /**
     * Valida a rentabilidade projetada
     * @throws \InvalidArgumentException
     */
    private function validarRentabilidade(?float $rentabilidade): void
    {
        if ($rentabilidade === null) {
            throw new \InvalidArgumentException('A rentabilidade projetada é obrigatória');
        }

        if ($rentabilidade < 0 || $rentabilidade > 100) {
            throw new \InvalidArgumentException('A rentabilidade projetada deve estar entre 0% e 100%');
        }
    }
}
