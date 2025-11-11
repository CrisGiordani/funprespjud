<?php

namespace App\Repository\Iris\App;

use App\Entity\Iris\App\QuestionarioResposta;
use App\Interface\Iris\Repository\App\QuestionarioRespostaRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;

/**
 * @extends ServiceEntityRepository<QuestionarioResposta>
 */
class QuestionarioRespostaRepository extends EntityRepository implements QuestionarioRespostaRepositoryInterface
{
    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->findAll();
    }

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function findByCpf(string $cpf): array
    {
        return $this->findBy(['cpf' => $cpf]);
    }

    /**
     * Utilizar para salvar apenas uma resposta
     * @param QuestionarioResposta $questionarioResposta
     *
     * @return void
     */
    public function save(QuestionarioResposta $questionarioResposta): void
    {
        $this->getEntityManager()->persist($questionarioResposta);
        $this->getEntityManager()->flush();
    }

    /**
     * Utilizar para enfileirar  várias respostas e depois salvar . Utilizar em conjunto com o método Flush
     * @param QuestionarioResposta  $questionarioRespostas
     *
     * @return void
     */
    public function persist(QuestionarioResposta $questionarioRespostas): void
    {
        $this->getEntityManager()->persist($questionarioRespostas);
    }

    /**
     * Utilizar para salvar as respostas enfileiradas
     * @return void
     */
    public function flush(): void
    {
        $this->getEntityManager()->flush();
    }

    /**
     * @return void
     */
    public function beginTransaction(): void
    {
        $this->getEntityManager()->beginTransaction();
    }

    /**
     * @return void
     */
    public function commit(): void
    {
        $this->getEntityManager()->commit();
    }

    /**
     * @return void
     */
    public function rollback(): void
    {
        $this->getEntityManager()->rollback();
    }

    /**
     * Busca as últimas 8 linhas agrupadas por dt_resposta
     * @return array
     */
    public function getUltimaRespostaByCpf(string $cpf): array
    {
        $qb = $this->createQueryBuilder('qr');

        return $qb->select('qr.dt_resposta,
                p.id as id_pergunta,
                a.id as id_alternativa,
                a.letraOpcao as letra_opcao')
            ->addSelect("
                    CASE a.letraOpcao
                        WHEN 'A' THEN 1
                        WHEN 'B' THEN 2
                        WHEN 'C' THEN 3
                        WHEN 'D' THEN 4
                        WHEN 'E' THEN 5
                        ELSE 0
                    END as ordem_resposta
                ")
            ->leftJoin('qr.pergunta', 'p')
            ->leftJoin('qr.alternativa', 'a')
            ->where('qr.cpf = :cpf')
            ->setParameter('cpf', $cpf)
            ->groupBy('qr.dt_resposta, p.id, a.id, a.letraOpcao')
            ->orderBy('qr.dt_resposta', 'DESC')
            ->setMaxResults(8)
            ->getQuery()
            ->getResult();
    }
}
