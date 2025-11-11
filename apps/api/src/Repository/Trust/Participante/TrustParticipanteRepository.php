<?php

namespace App\Repository\Trust\Participante;

use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Input\PatrocinadorDTO;
use App\DTO\Trust\Output\ParticipanteProfileOutputDTO;
use App\Interface\Trust\Repository\TrustParticipanteRepositoryInterface;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;

final class TrustParticipanteRepository implements TrustParticipanteRepositoryInterface
{
    public function __construct(
        private Connection $connection,
        private LoggerInterface $logger,
    ) {}

    /**
     * Busca o perfil do participante
     *
     *
     * @param string $cpf
     *
     * @return array|null|ParticipanteProfileOutputDTO
     */
    public function getParticipante(string $cpf, $getAll = false): array|null|ParticipanteProfileOutputDTO
    {
        try {
            $qb = $this->connection->createQueryBuilder('p');
            $builder = $qb->select(
                'p.ID_PESSOA as id',
                'p.NM_PESSOA as nome',
                'p.NM_CONJUGE as nomeConjuge',
                'CONVERT(VARCHAR(10),p.DT_NASCIMENTO, 103) as dtNascimento',
                'p.IC_SEXO as sexo',
                'p.NR_INSCRICAO as inscricao',
                'p.NR_MATRICULA as matricula',
                'p.NR_RG as rg',
                'p.SG_EMISSOR_RG as emissorRg',
                'p.SG_UF_EMISSOR_RG as ufRg',
                'CONVERT(VARCHAR(10),p.DT_EMISS_RG, 103)  as dtExpedicaoRg',
                '(select NM_ESTADO_CIVIL from ESTADO_CIVIL where ID_ESTADO_CIVIL = p.ID_ESTADO_CIVIL) as nmEstadoCivil',
                'p.IC_EXPOSTA as politicamenteExposto',
                'p.NM_MAE as nmMae',
                'p.NM_PAI as nmPai',
                'p.NM_ENDERECO as logradouro',
                'p.NR_ENDERECO as numero',
                'p.NM_COMPLEMENTO as enderecoComplemento',
                'p.NM_BAIRRO as bairro',
                'p.NM_CIDADE as cidade',
                'p.SG_UF as enderecoUf',
                'p.NR_CEP as cep',
                'p.NR_TELEFONE as telefone',
                'p.NR_TELEFONE_COM as telefoneComercial',
                'p.NR_CELULAR as celular',
                'CONVERT(VARCHAR(10),p.DT_ADMISSAO, 103) as dtExercicio',
                'pp.DT_INI_PLANO as dtInscricaoPlano',
                'pp.DT_OPCAO_TRIBUTACAO as dtOpcaoTributacao',
                'p.ID_CARGO as idCargo',
                'p.ID_EMP as idEmpresa',
                '(select top 1 NM_CARGO from CARGO where ID_EMP = p.ID_EMP and ID_CARGO = p.ID_CARGO) as nmCargo',
                'p.NM_CID_NATURAL as naturalidade',
                'p.SG_UF_NATURAL as ufNaturalidade',
                'p.ID_NACIONALIDADE as nacionalidade',
                '(select NM_NACIONALIDADE from NACIONALIDADE where ID_NACIONALIDADE = p.ID_NACIONALIDADE) as nmNacionalidade',
                'p.ID_ESTADO_CIVIL as estadoCivil',
                'p.NM_EMAIL as email',
                'p.NM_EMAIL2 as emailAdicional1',
                'p.NM_EMAIL3 as emailAdicional2',
                'ps.NM_SITUACAO as planoSituacao',
                'pc.NM_CATEGORIA AS planoCategoria',
            )
                ->from('PESSOA', 'p')
                ->leftJoin('p', 'PLANO_PARTICIPANTE', 'pp', 'p.ID_PESSOA = pp.ID_PESSOA')

                ->leftJoin('p', 'HIST_PLANO_PARTICIPANTE', 'hpp', 'p.ID_PESSOA = hpp.ID_PESSOA')
                ->leftJoin('hpp', 'PLANO_CATEGORIA', 'pc', 'pc.ID_CATEGORIA = hpp.ID_CATEGORIA')
                ->leftJoin('hpp', 'PLANO_SITUACAO', 'ps', 'hpp.ID_SITUACAO = ps.ID_SITUACAO')

                ->where('p.NR_CNPJ_CPF = :cpf')
                ->andWhere('hpp.DT_FIM IS NULL')
                ->andWhere('hpp.ID_SITUACAO in (1,2, 4,7,5,6,10,26,28,29)')
                ->setParameter('cpf', $cpf);
            if (!$getAll) {
                $builder->andWhere('pp.DT_FIM_PLANO is null');
            }
            $dados = $builder->executeQuery()->fetchAllAssociative();

            return $dados ? new ParticipanteProfileOutputDTO(array_shift($dados)) : null;
        } catch (\Exception $exception) {

            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * Busca os dados do participante ativo
     *
     * @param string $cpf
     *
     * @return array<ParticipanteProfileDTO>
     */
    public function getDadosParticipanteAtivo(string $cpf): array
    {
        try {
            $qb = $this->connection->createQueryBuilder('p');
            $dados = $qb->select('p.ID_PESSOA as id, p.NM_PESSOA as nome, p.DT_NASCIMENTO as dtNascimento, p.IC_SEXO as sexo, p.NR_CELULAR as celular, p.NM_EMAIL as email, p.NM_ENDERECO as endereco, p.NM_BAIRRO as bairro, p.NM_CIDADE as cidade, p.SG_UF as uf')
                ->from('PESSOA', 'p')
                ->innerJoin('p', 'hist_plano_participante', 'hpp', 'p.ID_PESSOA = hpp.ID_PESSOA')
                ->innerJoin('hpp', 'PLANO_CATEGORIA', 'pc', 'hpp.ID_CATEGORIA = pc.ID_CATEGORIA')
                ->where('p.NR_CNPJ_CPF = :cpf')
                ->andWhere('hpp.dt_fim is null')
                ->andWhere('hpp.ID_SITUACAO in (1,2,7,5,6,10,28)')
                ->setParameter('cpf', $cpf)
                ->executeQuery()
                ->fetchAllAssociative();

            return $dados ? array_map(fn($row) => (new ParticipanteProfileDTO($row)), $dados) : null;
        } catch (\Exception $e) {
            throw new \Exception('Erro ao buscar dados do participante ativo: ');
        }
    }

    /**
     * Busca os emails adicionais do participante
     *
     *
     * @param string $cpf
     *
     * @return array|null
     */
    public function getEmailsAdicionaisParticipante(string $cpf): array|null
    {
        $qb = $this->connection->createQueryBuilder('p');
        $builder = $qb->select('p.NM_EMAIL2 as email2', 'p.NM_EMAIL3 as email3')
            ->from('PESSOA', 'p')
            ->where('p.NR_CNPJ_CPF = :cpf')
            ->setParameter('cpf', $cpf);

        $dados = $builder->executeQuery()->fetchAllAssociative();

        return $dados ? array_shift($dados) : null;
    }

    /**
     * Atualiza o perfil do participante
     *
     *
     * @param string $cpf
     * @param ParticipanteProfileDTO $dados
     *
     * @return bool
     */
    public function updateParticipante(string $cpf, ParticipanteProfileDTO $dados): bool
    {
        try {
            $qb = $this->connection->createQueryBuilder();
            $qb->update('PESSOA')
                ->where('NR_CNPJ_CPF = :cpf')
                ->setParameter('cpf', $cpf);

            $parameters = ['cpf' => $cpf];

            // * Mapeamento de getters para campos do banco de dados
            $fieldMappings = [
                'getNome' => 'NM_PESSOA',
                'getDtNascimento' => 'DT_NASCIMENTO',
                'getSexo' => 'IC_SEXO',

                //* Mapeado para não poder ser alterado pelo participante
                // 'getRg' => 'NR_RG',
                // 'getEmissorRg' => 'SG_EMISSOR_RG',
                // 'getUfRg' => 'SG_UF_EMISSOR_RG',
                // 'getDtExpedicaoRg' => 'DT_EMISS_RG',

                'getPoliticamenteExposto' => 'IC_EXPOSTA',
                'getNmMae' => 'NM_MAE',
                'getNmPai' => 'NM_PAI',
                'getLogradouro' => 'NM_ENDERECO',
                'getNumero' => 'NR_ENDERECO',
                'getEnderecoComplemento' => 'NM_COMPLEMENTO',
                'getBairro' => 'NM_BAIRRO',
                'getCidade' => 'NM_CIDADE',
                'getEnderecoUf' => 'SG_UF',
                'getCep' => 'NR_CEP',
                'getTelefone' => 'NR_TELEFONE',
                'getTelefoneComercial' => 'NR_TELEFONE_COM',
                'getCelular' => 'NR_CELULAR',
                'getNaturalidade' => 'NM_CID_NATURAL',
                'getUfNaturalidade' => 'SG_UF_NATURAL',
                'getNacionalidade' => 'ID_NACIONALIDADE',
                'getEstadoCivil' => 'ID_ESTADO_CIVIL',
                'getEmail' => 'NM_EMAIL',
                'getEmailAdicional1' => 'NM_EMAIL2',
                'getEmailAdicional2' => 'NM_EMAIL3',
            ];

            // * Processa cada campo do mapeamento
            foreach ($fieldMappings as $getter => $dbField) {
                $value = $dados->$getter();
                $paramName = str_replace('get', '', $getter);
                $paramName = lcfirst($paramName);
                $qb->set($dbField, ':' . $paramName);
                $parameters[$paramName] = $value;
            }

            // ! Só executa a query se houver campos para atualizar
            if (count($parameters) > 1) { // ! Mais de 1 porque sempre temos o CPF
                $qb->setParameters($parameters);
                $qb->executeStatement();

                return true;
            }

            return false;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw $exception;
        }
    }

    /**
     * Busca o patrocinador do participante junto com o salário do participante
     *
     *
     * @param string $cpf
     *
     * @return array<PatrocinadorDTO>|null
     */
    public function getPatrocinadoresSalario(string $cpf): array|null
    {
        try {
            $qb = $this->connection->createQueryBuilder();
            $qb->select(
                'DISTINCT(p2.ID_PESSOA) as id',
                'p1.ID_PESSOA as idPessoa',
                'p1.ID_EMP as idEmpresa',
                'p1.ID_CARGO as idCargo',
                'p2.NR_CNPJ_CPF as cnpj',
                'p2.SG_PESSOA as sigla',
                'p2.NM_PESSOA as nome',
                'CONVERT(VARCHAR(10),p1.DT_ADMISSAO, 103) as dtExercicio',
                '(select top 1 NM_CARGO from CARGO where ID_EMP = p1.ID_EMP and ID_CARGO = p1.ID_CARGO) as nmCargo',
                '(select CONVERT(VARCHAR(10),min(DT_INI), 103)  from HIST_PLANO_PARTICIPANTE where ID_PESSOA = p1.ID_PESSOA) as dtInscricaoPlano',
                '(SELECT TOP 1 hb.[VL_RUBRICA] FROM HIST_RUBRICA as hb where p1.ID_PESSOA = hb.[ID_PESSOA] AND hb.ID_RUBRICA = :rubrica  order by hb.NR_ANO_COMP desc, hb.NR_MES_COMP desc) as salario'
            )->from('PESSOA', 'p1')
                ->innerJoin('p1', 'HIST_PLANO_PARTICIPANTE', 'hpp', 'p1.ID_PESSOA = hpp.ID_PESSOA')
                ->innerJoin('p1', 'EMPRESA', 'e', 'p1.ID_EMP = e.ID_EMP')
                ->innerJoin('e', 'PESSOA', 'p2', 'e.ID_PESSOA_EMP = p2.ID_PESSOA')
                ->innerJoin('p1', 'HIST_RUBRICA', 'hr', 'p1.ID_PESSOA = hr.ID_PESSOA')
                ->where('p1.NR_CNPJ_CPF = :cpf')
                ->andWhere('hpp.DT_FIM IS NULL')
                ->andWhere('hpp.ID_SITUACAO in (1,2,7,5,6,10,26,28)')
                ->setParameter('cpf', $cpf)
                ->setParameter('rubrica', 'S002');

            $dados = $qb->executeQuery()->fetchAllAssociative();

            $patrocinadores = [];
            array_map(function ($dado) use (&$patrocinadores) {
                $patrocinadores[] = new PatrocinadorDTO($dado);
            }, $dados);

            return $patrocinadores ?? null;
        } catch (\Throwable $th) {
            $this->logger->error($th->getMessage());

            throw $th;
        }
    }

    /**
     * Busca os patrocinadores do participante sem o salário do participante
     *
     *
     * @param string $cpf
     *
     * @return array|null
     */
    public function getPatrocinadores(string $cpf): array|null
    {
        $qb = $this->connection->createQueryBuilder();
        $qb->select(
            'p2.ID_PESSOA as id',
            'p2.NR_CNPJ_CPF as cnpj',
            'p2.SG_PESSOA as sigla',
            'p2.NM_PESSOA as nome',
            'CONVERT(VARCHAR(10),p1.DT_ADMISSAO, 103) as dtExercicio',
            '(select top 1 NM_CARGO from CARGO where ID_EMP = p1.ID_EMP and ID_CARGO = p1.ID_CARGO) as nmCargo',
            '(select CONVERT(VARCHAR(10),min(DT_INI), 103)  from HIST_PLANO_PARTICIPANTE where ID_PESSOA = p1.ID_PESSOA) as dtInscricaoPlano'
        )->from('PESSOA', 'p1')
            ->innerJoin('p1', 'EMPRESA', 'e', 'p1.ID_EMP = e.ID_EMP')
            ->innerJoin('e', 'PESSOA', 'p2', 'e.ID_PESSOA_EMP = p2.ID_PESSOA')
            ->where('p1.NR_CNPJ_CPF = :cpf')
            ->setParameter('cpf', $cpf);

        $dados = $qb->executeQuery()->fetchAllAssociative();

        $patrocinadores = [];
        array_map(function ($dado) use (&$patrocinadores) {
            $patrocinadores[] = new PatrocinadorDTO($dado);
        }, $dados);

        return $patrocinadores ?? null;
    }


    /**
     * Busca os patrocinadores do participante sem o salário do participante
     *
     *
     * @param string $cpf
     *
     * @return array|null
     */
    public function getPatrocinador(string $cpf): array|null
    {
        $qb = $this->connection->createQueryBuilder();
        $qb->select(
            'p2.ID_PESSOA as id',
            'p2.NR_CNPJ_CPF as cnpj',
            'p2.SG_PESSOA as sigla',
            'p2.NM_PESSOA as nome',
            'CONVERT(VARCHAR(10),p1.DT_ADMISSAO, 103) as dtExercicio',
            'CONVERT(VARCHAR(10),p1.DT_DEMISSAO, 103) as dtFinalExercicio',
            '(select top 1 NM_CARGO from CARGO where ID_EMP = p1.ID_EMP and ID_CARGO = p1.ID_CARGO) as nmCargo',
            '(select CONVERT(VARCHAR(10),min(DT_INI), 103)  from HIST_PLANO_PARTICIPANTE where ID_PESSOA = p1.ID_PESSOA) as dtInscricaoPlano'
        )->from('PESSOA', 'p1')
            ->innerJoin('p1', 'EMPRESA', 'e', 'p1.ID_EMP = e.ID_EMP')
            ->innerJoin('e', 'PESSOA', 'p2', 'e.ID_PESSOA_EMP = p2.ID_PESSOA')
            ->where('p1.NR_CNPJ_CPF = :cpf')
            ->andWhere('(p1.DT_DEMISSAO IS NULL OR p1.DT_DEMISSAO >= GETDATE())')
            ->setParameter('cpf', $cpf);

        $dados = $qb->executeQuery()->fetchAllAssociative();

        $patrocinadores = [];
        array_map(function ($dado) use (&$patrocinadores) {
            $patrocinadores[] = new PatrocinadorDTO($dado);
        }, $dados);

        return $patrocinadores ?? null;
    }

    /**
     * @param string $idParticipanteTrust
     *
     *
     * @return array
     */
    public function getPerfilAtual(string $idParticipanteTrust): array|null
    {
        try {
            $qb = $this->connection->createQueryBuilder();

            $qb->select('cp.ID_PERFIL as idPerfil', 'cp.NM_PERFIL as descricao')
                ->from('PERFIL_PLANO_PARTICIPANTE', 'ppp')
                ->innerJoin('ppp', 'CONFIG_PERFIL', 'cp', 'ppp.ID_PERFIL = cp.ID_PERFIL')
                ->where('ID_PESSOA = :idParticipanteTrust')
                ->setParameter('idParticipanteTrust', $idParticipanteTrust)
                ->orderBy('DT_VIGENCIA', 'DESC')
                ->setMaxResults(1);

            $result = $qb->executeQuery()->fetchAssociative();
            return $result ?: null;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param int $idPessoa
     *
     *
     * @return float
     */
    public function getSalarioParticipante(int $idPessoa): float
    {
        try {
            $qb = $this->connection->createQueryBuilder();
            $qb->select('CONVERT(DECIMAL(10,2), VL_RUBRICA) as VL_RUBRICA')
                ->from('HIST_RUBRICA')
                ->where('ID_PESSOA = :idPessoa')
                ->andWhere('ID_RUBRICA = :idRubrica')
                ->setParameter('idPessoa', $idPessoa)
                ->setParameter('idRubrica', 'S002')
                ->addOrderBy('NR_ANO_REF', 'DESC')
                ->addOrderBy('NR_MES_REF', 'DESC')
                ->setMaxResults(1);

            $dados = $qb->executeQuery()->fetchAssociative();

            return floatval($dados['VL_RUBRICA'] ?? 0.0);
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * Coberturas do participante.
     *
     *
     * @param string $cpf
     *
     *
     * @return array|null
     */
    public function getCoberturasCAR(string $cpf): array|null
    {
        try {
            $qb = $this->connection->createQueryBuilder();
            $builder = $qb
                ->select(
                    'emp.sg_pessoa as orgao',
                    'p.id_pessoa as idPessoa',
                    'p.nm_pessoa as nome',
                    'c.id_contribuicao as idContribuicao',
                    'c.nm_contribuicao as tipoContribuicao',
                    'CONVERT(DATETIME, h.dt_vigencia, 104) as dtVigencia',
                    'h.pc_contrib as valorSeguro'
                )
                ->from('pessoa', 'p')
                ->innerJoin('p', 'hist_contribuicao_percentual', 'h', 'p.id_pessoa = h.id_pessoa')
                ->leftJoin('h', 'contribuicao', 'c', 'h.id_contribuicao = c.id_contribuicao')
                ->leftJoin('h', 'conta_contribuicao', 'cc', 'cc.id_contribuicao = h.id_contribuicao')
                ->leftJoin('p', 'empresa', 'ep', 'p.id_emp = ep.id_emp')
                ->leftJoin('ep', "(SELECT
                                        a1.id_pessoa,
                                        a1.id_emp,
                                        a1.sg_pessoa,
                                        a1.nm_pessoa
                                    FROM
                                        pessoa a1
                                    WHERE
                                        a1.ic_emp_patroc = 'S')", 'emp', 'emp.id_pessoa = ep.id_pessoa_emp')
                ->where('p.NR_CNPJ_CPF = :cpf')
                ->setParameter('cpf', $cpf)
                ->andWhere('h.ID_CONTRIBUICAO in (471,475,476,477,554,555)')
                ->andWhere('h.pc_contrib > 0')
                ->andWhere("h.dt_vigencia = (SELECT
                                                Max(h1.dt_vigencia)
                                            FROM
                                                hist_contribuicao_percentual h1
                                            WHERE
                                                h1.id_pessoa = h.id_pessoa
                                                AND h1.id_contribuicao = h.id_contribuicao
                                                AND Format(h1.dt_vigencia, 'd') <= Getdate())");

            $retorno = $builder->executeQuery()->fetchAllAssociative();

            $coberturas = [];
            array_map(function ($dado) use (&$coberturas) {
                $coberturas[] = $dado;
            }, $retorno);

            return $coberturas ?? null;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     * @param array $dados
     * 
     * @return bool
     */
    public function updateCargo(string $cpf, array $dados): bool
    {
        try {
            array_map(function ($dado) use (&$cpf) {
                $qb = $this->connection->createQueryBuilder('p');
                $qb->update('PESSOA')
                    ->where('NR_CNPJ_CPF = :cpf')
                    ->andWhere('ID_PESSOA = :idPessoa')
                    ->set('ID_CARGO', ':idCargo')
                    ->setParameter('cpf', $cpf)
                    ->setParameter('idCargo', $dado['idCargo'])
                    ->setParameter('idPessoa', $dado['idPessoa']);
                $qb->executeStatement();
            }, $dados);

            return true;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }

    /**
     * @param string $cpf
     * 
     * @return array
     */
    public function getDadosPessoa(string $cpf): array|null
    {
        try {
            $qb = $this->connection->createQueryBuilder();
            $qb->select('*')
                ->from('PESSOA')
                ->where('NR_CNPJ_CPF = :cpf')
                ->setParameter('cpf', $cpf);

            $result = $qb->executeQuery()->fetchAllAssociative();
            return $result ?: null;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw  $exception;
        }
    }
}