<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\Bloco;

interface BlocoRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return Bloco
     */
    public function getById(int $id): Bloco;
}
