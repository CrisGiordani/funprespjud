<?php

namespace App\Interface\Trust\Repository;

use App\Exception\SimuladorNotFoundException;

interface TrustSimuladorRepositoryInterface
{
    /**
     * Obtém o histórico de contribuições do participante
     *
     * @param string $cpf CPF do participante
     * @return array Lista de contribuições
     * @throws SimuladorNotFoundException
     */
    public function getHistoricoContribuicoes(string $cpf): array;

    /**
     * Obtém os dados do plano do participante
     *
     * @param array $filter Filtros para busca
     * @return array Dados do plano contendo:
     *               - idPlano
     *               - nome
     *               - taxaAdministrativa
     *               - fcbe
     * @throws SimuladorNotFoundException
     */
    public function getDadosPlano(array $filter): array;

    /**
     * Obtém o valor do teto RGPS
     *
     * @return float|null Valor do teto RGPS
     */
    public function getRemuneracaoTetoRGPS(): ?array;

    /**
     * Obtém a situação anterior do participante
     *
     * @param string $idParticipante id do particpante
     * @return string|null Situação anterior
     */
    public function getSituacaoAnteriorParticipante(string $idParticipante): ?string;

    /**
     * Obtém o salário do participante
     *
     * @param array $filter Filtros para busca
     * @return float|null Salário do participante
     */
    public function getSalarioParticipante(array $filter): ?float;

    /**
     * Obtém o percentual de contribuição normal do participante
     *
     * @param array $filter Filtros para busca
     * @return float|null Percentual de contribuição
     */
    public function getPercentualContribuicaoNormal(array $filter): ?float;

    /**
     * Obtém o percentual de contribuição facultativa
     *
     * @param array $filter Filtros para busca
     * @return float|null Percentual de contribuição
     */
    public function getPercentualContribuicaoFacultativa(array $filter): ?float;

    /**
     * Obtém a data do indexador
     *
     * @param string $indexador Tipo do indexador
     * @return array|null Data do indexador
     */
    public function getDataIndexador(string $indexador): ?array;

    /**
     * Obtém os percentuais de contribuição
     *
     * @param string $situacaoConsiderada Situação do participante
     * @return array Percentuais de contribuição
     */
    public function getPercentuaisContribuicao(string $situacaoConsiderada): array;

    /**
     * Obtém os perfis de investimento
     *
     * @return array Lista de perfis de investimento
     */
    public function getPerfisDeInvestimento(): array;

    /**
     * Obtém o perfil de investimento recomendado
     *
     * @return array Perfil recomendado
     */
    public function getPerfilDeInvestimentoRecomendado(): array;

    /**
     * Obtém a rentabilidade projetada
     *
     * @return array Rentabilidade projetada
     */
    public function getRentabilidadeProjetada(string $idIndexadorAnualPerfilInvestimento): array;

    /**
     * Obtém o valor atual da cota
     *
     * @param array $filter Filtros para busca
     * @return float|null Valor atual da cota
     */
    public function getValorCotaAtual(array $filter): ?float;

    /**
     * Obtém o fator atuarial
     *
     * @param int $anoNascimento Ano de nascimento
     * @param int $idadeAposentadoria Idade de aposentadoria
     * @return array|null Fator atuarial
     */
    public function getFatorAtuarial(int $anoNascimento, int $idadeAposentadoria): ?array;

    /**
     * Obtém a base de contribuição do histórico de salário
     *
     * @param string $cpf CPF do participante
     * @return float|null Base de contribuição do histórico de salário
     */
    public function getLastHistoricoSalario(string $cpf): ?float;
}
