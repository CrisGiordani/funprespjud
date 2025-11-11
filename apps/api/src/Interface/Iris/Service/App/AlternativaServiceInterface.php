<?php

namespace App\Interface\Iris\Service\App;

use App\Entity\Iris\App\Alternativa;

interface AlternativaServiceInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return Alternativa|null
     */
    public function getById(int $id): ?Alternativa;
}
