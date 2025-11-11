<?php

namespace App\Repository\Trust\Pessoa;

use App\DTO\Trust\Input\BeneficiarioDTO;
use App\DTO\Trust\Input\PessoaDTO;
use App\Interface\Trust\Repository\TrustPessoaRepositoryInterface;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;

class TrustPessoaRepository implements TrustPessoaRepositoryInterface
{
    public function __construct(
        private Connection $connection,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * Obtém uma pessoa pelo CPF
     *
     * @param string $cpf
     * @return PessoaDTO|null
     */
    public function getPessoaByCpf(string $cpf): PessoaDTO|null
    {
        $qb = $this->connection->createQueryBuilder('p');
        $qb->select(
            'ID_PESSOA as id',
            'NR_CNPJ_CPF as cpf',
            'NM_PESSOA as nome',
            'DT_NASCIMENTO as dataNascimento',
            'IC_SEXO as sexo'
        )
            ->from('PESSOA')
            ->where('NR_CNPJ_CPF = :cpf')
            ->setParameter('cpf', $cpf);

        $pessoa = $qb->executeQuery()->fetchAssociative();

        return $pessoa ? new PessoaDTO($pessoa) : null;
    }


    /**
     * @param BeneficiarioDTO $dados
     * 
     * @return bool
     */
    public function insertPessoaBeneficiario(BeneficiarioDTO $dados): bool{
        $lastId = $this->getLastIdPessoa();
        $idBeneficiario = $lastId + 1;

        $qb = $this->connection->createQueryBuilder();

        // Insert into PESSOA
        $builder1 = $qb->insert('PESSOA')
            ->values([
                'ID_PESSOA' => ':idPessoa',
                'NM_PESSOA' => ':nome',
                'NR_CNPJ_CPF' => ':cpf',
                'DT_NASCIMENTO' => ':dtNascimento',
                'IC_SEXO' => ':sexo',
                'SG_PESSOA' => ':sgPessoa',
                'NR_CELULAR' => ':nrCelular',
                'NM_EMAIL' => ':nmEmail',
                'NM_ENDERECO' => ':nmEndereco',
                'NM_BAIRRO' => ':nmBairro',
                'NM_CIDADE' => ':nmCidade',
                'SG_UF' => ':sgUf',
            ])
            ->setParameters([
                'idPessoa' => $idBeneficiario,
                'nome' => $dados->getNome(),
                'cpf' => $dados->getCpf(),
                'dtNascimento' => $dados->getDtNascimento(),
                'sexo' => $dados->getSexo(),
                'sgPessoa' => 'NULO',
                'nrCelular' => $dados->getCelular(),
                'nmEmail' => $dados->getEmail(),
                'nmEndereco' => '-',
                'nmBairro' => '-',
                'nmCidade' => '-',
                'sgUf' => '-',
            ]);

       return $builder1->executeStatement();

       
    }


    /**
     * @return int
     */
    private function getLastIdPessoa(): int
    {
        $qb = $this->connection->createQueryBuilder();
        $builder = $qb
            ->select(
                'max(p.ID_PESSOA) as id'
            )
            ->from('PESSOA', 'p');

        $dados = $builder->executeQuery()->fetchAllAssociative();

        return $dados[0]['id'];
    }
}