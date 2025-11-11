<?php

namespace App\DTO\Trust\Output;

use Symfony\Component\Serializer\Annotation\Groups;

class SimuladorOutputDTO
{
    #[Groups(['simulador:output'])]
    private array $dadosSimulacao = [];

    #[Groups(['simulador:output'])]
    private array $dadosParticipante = [];

    #[Groups(['simulador:output'])]
    private array $informacoesAdicionais = [];

    #[Groups(['simulador:output'])]
    private array $planoCusteioVigente = [];

    #[Groups(['simulador:output'])]
    private string $tetoRPPS = '0';

    #[Groups(['simulador:output'])]
    private array $contribuicoesSimuladas = [];

    #[Groups(['simulador:output'])]
    private array $saldosEBeneficios = [];

    #[Groups(['simulador:output'])]
    private array $contribuicoesMensaisParticipante = [];

    #[Groups(['simulador:output'])]
    private array $beneficios = [];

    #[Groups(['simulador:output'])]
    private array $performance = [];

    #[Groups(['simulador:output'])]
    private array $beneficioLiquido = [];

    /**
     * @var array<string, float>|null
     */
    #[Groups(['simulador:output'])]
    private ?array $saldoRentabilizado = null;

    /**
     * @var array<string, float>|null
     */
    #[Groups(['simulador:output'])]
    private ?array $saldoProjetado = null;

    /**
     * @var array<string, float>|null
     */
    #[Groups(['simulador:output'])]
    private ?array $totalRentabilizado = null;

    /**
     * @var array<string, float>|null
     */
    #[Groups(['simulador:output'])]
    private ?array $beneficioAposentadoriaNormal = null;

    /**
     * @var array<string, float>|null
     */
    #[Groups(['simulador:output'])]
    private ?array $beneficioSuplementar = null;

    #[Groups(['simulador:output'])]
    private ?array $urp = null;

    public function __construct()
    {
        $this->saldosEBeneficios = [
            'saldo_normal_total' => 0,
            'beneficio_normal_mensal' => 0,
            'saldo_suplementar_total' => 0,
            'beneficio_suplementar_mensal' => 0,
            'saldo_total' => 0,
            'beneficio_mensal_total' => 0,
        ];

        $this->saldoRentabilizado = [
            'saldoRanRentabilizado' => 0,
            'beneficioNormalBruto' => 0,
            'saldoRasRentabilizado' => 0,
            'beneficioSuplementarBruto' => 0,
        ];

        $this->saldoProjetado = [
            'saldoProjetadoCotasRanParticipante' => 0,
            'saldoProjetadoCotasRanPatrocinador' => 0,
            'saldoProjetadoCotasRasParticipante' => 0,
            'valorCotaProjetado' => 0,
            'saldoProjetadoRanParticipante' => 0,
            'saldoProjetadoRanPatrocinador' => 0,
            'saldoProjetadoRasParticipante' => 0,
        ];

        $this->totalRentabilizado = [
            'totalRentabilizadoRanParticipante' => 0,
            'totalRentabilizadoRanPatrocinador' => 0,
            'totalRentabilizadoRasParticipante' => 0,
        ];

        $this->beneficioAposentadoriaNormal = [
            'saldoTotalRan' => 0,
            'fatorSobrevida' => 0,
            'valorBeneficioMensalBruto' => 0,
        ];

        $this->beneficioSuplementar = [
            'saldoRasTotal' => 0,
            'prazo' => 0,
            'percentualSaque' => 0,
            'valorSaque' => 0,
            'valorBeneficioSumplementarMensal' => 0,
        ];

        $this->performance = [
            'anos' => [],
            'performance_atual' => [],
            'performance_simulada' => [],
            'total_atual' => 0,
            'total_simulada' => 0,
        ];

        $this->beneficioLiquido = [
            'beneficio_bruto' => 0,
            'irpf_regressivo' => ['valor' => 0, 'percentual' => 0],
            'contribuicao_administrativa' => ['valor' => 0, 'percentual' => 0],
            'beneficio_liquido' => 0,
        ];
    }

    /**
     * @var array<string, float>|null
     */
    public function getSaldoRentabilizado(): ?array
    {
        return $this->saldoRentabilizado;
    }

    /**
     * @param array<string, float>|null $saldoProjetado
     */
    public function setSaldoRentabilizado(?array $saldoRentabilizado): self
    {
        $this->saldoRentabilizado = $saldoRentabilizado;

        return $this;
    }

    /**
     * @var array<string, float>|null
     */
    public function getSaldoProjetado(): ?array
    {
        return $this->saldoProjetado;
    }

    /**
     * @param array<string, float>|null $saldoProjetado
     */
    public function setSaldoProjetado(?array $saldoProjetado): self
    {
        $this->saldoProjetado = $saldoProjetado;

        return $this;
    }

    /**
     * @return array<string, float>|null
     */
    public function getTotalRentabilizado(): ?array
    {
        return $this->totalRentabilizado;
    }

    /**
     * @param array<string, float>|null $totalRentabilizado
     */
    public function setTotalRentabilizado(?array $totalRentabilizado): self
    {
        $this->totalRentabilizado = $totalRentabilizado;

        return $this;
    }

    /**
     * @return array<string, float>|null
     */
    public function getBeneficioAposentadoriaNormal(): ?array
    {
        return $this->beneficioAposentadoriaNormal;
    }

    /**
     * @param array<string, float>|null $beneficioAposentadoriaNormal
     */
    public function setBeneficioAposentadoriaNormal(?array $beneficioAposentadoriaNormal): self
    {
        $this->beneficioAposentadoriaNormal = $beneficioAposentadoriaNormal;

        return $this;
    }

    /**
     * @return array<string, float>|null
     */
    public function getBeneficioSuplementar(): ?array
    {
        return $this->beneficioSuplementar;
    }

    /**
     * @param array<string, float>|null $beneficioSuplementar
     */
    public function setBeneficioSuplementar(?array $beneficioSuplementar): self
    {
        $this->beneficioSuplementar = $beneficioSuplementar;

        return $this;
    }

    /**
     * Converte o DTO para array
     */
    public function toArray(): array
    {
        return [
            'saldosEBeneficios' => $this->saldosEBeneficios,
            'contribuicoesMensaisParticipante' => $this->contribuicoesMensaisParticipante,
            'beneficios' => $this->beneficios,
            'dadosParticipante' => $this->dadosParticipante,
            'informacoesAdicionais' => $this->informacoesAdicionais,
            'planoCusteioVigente' => $this->planoCusteioVigente,
            'performance' => $this->performance,
            'beneficioLiquido' => $this->beneficioLiquido,
            'dadosSimulacao' => $this->dadosSimulacao,
            'tetoRPPS' => $this->tetoRPPS,
            'contribuicoesSimuladas' => $this->contribuicoesSimuladas,
            'saldoRentabilizado' => $this->saldoRentabilizado,
            'saldoProjetado' => $this->saldoProjetado,
            'totalRentabilizado' => $this->totalRentabilizado,
            'beneficioAposentadoriaNormal' => $this->beneficioAposentadoriaNormal,
            'beneficioSuplementar' => $this->beneficioSuplementar,
            'urp' => $this->urp,
        ];
    }

    public function getTetoRPPS(): string
    {
        return $this->tetoRPPS;
    }

    public function setTetoRPPS(string $tetoRPPS): self
    {
        $this->tetoRPPS = $tetoRPPS;

        return $this;
    }

    public function getDadosSimulacao(): array
    {
        return $this->dadosSimulacao;
    }

    public function setDadosSimulacao(array $dadosSimulacao): self
    {
        $this->dadosSimulacao = $dadosSimulacao;

        return $this;
    }

    public function getContribuicoesSimuladas(): array
    {
        return $this->contribuicoesSimuladas;
    }

    public function setContribuicoesSimuladas(array $contribuicoesSimuladas): self
    {
        $this->contribuicoesSimuladas = $contribuicoesSimuladas;

        return $this;
    }

    public function getSaldosEBeneficios(): array
    {
        return $this->saldosEBeneficios;
    }

    public function setSaldosEBeneficios(array $saldosEBeneficios): self
    {
        $this->saldosEBeneficios = $saldosEBeneficios;

        return $this;
    }

    public function getContribuicoesMensaisParticipante(): array
    {
        return $this->contribuicoesMensaisParticipante;
    }

    public function setContribuicoesMensaisParticipante(array $contribuicoesMensaisParticipante): self
    {
        $this->contribuicoesMensaisParticipante = $contribuicoesMensaisParticipante;

        return $this;
    }

    public function getBeneficios(): array
    {
        return $this->beneficios;
    }

    public function setBeneficios(array $beneficios): self
    {
        $this->beneficios = $beneficios;

        return $this;
    }

    public function getDadosParticipante(): array
    {
        return $this->dadosParticipante;
    }

    public function setDadosParticipante(array $dadosParticipante): self
    {
        $this->dadosParticipante = $dadosParticipante;

        return $this;
    }

    public function getInformacoesAdicionais(): array
    {
        return $this->informacoesAdicionais;
    }

    public function setInformacoesAdicionais(array $informacoesAdicionais): self
    {
        $this->informacoesAdicionais = $informacoesAdicionais;

        return $this;
    }

    public function getPlanoCusteioVigente(): array
    {
        return $this->planoCusteioVigente;
    }

    public function setPlanoCusteioVigente(array $planoCusteioVigente): self
    {
        $this->planoCusteioVigente = $planoCusteioVigente;

        return $this;
    }

    public function getPerformance(): array
    {
        return $this->performance;
    }

    public function setPerformance(array $performance): self
    {
        $this->performance = $performance;

        return $this;
    }

    public function getBeneficioLiquido(): array
    {
        return $this->beneficioLiquido;
    }

    public function setBeneficioLiquido(array $beneficioLiquido): self
    {
        $this->beneficioLiquido = $beneficioLiquido;

        return $this;
    }

    public function getUrp(): array
    {
        return $this->urp;
    }

    public function setUrp(array $urp): self
    {
        $this->urp = $urp;

        return $this;
    }
}
