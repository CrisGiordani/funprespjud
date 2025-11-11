<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\App\Alternativa;
use App\Interface\Iris\Repository\App\AlternativaRepositoryInterface;
use App\Interface\Iris\Service\App\AlternativaServiceInterface;

class AlternativaService implements AlternativaServiceInterface
{
    public function __construct(
        private AlternativaRepositoryInterface $alternativaRepository
    ) {
    }

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->alternativaRepository->getAll();
    }

    /**
     * @param int $id
     *
     * @return Alternativa|null
     */
    public function getById(int $id): ?Alternativa
    {
        return $this->alternativaRepository->getById($id);
    }
}
