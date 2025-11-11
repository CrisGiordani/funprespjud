<?php

namespace App\Repository\Trust\Extrato;

use App\Interface\Trust\Repository\TrustCotasRepositoryInterface;
use App\Interface\Trust\Repository\TrustExtratoRepositoryInterface;
use Doctrine\DBAL\Connection;

class TrustExtratoRepository implements TrustExtratoRepositoryInterface
{
    private $connectTrust;

    public function __construct(
        Connection $connectTrust,
        private readonly TrustCotasRepositoryInterface $trustCotasRepository,
        private readonly string $portalDatabaseName
    ) {
        $this->connectTrust = $connectTrust;
    }

    /**
     * @param $cpf
     * @return mixed
     */
    public function findContribuicoes(array $filter): array
    {
        $cpf = $filter['cpf'];
        $idParticipante = $filter['idParticipante'];

        $startMes = $filter['startMes'] ?? null;
        $startAno = $filter['startAno'] ?? null;
        $endMes = $filter['endMes'] ?? null;
        $endAno = $filter['endAno'] ?? null;

        // Obtém a data da última cota usando o repositório de cotas
        $dtUltimaCota = $this->trustCotasRepository->getDataUltimaCota();

        // dump($dtUltimaCota);
        if (! $dtUltimaCota) {
            return [];
        }

        // Consulta principal
        $qb = $this->connectTrust->createQueryBuilder();
        $builder = $qb
            ->select(
                'PES.NR_CNPJ_CPF as cpf',
                'POA.SG_PESSOA as patrocinador',
                "CONCAT(HCT.NR_ANO_COMP, '-', HCT.NR_MES_COMP) as competencia",
                'HCT.NR_MES_COMP as mesCompetencia',
                'HCT.NR_ANO_COMP as anoCompetencia',
                "CONCAT(FORMAT(HCT.NR_MES_COMP, '00'), '/', HCT.NR_ANO_COMP) as competenciaFormatada",
                'HCT.DT_APORTE as dtRecolhimento',
                'CTB.NM_CONTRIBUICAO as contribuicao',
                'CTB.ID_CONTRIBUICAO as idContribuicao',
                'PTC.TIPO_CONTRIBUICAO as tipoContribuicao',
                'PTC.TIPO_VALOR as tipoValor',
                'PTC.ORIGEM_RECURSO as contribuidor',
                'PTC.COMPOE_IR as compoeIr',
                'HCT.VL_CONTRIB as valorContribuicao',
                'HCT.QT_COTA as qtdCota',
                '(HCT.QT_COTA * IDV.VL_INDEXADOR) as valorAtualizado'
            )
            ->from('PESSOA', 'PES')
            ->innerJoin('PES', 'HIST_CONTRIBUICAO', 'HCT', 'PES.ID_PESSOA = HCT.ID_PESSOA')
            ->innerJoin('HCT', 'CONTRIBUICAO', 'CTB', 'HCT.ID_CONTRIBUICAO = CTB.ID_CONTRIBUICAO')
            ->innerJoin('PES', 'EMPRESA', 'EMP', 'PES.ID_EMP = EMP.ID_EMP')
            ->innerJoin('EMP', 'PESSOA', 'POA', 'EMP.ID_PESSOA_EMP = POA.ID_PESSOA')
            ->innerJoin('HCT', 'INDEXADOR_VALOR', 'IDV', 'HCT.ID_INDEXADOR = IDV.ID_INDEXADOR')
            ->innerJoin('CTB', "{$this->portalDatabaseName}.dbo.PARTICIPANTE_TIPO_CONTRIBUICAO", 'PTC', 'CTB.ID_CONTRIBUICAO = PTC.ID_CONTRIBUICAO_TRUST')
            ->where('PES.ID_PESSOA = :idParticipante')
            ->andWhere('PES.NR_CNPJ_CPF = :cpf')
            ->andWhere('HCT.DT_INDEXADOR <= :dtUltimaCota')
            ->andWhere('IDV.DT_INDEXADOR = :dtUltimaCota')
            ->setParameter('idParticipante', $idParticipante)
            ->setParameter('cpf', $cpf)
            ->setParameter('dtUltimaCota', $dtUltimaCota);

        // Aplica filtros de data se informados
        if ($startMes && $startAno) {
            $builder->andWhere('(HCT.NR_ANO_COMP > :ptStartAno OR (HCT.NR_ANO_COMP = :ptStartAno AND HCT.NR_MES_COMP >= :ptStartMes))')
                ->setParameter('ptStartAno', $startAno)
                ->setParameter('ptStartMes', $startMes);
        }

        if ($endMes && $endAno) {
            $builder->andWhere('(HCT.NR_ANO_COMP < :ptEndAno OR (HCT.NR_ANO_COMP = :ptEndAno AND HCT.NR_MES_COMP <= :ptEndMes))')
                ->setParameter('ptEndAno', $endAno)
                ->setParameter('ptEndMes', $endMes);
        }

        return $builder->executeQuery()->fetchAllAssociative();
    }
}
