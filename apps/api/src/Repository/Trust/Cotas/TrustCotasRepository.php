<?php

namespace App\Repository\Trust\Cotas;

use App\DTO\Trust\Input\CotasDTO;
use App\DTO\Trust\Output\CotasOutputDTO;
use App\Enum\Trust\Cotas\TrustCotasEnum;
use App\Helper\Pagination\PaginationHelper;
use App\Interface\Trust\Repository\TrustCotasRepositoryInterface;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\QueryBuilder;
use Psr\Log\LoggerInterface;

final class TrustCotasRepository implements TrustCotasRepositoryInterface
{
    public function __construct(
        private readonly Connection $connectTrust,
        private readonly LoggerInterface $logger
    ) {}

    /**
     * Obtém a cota mais recente disponível no banco de dados
     *
     * @return array<string, mixed> Array contendo os dados da cota atual
     * @throws \Exception Quando ocorre um erro ao buscar a cota
     *
     */
    public function getCotasAtual(): array
    {
        try {
            $qb = $this->createBaseQueryBuilder();
            $result = $qb
                ->setMaxResults(1)
                ->executeQuery()
                ->fetchAssociative();

            if (! $result) {
                $this->logger->warning('Nenhuma cota atual encontrada');

                return [];
            }

            return $this->transformToOutputDTO($result);
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar cotas atuais: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar cotas atuais: ' . $e->getMessage());
        }
    }

    /**
     * Obtém todo o histórico de cotas disponível no banco de dados
     *
     * @return array<int, array<string, mixed>> Array contendo o histórico de cotas
     * @throws \Exception Quando ocorre um erro ao buscar o histórico

     */
    public function getCotasHistorico(): array
    {
        try {
            $this->logger->info('Iniciando busca de histórico de cotas');

            $qb = $this->createBaseQueryBuilder();
            $this->logger->debug('QueryBuilder criado', ['sql' => $qb->getSQL(), 'params' => $qb->getParameters()]);

            $results = $qb
                ->executeQuery()
                ->fetchAllAssociative();

            $this->logger->debug('Resultados brutos encontrados:', ['count' => count($results)]);

            if (empty($results)) {
                $this->logger->warning('Nenhuma cota encontrada no histórico');

                return [];
            }

            $this->logger->info(sprintf('Encontradas %d cotas no histórico', count($results)));

            $transformedResults = array_map(
                fn($result) => $this->transformToOutputDTO($result),
                $results
            );

            $this->logger->debug('Resultados transformados:', ['count' => count($transformedResults)]);

            return $transformedResults;
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar histórico de cotas: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar histórico de cotas: ' . $e->getMessage());
        }
    }

    /**
     * Obtém cotas paginadas com filtro opcional por ano
     *
     * @param array<string, mixed> $filter Filtros para a paginação
     * @return array<string, mixed> Array contendo os dados paginados
     * @throws \Exception Quando ocorre um erro ao buscar as cotas paginadas

     */
    public function getCotasPaginadas(array $filter): array
    {
        try {
            $this->logger->debug('Iniciando getCotasPaginadas', ['filter' => $filter]);

            $params = PaginationHelper::validatePaginationParams($filter);
            $pageIndex = $params['pageIndex'];
            $pageSize = $params['pageSize'];
            $anoCotas = $filter['anoCotas'] ?? null;

            $this->logger->debug('Parâmetros de paginação', [
                'pageIndex' => $pageIndex,
                'pageSize' => $pageSize,
                'anoCotas' => $anoCotas,
            ]);

            $offset = PaginationHelper::calculateOffset($pageIndex, $pageSize);

            $totalRegistros = $this->getTotalRegistros($anoCotas);

            if ($totalRegistros === 0) {
                $this->logger->debug('Nenhum registro encontrado, retornando resposta vazia');

                return PaginationHelper::createEmptyResponse($pageIndex, $pageSize);
            }

            $cotas = $this->getPaginatedData($pageSize, $offset, $anoCotas);
            $cotasTransformed = $this->transformResults($cotas);

            return [
                'cotas' => $cotasTransformed,
                'totalRegistros' => $totalRegistros,
                'pageIndex' => $pageIndex,
                'pageSize' => $pageSize,
                'totalPages' => ceil($totalRegistros / $pageSize),
            ];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar cotas paginadas: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar cotas paginadas: ' . $e->getMessage());
        }
    }

    /**
     * Obtém os resultados dos sorteios
     *
     * @return array<string, mixed> Array contendo os resultados dos sorteios
     * @throws \Exception Quando ocorre um erro ao buscar os resultados
     */
    public function getSorteiosResultados(): array
    {
        try {
            return [];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar resultados de sorteios: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar resultados de sorteios: ' . $e->getMessage());
        }
    }

    /**
     * Cria um QueryBuilder base com os campos comuns para consultas de cotas
     *
     * @return QueryBuilder QueryBuilder configurado com os campos padrão
     */
    private function createBaseQueryBuilder(?string $anoCotas = null): QueryBuilder
    {
        $qb = $this->connectTrust->createQueryBuilder()
            ->select(
                TrustCotasEnum::getFieldWithAliasAs('ID_INDEXADOR', 'idIndexador'),
                TrustCotasEnum::getFieldWithAliasAs('DT_INDEXADOR', 'dtCota'),
                TrustCotasEnum::getFieldWithAliasAs('VL_INDEXADOR', 'vlCota'),
                TrustCotasEnum::getStrFunction('VL_INDEXADOR', 16, 15) . ' as vlCotaFrm',
                TrustCotasEnum::getFieldWithAliasAs('VL_VARIACAO', 'vlVariacao'),
                TrustCotasEnum::getFieldWithAliasAs('IC_PREVIA', 'icPrevia')
            )
            ->from(TrustCotasEnum::TABLE_NAME->value, TrustCotasEnum::ALIAS->value)
            ->where(TrustCotasEnum::getFieldWithAlias('ID_INDEXADOR') . ' = :idIndexador')
            ->setParameter('idIndexador', TrustCotasEnum::ID_INDEXADOR->value);

        if ($anoCotas) {
            $periodoCotas = sprintf('%s-01-01 00:00:00.000', $anoCotas);
            $this->applyYearFilter($qb, $periodoCotas);
        }

        $qb->orderBy(TrustCotasEnum::getFieldWithAlias('DT_INDEXADOR'), 'DESC');

        $this->logger->debug('QueryBuilder criado', [
            'sql' => $qb->getSQL(),
            'params' => $qb->getParameters(),
        ]);

        return $qb;
    }

    /**
     * Aplica filtro por ano no QueryBuilder
     *
     * @param QueryBuilder $qb QueryBuilder a ser modificado
     * @param string $periodoCotas Data inicial do período no formato 'YYYY-01-01 00:00:00.000'
     */
    private function applyYearFilter(QueryBuilder $qb, string $periodoCotas): void
    {
        $ano = substr($periodoCotas, 0, 4);
        $periodoFinal = sprintf('%s-12-31 23:59:59.999', $ano);

        $qb->andWhere(TrustCotasEnum::getFieldWithAlias('DT_INDEXADOR') . ' >= :periodoCotas')
            ->andWhere(TrustCotasEnum::getFieldWithAlias('DT_INDEXADOR') . ' <= :periodoFinal')
            ->setParameter('periodoCotas', $periodoCotas)
            ->setParameter('periodoFinal', $periodoFinal);

        $this->logger->debug('Filtro por ano aplicado', [
            'periodoInicial' => $periodoCotas,
            'periodoFinal' => $periodoFinal,
            'sql' => $qb->getSQL(),
            'params' => $qb->getParameters(),
        ]);
    }

    /**
     * Transforma um array de dados em DTO de saída
     *
     * @param array<string, mixed> $data Dados a serem transformados
     * @return array<string, mixed> Dados transformados no formato do DTO
     * @throws \Exception Quando ocorre um erro na transformação
     */
    private function transformToOutputDTO(array $data): array
    {
        try {
            $this->logger->debug('Dados recebidos para transformação:', $data);

            $cotasDTO = new CotasDTO($data);
            $outputDTO = CotasOutputDTO::fromCotasDTO($cotasDTO);
            $result = $outputDTO->toArray();

            $this->logger->debug('Dados transformados:', $result);

            return $result;
        } catch (\Exception $e) {
            $this->logger->error('Erro ao transformar dados: ' . $e->getMessage());

            throw $e;
        }
    }

    /**
     * Registra informações sobre a requisição de paginação
     *
     * @param int $pageIndex Índice da página
     * @param int $pageSize Tamanho da página
     * @param string|null $anoCotas Ano para filtro (opcional)
     */
    private function logPaginationRequest(int $pageIndex, int $pageSize, ?string $anoCotas): void
    {
        $this->logger->info(sprintf(
            'Buscando cotas paginadas - Página: %d, Tamanho: %d, Ano: %s',
            $pageIndex,
            $pageSize,
            $anoCotas ?? 'todos'
        ));
    }

    /**
     * Obtém o total de registros com filtro opcional por ano
     *
     * @param string|null $anoCotas Ano para filtro (opcional)
     * @return int Total de registros encontrados
     */
    private function getTotalRegistros(?string $anoCotas): int
    {
        $this->logger->debug('Iniciando getTotalRegistros', ['anoCotas' => $anoCotas]);

        $countQb = $this->connectTrust->createQueryBuilder()
            ->select('COUNT(*) as total')
            ->from(TrustCotasEnum::TABLE_NAME->value, TrustCotasEnum::ALIAS->value)
            ->where(TrustCotasEnum::getFieldWithAlias('ID_INDEXADOR') . ' = :idIndexador')
            ->setParameter('idIndexador', TrustCotasEnum::ID_INDEXADOR->value);

        if ($anoCotas) {
            $periodoCotas = sprintf('%s-01-01 00:00:00.000', $anoCotas);
            $this->applyYearFilter($countQb, $periodoCotas);
        }

        $total = $countQb->executeQuery()->fetchAssociative();
        $this->logger->debug('Total de registros encontrados', ['total' => $total['total']]);

        return (int) $total['total'];
    }

    /**
     * Obtém dados paginados com filtro opcional por ano
     *
     * @param int $pageSize Tamanho da página
     * @param int $offset Offset para paginação
     * @param string|null $anoCotas Ano para filtro (opcional)
     * @return array<int, array<string, mixed>> Dados paginados
     */
    private function getPaginatedData(int $pageSize, int $offset, ?string $anoCotas): array
    {
        $this->logger->debug('Iniciando getPaginatedData', [
            'pageSize' => $pageSize,
            'offset' => $offset,
            'anoCotas' => $anoCotas,
        ]);

        $dataQb = $this->createBaseQueryBuilder($anoCotas)
            ->setMaxResults($pageSize)
            ->setFirstResult($offset);

        $this->logger->debug('Query final', [
            'sql' => $dataQb->getSQL(),
            'params' => $dataQb->getParameters(),
        ]);

        $results = $dataQb->executeQuery()->fetchAllAssociative();
        $this->logger->debug('Resultados encontrados', ['count' => count($results)]);

        return $results;
    }

    /**
     * Transforma um array de resultados em DTOs
     *
     * @param array<int, array<string, mixed>> $results Resultados a serem transformados
     * @return array<int, array<string, mixed>> Resultados transformados
     */
    private function transformResults(array $results): array
    {
        return array_map(
            fn($result) => $this->transformToOutputDTO($result),
            $results
        );
    }

    /**
     * Obtém a data da última cota disponível no banco de dados
     *
     * @return string|null Data da última cota ou null se não houver cotas
     * @throws \Exception Quando ocorre um erro ao buscar a data
     */
    public function getDataUltimaCota(): ?string
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $result = $qb
                ->select('DT_INDEXADOR as dt_ultima_cota')
                ->from(TrustCotasEnum::TABLE_NAME->value)
                ->where('ID_INDEXADOR = :idIndexador')
                ->setParameter('idIndexador', TrustCotasEnum::ID_INDEXADOR->value)
                ->orderBy('DT_INDEXADOR', 'DESC')
                ->setMaxResults(1);

            $result = $qb->executeQuery()->fetchAssociative();
            if (! $result || ! $result['dt_ultima_cota']) {
                $this->logger->warning('Nenhuma data de cota encontrada');

                return null;
            }

            return $result['dt_ultima_cota'];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar data da última cota: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar data da última cota: ' . $e->getMessage());
        }
    }
}