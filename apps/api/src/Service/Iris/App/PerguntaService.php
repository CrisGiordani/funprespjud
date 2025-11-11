<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\App\Pergunta;
use App\Interface\Iris\Repository\App\PerguntaRepositoryInterface;
use App\Interface\Iris\Service\App\PerguntaServiceInterface;

class PerguntaService implements PerguntaServiceInterface
{
    public function __construct(
        private PerguntaRepositoryInterface $perguntaRepository
    ) {
    }

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->perguntaRepository->getAll();
    }

    /**
     * @param int $id
     *
     * @return Pergunta|null
     */
    public function getById(int $id): ?Pergunta
    {
        return $this->perguntaRepository->getById($id);
    }
}
