<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\PerfilInvestimentoAlteracao;
use App\Enum\Iris\App\StatusSolicitacaoAlteracaoPerfilInvestimentoEnum;
use App\Interface\Iris\Repository\App\PerfilInvestimentoAlteracaoRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;

/**
 * @extends ServiceEntityRepository<PerfilInvestimentoAlteracao>
 */
class PerfilInvestimentoAlteracaoRepository extends EntityRepository implements PerfilInvestimentoAlteracaoRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->findAll();
    }

    /**
     * @param int $id
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getById(int $id): ?PerfilInvestimentoAlteracao
    {
        return $this->find($id);
    }

    /**
     * @param string $cpf
     *
     * @return Query
     */
    public function getByCpf(string $cpf): Query
    {
        try {
            return $this->getEntityManager()->createQueryBuilder()
                ->select(
                    'p.id,
                    p.idTrust,
                    p.dt_solicitacao,
                    p.owncloud,
                    p.protocolo,
                    p.status,
                    pi.descricao as perfilInvestimentoDescricao,
                    c.descricao as campanhaDescricao'
                )
                ->from(PerfilInvestimentoAlteracao::class, 'p')
                ->leftJoin('p.perfilInvestimento', 'pi')
                ->leftJoin('p.campanha', 'c')
                ->where('p.cpf = :cpf')
                ->orderBy('p.id', 'DESC')
                ->setParameter('cpf', $cpf)
                ->getQuery();
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    /**
     * @param string $cpf
     *
     * @return PerfilInvestimentoAlteracao|null
     */
    public function getUltimaSolicitacaoAlteracaoPerfil(string $cpf): ?PerfilInvestimentoAlteracao
    {
        return $this->getEntityManager()->createQueryBuilder()
            ->select('p')
            ->from(PerfilInvestimentoAlteracao::class, 'p')
            ->where('p.cpf = :cpf')
            ->orderBy('p.id', 'DESC')
            ->setParameter('cpf', $cpf)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao
     *
     * @return void
     */
    public function postPerfilSolicitacaoAlteracao(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao): void
    {
        $this->getEntityManager()->persist($perfilInvestimentoAlteracao);
        $this->getEntityManager()->flush();
    }

    public function update(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao): void
    {
        $this->getEntityManager()->persist($perfilInvestimentoAlteracao);
        $this->getEntityManager()->flush();
    }

    public function solicitacoesRecebidas(int $campanha): array
    {
        return $this->getEntityManager()->createQueryBuilder()
            ->select(
                'p.id',
                'IDENTITY(p.perfilInvestimento) as perfilInvestimentoId',
                'IDENTITY(p.campanha) as campanhaId',
                'p.idTrust',
                'p.cpf',
                'p.status',
                'p.email',
                'p.dt_solicitacao',
                'p.ativo',
                'p.protocolo',
                'p.owncloud as url'
            )
            ->from(PerfilInvestimentoAlteracao::class, 'p')
            ->leftJoin('p.perfilInvestimento', 'pi')
            ->addSelect('pi.descricao as perfilInvestimentoDescricao')
            ->where('p.status = :status')
            ->orWhere('p.status = :status2')
            ->andWhere('p.campanha = :campanha')
            ->setParameter('status', StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::SOLICITACAO_RECEBIDA->getDescricao())
            ->setParameter('status2', StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::FORMULARIO_FISICO->getDescricao())
            ->setParameter('campanha', $campanha)
            ->getQuery()
            ->getResult();
    }


    public function solicitacoesInconsistentes(int $campanha): array
    {
        return $this->getEntityManager()->createQueryBuilder()
            ->select(
                'p.id',
                'IDENTITY(p.perfilInvestimento) as perfilInvestimentoId',
                'IDENTITY(p.campanha) as campanhaId',
                'p.idTrust',
                'p.cpf',
                'p.status',
                'p.email',
                'p.dt_solicitacao',
                'p.ativo',
                'p.protocolo',
                'p.owncloud as url'
            )
            ->from(PerfilInvestimentoAlteracao::class, 'p')
            ->leftJoin('p.perfilInvestimento', 'pi')
            ->addSelect('pi.descricao as perfilInvestimentoDescricao')
            ->where('p.status = :status')
            ->andWhere('p.campanha = :campanha')
            ->setParameter('status', StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::ERRO_NO_PROCESSAMENTO->getDescricao())
            ->setParameter('campanha', $campanha)
            ->getQuery()
            ->getResult();
    }


    public function solicitacoesProcessadas(int $campanha): array
    {
        return $this->getEntityManager()->createQueryBuilder()
            ->select(
                'p.id',
                'IDENTITY(p.perfilInvestimento) as perfilInvestimentoId',
                'IDENTITY(p.campanha) as campanhaId',
                'p.idTrust',
                'p.cpf',
                'p.status',
                'p.email',
                'p.dt_solicitacao',
                'p.ativo',
                'p.protocolo',
                'p.owncloud as url'
            )
            ->from(PerfilInvestimentoAlteracao::class, 'p')
            ->leftJoin('p.perfilInvestimento', 'pi')
            ->addSelect('pi.descricao as perfilInvestimentoDescricao')
            ->where('p.status = :status')
            ->andWhere('p.campanha = :campanha')
            ->setParameter('status', StatusSolicitacaoAlteracaoPerfilInvestimentoEnum::SOLICITACAO_PROCESSADA->getDescricao())
            ->setParameter('campanha', $campanha)
            ->getQuery()
            ->getResult();
    }
}
