<?php

namespace App\Service\Trust\Simulador\Validator;

use App\Service\Trust\Simulador\TrustSimuladorConstants;
use InvalidArgumentException;

class TrustSimuladorValidator
{
    /**
     * Valida os dados de entrada
     *
     * @param array $dados Dados a serem validados
     * @throws InvalidArgumentException
     */
    public function validarInput(array $dados): void
    {
        if (! isset($dados['participante']) || ! isset($dados['simulacao'])) {
            throw new InvalidArgumentException('Dados inválidos');
        }

        $participante = $dados['participante'];
        $simulacao = $dados['simulacao'];

        if (! isset($participante['nome']) || ! isset($participante['dataNascimento']) || ! isset($participante['salario'])) {
            throw new InvalidArgumentException('Dados do participante inválidos');
        }

        if (! isset($simulacao['percentualContribuicao']) || ! isset($simulacao['valorCotaAtual']) || ! isset($simulacao['rentabilidadeProjetada'])) {
            throw new InvalidArgumentException('Dados da simulação inválidos');
        }
    }

    /**
     * Valida os parâmetros de contribuição
     *
     * @param float $salario Salário do participante
     * @param float $percentual Percentual de contribuição
     * @throws InvalidArgumentException
     */
    public function validarParametrosContribuicao(float $salario, float $percentual): void
    {
        if ($salario <= 0) {
            throw new InvalidArgumentException('Salário deve ser maior que zero');
        }

        if ($percentual <= 0) {
            throw new InvalidArgumentException('Percentual de contribuição deve ser maior que zero');
        }
    }

    /**
     * Valida o valor da cota
     *
     * @param float $valorCota Valor da cota
     * @throws InvalidArgumentException
     */
    public function validarValorCota(float $valorCota): void
    {
        if ($valorCota <= 0) {
            throw new InvalidArgumentException('Valor da cota deve ser maior que zero');
        }
    }

    /**
     * Valida o valor líquido da contribuição
     *
     * @param float $valorLiquido Valor líquido da contribuição
     * @throws InvalidArgumentException
     */
    public function validarValorLiquidoContribuicao(float $valorLiquido): void
    {
        if ($valorLiquido <= 0) {
            throw new InvalidArgumentException('Valor líquido da contribuição deve ser maior que zero');
        }
    }

    /**
     * Valida o percentual de contribuição facultativa
     *
     * @param float $percentual Percentual de contribuição facultativa
     * @throws InvalidArgumentException
     */
    public function validarPercentualContribuicaoFacultativa(float $percentual): void
    {
        if ($percentual < TrustSimuladorConstants::PERCENTUAL_MINIMO_CONTRIBUICAO_FACULTATIVA) {
            throw new InvalidArgumentException(sprintf('O valor mínimo para a contribuição facultativa é de %.1f%%', TrustSimuladorConstants::PERCENTUAL_MINIMO_CONTRIBUICAO_FACULTATIVA));
        }
    }
}
