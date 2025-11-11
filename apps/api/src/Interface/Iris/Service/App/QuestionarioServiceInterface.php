<?php

namespace App\Interface\Iris\Service\App;

use App\Entity\Iris\App\Questinario;

interface QuestionarioServiceInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return Questinario
     */
    public function getById(int $id): Questinario;
}
