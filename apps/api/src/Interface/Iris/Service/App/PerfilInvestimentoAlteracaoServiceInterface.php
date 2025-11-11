<?php

namespace App\Interface\Iris\Service\App;

use App\DTO\Trust\Input\MigracaoSolicitacoesDTO;
use App\DTO\Trust\Output\ParticipanteProfileOutputDTO;
use App\Entity\Iris\App\PerfilInvestimento;
use App\Entity\Iris\App\PerfilInvestimentoAlteracao;
use App\Enum\Iris\App\StatusSolicitacaoAlteracaoPerfilInvestimentoEnum;
use Knp\Component\Pager\Pagination\PaginationInterface;

interface PerfilInvestimentoAlteracaoServiceInterface
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
     * @return PaginationInterface
     */
    public function getByCpf(string $cpf, array $filterPagination): PaginationInterface;

    /**
     * @param string $cpf
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getUltimaSolicitacaoAlteracaoPerfil(string $cpf): ?PerfilInvestimentoAlteracao;

    /**
     * @param string $cpf
     *
     * @return void
     */
    public function postPerfilSolicitacaoAlteracao(string $cpf, int $perfilInvestimento, int $idCampanha, string $ipMaquina, string $dadosSimulacao): ?PerfilInvestimentoAlteracao;

    /**
     * @param string $cpf
     * @param int $perfilInvestimento
     * @param int $idCampanha
     * @param string $ipMaquina
     * @param string $dadosSimulacao
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function perfilSolicitacaoAlteracao(string $cpf, int $perfilInvestimento, int $idCampanha, string $ipMaquina, string $dadosSimulacao): ?PerfilInvestimentoAlteracao;

    /**
     * @param string $cpf
     * @param PerfilInvestimento $perfilInvestimento
     * @param string $ipMaquina
     *
     */
    public function gerarDocumento(string $cpf, ParticipanteProfileOutputDTO $participante, PerfilInvestimento $perfilInvestimento, string $ipMaquina);

    /**
     * @param string $cpf
     * @param string $token
     * @param string $ipMaquina
     *
     * @return bool
     */
    public function verificarToken(string $cpf, string $token, string $ipMaquina): bool;

    /**
     * @param string $cpf
     *
     * @return string
     */
    public function gerarNovoToken(string $cpf): string;

    /**
     * @param string $cpf
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getPerfilSolicitado(string $cpf): ?PerfilInvestimentoAlteracao;

    /**
     * @param string $cpf
     * @param int $status
     *
     * @return bool
     */
    public function cancelarSolicitacaoAlteracaoPerfil(string $cpf, int $status = StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE->value): bool;


    /**
     * @param int $campanha
     *
     * @return array
     */
    public function solicitacoesRecebidas(int $campanha): array;

    /**
     * @param PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao
     * 
     * @return void
     */
    public function updatePerfilInvestimentoAlteracao(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao): void;

    /**
     * @param int $campanha
     * 
     * @return array
     */
    public function solicitacoesInconsistentes(int $campanha): array;


    /**
     * @param int $campanha
     * 
     * @return MigracaoSolicitacoesDTO
     */
    public function migracaoPerfilInvestimento(int $campanha): MigracaoSolicitacoesDTO;

    /**
     * Migra o perfil de investimento de uma solicitação individual
     *
     * @param int $solicitacaoId
     * @return array
     * @throws \Exception
     */
    public function migrarPerfilIndividual(int $solicitacaoId): array;
}
