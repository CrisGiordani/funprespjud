<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\Pergunta;

interface PerguntaRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return Pergunta|null
     */
    public function getById(int $id): ?Pergunta;
}
