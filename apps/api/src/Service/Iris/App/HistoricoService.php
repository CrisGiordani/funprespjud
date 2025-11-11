<?php

namespace App\Service\Iris\App;

use App\DTO\Iris\App\Output\StatusHistoricoOutputDTO;
use App\Entity\Iris\App\Historico;
use App\Enum\Iris\App\StatusHistoricoEnum;
use App\Helper\CpfHelper;
use App\Interface\Iris\Repository\App\HistoricoRepositoryInterface;
use App\Interface\Iris\Service\App\HistoricoServiceInterface;
use Exception;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;

class HistoricoService implements HistoricoServiceInterface
{
    public function __construct(
        private readonly HistoricoRepositoryInterface $historicoRepository,
        private readonly PaginatorInterface $paginator,
    ) {
    }

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->historicoRepository->getAll();
    }

    /**
     * @param int $id
     *
     * @return array<Historico>
     */
    public function getById(int $id): array
    {
        return $this->historicoRepository->getById($id);
    }

    /**
     * @param string $cpf
     *
     * @return PaginationInterface
     */
    public function getByCpf(string $cpf, array $filterPagination): PaginationInterface
    {
        if (! CpfHelper::isValidCpf($cpf)) {
            throw new Exception('CPF inválido');
        }

        $query = $this->historicoRepository->getByCpf($cpf);

        return $this->paginator->paginate(
            $query,
            $filterPagination['pageIndex'] + 1,
            $filterPagination['pageSize']
        );
    }

    /**
     * @param Historico $historico
     *
     * @return void
     */
    public function save(Historico $historico): void
    {
        $this->historicoRepository->save($historico);
    }

    /**
     * @param string $cpf
     *
     * @return Historico|null
     */
    public function findByCpfLastresult(string $cpf): ?Historico
    {
        return $this->historicoRepository->findByCpfLastresult($cpf);
    }

    public function getStatusApp(string $cpf): ?StatusHistoricoOutputDTO
    {
        $ultimaResposta = $this->findByCpfLastresult($cpf);

        if ($ultimaResposta === null) {
            return $this->createStatusAppNuncaPreenchido();
        }

        return match ($ultimaResposta->getStatus()->getCdStatus()) {
            StatusHistoricoEnum::NAO_PREENCHIDO_OPCAO_PARTICIPANTE->value => $this->createStatusAppNaoPreenchido($ultimaResposta, StatusHistoricoEnum::NAO_PREENCHIDO_OPCAO_PARTICIPANTE),

            StatusHistoricoEnum::NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR->value => $this->createStatusAppNaoPreenchido($ultimaResposta, StatusHistoricoEnum::NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR),

            StatusHistoricoEnum::PREENCHIDO->value => $this->getStatusAppPreenchido($ultimaResposta),

            default => null
        };
    }

    private function createStatusAppNuncaPreenchido(): StatusHistoricoOutputDTO
    {
        return new StatusHistoricoOutputDTO(
            descricao: StatusHistoricoEnum::NUNCA_PREENCHIDO->getDescricao(),
            cdStatus: StatusHistoricoEnum::NUNCA_PREENCHIDO->value,
            dt_evento: null,
            urlDocumento: null,
            statusAppPreenchido: null,
            descricaoAppPreenchido: null
        );
    }

    private function createStatusAppNaoPreenchido(Historico $ultimaResposta, StatusHistoricoEnum $status): StatusHistoricoOutputDTO
    {
        return new StatusHistoricoOutputDTO(
            descricao: $status->getDescricao(),
            cdStatus: $status->value,
            dt_evento: $ultimaResposta->getDtEvento(),
            urlDocumento: $ultimaResposta->getUrlDocumento(),
            statusAppPreenchido: null,
            descricaoAppPreenchido: null
        );
    }

    private function getStatusAppPreenchido(Historico $ultimaResposta): ?StatusHistoricoOutputDTO
    {
        if ($ultimaResposta->getStatus()->getCdStatus() !== StatusHistoricoEnum::PREENCHIDO->value) {
            return null;
        }

        $baseStatus = new StatusHistoricoOutputDTO(
            descricao: StatusHistoricoEnum::PREENCHIDO->getDescricao(),
            cdStatus: StatusHistoricoEnum::PREENCHIDO->value,
            dt_evento: $ultimaResposta->getDtEvento()->format('d/m/Y'),
            urlDocumento: $ultimaResposta->getUrlDocumento(),
            statusAppPreenchido: null,
            descricaoAppPreenchido: null
        );

        return match (true) {
            StatusHistoricoEnum::ruleAptoParaAlterarPerfil($ultimaResposta) => $this->createStatusAppPreenchidoApto($baseStatus),

            StatusHistoricoEnum::ruleAppValido($ultimaResposta) => $this->createStatusAppPreenchidoValido($baseStatus),

            default => $this->createStatusAppPreenchidoNaoValido($baseStatus)
        };
    }

    private function createStatusAppPreenchidoApto(StatusHistoricoOutputDTO $baseStatus): StatusHistoricoOutputDTO
    {
        return new StatusHistoricoOutputDTO(
            descricao: $baseStatus->descricao,
            cdStatus: $baseStatus->cdStatus,
            dt_evento: $baseStatus->dt_evento,
            urlDocumento: $baseStatus->urlDocumento,
            descricaoAppPreenchido: StatusHistoricoEnum::PREENCHIDO_APTO_ALTERAR_PERFIL->getDescricao(),
            statusAppPreenchido: StatusHistoricoEnum::PREENCHIDO_APTO_ALTERAR_PERFIL->value
        );
    }

    private function createStatusAppPreenchidoValido(StatusHistoricoOutputDTO $baseStatus): StatusHistoricoOutputDTO
    {
        return new StatusHistoricoOutputDTO(
            descricao: $baseStatus->descricao,
            cdStatus: $baseStatus->cdStatus,
            dt_evento: $baseStatus->dt_evento,
            urlDocumento: $baseStatus->urlDocumento,
            statusAppPreenchido: StatusHistoricoEnum::PREENCHIDO_MAS_AINDA_VALIDO->value,
            descricaoAppPreenchido:  StatusHistoricoEnum::PREENCHIDO_MAS_AINDA_VALIDO->getDescricao(),
        );
    }

    private function createStatusAppPreenchidoNaoValido(StatusHistoricoOutputDTO $baseStatus): StatusHistoricoOutputDTO
    {
        return new StatusHistoricoOutputDTO(
            descricao: $baseStatus->descricao,
            cdStatus: $baseStatus->cdStatus,
            dt_evento: $baseStatus->dt_evento,
            urlDocumento: $baseStatus->urlDocumento,
            statusAppPreenchido: StatusHistoricoEnum::PREENCHIDO_MAS_NAO_VALIDO->value,
            descricaoAppPreenchido: StatusHistoricoEnum::PREENCHIDO_MAS_NAO_VALIDO->getDescricao(),
        );
    }
}
