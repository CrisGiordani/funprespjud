<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Input\SimuladorDTO;
use App\DTO\Trust\Output\ProjecaoBeneficioOutputDTO;
use App\DTO\Trust\Output\SimuladorOutputDTO;

/**
 * Interface do serviço de simulação Trust
 */
interface TrustSimuladorServiceInterface
{
    /**
     * Realiza o cálculo da simulação
     * @throws \App\Exception\SimuladorNotFoundException
     * @throws \InvalidArgumentException
     */
    public function calculoSimulacao(SimuladorDTO $input): SimuladorOutputDTO;

    /**
     * Obtém os dados do simulador para um participante
     * @throws \App\Exception\SimuladorNotFoundException
     */
    public function getDadosSimulador(string $cpf): array;

    /**
     * Obtém os perfis de investimento disponíveis
     */
    public function getPerfisInvestimento(): array;

    /**
     * Obtém as rentabilidades projetadas disponíveis
     */
    public function getRentabilidadesProjetadas(string $cpf): array;

    /**
     * Obtém o perfil recomendado para um participante
     */
    public function getPerfilRecomendado(array $filter): int;

    /**
     * Obtém os dados do plano para um participante
     */
    public function getDadosPlano(string $cpf): array;

    /**
     * Obtém o histórico de simulações de um participante
     */
    public function getHistoricoSimulacoes(string $cpf): array;

    /**
     * Obtém os parâmetros padrão do simulador
     */
    public function getParametrosPadrao(): array;

    /**
     * Prepara os dados da simulação simplificada
     */
    public function preparaDadosSimulacaoSimplificada(string $cpf): SimuladorDTO;

    /**
     * @param string $cpf
     *
     * @return ProjecaoBeneficioOutputDTO|null
     */
    public function getProjecaoBeneficio(string $cpf): ProjecaoBeneficioOutputDTO|null;

    /**
     * Calcula a simulação simplificada normal
     */
    public function simplificadaNormal(string $cpf): array;
}
