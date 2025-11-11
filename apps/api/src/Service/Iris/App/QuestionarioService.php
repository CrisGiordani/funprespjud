<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\App\Questinario;
use App\Interface\Iris\Repository\App\QuestinarioRepositoryInterface;
use App\Interface\Iris\Service\App\QuestionarioServiceInterface;

class QuestionarioService implements QuestionarioServiceInterface
{
    public function __construct(
        private readonly QuestinarioRepositoryInterface $questinarioRepository
    ) {
    }

    public function getAll(): array
    {
        return $this->questinarioRepository->getAll();
    }

    public function getById(int $id): Questinario
    {
        return $this->questinarioRepository->getById($id);
    }
}
