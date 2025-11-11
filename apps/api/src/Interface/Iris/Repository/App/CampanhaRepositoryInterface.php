<?php

namespace App\Interface\Iris\Repository\App;

use App\DTO\Iris\App\Input\DistribuicaoSolicitacoesDTO;
use App\DTO\Iris\App\Input\ResumoSolicitacoesDTO;
use App\Entity\Iris\App\Campanha;
use Doctrine\ORM\Query;

interface CampanhaRepositoryInterface
{
    /**
     * @param Campanha $campanha
     *
     * @return void
     */
    public function salvarCampanha(Campanha $campanha): void;


    /**
     * @param array $filter
     * 
     * @return Query
     */
    public function getAll(array $filter = []): Query;

    /**
     * @param int $id
     *
     * @return Campanha|null|array
     */
    public function getById(int $id): Campanha|null|array;

    /**
     * Obtém as campanhas ativas de um participante por CPF
     *
     * @return array Array contendo as campanhas ativas
     */
    public function getCampanhaAtiva(?string $dtAtual = null): ?array;

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
    public function getResumoSolicitacoesCampanha(int $idCampanha): ?ResumoSolicitacoesDTO;


    /**
     * @param int $idCampanha
     * @param string $perfilRecomendado
     * 
     * @return DistribuicaoSolicitacoesDTO|null
     */
    public function distruibuicaoSolicitacoesCampanha(int $idCampanha, string $perfilRecomendado): ?DistribuicaoSolicitacoesDTO;
}
