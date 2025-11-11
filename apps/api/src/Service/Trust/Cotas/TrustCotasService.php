<?php

namespace App\Service\Trust\Cotas;

use App\DTO\Trust\Input\IndexadorValorDTO;
use App\Enum\Trust\Cotas\TrustCotasEnum;
use App\Enum\Trust\IndexadorValor\IndexadorValorEnum;
use App\Interface\Iris\Service\App\PortalPerfilInvestimentoServiceInterface;
use App\Interface\Trust\Repository\TrustCotasRepositoryInterface;
use App\Interface\Trust\Service\IndexadorValorServiceInterface;
use App\Interface\Trust\Service\TrustCotasServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use Psr\Log\LoggerInterface;

class TrustCotasService implements TrustCotasServiceInterface
{
    public function __construct(
        private readonly TrustCotasRepositoryInterface $trustCotasRepository,
        private readonly LoggerInterface $logger,
        private readonly IndexadorValorServiceInterface $indexadorValorService,
        private readonly TrustParticipanteServiceInterface $trustParticipanteService,
        private readonly PortalPerfilInvestimentoServiceInterface $perfilInvestimentoService
    ) {}

    /**
     ** @description Busca as cotas atuais apartir do perfil de investimento do usuario. (Para se adequar ao novo resitio de cotas)
     * @return IndexadorValorDTO | array
     */
    public function getCotasAtual($cpf): IndexadorValorDTO | array
    {
        $this->logger->info('Buscando cotas atuais');

        try {
            $perfilAtual = $this->trustParticipanteService->getPerfilAtual($cpf);
            $indexador = IndexadorValorEnum::getCodigoPerfilInvestimentoByIdIndexadorTrust($perfilAtual['idPerfil']);
            $cota = $this->indexadorValorService->getLastValueByCodigo($indexador);
        
          
            if (empty($cota)) {
                $this->logger->warning('Nenhuma cota atual encontrada');

                return [];
            }
            $this->logger->info('Cotas atuais encontradas com sucesso', ['count' => count($cota)]);

            return $cota[0];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar cotas atuais: ' . $e->getMessage());

            throw $e;
        }
    }

    /**
     * @return array
     */
    public function getCotasHistorico(): array
    {
        $this->logger->info('Buscando histórico de cotas');

        try {
            $cotas = $this->trustCotasRepository->getCotasHistorico();
            if (empty($cotas)) {
                $this->logger->warning('Nenhuma cota histórica encontrada');

                return [];
            }
            $this->logger->info('Histórico de cotas encontrado com sucesso', ['count' => count($cotas)]);

            return $cotas;
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar histórico de cotas: ' . $e->getMessage());

            throw $e;
        }
    }

    /**
     * @param array $filter
     *
     * @return array
     */
    public function getCotasPaginadas(array $filter): array
    {
        $pageIndex = $filter['pageIndex'] ?? TrustCotasEnum::DEFAULT_PAGE_INDEX->getIntValue();
        $pageSize = $filter['pageSize'] ?? TrustCotasEnum::DEFAULT_PAGE_SIZE->getIntValue();
        $anoCotas = $filter['anoCotas'] ?? null;

        $this->logPaginationRequest($pageIndex, $pageSize, $anoCotas);

        try {
            $result = $this->trustCotasRepository->getCotasPaginadas([
                'pageIndex' => $pageIndex,
                'pageSize' => $pageSize,
                'anoCotas' => $anoCotas,
            ]);

            if (empty($result['cotas'])) {
                $this->logger->warning('Nenhuma cota encontrada para os parâmetros especificados');

                return $this->createEmptyPaginationResponse($pageIndex, $pageSize);
            }

            $this->logger->info('Cotas paginadas encontradas com sucesso', [
                'total' => $result['totalRegistros'],
                'page' => $result['pageIndex'],
                'size' => $result['pageSize'],
            ]);

            return [
                'data' => $result['cotas'],
                'totalRegistros' => $result['totalRegistros'],
                'pageIndex' => $result['pageIndex'],
                'pageSize' => $result['pageSize'],
                'totalPages' => ceil($result['totalRegistros'] / $result['pageSize']),
            ];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar cotas paginadas: ' . $e->getMessage());

            throw $e;
        }
    }

    /**
     * Registra a requisição de paginação no log
     *
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @param int|null $year Ano para filtro
     */
    private function logPaginationRequest(int $pageIndex, int $pageSize, ?string $anoCotas): void
    {
        $this->logger->info('Buscando cotas paginadas', [
            'pageIndex' => $pageIndex,
            'pageSize' => $pageSize,
            'anoCotas' => $anoCotas,
        ]);
    }

    /**
     * Cria uma resposta de paginação vazia
     *
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @return array Resposta de paginação vazia
     */
    private function createEmptyPaginationResponse(int $pageIndex, int $pageSize): array
    {
        return [
            'data' => [],
            'totalRegistros' => 0,
            'pageIndex' => $pageIndex,
            'pageSize' => $pageSize,
            'totalPages' => 0,
        ];
    }
}
