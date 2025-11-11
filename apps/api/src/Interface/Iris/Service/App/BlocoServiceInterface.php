<?php

namespace App\Interface\Iris\Service\App;

use App\Entity\Iris\Bloco;

interface BlocoServiceInterface
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
