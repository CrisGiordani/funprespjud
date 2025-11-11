<?php

namespace App\Repository\Trust\Contribuicao;

use App\DTO\Trust\Input\ContribuicaoAnaliticaImpostoRendaDTO;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\DTO\Trust\Output\ContribuicaoOutputDTO;
use App\Enum\Trust\Contribuicao\TipoContribuicaoEnum;
use App\Enum\Trust\Contribuicao\TipoMantenedorConsolidadoEnum;
use App\Interface\Trust\Repository\TrustCotasRepositoryInterface;
use App\Interface\Trust\Repository\TrustContribuicaoRepositoryInterface;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;

final class TrustContribuicaoRepository implements TrustContribuicaoRepositoryInterface
{
    public function __construct(
        private readonly Connection $connection,
        private readonly LoggerInterface $logger,
        private readonly TrustCotasRepositoryInterface $trustCotasRepository,
        private readonly string $portalDatabaseName,
        private readonly string $trustDatabaseName
    ) {}

    public function demonstrativoAnaliticoImpostoRenda(string $cpf, ContribuicaoFilterDTO $filter, string $mantenedorConsolidado): array
    {
        try {
            $qb = $this->connection->createQueryBuilder();

            $builder = $qb
                ->select(
                    'FF.NR_ANO_COMP as anoCompetencia',
                    'FF.NR_MES_COMP as mesCompetencia',
                    'FF.DT_INDEXADOR as dtIndexador',
                    'CONVERT(VARCHAR, FF.DT_INDEXADOR, 103) as dtRecebimento',
                    'CONVERT(VARCHAR, FF.DT_APORTE, 103) as dtAporte',
                    'SUM(FF.VL_CONTRIB) as valorRecebido'
                )
                ->from('PESSOA', 'P')
                ->innerJoin('P', 'EMPRESA', 'EP', 'P.ID_EMP = EP.ID_EMP')
                ->innerJoin('EP', 'PESSOA', 'EMP', 'EMP.ID_PESSOA = EP.ID_PESSOA_EMP')
                ->innerJoin('P', 'HIST_CONTRIBUICAO', 'FF', 'P.ID_PESSOA = FF.ID_PESSOA')
                ->innerJoin('FF', 'CONTRIBUICAO', 'C', 'C.ID_CONTRIBUICAO = FF.ID_CONTRIBUICAO')
                ->innerJoin('C', "[{$this->portalDatabaseName}].[dbo].[PARTICIPANTE_TIPO_CONTRIBUICAO]", 'PTC', 'FF.ID_CONTRIBUICAO = PTC.ID_CONTRIBUICAO_TRUST')
                ->where('EMP.IC_EMP_PATROC = :icEmpPatroc')
                ->andWhere('PTC.MANTENEDOR_CONSOLIDADO = :mantenedorConsolidado')
                ->andWhere('PTC.COMPOE_IR = :compoeIr')
                ->andWhere('P.NR_CNPJ_CPF = :cpf')
                ->andWhere('EMP.sg_pessoa = :patrocinador')
                ->andWhere('YEAR(FF.DT_APORTE) = :ano')
                ->setParameter('icEmpPatroc', 'S')
                ->setParameter('mantenedorConsolidado', $mantenedorConsolidado)
                ->setParameter('compoeIr', 'S')
                ->setParameter('cpf', $cpf)
                ->setParameter('patrocinador', $filter->getPatrocinador())
                ->setParameter('ano', $filter->getAno())
                ->groupBy(
                    'P.ID_EMP',
                    'EMP.SG_PESSOA',
                    'P.ID_PESSOA',
                    'P.NR_CNPJ_CPF',
                    'P.NM_PESSOA',
                    'FF.NR_ANO_COMP',
                    'FF.NR_MES_COMP',
                    'FF.DT_INDEXADOR',
                    'FF.DT_APORTE',
                    'PTC.ORIGEM_RECURSO',
                    'PTC.MANTENEDOR_CONSOLIDADO'
                )
                ->orderBy('FF.DT_INDEXADOR', 'ASC');

            $this->logger->debug('Query SQL', [
                'sql' => $builder->getSQL(),
                'params' => $builder->getParameters(),
            ]);

            $resultados = $builder->executeQuery()->fetchAllAssociative();

            if (empty($resultados)) {
                $this->logger->info('Nenhum demonstrativo encontrado');

                return [];
            }

            return array_map(fn($contribuicao) => ContribuicaoAnaliticaImpostoRendaDTO::fromArray($contribuicao), $resultados);
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar demonstrativo analitico do imposto de renda: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar demonstrativo analitico do imposto de renda');
        }
    }

    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     * @return array
     */
    public function getContribuicoes(string $cpf, ContribuicaoFilterDTO $filter): array
    {
        try {
            $this->logger->info('Iniciando busca de contribuições', ['cpf' => $cpf, 'filter' => $filter->toArray()]);
            // Primeiro, busca os ID_PESSOA pelo CPF
            $idsPessoa = $this->getIdsPessoaByCpf($cpf);

            // Query principal
            $qb = $this->connection->createQueryBuilder();
            $builder = $qb
                ->select(
                    'POA.SG_PESSOA as patrocinador',
                    'HCT.NR_MES_COMP as mesCompetencia',
                    'HCT.NR_ANO_COMP as anoCompetencia',
                    'HCT.DT_INDEXADOR as dtRecolhimento',
                    'HCT.DT_APORTE as dtAporte',
                    'CTB.NM_CONTRIBUICAO as contribuicao',
                    'CTB.ID_CONTRIBUICAO as idContribuicao',
                    'PTC.TIPO_CONTRIBUICAO as tipoContribuicao',
                    'PTC.TIPO_VALOR as tipoValor',
                    'PTC.ORIGEM_RECURSO as contribuidor',
                    'PTC.ORIGEM_RECURSO as origem_recurso',
                    'PTC.MANTENEDOR_CONSOLIDADO as mantenedor_consolidado',
                    'PTC.MANTENEDOR_CONTRIBUICAO as mantenedor_contribuicao',
                    'PTC.COMPOE_IR as compoeIr',
                    'HCT.VL_CONTRIB as valorContribuicao',
                    'HCT.QT_COTA as qtdCota',
                    'HCT.ID_CONTRIBUICAO as idContribuicaoHistorico',
                    'PTC.GRUPO_CONTRIBUICAO as grupoContribuicao',
                    'PES.ID_PESSOA as idPessoa',
                    'PES.NR_CNPJ_CPF as CPF',
                )

                ->from('PESSOA', 'PES')
                ->innerJoin('PES', 'HIST_CONTRIBUICAO', 'HCT', 'PES.ID_PESSOA = HCT.ID_PESSOA')
                ->innerJoin('HCT', 'CONTRIBUICAO', 'CTB', 'HCT.ID_CONTRIBUICAO = CTB.ID_CONTRIBUICAO')
                ->innerJoin('PES', 'EMPRESA', 'EMP', 'PES.ID_EMP = EMP.ID_EMP')
                ->innerJoin('EMP', 'PESSOA', 'POA', 'EMP.ID_PESSOA_EMP = POA.ID_PESSOA')
                ->innerJoin('CTB', "[{$this->portalDatabaseName}].[dbo].[PARTICIPANTE_TIPO_CONTRIBUICAO]", 'PTC', 'CTB.ID_CONTRIBUICAO = PTC.ID_CONTRIBUICAO_TRUST')
                ->where($qb->expr()->in('PES.ID_PESSOA', $idsPessoa))
                ->andWhere('HCT.QT_COTA <> 0')
                ->andWhere('HCT.ID_CONTRIBUICAO not in (480,481)')
                ->orderBy('HCT.DT_APORTE', 'DESC')
                ->distinct(true);

            // Aplica filtros de data se fornecidos
            if ($filter->getDataInicial() || $filter->getDataFinal()) {

                $dataInicial = $filter->getDataInicial();
                $dataFinal = $filter->getDataFinal();

                // Detecta se é formato de data (m/Y) ou apenas mês/ano
                if ($dataInicial && strpos($dataInicial, '/') !== false) {
                    // Formato de data (ex: "01/2024")
                    $dataInicialObj = \DateTime::createFromFormat('m/Y', $dataInicial);
                    if ($dataInicialObj) {
                        $dataInicialObj->setDate($dataInicialObj->format('Y'), $dataInicialObj->format('m'), 1);

                        // Aplica filtro de data inicial
                        $builder->andWhere('(HCT.NR_ANO_COMP > :ptStartAno OR (HCT.NR_ANO_COMP = :ptStartAno AND HCT.NR_MES_COMP >= :ptStartMes))')
                            ->setParameter('ptStartAno', $dataInicialObj->format('Y'))
                            ->setParameter('ptStartMes', $dataInicialObj->format('m'));
                    }
                } elseif ($dataInicial && is_numeric($dataInicial)) {
                    // Apenas número - detecta se é mês ou ano
                    if (intval($dataInicial) >= 1 && intval($dataInicial) <= 12) {
                        // É um mês (1-12)
                        $builder->andWhere('HCT.NR_MES_COMP = :mes')
                            ->setParameter('mes', intval($dataInicial));
                    } elseif (intval($dataInicial) >= 1900 && intval($dataInicial) <= 2100) {
                        // É um ano (1900-2100)
                        $builder->andWhere('HCT.NR_ANO_COMP = :ano')
                            ->setParameter('ano', intval($dataInicial));
                    }
                }

                if ($dataFinal && strpos($dataFinal, '/') !== false) {
                    // Formato de data (ex: "12/2024")
                    $dataFinalObj = \DateTime::createFromFormat('m/Y', $dataFinal);
                    if ($dataFinalObj) {
                        $dataFinalObj->setDate($dataFinalObj->format('Y'), $dataFinalObj->format('m'), $dataFinalObj->format('t'));

                        // Aplica filtro de data final
                        $builder->andWhere('(HCT.NR_ANO_COMP < :ptEndAno OR (HCT.NR_ANO_COMP = :ptEndAno AND HCT.NR_MES_COMP <= :ptEndMes))')
                            ->setParameter('ptEndAno', $dataFinalObj->format('Y'))
                            ->setParameter('ptEndMes', $dataFinalObj->format('m'));
                    }
                } elseif ($dataFinal && is_numeric($dataFinal)) {
                    // Apenas número - detecta se é mês ou ano
                    if (intval($dataFinal) >= 1 && intval($dataFinal) <= 12) {
                        // É um mês (1-12)
                        $builder->andWhere('HCT.NR_MES_COMP = :mes')
                            ->setParameter('mes', intval($dataFinal));
                    } elseif (intval($dataFinal) >= 1900 && intval($dataFinal) <= 2100) {
                        // É um ano (1900-2100)
                        $builder->andWhere('HCT.NR_ANO_COMP = :ano')
                            ->setParameter('ano', intval($dataFinal));
                    }
                }
            }

            // Aplica filtro de tipo se fornecido
            if ($filter->getTipo()) {
                switch ($filter->getTipo()) {
                    case 'BPD':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO = :bpd')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->andWhere('PTC.TIPO_CONTRIBUICAO NOT LIKE :NATALINA')
                            ->andWhere('HCT.NR_MES_COMP not in (13)')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('NATALINA', '%NATALINA%')
                            ->setParameter('bpd', 'BPD');

                        break;

                    case 'ESTORNO':
                        $builder->andWhere('CTB.NM_CONTRIBUICAO LIKE :estorno AND CTB.NM_CONTRIBUICAO LIKE :viaMapa AND CTB.NM_CONTRIBUICAO LIKE :partic')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('viaMapa', '%VIA MAPA%')
                            ->setParameter('partic', '%PARTIC%');

                        break;

                    case 'NAT':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO LIKE :nat')
                            ->setParameter('nat', '%NAT%')
                        ;

                        break;

                    case 'CAR':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO LIKE :car')
                            ->setParameter('car', '%SEG%');

                        break;

                    case 'FACULTATIVA':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO = :facultativa')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('facultativa', 'FACULTATIVA');

                        break;

                    case 'NORMAL':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO = :normal')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('normal', 'NORMAL');

                        break;

                    case 'VINCULADA':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO = :vinculado')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('vinculado', 'VINCULADA');

                        break;
                    case 'PAGTO':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO = :pagto')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('pagto', 'CONCESSÃO');

                        break;

                    case 'MULTA':
                        $builder->andWhere('PTC.TIPO_CONTRIBUICAO = :multa')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('multa', 'MULTA');

                        break;

                    case 'DEVOL':
                        $builder->andWhere('PTC.GRUPO_CONTRIBUICAO = :devol')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('devol', 'DEVOLUÇÃO');

                        break;

                    default:
                        $builder->andWhere('PTC.GRUPO_CONTRIBUICAO LIKE :tipo')
                            ->setParameter('tipo', '%' . $filter->getTipo() . '%');

                        break;
                }
            }

            // Aplica filtro de órgão se fornecido
            if ($filter->getOrgao()) {
                $builder->andWhere('POA.SG_PESSOA = :orgao')
                    ->setParameter('orgao', $filter->getOrgao());
            }

            // Aplica filtro de autor se fornecido
            if ($filter->getAutor()) {
                $builder->andWhere('PTC.ORIGEM_RECURSO = :autor')
                    ->setParameter('autor', $filter->getAutor());
            }

            $this->logger->debug('Query SQL', [
                'sql' => $builder->getSQL(),
                'params' => $builder->getParameters(),
            ]);


            $resultados = $builder->executeQuery()->fetchAllAssociative();
            if (empty($resultados)) {
                $this->logger->info('Nenhuma contribuição encontrada');

                return [];
            }

            $contribuicoes = array_map(
                fn($resultado) => new ContribuicaoOutputDTO($resultado),
                $resultados
            );

            $this->logger->info('Contribuições encontradas', ['count' => count($contribuicoes)]);

            return $contribuicoes;
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar contribuições: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar contribuições: ' . $e->getMessage());
        }
    }


    /**
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     * @return array
     */
    public function getContribuicoesPERFIL(string $cpf, ContribuicaoFilterDTO $filter): array
    {
        try {
            $this->logger->info('Iniciando busca de contribuições', ['cpf' => $cpf, 'filter' => $filter->toArray()]);
            // Primeiro, busca os ID_PESSOA pelo CPF
            $idsPessoa = $this->getIdsPessoaByCpf($cpf);

            $dtUltimaCota = $this->trustCotasRepository->getDataUltimaCota();

            // Query principal
            $qb = $this->connection->createQueryBuilder();
            $builder = $qb
                ->select(
                    'POA.SG_PESSOA as patrocinador',
                    'HCT.NR_MES_COMP as mesCompetencia',
                    'HCT.NR_ANO_COMP as anoCompetencia',
                    'HCT.DT_INDEXADOR as dtRecolhimento',
                    'HCT.DT_APORTE as dtAporte',
                    'CTB.NM_CONTRIBUICAO as contribuicao',
                    'CTB.ID_CONTRIBUICAO as idContribuicao',
                    'PTC.TIPO_CONTRIBUICAO as tipoContribuicao',
                    'PTC.TIPO_VALOR as tipoValor',
                    'PTC.ORIGEM_RECURSO as contribuidor',
                    'PTC.ORIGEM_RECURSO as origem_recurso',
                    'PTC.MANTENEDOR_CONSOLIDADO as mantenedor_consolidado',
                    'PTC.MANTENEDOR_CONTRIBUICAO as mantenedor_contribuicao',
                    'PTC.COMPOE_IR as compoeIr',
                    'HCT.VL_CONTRIB as valorContribuicao',
                    'HCT.QT_COTA as qtdCota',
                    'HCT.ID_CONTRIBUICAO as idContribuicaoHistorico',
                    'PTC.GRUPO_CONTRIBUICAO as grupoContribuicao',
                    'PES.ID_PESSOA as idPessoa',
                    'PES.NR_CNPJ_CPF as CPF',
                    'PPP.ID_PLANO AS idPlano',
                    'PPP.DT_VIGENCIA AS dtVigencia',
                    'PPP.ID_PERFIL AS idPerfil',
                    'CPF.NM_PERFIL AS nmPerfil'
                )
                ->from('PESSOA', 'PES')
                ->innerJoin('PES', 'HIST_CONTRIBUICAO', 'HCT', 'PES.ID_PESSOA = HCT.ID_PESSOA')
                ->innerJoin('PES', 'EMPRESA', 'EMP', 'PES.ID_EMP = EMP.ID_EMP')
                ->innerJoin('HCT', 'CONTRIBUICAO', 'CTB', 'HCT.ID_CONTRIBUICAO = CTB.ID_CONTRIBUICAO')
                ->innerJoin('CTB', "[{$this->portalDatabaseName}].[dbo].[PARTICIPANTE_TIPO_CONTRIBUICAO]", 'PTC', 'CTB.ID_CONTRIBUICAO = PTC.ID_CONTRIBUICAO_TRUST')
                ->innerJoin('EMP', 'PESSOA', 'POA', 'EMP.ID_PESSOA_EMP = POA.ID_PESSOA')
                ->innerJoin('PES', "[{$this->trustDatabaseName}].[dbo].[PERFIL_PLANO_PARTICIPANTE]", 'PPP', 'PES.ID_PESSOA = PPP.ID_PESSOA')
                ->innerJoin('PPP', "[{$this->trustDatabaseName}].[dbo].[CONFIG_PERFIL]", 'CPF', 'PPP.ID_PERFIL = CPF.ID_PERFIL')
                ->where($qb->expr()->in('PES.ID_PESSOA', $idsPessoa))
                ->andWhere('HCT.QT_COTA <> 0')
                ->andWhere('HCT.ID_CONTRIBUICAO not in (480,481)')
                ->orderBy('HCT.DT_APORTE', 'DESC');

            // Aplica filtros de data se fornecidos
            if ($filter->getDataInicial() || $filter->getDataFinal()) {

                $dataInicial = $filter->getDataInicial();
                $dataFinal = $filter->getDataFinal();

                // Detecta se é formato de data (m/Y) ou apenas mês/ano
                if ($dataInicial && strpos($dataInicial, '/') !== false) {
                    // Formato de data (ex: "01/2024")
                    $dataInicialObj = \DateTime::createFromFormat('m/Y', $dataInicial);
                    if ($dataInicialObj) {
                        $dataInicialObj->setDate($dataInicialObj->format('Y'), $dataInicialObj->format('m'), 1);

                        // Aplica filtro de data inicial
                        $builder->andWhere('(HCT.NR_ANO_COMP > :ptStartAno OR (HCT.NR_ANO_COMP = :ptStartAno AND HCT.NR_MES_COMP >= :ptStartMes))')
                            ->setParameter('ptStartAno', $dataInicialObj->format('Y'))
                            ->setParameter('ptStartMes', $dataInicialObj->format('m'));
                    }
                } elseif ($dataInicial && is_numeric($dataInicial)) {
                    // Apenas número - detecta se é mês ou ano
                    if (intval($dataInicial) >= 1 && intval($dataInicial) <= 12) {
                        // É um mês (1-12)
                        $builder->andWhere('HCT.NR_MES_COMP = :mes')
                            ->setParameter('mes', intval($dataInicial));
                    } elseif (intval($dataInicial) >= 1900 && intval($dataInicial) <= 2100) {
                        // É um ano (1900-2100)
                        $builder->andWhere('HCT.NR_ANO_COMP = :ano')
                            ->setParameter('ano', intval($dataInicial));
                    }
                }

                if ($dataFinal && strpos($dataFinal, '/') !== false) {
                    // Formato de data (ex: "12/2024")
                    $dataFinalObj = \DateTime::createFromFormat('m/Y', $dataFinal);
                    if ($dataFinalObj) {
                        $dataFinalObj->setDate($dataFinalObj->format('Y'), $dataFinalObj->format('m'), $dataFinalObj->format('t'));

                        // Aplica filtro de data final
                        $builder->andWhere('(HCT.NR_ANO_COMP < :ptEndAno OR (HCT.NR_ANO_COMP = :ptEndAno AND HCT.NR_MES_COMP <= :ptEndMes))')
                            ->setParameter('ptEndAno', $dataFinalObj->format('Y'))
                            ->setParameter('ptEndMes', $dataFinalObj->format('m'));
                    }
                } elseif ($dataFinal && is_numeric($dataFinal)) {
                    // Apenas número - detecta se é mês ou ano
                    if (intval($dataFinal) >= 1 && intval($dataFinal) <= 12) {
                        // É um mês (1-12)
                        $builder->andWhere('HCT.NR_MES_COMP = :mes')
                            ->setParameter('mes', intval($dataFinal));
                    } elseif (intval($dataFinal) >= 1900 && intval($dataFinal) <= 2100) {
                        // É um ano (1900-2100)
                        $builder->andWhere('HCT.NR_ANO_COMP = :ano')
                            ->setParameter('ano', intval($dataFinal));
                    }
                }
            }

            // Aplica filtro de tipo se fornecido
            if ($filter->getTipo()) {
                switch ($filter->getTipo()) {
                    case 'TRANSFERENCIA':
                        $builder->andWhere('PTC.GRUPO_CONTRIBUICAO = :transfer')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :estorno')
                            ->andWhere('CTB.NM_CONTRIBUICAO NOT LIKE :NAT')
                            ->setParameter('estorno', '%ESTORNO%')
                            ->setParameter('NAT', '%NAT%')
                            ->setParameter('transfer', 'TRANSFERÊNCIA DE PERFIL');

                        break;

                    default:
                        $builder->andWhere('PTC.GRUPO_CONTRIBUICAO LIKE :tipo')
                            ->setParameter('tipo', '%' . $filter->getTipo() . '%');

                        break;
                }
            }

            // Aplica filtro de órgão se fornecido
            if ($filter->getOrgao()) {
                $builder->andWhere('POA.SG_PESSOA = :orgao')
                    ->setParameter('orgao', $filter->getOrgao());
            }

            // Aplica filtro de autor se fornecido
            if ($filter->getAutor()) {
                $builder->andWhere('PTC.ORIGEM_RECURSO = :autor')
                    ->setParameter('autor', $filter->getAutor());
            }

            $this->logger->debug('Query SQL', [
                'sql' => $builder->getSQL(),
                'params' => $builder->getParameters(),
            ]);

            $resultados = $builder->executeQuery()->fetchAllAssociative();
            if (empty($resultados)) {
                $this->logger->info('Nenhuma contribuição encontrada');

                return [];
            }

            $contribuicoes = array_map(
                fn($resultado) => new ContribuicaoOutputDTO($resultado),
                $resultados
            );
            $this->logger->info('Contribuições encontradas', ['count' => count($contribuicoes)]);

            return $contribuicoes;
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar contribuições: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar contribuições: ' . $e->getMessage());
        }
    }


    /**
     * @param string $cpf
     * @param TipoMantenedorConsolidadoEnum $contribuidor
     *
     * @return array
     */
    public function getContribuicaoDoMes(string $cpf, TipoMantenedorConsolidadoEnum $contribuidor): array
    {
        try {
            $this->logger->info('Iniciando busca de contribuições por mes e ano', ['cpf' => $cpf, 'contribuidor' => $contribuidor->getValue()]);

            // Primeiro, busca os ID_PESSOA pelo CPF
            $idsPessoa = $this->getIdsPessoaByCpf($cpf);

            // Query principal
            $qb = $this->connection->createQueryBuilder();
            $builder = $qb
                ->select(
                    'HCT.NR_MES_COMP as mesCompetencia',
                    'HCT.NR_ANO_COMP as anoCompetencia',
                    'PTC.MANTENEDOR_CONTRIBUICAO as mantenedor_contribuicao',
                    'SUM(HCT.VL_CONTRIB) as totalContribuicaoDoMes',
                    'MAX(HCT.DT_APORTE) as dtUltimoAporte'
                )
                ->from('PESSOA', 'PES')
                ->innerJoin('PES', 'HIST_CONTRIBUICAO', 'HCT', 'PES.ID_PESSOA = HCT.ID_PESSOA')
                ->innerJoin('HCT', 'CONTRIBUICAO', 'CTB', 'HCT.ID_CONTRIBUICAO = CTB.ID_CONTRIBUICAO')
                ->innerJoin('PES', 'EMPRESA', 'EMP', 'PES.ID_EMP = EMP.ID_EMP')
                ->innerJoin('EMP', 'PESSOA', 'POA', 'EMP.ID_PESSOA_EMP = POA.ID_PESSOA')
                ->innerJoin('CTB', "[{$this->portalDatabaseName}].[dbo].[PARTICIPANTE_TIPO_CONTRIBUICAO]", 'PTC', 'CTB.ID_CONTRIBUICAO = PTC.ID_CONTRIBUICAO_TRUST')
                ->where($qb->expr()->in('PES.ID_PESSOA', $idsPessoa))
                ->andWhere('PTC.MANTENEDOR_CONTRIBUICAO = :contribuidor')
                ->setParameter('contribuidor', $contribuidor->getValue())
                ->andWhere('HCT.QT_COTA <> 0')
                ->groupBy(
                    'PTC.MANTENEDOR_CONTRIBUICAO',
                    'HCT.NR_MES_COMP',
                    'HCT.NR_ANO_COMP'
                )
                ->orderBy('HCT.NR_ANO_COMP', 'DESC')
                ->addOrderBy('HCT.NR_MES_COMP', 'DESC')
                ->setMaxResults(1);

            $this->logger->debug('Query SQL', [
                'sql' => $builder->getSQL(),
                'params' => $builder->getParameters(),
            ]);

            $resultados = $builder->executeQuery()->fetchAllAssociative();

            if (empty($resultados)) {
                $this->logger->info('Nenhuma contribuição encontrada');

                return [];
            }

            $this->logger->info('Contribuições encontradas', ['count' => count($resultados)]);

            return $resultados[0];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar contribuições: ' . $e->getMessage());
            throw new \Exception('Erro ao buscar contribuições: ' . $e->getMessage());
        }
    }

    /**
     * @param int $idPessoa
     *
     * @return array|null
     */
    public function getUltimaContribuicaoFacultativaByCpf(int $idPessoa): ?array
    {
        try {
            $result = $this->connection->createQueryBuilder()
                ->select('*')
                ->from('HIST_CONTRIBUICAO_PERCENTUAL')
                ->where('ID_PESSOA = :idPessoa')
                ->andWhere('ID_CONTRIBUICAO = :idContribuicao')
                ->setParameter('idPessoa', $idPessoa)
                ->setParameter('idContribuicao', TipoContribuicaoEnum::CONTRIBUICAO_FACULTATIVA->getValue())
                ->orderBy('DT_VIGENCIA', 'DESC')
                ->setMaxResults(1)
                ->executeQuery()
                ->fetchAllAssociative();

            if (! $result) {
                return null;
            }

            return $result[0];
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar contribuição facultativa: ' . $e->getMessage());

            throw $e;
        }
    }

    public function getContribuicoesSaldo(string $cpf): array
    {
        try {
            $this->logger->info('Iniciando busca de contribuições de saldo', ['cpf' => $cpf]);

            $idsPessoa = $this->getIdsPessoaByCpf($cpf);

            $qb = $this->connection->createQueryBuilder();
            $builder = $qb
                ->select(
                    'SUM(h.vl_contrib) valorContribuicao',
                    'SUM(h.qt_cota) totalCotas',
                    'cp.id_conta as idConta',
                )
                ->from('hist_contribuicao', 'h')
                ->innerJoin('h', 'conta_contribuicao', 'cc', 'cc.id_contribuicao = h.id_contribuicao')
                ->innerJoin('cc', 'conta_previdencial', 'cp', 'cc.id_conta = cp.id_conta')
                ->where("cp.IC_SOMA_SALDO = 'S'")
                ->andWhere('h.QT_COTA <> 0')
                ->andWhere($qb->expr()->in('h.ID_PESSOA', $idsPessoa))
                ->groupBy('cp.id_conta');

            return $builder->executeQuery()->fetchAllAssociative();
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar contribuições de saldo: ' . $e->getMessage());

            throw new \Exception('Erro ao buscar contribuições de saldo: ' . $e->getMessage());
        }
    }

    function getIdsPessoaByCpf(string $cpf): array
    {
        try {
            $this->logger->info('Iniciando busca de ID_PESSOA pelo CPF', ['cpf' => $cpf]);

            $qb = $this->connection->createQueryBuilder();
            $builder = $qb
                ->select('ID_PESSOA')
                ->from('PESSOA')
                ->where('NR_CNPJ_CPF = :cpf')
                ->setParameter('cpf', $cpf);

            return $builder->executeQuery()->fetchFirstColumn();
        } catch (\Exception $e) {
            $this->logger->error('Erro ao buscar ID_PESSOA pelo CPF: ' . $e->getMessage());

            throw $e;
        }
    }
}