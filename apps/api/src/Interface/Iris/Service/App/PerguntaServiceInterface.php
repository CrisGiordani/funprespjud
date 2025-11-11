<?php

namespace App\Interface\Iris\Service\App;

use App\Entity\Iris\App\Pergunta;

interface PerguntaServiceInterface
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
