<?php

namespace App\Interface\Iris\Service\App;

use App\DTO\Iris\App\Input\DistribuicaoSolicitacoesDTO;
use App\DTO\Iris\App\Input\ResumoSolicitacoesDTO;
use App\DTO\Iris\App\Input\TotalDistribuicaoSolicitacoesDTO;
use App\Entity\Iris\App\Campanha;
use Knp\Component\Pager\Pagination\PaginationInterface;

interface CampanhaServiceInterface
{
    /**
     * @param array $data
     *
     * @return void
     */
    public function criarCampanha(array $data): void;

    /**
     * @param int $id
     * @param array $data
     *
     * @return Campanha
     */
    public function editarCampanha(int $id, array $data): Campanha;

    /**
     * @param array $filter
     * 
     * @return PaginationInterface
     */
    public function getAll(array $filter = []): PaginationInterface;

    /**
     * @param int $id
     * @return Campanha|null
     */
    public function getById(int $id): Campanha|null|array;

    /**
     * @return array | null
     */
    public function getCampanhaAtiva(?string $dtAtual = null): array | null;

    /**
     * @param Campanha $campanha
     * 
     * @return void
     */
    public function deleteCampanha(Campanha $campanha): void;

    /**
     * @param int $idCampanha
     * 
     * @return ResumoSolicitacoesDTO|null
     */
    public function getResumoSolicitacoesCampanha(int $idCampanha): ResumoSolicitacoesDTO|null;

    /**
     * @param int $idCampanha
     * 
     * @return TotalDistribuicaoSolicitacoesDTO|null
     */
    public function getDistribuicaoSolicitacoesCampanha(int $idCampanha): TotalDistribuicaoSolicitacoesDTO|null;
}
