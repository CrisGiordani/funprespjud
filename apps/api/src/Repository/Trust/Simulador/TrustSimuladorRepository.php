<?php

namespace App\Repository\Trust\Simulador;

use App\Interface\Trust\Repository\TrustParticipanteRepositoryInterface;
use App\Interface\Trust\Repository\TrustSimuladorRepositoryInterface;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;

class TrustSimuladorRepository implements TrustSimuladorRepositoryInterface
{
    private Connection $connectTrust;
    private LoggerInterface $logger;
    private TrustParticipanteRepositoryInterface $trustParticipanteRepository;

    public function __construct(
        Connection $connectTrust,
        LoggerInterface $logger,
        TrustParticipanteRepositoryInterface $trustParticipanteRepository,
        private readonly string $trustDatabaseName
    ) {
        $this->connectTrust = $connectTrust;
        $this->logger = $logger;
        $this->trustParticipanteRepository = $trustParticipanteRepository;
    }

    public function getSalarioParticipante(array $filter): ?float
    {
        $sql = '
                SELECT TOP(1) NR_ANO_REF, NR_MES_REF
                FROM HIST_SALARIO
                WHERE ID_PESSOA IN (
                    SELECT ID_PESSOA FROM PESSOA WHERE NR_CNPJ_CPF = :cpf
                )
                ORDER BY NR_ANO_REF DESC, NR_MES_REF DESC
            ';

        $stmt = $this->connectTrust->prepare($sql);
        $result = $stmt->executeQuery(['cpf' => $filter['cpf']]);

        $dataReferencia = $result->fetchAssociative();

        if (! $dataReferencia) {
            return 0.0;
        }

        $anoReferencia = $dataReferencia['NR_ANO_REF'];
        $mesReferencia = $dataReferencia['NR_MES_REF'];

        $sql = '
                SELECT VL_SALARIO as salarioParticipante
                FROM HIST_SALARIO
                WHERE ID_PESSOA IN (
                    SELECT ID_PESSOA FROM PESSOA WHERE NR_CNPJ_CPF = :cpf
                )
                AND NR_ANO_REF = :ano
                AND NR_MES_REF = :mes
            ';

        $stmt = $this->connectTrust->prepare($sql);
        $result = $stmt->executeQuery([
            'cpf' => $filter['cpf'],
            'ano' => $anoReferencia,
            'mes' => $mesReferencia,
        ]);

        return $result->fetchOne() ?: 0.0;
    }


    public function getLastHistoricoSalario(string $cpf): ?float
    {
        $sql = "
            SELECT TOP(1)
                SUM(hr.VL_SALARIO) AS SALARIO_TOTAL
            FROM {$this->trustDatabaseName}.dbo.HIST_SALARIO AS hr
            INNER JOIN {$this->trustDatabaseName}.dbo.PESSOA AS p ON hr.ID_PESSOA = p.ID_PESSOA
            WHERE p.NR_CNPJ_CPF = :cpf AND hr.NR_MES_COMP <> 13
            GROUP BY hr.NR_ANO_COMP, hr.NR_MES_COMP, hr.ID_PESSOA
            ORDER BY
                hr.NR_ANO_COMP DESC,
                hr.NR_MES_COMP DESC
            ";

        $stmt = $this->connectTrust->prepare($sql);
        $result = $stmt->executeQuery(['cpf' => $cpf]);

        return $result->fetchOne() ?: 0.0;
    }

    /**
     * Obtém o percentual de contribuição normal
     *
     * @param array $filter Filtros para busca
     * @return float|null Percentual de contribuição
     */
    public function getPercentualContribuicaoNormal(array $filter): ?float
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select('HCP.PC_CONTRIB as percentualContribuicaoNormal')
                ->from('HIST_CONTRIBUICAO_PERCENTUAL', 'HCP')
                ->where('HCP.ID_PESSOA = :idParticipante')
                ->andWhere('HCP.ID_CONTRIBUICAO in (1,7,27)')
                ->setParameter('idParticipante', $filter['idParticipante'])
                ->orderBy('HCP.DT_VIGENCIA', 'DESC')
                ->setMaxResults(1);

            $result = $qb->executeQuery()->fetchAssociative();

            return $result ? (float)$result['percentualContribuicaoNormal'] : null;
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar percentual de contribuição normal: ' . $e->getMessage(), ['filter' => $filter]);

            return null;
        }
    }

    /**
     * Obtém o percentual de contribuição facultativa
     *
     * @param array $filter Filtros para busca
     * @return float|null Percentual de contribuição
     */
    public function getPercentualContribuicaoFacultativa(array $filter): ?float
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select('HCP.PC_CONTRIB as percentualContribuicaoFacultativa')
                ->from('HIST_CONTRIBUICAO_PERCENTUAL', 'HCP')
                ->where('HCP.ID_PESSOA = :idParticipante')
                ->andWhere('HCP.ID_CONTRIBUICAO = 8')
                ->setParameter('idParticipante', $filter['idParticipante'])
                ->orderBy('HCP.DT_VIGENCIA', 'DESC')
                ->setMaxResults(1);
            $result = $qb->executeQuery()->fetchAssociative();

            return isset($result['percentualContribuicaoFacultativa']) ? (float)$result['percentualContribuicaoFacultativa'] : 0.0;
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar percentual de contribuição facultativa: ' . $e->getMessage(), ['filter' => $filter]);

            return null;
        }
    }

    public function getDadosPlano(array $filter, $getAll = false): array
    {
        try {
            $idParticipante = intval($filter['idParticipante']);

            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select(
                    'pct.NM_CATEGORIA as planoCategoria',
                    'psi.NM_SITUACAO as planoSituacao',
                    'pp.ic_tributacao as regimeTributacao'
                )
                ->from('HIST_PLANO_PARTICIPANTE', 'hpp')
                ->innerJoin('hpp', 'PLANO_SITUACAO', 'psi', 'psi.ID_SITUACAO = hpp.ID_SITUACAO')
                ->innerJoin('hpp', 'PLANO_CATEGORIA', 'pct', 'pct.ID_CATEGORIA = hpp.ID_CATEGORIA')
                ->innerJoin('hpp', 'PLANO_PARTICIPANTE', 'pp', 'hpp.ID_PESSOA = pp.ID_PESSOA')
                ->where('hpp.ID_PESSOA = :idParticipante')
                ->setParameter('idParticipante', $idParticipante);

            if (!$getAll) {
                $qb->andWhere('hpp.ID_CATEGORIA <> 9')
                    ->andWhere('hpp.DT_FIM IS NULL');
            }

            return $qb->executeQuery()->fetchAllAssociative() ?: [];
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar dados do plano: ' . $e->getMessage(), ['filter' => $filter]);

            return [];
        }
    }

    public function getRemuneracaoTetoRGPS(): ?array
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $builder = $qb
                ->select('top 1 cast(VL_INDEXADOR as decimal(9,2)) as valor')
                ->from('INDEXADOR_VALOR', 'IV')
                ->where("ID_INDEXADOR='TETO RGPS'")
                ->orderBy('IV.DT_INDEXADOR', 'DESC');

            return $builder->executeQuery()->fetchAssociative();
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar remuneração teto RGPS: ' . $e->getMessage());

            return null;
        }
    }

    /**
     * Obtém a situação anterior do participante
     *
     * @param string  $filter Filtros para busca
     * @return string|null Situação anterior
     */
    public function getSituacaoAnteriorParticipante(string $idParticipante): ?string
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select('TOP 1 PS.NM_SITUACAO situacao_anterior')
                ->from('HIST_PLANO_PARTICIPANTE', 'HPP')
                ->innerJoin('HPP', 'PESSOA', 'P', 'HPP.ID_PESSOA = P.ID_PESSOA')
                ->innerJoin('HPP', 'PLANO_SITUACAO', 'PS', 'PS.ID_SITUACAO = HPP.ID_SITUACAO')
                ->where('P.ID_PESSOA = ' . $idParticipante)
                ->andWhere("HPP.DT_FIM IS NOT NULL")
                ->orderBy('HPP.DT_INI', 'DESC');

            $result = $qb->executeQuery()->fetchAssociative();

            return $result["situacao_anterior"] ?: null;
        } catch (\Throwable $e) {

            $this->logger->error('Erro ao buscar situação anterior: ' . $e->getMessage());

            return null;
        }
    }

    /**
     * Obtém a data do indexador
     *
     * @param string $indexador Tipo do indexador
     * @return array|null Data do indexador
     */
    public function getDataIndexador(string $indexador): ?array
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select('IV.DT_INDEXADOR as dataIndexador')
                ->from('INDEXADOR_VALOR', 'IV')
                ->where('IV.ID_INDEXADOR = :indexador')
                ->setParameter('indexador', $indexador)
                ->setMaxResults(1);

            $result = $qb->executeQuery()->fetchAssociative();

            return $result ?: null;
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar data do indexador: ' . $e->getMessage(), ['indexador' => $indexador]);

            return null;
        }
    }

    /**
     * Obtém os percentuais de contribuição
     *
     * @param string $situacaoConsiderada Situação do participante
     * @return array Percentuais de contribuição
     */
    public function getPercentuaisContribuicao(string $situacaoConsiderada): array
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select('TOP 1 HCP.PC_CONTRIB as percentualContribuicao')
                ->from('HIST_CONTRIBUICAO_PERCENTUAL', 'HCP')
                ->where('HCP.ID_PESSOA = :idParticipante')
                ->andWhere('HCP.ID_CONTRIBUICAO = :idSituacao')
                ->setParameter(':idParticipante', $situacaoConsiderada['idParticipante'])
                ->setParameter(':idSituacao', $situacaoConsiderada['idSituacao'])
                ->orderBy('HCP.DT_VIGENCIA', 'DESC');

            $result = $qb->executeQuery()->fetchAssociative();

            return $result ?: [];
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar percentuais de contribuição: ' . $e->getMessage(), ['situacaoConsiderada' => $situacaoConsiderada]);

            return [];
        }
    }

    /**
     * Obtém os perfis de investimento
     *
     * @return array Lista de perfis de investimento
     */
    public function getPerfisDeInvestimento(): array
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select('PI.ID_PERFIL as idPerfil', 'PI.NM_PERFIL as nomePerfil')
                ->from('PERFIL_INVESTIMENTO', 'PI')
                ->where('PI.IC_ATIVO = :ativo')
                ->setParameter(':ativo', 'S');

            return $qb->executeQuery()->fetchAllAssociative() ?: [];
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar perfis de investimento: ' . $e->getMessage());

            return [];
        }
    }

    /**
     * Obtém o perfil de investimento recomendado
     *
     * @return array Perfil recomendado
     */
    public function getPerfilDeInvestimentoRecomendado(): array
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $qb
                ->select('PI.ID_PERFIL as idPerfil', 'PI.NM_PERFIL as nomePerfil')
                ->from('PERFIL_INVESTIMENTO', 'PI')
                ->where('PI.IC_RECOMENDADO = :recomendado')
                ->setParameter(':recomendado', 'S');

            return $qb->executeQuery()->fetchAssociative() ?: [];
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar perfil recomendado: ' . $e->getMessage());

            return [];
        }
    }

    /**
     * Obtém a rentabilidade projetada
     *
     * @return array Rentabilidade projetada
     */
    public function getRentabilidadeProjetada(string $idIndexadorAnualPerfilInvestimento): array
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $builder = $qb
                ->select('IV.VL_INDEXADOR as rentabilidadeProjetada')
                ->from('INDEXADOR_VALOR', 'IV')
                ->where("IV.ID_INDEXADOR = :idIndexadorAnualPerfilInvestimento")
                ->setParameter('idIndexadorAnualPerfilInvestimento', $idIndexadorAnualPerfilInvestimento)
                ->orderBy('IV.DT_INDEXADOR', 'DESC')
                ->setMaxResults(1);

            return $builder->executeQuery()->fetchAssociative() ?: [];
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar rentabilidade projetada: ' . $e->getMessage());

            return [];
        }
    }

    public function getHistoricoContribuicoes(string $cpf): array
    {
        $qb = $this->connectTrust->createQueryBuilder();

        return $qb->select('VL_CONTRIBUICAO', 'DT_CONTRIBUICAO')
            ->from('HIST_CONTRIBUICAO')
            ->where('ID_PESSOA IN (SELECT ID_PESSOA FROM PESSOA WHERE NR_CNPJ_CPF = :cpf)')
            ->setParameter('cpf', $cpf)
            ->orderBy('DT_CONTRIBUICAO', 'DESC')
            ->executeQuery()
            ->fetchAllAssociative();
    }

    /**
     * Obtém o valor atual da cota
     *
     * @param array $filter Filtros para busca
     * @return float|null Valor atual da cota
     */
    public function getValorCotaAtual(array $filter): ?float
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $builder = $qb
                ->select('TOP(1) IV.VL_INDEXADOR as valorCotaAtual')
                ->from('INDEXADOR_VALOR', 'IV')
                ->where("IV.ID_INDEXADOR = 'COTA'")
                ->orderBy('IV.DT_INDEXADOR', 'DESC');

            $result = $builder->executeQuery()->fetchAssociative();

            return $result['valorCotaAtual'] ? floatval($result['valorCotaAtual']) : null;
        } catch (\Throwable $e) {
            $this->logger->error('Erro ao buscar valor atual da cota: ' . $e->getMessage(), ['filter' => $filter]);

            return null;
        }
    }

    /**
     * @param $anoNascimento
     * @param $idadeAposentadoria
     * @return mixed
     */
    public function getFatorAtuarial(int $anoNascimento, int $idadeAposentadoria): array
    {
        $qb = $this->connectTrust->createQueryBuilder();
        $builder = $qb
            ->select('fa.VL_FATOR_FEM as fatorMulher', 'fa.VL_FATOR_MASC as fatorHomem')
            ->from('FATOR_ATUARIAL', 'fa')
            ->where('fa.NR_ANO_NASCIMENTO = :anoNascimento')
            ->andWhere('fa.NR_IDADE_PART = :idadeAposentadoria')
            ->setParameter('anoNascimento', $anoNascimento)
            ->setParameter('idadeAposentadoria', $idadeAposentadoria);

        $result = $builder->executeQuery()->fetchAllAssociative();

        if (empty($result)) {
            throw new \Exception('Fator atuarial não encontrado para os parâmetros informados');
        }

        return $result;
    }

    public function getSaldoRanRentabilizado(string $cpf): array
    {
        $qb = $this->connectTrust->createQueryBuilder();
        $builder = $qb
            ->select(
                'SUM(CASE WHEN cp.ID_CONTA = 1 THEN h.qt_cota * ct.vl_indexador ELSE 0 END) as saldoRanParticipante',
                'SUM(CASE WHEN cp.ID_CONTA = 2 THEN h.qt_cota * ct.vl_indexador ELSE 0 END) as saldoRanPatrocinador',
                'SUM(CASE WHEN cp.ID_CONTA IN (7,8) THEN h.qt_cota * ct.vl_indexador ELSE 0 END) as saldoRasParticipante'
            )
            ->from('pessoa', 'p')
            ->innerJoin('p', 'hist_contribuicao', 'h', 'p.id_pessoa = h.id_pessoa')
            ->innerJoin('h', 'contribuicao', 'c', 'h.id_contribuicao = c.id_contribuicao')
            ->innerJoin('h', 'conta_contribuicao', 'cc', 'cc.id_contribuicao = h.id_contribuicao')
            ->innerJoin('cc', 'conta_previdencial', 'cp', 'cc.id_conta = cp.id_conta')
            ->innerJoin('h', 'indexador_valor', 'ct', 'ct.id_indexador = \'COTA\'')
            ->where('p.NR_CNPJ_CPF = :cpf')
            ->andWhere('ct.dt_indexador = (SELECT max(dt_indexador) FROM indexador_valor WHERE id_indexador = \'COTA\')')
            ->setParameter('cpf', $cpf);

        $result = $builder->executeQuery()->fetchAssociative();

        return [
            'saldoRanParticipante' => floatval($result['saldoRanParticipante'] ?? 0),
            'saldoRanPatrocinador' => floatval($result['saldoRanPatrocinador'] ?? 0),
            'saldoRasParticipante' => floatval($result['saldoRasParticipante'] ?? 0),
        ];
    }
}
