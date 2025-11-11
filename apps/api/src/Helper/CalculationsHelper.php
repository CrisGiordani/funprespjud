<?php

namespace App\Helper;

use App\Interface\Helpers\CalculationsHelperInterface;

class CalculationsHelper implements CalculationsHelperInterface
{
    /**
     * Calcula o percentual de um valor em relação a outro
     * @param float $total
     * @param float $part
     * @return float
     */
    public function calculatePercentage(float $total, float $part): float
    {
        if ($total > 0) {
            $fraction = bcdiv($part, $total, 10);

            return bcmul($fraction, 100, 2);
        }

        return 0;
    }

    /**
     * Calcula o percentual dentro de um valor
     * @param float $value
     * @param float $percentage
     * @return float
     */
    public function getPercentage(float $value, float $percentage): float
    {
        return $value * ($percentage / 100);
    }
}
