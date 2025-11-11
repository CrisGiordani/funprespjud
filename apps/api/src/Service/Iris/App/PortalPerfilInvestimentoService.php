<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\App\PerfilInvestimento;
use App\Interface\Iris\Repository\App\PerfilInvestimentoRepositoryInterface;
use App\Interface\Iris\Service\App\PortalPerfilInvestimentoServiceInterface;

class PortalPerfilInvestimentoService implements PortalPerfilInvestimentoServiceInterface
{
    private $repositoryPerfilInvestimento;

    /**
     * @param PerfilInvestimentoRepositoryInterface $repositoryPerfilInvestimento
     */
    public function __construct(PerfilInvestimentoRepositoryInterface $repositoryPerfilInvestimento)
    {
        $this->repositoryPerfilInvestimento = $repositoryPerfilInvestimento;
    }

    /**
     * @return [type]
     */
    public function getAll()
    {
        return $this->repositoryPerfilInvestimento->getAll();
    }

    /**
     * @param int $id
     *
     * @return [type]
     */
    public function getById(int $id)
    {
        return $this->repositoryPerfilInvestimento->getById($id);
    }

    /**
     * @param string $name
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilByName(string $name): ?PerfilInvestimento
    {
        return $this->repositoryPerfilInvestimento->getPerfilByName($name);
    }

    /**
     * @param int $id
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilByIdTrust(int $id): ?PerfilInvestimento
    {
        
        return $this->repositoryPerfilInvestimento->getPerfilByIdTrust($id);
    }
}
