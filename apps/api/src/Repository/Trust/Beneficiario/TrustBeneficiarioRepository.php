<?php

namespace App\Repository\Trust\Beneficiario;

use App\DTO\Trust\Input\BeneficiarioDTO;
use App\DTO\Trust\Input\BeneficiarioUpdateDTO;
use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Output\BeneficiarioOutputDTO;
use App\Interface\Trust\Repository\TrustBeneficiarioRepositoryInterface;
use Doctrine\DBAL\Connection;

class TrustBeneficiarioRepository implements TrustBeneficiarioRepositoryInterface
{
    private Connection $connectTrust;

    public function __construct(
        Connection $connectTrust
    ) {
        $this->connectTrust = $connectTrust;
    }

    /**
     * @return void
     */
    public function beginTransaction(): void
    {
        $this->connectTrust->beginTransaction();
    }

    /**
     * @return void
     */
    public function commitTransaction(): void
    {
        $this->connectTrust->commit();
    }

    /**
     * @return void
     */
    public function rollbackTransaction(): void
    {
        $this->connectTrust->rollBack();
    }

    /**
     * @param string $cpf
     * @return BeneficiarioOutputDTO[]|null
     */
    public function getBeneficiarios(string $cpf): array|null
    {
        try {
            $qb = $this->connectTrust->createQueryBuilder();
            $builder = $qb
                ->select(
                    'DISTINCT(pb.ID_PESSOA) as id',
                    'pb.NM_PESSOA as nome',
                    'de.ID_PARENTESCO as idParentesco',
                    'pa.NM_PARENTESCO as nmParentesco',
                    'pb.DT_NASCIMENTO as dtNascimento',
                    'pb.NM_EMAIL as nmEmail',
                    'pb.NR_CELULAR as nrCelular',
                    'pb.DT_RECADASTRAMENTO as dtRecadastramento',
                    'pb.IC_SEXO as sexo',
                    'de.IC_INVALIDO as invalido'
                )
                ->from('PESSOA', 'pe')
                ->innerJoin('pe', 'DEPENDENTE', 'de', 'pe.ID_PESSOA = de.ID_PESSOA')
                ->innerJoin('de', 'PARENTESCO', 'pa', 'de.ID_PARENTESCO = pa.ID_PARENTESCO')
                ->innerJoin('pa', 'PESSOA', 'pb', 'de.ID_PESSOA_DEP = pb.ID_PESSOA')
                ->where('pe.NR_CNPJ_CPF = :cpf')
                ->setParameter('cpf', $cpf);

            $dados = $builder->executeQuery()->fetchAllAssociative();

            return $dados ? array_map(fn($row) => (new BeneficiarioOutputDTO($row))->toArray(), $dados) : null;
        } catch (\Exception $exception) {
            throw $exception;
        }
    }

    private function getID(string $cpf): int
    {
        return $this->connectTrust->createQueryBuilder()
            ->select('ID_PESSOA')
            ->from('PESSOA')
            ->where('NR_CNPJ_CPF = :cpf')
            ->setParameter('cpf', $cpf)
            ->executeQuery()
            ->fetchOne();
    }



    /**
     * @param array $dadosParticipante
     * @param BeneficiarioDTO $dados
     * @param int $idBeneficiario
     * 
     * @return bool
     */
    public function insertBeneficiario(array $dadosParticipante, BeneficiarioDTO $dados, int $idBeneficiario): bool
    {
        try {
            foreach ($dadosParticipante as $participante) {

                $qb = $this->connectTrust->createQueryBuilder();

                $qb->insert('DEPENDENTE')
                    ->values([
                        'ID_PESSOA' => ':idParticipante',
                        'ID_PESSOA_DEP' => ':idBeneficiario',
                        'ID_PARENTESCO' => ':idParentesco',
                        'IC_INVALIDO' => ':icInvalido',
                        'IC_SUPERIOR' => ':icSuperior',
                    ])
                    ->setParameters([
                        'idParticipante' => (int)$participante->getId(),
                        'idBeneficiario' => $idBeneficiario,
                        'idParentesco' => $dados->getGrauParentesco(),
                        'icInvalido' => $dados->getInvalido(),
                        'icSuperior' => 'N',
                    ])->executeStatement();
            }

            return true;
        } catch (\Exception $e) {
            throw new \Exception('Erro ao inserir beneficiário: ' . $e->getMessage());
        }
    }

    /**
     * @param array $dadosParticipante
     * @param int $idBeneficiario
     * 
     * @return array
     */
    public function filterDadosParticipanteNaoVinculadosAoBeneficiario(array $dadosParticipante, int $idBeneficiario): array
    {
        return array_filter($dadosParticipante, function ($participante) use ($idBeneficiario) {

            $qb = $this->connectTrust->createQueryBuilder();
            $result = $qb->select('COUNT(1) as total')
                ->from('DEPENDENTE')
                ->where('ID_PESSOA = :idParticipante')
                ->andWhere('ID_PESSOA_DEP = :idBeneficiario')
                ->setParameters(['idParticipante' => $participante->getId(), 'idBeneficiario' => $idBeneficiario])
                ->executeQuery()
                ->fetchAssociative();

            return (int)$result['total'] == 0 ? $participante : null;
        });
    }

    /**
     * @param string $cpf
     * @param string $id
     * @param BeneficiarioDTO|BeneficiarioUpdateDTO $dados
     * 
     * @return bool
     */
    public function updateBeneficiario(string $cpf, string $id, BeneficiarioDTO|BeneficiarioUpdateDTO $dados): bool
    {
        try {
            $this->connectTrust->beginTransaction();

            $qb = $this->connectTrust->createQueryBuilder();
            $qb->update('PESSOA')
                ->where('ID_PESSOA = :id')
                ->setParameter('id', $id);

            $parameters = ['id' => $id];

            $fieldMappings = [
                'getNome' => 'NM_PESSOA',
                'getDtNascimento' => 'DT_NASCIMENTO',
                'getSexo' => 'IC_SEXO',
                'getCelular' => 'NR_CELULAR',
                'getEmail' => 'NM_EMAIL',
            ];

            foreach ($fieldMappings as $getter => $dbField) {
                $value = $dados->$getter();
                if ($value != null) {
                    $paramName = str_replace('get', '', $getter);
                    $paramName = lcfirst($paramName);
                    $qb->set($dbField, ':' . $paramName);
                    $parameters[$paramName] = $value;
                }
            }

            $qb->setParameters($parameters);
            $qb->executeStatement();

            // Atualiza a tabela DEPENDENTE
            $qb = $this->connectTrust->createQueryBuilder();
            $qb->update('DEPENDENTE')
                ->where('ID_PESSOA_DEP = :idBeneficiario')
                ->andWhere('ID_PESSOA = :idParticipante')
                ->set('ID_PARENTESCO', ':idParentesco')
                ->set('IC_INVALIDO', ':icInvalido')
                ->setParameters([
                    'idBeneficiario' => $id,
                    'idParticipante' => $this->getID($cpf),
                    'idParentesco' => $dados->getGrauParentesco(),
                    'icInvalido' => $dados->getInvalido(),
                ])
                ->executeStatement();

            $this->connectTrust->commit();

            return true;
        } catch (\Exception $e) {
            $this->connectTrust->rollBack();

            throw new \Exception('Erro ao atualizar beneficiário: ' . $e->getMessage());
        }
    }

    public function deleteBeneficiario(string $id): bool
    {

        try {
            $this->beginTransaction();


            // Delete from DEPENDENTE_FINALIDADE
            $qb1 = $this->connectTrust->createQueryBuilder();
            $qb1->delete('DEPENDENTE_FINALIDADE')
                ->where('ID_PESSOA_DEP = :id')
                // ->andWhere('ID_PESSOA = :idParticipante')
                ->setParameters([
                    'id' => $id,
                    // 'idParticipante' => $participante->getId(),
                ])
                ->executeStatement();

            // Delete from DEPENDENTE
            $qb2 = $this->connectTrust->createQueryBuilder();
            $qb2->delete('DEPENDENTE')
                ->where('ID_PESSOA_DEP = :id')
                // ->where('ID_PESSOA = :idParticipante')
                ->setParameters([
                    'id' => $id,
                    // 'idParticipante' => $participante->getId(),
                ])
                ->executeStatement();

            // Delete from PESSOA
            $qb3 = $this->connectTrust->createQueryBuilder();
            $qb3->delete('PESSOA')
                ->where('ID_PESSOA = :id')
                ->setParameter('id', $id)
                ->executeStatement();


            $this->commitTransaction();
        } catch (\Exception $e) {
            $this->rollbackTransaction();

            throw new \Exception('Erro ao deletar beneficiário: ' . $e->getMessage());
        }

        return  true;
    }

    /**
     * @param array $dadosParticipante
     * @param int $idBeneficiario
     * 
     * @return bool
     */
    public function isVinculado(array $dadosParticipante, int $idBeneficiario): bool
    {
        foreach ($dadosParticipante as $participante) {
            if (!$participante instanceof ParticipanteProfileDTO) {
                throw new \Exception('Dados do participante não são válidos');
                break;
            }

            $qb = $this->connectTrust->createQueryBuilder();
            $result = $qb->select('COUNT(1) as total')
                ->from('DEPENDENTE')
                ->where('ID_PESSOA = :idParticipante')
                ->andWhere('ID_PESSOA_DEP = :idBeneficiario')
                ->setParameters(['idParticipante' => $participante->getId(), 'idBeneficiario' => $idBeneficiario])
                ->executeQuery()
                ->fetchAssociative();


            if ((int)$result['total'] == 0) {
                //Não esta vinculado
                return false;
                break;
            }
        }
        //Todos os registros estão vinculados
        return true;
    }

    /**
     * 
     * @param array $dadosParticipante
     * @param string $cpf
     * 
     * @return bool
     */
    public function hasBeneficiarioComCpf(array $dadosParticipante, string $cpf): bool
    {
        foreach ($dadosParticipante as $participante) {
            if (!$participante instanceof ParticipanteProfileDTO) {
                throw new \Exception('Dados do participante não são válidos');
            }

            $qb = $this->connectTrust->createQueryBuilder();
            $result = $qb->select('COUNT(1) as total')
                ->from('DEPENDENTE', 'd')
                ->innerJoin('d', 'PESSOA', 'p', 'd.ID_PESSOA_DEP = p.ID_PESSOA')
                ->where('d.ID_PESSOA = :idParticipante')
                ->andWhere('p.NR_CNPJ_CPF = :cpf')
                ->setParameters(['idParticipante' => $participante->getId(), 'cpf' => $cpf])
                ->executeQuery()
                ->fetchAssociative();

            if ((int)$result['total'] > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array $dadosParticipante
     * @param string $grauParentesco
     * 
     * @return bool
     */
    public function hasConjugeVinculado(array $dadosParticipante, string $grauParentesco): bool
    {
        foreach ($dadosParticipante as $participante) {
            if (!$participante instanceof ParticipanteProfileDTO) {
                throw new \Exception('Dados do participante não são válidos');
            }

            $qb = $this->connectTrust->createQueryBuilder();
            $result = $qb->select('COUNT(1) as total')
                ->from('DEPENDENTE', 'd')
                ->where('d.ID_PESSOA = :idParticipante')
                ->andWhere('d.ID_PARENTESCO = :grauParentesco')
                ->setParameters(['idParticipante' => $participante->getId(), 'grauParentesco' => $grauParentesco])
                ->executeQuery()
                ->fetchAssociative();

            if ((int)$result['total'] > 0) {
                return true;
            }
        }

        return false;
    }
}
