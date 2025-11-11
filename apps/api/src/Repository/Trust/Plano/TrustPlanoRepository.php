<?php

namespace App\Repository\Trust\Plano;

use App\DTO\Trust\Output\DadosPlanoOutputDTO;
use App\Interface\Trust\Repository\TrustPlanoRepositoryInterface;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;

final class TrustPlanoRepository implements TrustPlanoRepositoryInterface
{
    public function __construct(
        private readonly Connection $connection,
        private readonly LoggerInterface $logger
    ) {}

    /**
     * @param string $cpf
     * @return DadosPlanoOutputDTO[]
     */
    public function getPlanosByCpf(string $cpf, bool $allPlanos = false): array
    {
        try {
            $qb = $this->connection->createQueryBuilder();
            $builder = $qb->select(
                'emp.sg_pessoa as orgao',
                'p.NM_PLANO as plano',
                'p.NR_PLANO_SPC as cnpb',
                'pp.DT_INI_PLANO as dtInscricao',
                'hpp.DT_INI as dtInicio',
                'hpp.DT_FIM as dtFim',
                'ps.NM_SITUACAO as situacao',
                'pc.NM_CATEGORIA AS categoria',
                'pp.ic_tributacao as regimeTributacao',
                'hcp.pc_contrib percentualContribuicao',
                'c.NM_CONTRIBUICAO tipoContribuicao'
            )
                ->from('PESSOA', 'pe')
                ->innerJoin('pe', 'PLANO_PARTICIPANTE', 'pp', 'pe.ID_PESSOA = pp.ID_PESSOA')
                ->innerJoin('pe', 'EMPRESA', 'em', 'pe.id_emp = em.id_emp')
                ->innerJoin('pp', 'HIST_PLANO_PARTICIPANTE', 'hpp', 'pp.ID_PESSOA = hpp.ID_PESSOA')
                ->innerJoin('pp', 'PLANO', 'p', 'pp.ID_PLANO = p.ID_PLANO')
                ->innerJoin('hpp', 'PLANO_CATEGORIA', 'pc', 'pc.ID_CATEGORIA = hpp.ID_CATEGORIA')
                ->innerJoin('hpp', 'PLANO_SITUACAO', 'ps', 'hpp.ID_SITUACAO = ps.ID_SITUACAO')
                ->innerJoin('em', "
                (SELECT
                    a1.ID_PESSOA,
                    a1.ID_EMP,
                    a1.SG_PESSOA,
                    a1.NM_PESSOA,
                    a1.NR_CNPJ_CPF
                FROM
                    pessoa a1
                WHERE
                    a1.ic_emp_patroc = 'S')", 'emp', 'emp.id_pessoa = em.id_pessoa_emp')
                ->innerJoin('pe', 'hist_contribuicao_percentual', 'hcp', 'hcp.ID_PESSOA = pe.ID_PESSOA')
                ->innerJoin('hcp', 'CONTRIBUICAO', 'c', 'c.ID_CONTRIBUICAO = hcp.ID_CONTRIBUICAO')
                ->where('pe.NR_CNPJ_CPF = :cpf')
                ->setParameter('cpf', $cpf)
                ->andWhere($allPlanos ? 'hpp.DT_FIM IS NULL OR pp.DT_FIM_PLANO IS NULL' : 'hpp.DT_FIM IS NULL')
                ->andWhere('hcp.ID_CONTRIBUICAO in (1,7,27)')
                ->andWhere('concat(hcp.ID_PESSOA,
                hcp.id_contribuicao,
                CONVERT(VARCHAR,hcp.DT_VIGENCIA,103)) in
                   (SELECT
                        concat(hcp_latest.id_pessoa, hcp_latest.id_contribuicao, CONVERT(VARCHAR,hcp_latest.DT_VIGENCIA,103))
                    FROM
                        hist_contribuicao_percentual hcp_latest
                    INNER JOIN (
                        SELECT
                            hcp_max.id_pessoa,
                            hcp_max.id_contribuicao,
                            max(hcp_max.DT_VIGENCIA) as max_vigencia
                        FROM
                            hist_contribuicao_percentual hcp_max
                        WHERE
                            hcp_max.id_pessoa = hcp.ID_PESSOA
                            and hcp_max.ID_CONTRIBUICAO = hcp.ID_CONTRIBUICAO
                        GROUP BY hcp_max.id_pessoa, hcp_max.id_contribuicao
                    ) latest ON hcp_latest.id_pessoa = latest.id_pessoa
                               AND hcp_latest.id_contribuicao = latest.id_contribuicao
                               AND hcp_latest.DT_VIGENCIA = latest.max_vigencia
                    WHERE
                        hcp_latest.PC_CONTRIB > 0)')
                ->orderBy('pp.DT_INI_PLANO ', 'DESC');

            // Log the SQL query and parameters
            $this->logger->debug('SQL Query:', [
                'sql' => $builder->getSQL(),
                'parameters' => $builder->getParameters(),
            ]);

            $dados = $builder->executeQuery()->fetchAllAssociative();

            $planos = [];
            foreach ($dados as $dado) {
                $plano = new DadosPlanoOutputDTO();
                $plano->setOrgao($dado['orgao'])
                    ->setPlano($dado['plano'])
                    ->setCnpb($dado['cnpb'])
                    ->setDtInscricao($dado['dtInscricao'])
                    ->setDtInicio($dado['dtInicio'])
                    ->setDtFim($dado['dtFim'])
                    ->setSituacao($dado['situacao'])
                    ->setCategoria($dado['categoria'])
                    ->setRegimeTributacao($dado['regimeTributacao'])
                    ->setPercentualContribuicao((float)$dado['percentualContribuicao'])
                    ->setTipoContribuicao($dado['tipoContribuicao']);

                $planos[] = $plano;
            }

            return $planos;
        } catch (\Exception $exception) {
            $this->logger->error('Erro ao buscar planos por CPF: ' . $exception->getMessage(), ['cpf' => $cpf]);

            throw $exception;
        }
    }

    /**
     * @param string $cpf
     * @param int $id
     * @return DadosPlanoOutputDTO|null
     */
    public function getPlanoById(string $cpf, int $id): ?DadosPlanoOutputDTO
    {
        try {
            $qb = $this->connection->createQueryBuilder();
            $builder = $qb->select(
                'emp.sg_pessoa as orgao',
                'p.NM_PLANO as plano',
                'p.NR_PLANO_SPC as cnpb',
                'pp.DT_INI_PLANO as dtInscricao',
                'hpp.DT_INI as dtInicio',
                'hpp.DT_FIM as dtFim',
                'ps.NM_SITUACAO as situacao',
                'pc.NM_CATEGORIA AS categoria',
                'pp.ic_tributacao as regimeTributacao',
                'hcp.pc_contrib percentualContribuicao',
                'c.NM_CONTRIBUICAO tipoContribuicao'
            )
                ->from('PESSOA', 'pe')
                ->innerJoin('pe', 'PLANO_PARTICIPANTE', 'pp', 'pe.ID_PESSOA = pp.ID_PESSOA')
                ->innerJoin('pe', 'EMPRESA', 'em', 'pe.id_emp = em.id_emp')
                ->innerJoin('pp', 'HIST_PLANO_PARTICIPANTE', 'hpp', 'pp.ID_PESSOA = hpp.ID_PESSOA')
                ->innerJoin('pp', 'PLANO', 'p', 'pp.ID_PLANO = p.ID_PLANO')
                ->innerJoin('hpp', 'PLANO_CATEGORIA', 'pc', 'pc.ID_CATEGORIA = hpp.ID_CATEGORIA')
                ->innerJoin('hpp', 'PLANO_SITUACAO', 'ps', 'hpp.ID_SITUACAO = ps.ID_SITUACAO')
                ->innerJoin('em', "
                (SELECT
                    a1.ID_PESSOA,
                    a1.ID_EMP,
                    a1.SG_PESSOA,
                    a1.NM_PESSOA,
                    a1.NR_CNPJ_CPF
                FROM
                    pessoa a1
                WHERE
                    a1.ic_emp_patroc = 'S')", 'emp', 'emp.id_pessoa = em.id_pessoa_emp')
                ->innerJoin('pe', 'hist_contribuicao_percentual', 'hcp', 'hcp.ID_PESSOA = pe.ID_PESSOA')
                ->innerJoin('hcp', 'CONTRIBUICAO', 'c', 'c.ID_CONTRIBUICAO = hcp.ID_CONTRIBUICAO')
                ->where('pe.NR_CNPJ_CPF = :cpf')
                ->andWhere('p.ID_PLANO = :id')
                ->setParameters([
                    'cpf' => $cpf,
                    'id' => $id,
                ])
                ->andWhere('hpp.DT_FIM IS NULL')
                ->andWhere('hcp.ID_CONTRIBUICAO in (1,7,27)')
                ->andWhere('concat(hcp.ID_PESSOA,
                hcp.id_contribuicao,
                CONVERT(VARCHAR,hcp.DT_VIGENCIA,103)) in
                   (SELECT
                        concat(hcp_latest.id_pessoa, hcp_latest.id_contribuicao, CONVERT(VARCHAR,hcp_latest.DT_VIGENCIA,103))
                    FROM
                        hist_contribuicao_percentual hcp_latest
                    INNER JOIN (
                        SELECT
                            hcp_max.id_pessoa,
                            hcp_max.id_contribuicao,
                            max(hcp_max.DT_VIGENCIA) as max_vigencia
                        FROM
                            hist_contribuicao_percentual hcp_max
                        WHERE
                            hcp_max.id_pessoa = hcp.ID_PESSOA
                            and hcp_max.ID_CONTRIBUICAO = hcp.ID_CONTRIBUICAO
                        GROUP BY hcp_max.id_pessoa, hcp_max.id_contribuicao
                    ) latest ON hcp_latest.id_pessoa = latest.id_pessoa
                               AND hcp_latest.id_contribuicao = latest.id_contribuicao
                               AND hcp_latest.DT_VIGENCIA = latest.max_vigencia
                    WHERE
                        hcp_latest.PC_CONTRIB > 0)');

            $dados = $builder->executeQuery()->fetchAllAssociative();

            if (empty($dados)) {
                return null;
            }

            $dado = array_shift($dados);
            $plano = new DadosPlanoOutputDTO();
            $plano->setOrgao($dado['orgao'])
                ->setPlano($dado['plano'])
                ->setCnpb($dado['cnpb'])
                ->setDtInscricao($dado['dtInscricao'])
                ->setDtInicio($dado['dtInicio'])
                ->setDtFim($dado['dtFim'])
                ->setSituacao($dado['situacao'])
                ->setCategoria($dado['categoria'])
                ->setRegimeTributacao($dado['regimeTributacao'])
                ->setPercentualContribuicao((float)$dado['percentualContribuicao'])
                ->setTipoContribuicao($dado['tipoContribuicao']);

            return $plano;
        } catch (\Exception $exception) {
            $this->logger->error('Erro ao buscar plano por ID: ' . $exception->getMessage(), ['cpf' => $cpf, 'id' => $id]);

            throw $exception;
        }
    }
}
