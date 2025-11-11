<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\Alternativa;

interface AlternativaRepositoryInterface
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
