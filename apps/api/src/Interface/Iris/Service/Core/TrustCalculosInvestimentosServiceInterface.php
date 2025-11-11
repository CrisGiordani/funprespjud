<?php

namespace App\Interface\Iris\Service\Core;

interface TrustCalculosInvestimentosServiceInterface
{
    /**
     * @param mixed $dados
     * @param mixed $tipo
     * @param mixed $codigoTipoCota
     * @param float $a Limite inferior do intervalo (percentual, ex: -0.99 = -99%)
     * @param float $b Limite superior do intervalo (percentual, ex: 10 = 1000%)
     * 
     * @return float|int|string Taxa de rentabilidade encontrada
     */
    public function atingirMeta($dados, $tipo, $codigoTipoCota, float $a = -0.99, float $b = 10);
    /**
     * @param mixed $dados
     * @param mixed $tipo
     * @param int $percentual
     * @param mixed $codigoTipoCota
     * 
     * @return float|int|string
     */
    public function calcularVpl($dados, $tipo, $codigoTipoCota,  $percentual  );
    /**
     * @param mixed $contribuicao
     * @param mixed $percentual
     * @param mixed $patrimonioAtualizado
     * 
     * @return float|int|string
     */
    public function calculoRentabilidadeVplExcedente($contribuicao, $percentual, $patrimonioAtualizado);
    /**
     * @param mixed $contribuicao
     * @param string $tipo
     * @param float $percentual
     * @param float $patrimonioAtualizado
     * @param bool $ultimoCalculoPositivo
     * @param mixed $codigoTipoCota
     * 
     * @return float|int|string
     */
    public function calculoRentabilidadeVpl($contribuicao, string $tipo, float $percentual, $codigoTipoCota, float $patrimonioAtualizado, bool $ultimoCalculoPositivo);

}
