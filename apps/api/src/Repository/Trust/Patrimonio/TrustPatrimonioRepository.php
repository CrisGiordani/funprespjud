<?php

namespace App\Repository\Trust\Patrimonio;

use App\Enum\Trust\Contribuicao\ContribuicaoEnum;
use App\Interface\Trust\Repository\TrustPatrimonioRepositoryInterface;
use Doctrine\DBAL\Connection;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use App\Interface\Trust\Service\TrustCotasServiceInterface;

class TrustPatrimonioRepository implements TrustPatrimonioRepositoryInterface
{
    public function __construct(
        private Connection $connection,
        private ManagerRegistry $managerRegistry,
        private LoggerInterface $logger,
        private TrustCotasServiceInterface $trustCotasService
    ) {}

    /**
     * Busca o patrimônio evolução anual do participante
     *
     * @param string $cpf
     *
     * @return array
     */
    public function getPatrimonioEvolucaoAnual(string $cpf): array
    {
        $qb = $this->connection->createQueryBuilder();
        $builder = $qb
            ->select(
                'h.NR_ANO_COMP as ano',
                'Sum(h.vl_contrib) as vlNominal',
                'SUM(h.qt_cota) qtCota',
            )
            ->from('pessoa', 'p')
            ->innerJoin('p', 'hist_contribuicao', 'h', 'p.id_pessoa = h.id_pessoa')
            ->innerJoin('h', 'contribuicao', 'c', 'h.id_contribuicao = c.id_contribuicao')
            ->innerJoin('h', 'conta_contribuicao', 'cc', 'cc.id_contribuicao = h.id_contribuicao')
            ->innerJoin('cc', 'conta_previdencial', 'cp', 'cc.id_conta = cp.id_conta')
            ->where('h.NR_ANO_COMP <= :ano')
            ->setParameter('ano', ContribuicaoEnum::getAnoContribuicaoAtual())
            ->andWhere("cp.IC_EXIBE_SALDO = 'S'")
            ->andWhere('h.ID_CONTRIBUICAO NOT IN (91, 92, 93, 480, 481)')
            ->andWhere('h.QT_COTA <> 0')
            ->setParameter('ano2', ContribuicaoEnum::getAnoContribuicaoAtual())
            ->andWhere('p.NR_CNPJ_CPF = :cpf')
            ->setParameter('cpf', $cpf)
            ->groupBy('h.NR_ANO_COMP', 'p.NR_CNPJ_CPF')
            ->orderBy('h.NR_ANO_COMP');

        return $builder->executeQuery()->fetchAllAssociative();
    }

    public function getMeuInvestimento(string $cpf, string $perfilPlanoParticipante): array
    {
        $sp = "SET NOCOUNT ON; exec RentabilidadeParticXTIR '$cpf', '$perfilPlanoParticipante'";
        $irisConnection = $this->managerRegistry->getConnection('iris');
        $stmt = $irisConnection->prepare($sp);

        $result = $stmt->executeQuery();

        return $result->fetchAllAssociative();
    }
}
