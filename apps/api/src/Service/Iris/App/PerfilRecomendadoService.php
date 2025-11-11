<?php

namespace App\Service\Iris\App;

use App\Entity\Iris\App\PerfilInvestimento;
use App\Entity\Iris\App\PerfilRecomendado;
use App\Interface\Iris\Repository\App\PerfilRecomendadoRepositoryInterface;
use App\Interface\Iris\Service\App\PerfilRecomendadoServiceInterface;
use App\Interface\Iris\Service\App\PortalPerfilInvestimentoServiceInterface;

class PerfilRecomendadoService implements PerfilRecomendadoServiceInterface
{
    public function __construct(
        private readonly PerfilRecomendadoRepositoryInterface $perfilRecomendadoRepository,
        private readonly PortalPerfilInvestimentoServiceInterface $portalPerfilInvestimentoService
    ) {}

    /**
     * @param string $cpf
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilRecomendadoByCpf(string $cpf): ?PerfilInvestimento
    {
        $perfilRecomendado = $this->perfilRecomendadoRepository->getPerfilRecomendadoByCpf($cpf);
        if (empty($perfilRecomendado)) {
            return null;
        }
        return $this->portalPerfilInvestimentoService->getPerfilByName($perfilRecomendado['descricao']);
    }

    public function getByCpf(string $cpf): ?PerfilRecomendado
    {
        $perfilRecomendado = $this->perfilRecomendadoRepository->getByCpf($cpf);
        if (empty($perfilRecomendado)) {
            return null;
        }

        return $perfilRecomendado;
    }

    public function getAll(): array
    {
        return $this->perfilRecomendadoRepository->getAll();
    }

    public function getById(int $id): ?PerfilRecomendado
    {
        return $this->perfilRecomendadoRepository->getById($id);
    }

    public function update(PerfilRecomendado $perfilRecomendado): void
    {
        $this->perfilRecomendadoRepository->update($perfilRecomendado);
    }
}
