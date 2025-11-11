<?php

namespace App\Repository\Trust\Lgpd;

use App\DTO\Trust\Input\LgpdDTO;
use App\DTO\Trust\Output\LgpdOutputDTO;
use App\Interface\Trust\Repository\TrustLgpdRepositoryInterface;
use Doctrine\DBAL\Connection;

final class TrustLgpdRepository implements TrustLgpdRepositoryInterface
{
    public function __construct(
        private Connection $connection
    ) {
    }

    /**
     * @param int $idTrust
     *
     * @return array
     */
    public function getConsentimentoLgpd(int $idTrust): array
    {
        $dados = $this->findConsentimentoLgpd($idTrust);
        if (! $dados) {
            return [];
        }

        $lgpdDTO = new LgpdDTO(array_shift($dados));
        $outputDTO = LgpdOutputDTO::fromLgpdDTO($lgpdDTO);

        return $outputDTO->toArray();
    }

    /**
     * @param array $dados
     * @param int $idTrust
     *
     * @return array
     */
    public function saveConsentimentoLgpd(array $dados, int $idTrust): array
    {
        try {
            $sequence = $this->findSequenceConsentimentoLgpd();

            $icAtivo = $this->determineActiveStatus($dados);

            $this->insertConsentimentoLgpdRecord($sequence, $idTrust, $icAtivo);

            return $this->getInsertedConsentimentoLgpdRecord($sequence);
        } catch (\Exception $e) {
            throw new \Exception('Erro ao salvar consentimento LGPD: ' . $e->getMessage());
        }
    }

    /**
     * @param array $dados
     *
     * @return string
     */
    private function determineActiveStatus(array $dados): string
    {
        return $dados['aceiteConsentimentoLgpd'] ? 'S' : 'N';
    }

    /**
     * @param int $sequence
     * @param int $idTrust
     * @param string $icAtivo
     *
     * @return int
     */
    private function insertConsentimentoLgpdRecord(int $sequence, int $idTrust, string $icAtivo): int
    {
        $dtCadastro = date('Y-m-d H:i:s');

        $qb = $this->connection->createQueryBuilder();
        $builder = $qb
            ->insert('WEB_REGISTRO_POLITICA')
            ->setValue('ID_SEQ', ':idSeq')
            ->setValue('ID_PESSSOA', ':idPessoa')
            ->setValue('DT_CADASTRO', ':dtCadastro')
            ->setValue('IC_ATIVO', ':icAtivo')
            ->setParameter('idSeq', $sequence)
            ->setParameter('idPessoa', $idTrust)
            ->setParameter('dtCadastro', $dtCadastro)
            ->setParameter('icAtivo', $icAtivo);

        return $builder->executeStatement();
    }

    /**
     * @param int $sequence
     *
     * @return array
     */
    private function getInsertedConsentimentoLgpdRecord(int $sequence): array
    {
        $qb = $this->connection->createQueryBuilder();
        $builder = $qb
            ->select(
                'wrp.ID_SEQ as id',
                'wrp.ID_PESSSOA as idPessoa',
                'CONVERT(VARCHAR(10),wrp.DT_CADASTRO, 103) as dtCadastro',
                'wrp.IC_ATIVO as ativo'
            )
            ->from('WEB_REGISTRO_POLITICA', 'wrp')
            ->where('wrp.ID_SEQ = :idSeq')
            ->setParameter('idSeq', $sequence);

        $dados = $builder->executeQuery()->fetchAllAssociative();

        if (empty($dados)) {
            return [];
        }

        $lgpdDTO = new LgpdDTO(array_shift($dados));
        $outputDTO = LgpdOutputDTO::fromLgpdDTO($lgpdDTO);

        return $outputDTO->toArray();
    }

    /**
     * @param mixed $idTrust
     *
     * @return array
     */
    private function findConsentimentoLgpd($idTrust): array
    {
        $qb = $this->connection->createQueryBuilder();
        $builder = $qb
            ->select(
                'wrp.ID_SEQ as id',
                'wrp.ID_PESSSOA as idPessoa',
                'CONVERT(VARCHAR(10),wrp.DT_CADASTRO, 103) as dtCadastro',
                'wrp.IC_ATIVO as ativo'
            )
            ->from('WEB_REGISTRO_POLITICA', 'wrp')
            ->where('wrp.ID_PESSSOA = :idPessoa')
            ->setParameter('idPessoa', $idTrust);

        return $builder->executeQuery()->fetchAllAssociative();
    }

    /**
     * @return int|mixed
     */
    public function findSequenceConsentimentoLgpd(): int
    {
        $qb = $this->connection->createQueryBuilder();
        $builder = $qb
            ->select('max(wrp.ID_SEQ) as lastId')->from('WEB_REGISTRO_POLITICA', 'wrp');

        $result = $builder->executeQuery()->fetchAllAssociative();
        $sequence = $result[0]['lastId'];

        if (! $sequence) {
            $sequence = 1;
        } else {
            $sequence = $sequence + 1;
        }

        return $sequence;
    }
}
