<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\Alternativa;
use App\Interface\Iris\Repository\App\AlternativaRepositoryInterface;
use Doctrine\ORM\EntityRepository;

class AlternativaRepository extends EntityRepository implements AlternativaRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->findAll();
    }

    /**
     * @param int $id
     *
     * @return Alternativa|null
     */
    public function getById(int $id): ?Alternativa
    {
        return $this->find($id);
    }

    /**
     * Utilizar para salvar uma alternativa
     * @param Alternativa $alternativa
     *
     * @return void
     */
    public function save(Alternativa $alternativa): void
    {
        $this->getEntityManager()->persist($alternativa);
        $this->getEntityManager()->flush();
    }
}
