<?php

namespace App\Service\Trust\Patrimonio;

use App\Interface\Iris\Service\Core\TrustCalculosInvestimentosServiceInterface;

class TrustCalculosInvestimentosService implements TrustCalculosInvestimentosServiceInterface
{

    /**
     * @param $dados
     * @param $tipo
     * @param $codigoTipoCota
     * @param float $a Limite inferior do intervalo (percentual, ex: -0.99 = -99%)
     * @param float $b Limite superior do intervalo (percentual, ex: 10 = 1000%)
     * @return float|int|string Taxa de rentabilidade encontrada
     * @throws \Exception Quando não há solução matemática no intervalo
     */
    public function atingirMeta($dados, $tipo, $codigoTipoCota, float $a = -0.99, float $b = 10)
    {
        $EPSILON = 0.00001; // erro aceitável ao encontrar o resultado
        $LIMITE_ITERACOES = 100; // máximo de iterações para evitar entrar em loop infinito
        $contador = 0;

        // Testar múltiplos intervalos para encontrar mudança de sinal
        $intervalos = [
            [-0.99, 10],    // -99% a 1000%
            [-0.5, 5],      // -50% a 500%
            [-0.9, 20],     // -90% a 2000%
            [0.001, 10],    // 0.1% a 1000%
        ];

        $fa = null;
        $fb = null;
        
        foreach ($intervalos as $intervalo) {
            $a = $intervalo[0];
            $b = $intervalo[1];
            
            $fa = $this->calcularVpl($dados, $tipo, $codigoTipoCota, $a);
            $fb = $this->calcularVpl($dados, $tipo, $codigoTipoCota, $b);
            
            // Encontrou intervalo válido (sinais opostos)
            if ($fa * $fb < 0) {
                break;
            }
        }

        if ($fa * $fb >= 0) {
            // Nenhum intervalo válido encontrado - não há solução matemática
            throw new \Exception("Intervalo errado na função de atingir meta! VPL não cruza zero nos intervalos testados.");
        }

        $c = $a;
        while (($b - $a) >= $EPSILON && $contador < $LIMITE_ITERACOES) {
            $c = ($a + $b) / 2;
            $fa = $this->calcularVpl($dados, $tipo, $codigoTipoCota, $a);
            $fb = $this->calcularVpl($dados, $tipo, $codigoTipoCota, $b);
            $fc = $this->calcularVpl($dados, $tipo, $codigoTipoCota, $c);
            if ($fc == 0.0)
                break;
            else if ($fc * $fa < 0)
                $b = $c;
            else
                $a = $c;
            $contador++;
        }
        return $c;
    }

    /**
     * @param mixed $dados
     * @param mixed $tipo
     * @param int $percentual
     * @param mixed $codigoTipoCota
     * 
     * @return float|int|string
     */
    public function calcularVpl($dados, $tipo, $codigoTipoCota,  $percentual = 0.1)
    {

        $strPatrimonioAtualizado = 'patrimonioAtualizado';
        switch ($codigoTipoCota) {
            case 1:
                $strPatrimonioAtualizado = $strPatrimonioAtualizado . '_CDI';
                break;
            case 2:
                $strPatrimonioAtualizado = $strPatrimonioAtualizado . '_PB';
                break;
            default:
                break;
        }


        $contribuicoes = $dados['contribuicoes'];
        $patrimonioAtualizado = $dados['totais'][$strPatrimonioAtualizado];
        $resultadoFinal = 0;
        $vpl = 0;
        $ultimoIndice = array_key_last($contribuicoes);

        //        var_dump($patrimonioAtualizado,$ultimoIndice,$strPatrimonioAtualizado);
        foreach ($contribuicoes as $indice => $contribuicao) {
            $proximoIndice = $indice + 1;
            if ($proximoIndice > $ultimoIndice) $proximoIndice = $indice;
            $contribuicaoPosterior = $contribuicoes[$proximoIndice];

            if ($contribuicao['dtPagamento'] != $contribuicaoPosterior['dtPagamento']) {
                $resultado = $this->calculoRentabilidadeVpl($contribuicao, $tipo, $percentual, $patrimonioAtualizado, false, $codigoTipoCota);
                $resultado = is_nan($resultado) ? 0 : $resultado;
                //                var_dump($resultado);
                $resultadoFinal += $resultado;
            }

            if ($indice == $ultimoIndice) {
                if ($contribuicao['dtPagamentoDateTime'] < $contribuicao['dtUltimaCotaDateTime']) {
                    $resultado = $this->calculoRentabilidadeVpl($contribuicao, $tipo, $percentual, $patrimonioAtualizado, false, $codigoTipoCota);
                    $resultado = is_nan($resultado) ? 0 : $resultado;
                    $resultadoFinal += $resultado;

                    $resultadoExcedente = $this->calculoRentabilidadeVplExcedente($contribuicao, $percentual, $patrimonioAtualizado);
                    $resultadoExcedente = is_nan($resultadoExcedente) ? 0 : $resultadoExcedente;
                    return $resultadoFinal + $resultadoExcedente;
                }

                $resultado = $this->calculoRentabilidadeVpl($contribuicao, $tipo, $percentual, $patrimonioAtualizado, true, $codigoTipoCota);
                $vpl = $resultadoFinal + $resultado;
            }
        }

        return $vpl;
    }


    public function calculoRentabilidadeVplExcedente($contribuicao, $percentual, $patrimonioAtualizado)
    {
        $diasUteisUltimaCota = $contribuicao['diasUteisUltimaCota'];
        $diasUteisUltimaCotaPorAno = $diasUteisUltimaCota / 252;
        $percentualParaCalculo = 1 + $percentual;

        return (((0 / pow($percentualParaCalculo, $diasUteisUltimaCotaPorAno)) * -1) + ($patrimonioAtualizado / pow($percentualParaCalculo, $diasUteisUltimaCotaPorAno)));
    }

    /**
     * @param $contribuicao
     * @param string $tipo
     * @param float $percentual
     * @param float $patrimonioAtualizado
     * @param bool $ultimoCalculoPositivo
     * @return float|int
     */
    public function calculoRentabilidadeVpl($contribuicao, string $tipo, float $percentual, $codigoTipoCota, float $patrimonioAtualizado = 0, bool $ultimoCalculoPositivo = false)
    {
        switch ($tipo) {
            case 'RI':
                $totalFluxo = 'totalFluxoPorData';
                break;
            case 'VPP':
                $totalFluxo = 'totalFluxoVppPorData';
                break;
            default:
                $totalFluxo = 'totalFluxoPorData';
        }
        switch ($codigoTipoCota) {
            case 1:
                $totalFluxo = $totalFluxo . '_CDI';
                break;
            case 2:
                $totalFluxo = $totalFluxo . '_PB';
                break;
            default:
                break;
        }

        $totalFluxoPorData = floatval($contribuicao[$totalFluxo]);
        $diasUteis = $contribuicao['diasUteisApartirPrimeiraContribuicao'];
        $diasUteisPorAno = $diasUteis / 252;
        $percentualParaCalculo = 1 + $percentual;
        $ret = 0;
        try {
            if ($ultimoCalculoPositivo) {
                $ret = ((($totalFluxoPorData / pow($percentualParaCalculo, $diasUteisPorAno)) * -1) + ($patrimonioAtualizado / pow($percentualParaCalculo, $diasUteisPorAno)));
            } else {
                $ret = ($totalFluxoPorData / pow($percentualParaCalculo, $diasUteisPorAno)) * -1;
            }
        } catch(\DivisionByZeroError $e){
            $ret = 0;
        } catch (\Exception $e) {
            $ret = 0;
        }
        return $ret;
    }

}
