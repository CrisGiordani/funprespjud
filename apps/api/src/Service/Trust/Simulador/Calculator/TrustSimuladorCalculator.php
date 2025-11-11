<?php

namespace App\Service\Trust\Simulador\Calculator;

use App\Service\Trust\Simulador\TrustSimuladorConstants;

class TrustSimuladorCalculator
{
    /**
     * Calcula o valor bruto da contribuição
     *
     * @param float $salario Salário do participante
     * @param float $percentual Percentual de contribuição
     * @param bool $isDezembro Se é contribuição de dezembro
     * @return float Valor bruto da contribuição
     */
    public function calcularValorBrutoContribuicao(float $salario, float $percentual, bool $isDezembro): float
    {
        $valorBruto = round($salario * ($percentual / 100), 2);

        return $isDezembro ? round($valorBruto * 2, 2) : $valorBruto;
    }

    /**
     * Calcula o valor líquido da contribuição
     *
     * @param float $valorBruto Valor bruto da contribuição
     * @return float Valor líquido da contribuição
     */
    public function calcularValorLiquidoContribuicao(float $valorBruto): float
    {
        $taxaAdmin = $valorBruto * TrustSimuladorConstants::TAXA_ADMINISTRATIVA;
        $taxaFcbe = $valorBruto * TrustSimuladorConstants::FCBE;

        return round($valorBruto - $taxaAdmin - $taxaFcbe, 2);
    }

    /**
     * Calcula a quantidade de cotas
     *
     * @param float $valorContribuicao Valor da contribuição
     * @param float $valorCota Valor da cota
     * @return float Quantidade de cotas
     */
    public function calcularQuantidadeCotasContribuicao(float $valorContribuicao, float $valorCota): float
    {
        return $valorContribuicao / $valorCota;
    }

    /**
     * Calcula o valor total em cotas
     *
     * @param float $quantidadeCotas Quantidade de cotas
     * @param float $valorCota Valor da cota
     * @return float Valor total em cotas
     */
    public function calcularValorTotalCotas(float $quantidadeCotas, float $valorCota): float
    {
        return $quantidadeCotas * $valorCota;
    }

    /**
     * Calcula o valor da cota projetada
     *
     * @param float $valorCotaAtual Valor atual da cota
     * @param float $rentabilidadeProjetada Rentabilidade projetada
     * @param int $mesesAteAposentadoria Meses até a aposentadoria
     * @return float Valor projetado da cota
     */
    public function calcularValorCotaProjetado(float $valorCotaAtual, float $rentabilidadeProjetada, int $mesesAteAposentadoria): float
    {
        return $valorCotaAtual * pow(
            1 + ($rentabilidadeProjetada / 100),
            $mesesAteAposentadoria / 12
        );
    }

    /**
     * Calcula o valor da contribuição vinculada
     *
     * @param float $salario Salário do participante
     * @return float Valor da contribuição vinculada
     */
    public function calcularValorContribuicaoVinculada(float $salario): float
    {
        return $salario * TrustSimuladorConstants::PERCENTUAL_VINCULADO / 100;
    }

    /**
     * Calcula o valor da contribuição normal
     *
     * @param float $salario Salário do participante
     * @param float $percentual Percentual de contribuição
     * @param bool $isDezembro Se é contribuição de dezembro
     * @return float Valor da contribuição normal
     */
    public function calcularValorContribuicaoNormal(float $salario, float $percentual, bool $isDezembro = false): float
    {
        $valorBruto = $this->calcularValorBrutoContribuicao($salario, $percentual, $isDezembro);

        return $this->calcularValorLiquidoContribuicao($valorBruto);
    }

    /**
     * Calcula o valor da contribuição facultativa
     *
     * @param float $salario Salário do participante
     * @param float $percentual Percentual de contribuição
     * @param bool $isDezembro Se é contribuição de dezembro
     * @return float Valor da contribuição facultativa
     */
    public function calcularValorContribuicaoFacultativa(float $salario, float $percentual, bool $isDezembro = false): float
    {
        return $this->calcularValorBrutoContribuicao($salario, $percentual, $isDezembro);
    }
}
