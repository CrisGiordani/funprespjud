<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\Bloco;
use App\Interface\Iris\Repository\App\BlocoRepositoryInterface;
use App\Interface\Iris\Service\App\BlocoServiceInterface;

class BlocoService implements BlocoServiceInterface
{
    public function __construct(
        private BlocoRepositoryInterface $blocoRepository
    ) {
    }

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->blocoRepository->getAll();
    }

    /**
     * @param int $id
     *
     * @return Bloco
     */
    public function getById(int $id): Bloco
    {
        return $this->blocoRepository->getById($id);
    }
}
