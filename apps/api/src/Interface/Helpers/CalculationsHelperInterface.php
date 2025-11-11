<?php

namespace App\Interface\Helpers;

interface CalculationsHelperInterface
{
    /**
     * Calcula o percentual de um valor em relação a outro
     * @param float $total
     * @param float $partial
     * @return float
     */
    public function calculatePercentage(float $total, float $partial): float;

    /**
     * Calcula o percentual dentro de um valor
     * @param float $value
     * @param float $percentage
     * @return float
     */
    public function getPercentage(float $value, float $percentage): float;
}
