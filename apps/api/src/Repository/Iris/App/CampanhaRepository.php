<?php

namespace App\Repository\Iris\App;

use App\DTO\Iris\App\Input\ResumoSolicitacoesDTO;
use App\DTO\Iris\App\Input\DistribuicaoSolicitacoesDTO;
use App\Entity\Iris\App\Campanha;
use App\Entity\Iris\App\PerfilInvestimentoAlteracao;
use App\Entity\Iris\App\PerfilRecomendado;
use App\Exception\CampanhaSaveException;
use App\Interface\Iris\Repository\App\CampanhaRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;

/**
 * @extends ServiceEntityRepository<Campanha>
 */
class CampanhaRepository extends EntityRepository implements CampanhaRepositoryInterface
{
    /**
     * @param array $filter
     * 
     * @return Query
     */
    public function getAll(array $filter = []): Query
    {
        return $this->createQueryBuilder('c')
            ->select('c.id as idCampanha', 'c.descricao as descricao', 'c.dt_inicio as dt_inicio', 'c.dt_fim as dt_fim')
            ->addSelect('
                CASE 
                    WHEN c.dt_inicio > CURRENT_DATE() THEN \'agendada\'
                    WHEN c.dt_inicio <= CURRENT_DATE() AND c.dt_fim >= CURRENT_DATE() THEN \'andamento\'
                    WHEN c.dt_fim < CURRENT_DATE() THEN \'finalizada\'
                    ELSE \'agendada\'
                END as status
            ')
            ->orderBy('c.dt_inicio', 'DESC')
            // ->leftJoin('c.perfisRecomendados', 'p')
            // ->addSelect('p')
            // ->setMaxResults($limit)
            ->getQuery();
    }

    /**
     * @param int $id
     * @param int $limit
     * 
     * @return Campanha|null
     */
    public function getById(int $id, int $limit = 100): Campanha|null|array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.perfisRecomendados', 'p')
            ->addSelect('p')
            ->select('c', 'p')
            ->where('c.id = :id')
            ->setMaxResults($limit)
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string|null $dtAtual
     * 
     * @return array|null
     */
    public function getCampanhaAtiva(?string $dtAtual = null): ?array
    {

        $qb = $this->createQueryBuilder('c')
            ->select(
                'c.id as idCampanha',
                'c.descricao as descricao',
                'c.dt_inicio ',
                'c.dt_fim'
            )
            ->setMaxResults(1)
            ->where('c.dt_inicio <= :dtInicio')
            ->andWhere('c.dt_fim >= :dtFim')
            ->setParameter('dtInicio', $dtAtual)
            ->setParameter('dtFim', $dtAtual)
            ->orderBy('c.dt_inicio', 'DESC');

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @param Campanha $campanha
     * 
     * @return void
     */
    public function salvarCampanha(Campanha $campanha): void
    {
        try {
            $this->getEntityManager()->persist($campanha);
            $this->getEntityManager()->flush();
        } catch (\Exception $e) {
            throw new CampanhaSaveException();
        }
    }

    /**
     * @param Campanha $campanha
     * 
     * @return void
     */
    public function deleteCampanha(Campanha $campanha): void
    {

        try {
            $this->getEntityManager()->remove($campanha);
            $this->getEntityManager()->flush();
        } catch (\Exception $e) {
            throw new CampanhaSaveException('Erro ao deletar campanha ');
        }
    }


    /**
     * @param int $idCampanha
     * 
     * @return ResumoSolicitacoesDTO|null
     */
    public function getResumoSolicitacoesCampanha(int $idCampanha): ?ResumoSolicitacoesDTO
    {
        $em = $this->getEntityManager();

        // Primeiro, verifica se existem dados na tabela participante_perfil_investimento_alteracao para esta campanha
        $hasAlteracaoData = $em->createQueryBuilder()
            ->select('COUNT(ppia.id)')
            ->from(PerfilInvestimentoAlteracao::class, 'ppia')
            ->where('ppia.campanha = :campanha')
            ->setParameter('campanha', $idCampanha)
            ->getQuery()
            ->getSingleScalarResult();

        // Se não há dados de alteração, retorna zeros
        if ($hasAlteracaoData == 0) {
            return new ResumoSolicitacoesDTO([
                'contagemSolicitacoes' => 0,
                'processadas' => 0,
                'canceladas' => 0,
                'nconfirmadas' => 0
            ]);
        }

        // Verifica se existem dados na tabela participante_perfil_recomendado para esta campanha
        $hasRecomendadoData = $em->createQueryBuilder()
            ->select('COUNT(pr.id)')
            ->from(PerfilRecomendado::class, 'pr')
            ->where('pr.campanha = :campanha')
            ->setParameter('campanha', $idCampanha)
            ->getQuery()
            ->getSingleScalarResult();

        // Se não há dados de recomendado, retorna zeros
        if ($hasRecomendadoData == 0) {
            return new ResumoSolicitacoesDTO([
                'contagemSolicitacoes' => 0,
                'processadas' => 0,
                'canceladas' => 0,
                'nconfirmadas' => 0
            ]);
        }

        $qb = $em->createQueryBuilder();
        $result = $qb
            ->select([
                'COUNT(ppia.id) as contagem_solicitacoes',
                '(SELECT COUNT(ppia2.id) FROM ' . PerfilInvestimentoAlteracao::class . ' ppia2 WHERE ppia2.campanha = :campanha AND ppia2.status IN (:statusProcessadas) AND ppia2.cpf IN (SELECT DISTINCT pr2.cpf FROM ' . PerfilRecomendado::class . ' pr2 WHERE pr2.campanha = :campanha)) as processadas',
                '(SELECT COUNT(ppia3.id) FROM ' . PerfilInvestimentoAlteracao::class . ' ppia3 WHERE ppia3.campanha = :campanha AND ppia3.status IN (:statusCanceladas) AND ppia3.cpf IN (SELECT DISTINCT pr3.cpf FROM ' . PerfilRecomendado::class . ' pr3 WHERE pr3.campanha = :campanha)) as canceladas',
                '(SELECT COUNT(ppia4.id) FROM ' . PerfilInvestimentoAlteracao::class . ' ppia4 WHERE ppia4.campanha = :campanha AND ppia4.status = :statusNaoConfirmadas AND ppia4.cpf IN (SELECT DISTINCT pr4.cpf FROM ' . PerfilRecomendado::class . ' pr4 WHERE pr4.campanha = :campanha)) as nconfirmadas'
            ])
            ->from(PerfilInvestimentoAlteracao::class, 'ppia')
            ->where('ppia.campanha = :campanha')
            ->andWhere('ppia.status IN (:statusTotal)')
            ->andWhere('ppia.cpf IN (SELECT DISTINCT pr5.cpf FROM ' . PerfilRecomendado::class . ' pr5 WHERE pr5.campanha = :campanha )')
            ->setParameter('campanha', $idCampanha)
            ->setParameter('statusTotal', [
                'Solicitação Processada',
                'Formulario Fisico',
                'Solicitação Recebida',
                'Cancelado – Nova Solicitação Registrada',
                'Cancelado por Solicitação do Participante',
                'Confirmação Pendente: Valide seu Token',
                'Erro no Processamento'
            ])
            ->setParameter('statusProcessadas', [
                'Solicitação Processada',
                'Formulario Fisico',
                'Solicitação Recebida',
                'Erro no Processamento'
            ])
            ->setParameter('statusCanceladas', [
                'Cancelado – Nova Solicitação Registrada',
                'Cancelado por Solicitação do Participante'
            ])
            ->setParameter('statusNaoConfirmadas', 'Confirmação Pendente: Valide seu Token')
            ->getQuery()
            ->getSingleResult();

        return new ResumoSolicitacoesDTO([
            'contagemSolicitacoes' => (int) $result['contagem_solicitacoes'],
            'processadas' => (int) $result['processadas'],
            'canceladas' => (int) $result['canceladas'],
            'nconfirmadas' => (int) $result['nconfirmadas']
        ]);
    }

    /**
     * @param int $idCampanha
     * @param string $perfilRecomendado
     * 
     * @return DistribuicaoSolicitacoesDTO|null
     */
    public function distruibuicaoSolicitacoesCampanha(int $idCampanha, string $perfilRecomendado): ?DistribuicaoSolicitacoesDTO
    {
        $em = $this->getEntityManager();

        // Primeiro, verifica se existem dados na tabela participante_perfil_investimento_alteracao para esta campanha
        $hasAlteracaoData = $em->createQueryBuilder()
            ->select('COUNT(ppia.id)')
            ->from(PerfilInvestimentoAlteracao::class, 'ppia')
            ->where('ppia.campanha = :campanha')
            ->setParameter('campanha', $idCampanha)
            ->getQuery()
            ->getSingleScalarResult();

        // Se não há dados de alteração, retorna zeros
        if ($hasAlteracaoData == 0) {
            return new DistribuicaoSolicitacoesDTO([
                'total' => 0,
                'horizonte2040' => 0,
                'horizonte2050' => 0,
                'horizonteProtegido' => 0
            ]);
        }

        // Verifica se existem dados na tabela participante_perfil_recomendado para esta campanha e perfil
        $hasRecomendadoData = $em->createQueryBuilder()
            ->select('COUNT(pr.id)')
            ->from(PerfilRecomendado::class, 'pr')
            ->where('pr.campanha = :campanha AND pr.perfilRecomendado = :perfilRecomendado')
            ->setParameter('campanha', $idCampanha)
            ->setParameter('perfilRecomendado', $perfilRecomendado)
            ->getQuery()
            ->getSingleScalarResult();

        // Se não há dados de recomendado, retorna zeros
        if ($hasRecomendadoData == 0) {
            return new DistribuicaoSolicitacoesDTO([
                'total' => 0,
                'horizonte2040' => 0,
                'horizonte2050' => 0,
                'horizonteProtegido' => 0
            ]);
        }

        $qb = $em->createQueryBuilder();
        $result = $qb
            ->select([
                'COUNT(ppia.id) as total',
                '(SELECT COUNT(ppia2.id) FROM ' . PerfilInvestimentoAlteracao::class . ' ppia2 WHERE ppia2.campanha = :campanha AND ppia2.perfilInvestimento = 1 AND ppia2.cpf IN (SELECT DISTINCT pr.cpf FROM ' . PerfilRecomendado::class . ' pr WHERE pr.campanha = :campanha AND pr.perfilRecomendado = :perfilRecomendado)) as horizonte2040',
                '(SELECT COUNT(ppia3.id) FROM ' . PerfilInvestimentoAlteracao::class . ' ppia3 WHERE ppia3.campanha = :campanha AND ppia3.perfilInvestimento = 2 AND ppia3.cpf IN (SELECT DISTINCT pr2.cpf FROM ' . PerfilRecomendado::class . ' pr2 WHERE pr2.campanha = :campanha AND pr2.perfilRecomendado = :perfilRecomendado)) as horizonte2050',
                '(SELECT COUNT(ppia4.id) FROM ' . PerfilInvestimentoAlteracao::class . ' ppia4 WHERE ppia4.campanha = :campanha AND ppia4.perfilInvestimento = 3 AND ppia4.cpf IN (SELECT DISTINCT pr3.cpf FROM ' . PerfilRecomendado::class . ' pr3 WHERE pr3.campanha = :campanha AND pr3.perfilRecomendado = :perfilRecomendado)) as horizonteProtegido'
            ])
            ->from(PerfilInvestimentoAlteracao::class, 'ppia')
            ->where('ppia.campanha = :campanha')
            ->andWhere('ppia.cpf IN (SELECT DISTINCT pr4.cpf FROM ' . PerfilRecomendado::class . ' pr4 WHERE pr4.campanha = :campanha AND pr4.perfilRecomendado = :perfilRecomendado)')
            ->setParameter('campanha', $idCampanha)
            ->setParameter('perfilRecomendado', $perfilRecomendado)
            ->getQuery()
            ->getSingleResult();

        return new DistribuicaoSolicitacoesDTO([
            'total' => (int) $result['total'],
            'horizonte2040' => (int) $result['horizonte2040'],
            'horizonte2050' => (int) $result['horizonte2050'],
            'horizonteProtegido' => (int) $result['horizonteProtegido']
        ]);
    }
}
