<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\PerfilInvestimentoAlteracao;
use Doctrine\ORM\Query;

interface PerfilInvestimentoAlteracaoRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param int $id
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getById(int $id): ?PerfilInvestimentoAlteracao;

    /**
     * @param string $cpf
     *
     * @return Query
     */
    public function getByCpf(string $cpf): Query;

    /**
     * @param string $cpf
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getUltimaSolicitacaoAlteracaoPerfil(string $cpf): ?PerfilInvestimentoAlteracao;

    /**
     * @param PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao
     *
     * @return void
     */
    public function postPerfilSolicitacaoAlteracao(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao): void;

    /**
     * @param PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao
     *
     * @return void
     */
    public function update(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao): void;

    /**
     * @param int $campanha
     *
     * @return array
     */
    public function solicitacoesRecebidas( int $campanha): array;

    /**
     * @param int $campanha
     *
     * @return array
     */
    public function solicitacoesInconsistentes(int $campanha): array;

    /**
     * @param int $campanha
     *
     * @return array
     */
    public function solicitacoesProcessadas(int $campanha): array;
}
