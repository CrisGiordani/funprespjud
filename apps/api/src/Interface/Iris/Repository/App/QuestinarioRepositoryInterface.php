<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\Questinario;

interface QuestinarioRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return Questinario|null
     */
    public function getById(int $id): ?Questinario;
}
