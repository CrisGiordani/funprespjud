<?php

namespace App\DTO\Trust\Output;

use App\DTO\Trust\Input\ParticipanteProfileDTO;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Output Data Transfer Object for participant profile information
 *
 * This DTO represents the data structure for participant profile information
 * in API responses, including personal and contact details.
 */
class ParticipanteProfileOutputDTO
{
    #[Groups(['participant_profile:output'])]
    private ?string $id = null;

    #[Groups(['participant_profile:output'])]
    private ?string $nome = null;

    #[Groups(['participant_profile:output'])]
    private ?string $dtNascimento = null;

    #[Groups(['participant_profile:output'])]
    private ?string $sexo = null;

    #[Groups(['participant_profile:output'])]
    private ?string $inscricao = null;

    #[Groups(['participant_profile:output'])]
    private ?string $matricula = null;

    #[Groups(['participant_profile:output'])]
    private ?string $rg = null;

    #[Groups(['participant_profile:output'])]
    private ?string $emissorRg = null;

    #[Groups(['participant_profile:output'])]
    private ?string $ufRg = null;

    #[Groups(['participant_profile:output'])]
    private ?string $dtExpedicaoRg = null;

    #[Groups(['participant_profile:output'])]
    private ?string $nmEstadoCivil = null;

    #[Groups(['participant_profile:output'])]
    private ?string $politicamenteExposto = null;

    #[Groups(['participant_profile:output'])]
    private ?string $nmMae = null;

    #[Groups(['participant_profile:output'])]
    private ?string $nmPai = null;

    #[Groups(['participant_profile:output'])]
    private ?string $logradouro = null;

    #[Groups(['participant_profile:output'])]
    private ?string $numero = null;

    #[Groups(['participant_profile:output'])]
    private ?string $enderecoComplemento = null;

    #[Groups(['participant_profile:output'])]
    private ?string $bairro = null;

    #[Groups(['participant_profile:output'])]
    private ?string $cidade = null;

    #[Groups(['participant_profile:output'])]
    private ?string $enderecoUf = null;

    #[Groups(['participant_profile:output'])]
    private ?string $cep = null;

    #[Groups(['participant_profile:output'])]
    private ?string $telefone = null;

    #[Groups(['participant_profile:output'])]
    private ?string $telefoneComercial = null;

    #[Groups(['participant_profile:output'])]
    private ?string $celular = null;

    #[Groups(['participant_profile:output'])]
    private ?string $dtExercicio = null;

    #[Groups(['participant_profile:output'])]
    private ?string $dtInscricaoPlano = null;

    #[Groups(['participant_profile:output'])]
    private ?string $idCargo = null;

    #[Groups(['participant_profile:output'])]
    private ?string $nmCargo = null;

    #[Groups(['participant_profile:output'])]
    private ?int $idEmpresa = null;

    #[Groups(['participant_profile:output'])]
    private ?string $naturalidade = null;

    #[Groups(['participant_profile:output'])]
    private ?string $ufNaturalidade = null;

    #[Groups(['participant_profile:output'])]
    private ?string $nacionalidade = null;

    #[Groups(['participant_profile:output'])]
    private ?string $nmNacionalidade = null;

    #[Groups(['participant_profile:output'])]
    private ?string $estadoCivil = null;

    #[Groups(['participant_profile:output'])]
    private ?string $email = null;

    #[Groups(['participant_profile:output'])]
    private ?string $emailAdicional1 = null;

    #[Groups(['participant_profile:output'])]
    private ?string $emailAdicional2 = null;

    #[Groups(['participant_profile:output'])]
    private ?array $beneficiarios = null;

    #[Groups(['participant_profile:output'])]
    private ?string $dtOpcaoTributacao = null;

    #[Groups(['participant_profile:output'])]
    private ?string $planoSituacao = null;

    #[Groups(['participant_profile:output'])]
    private ?string $planoCategoria = null;

    #[Groups(['participant_profile:output'])]
    private ?array $planos = null;

    #[Groups(['participant_profile:output'])]
    private ?array $patrocinadores = null;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->nome = $data['nome'] ?? null;
        $this->dtNascimento = $data['dtNascimento'] ?? null;
        $this->sexo = $data['sexo'] ?? null;
        $this->inscricao = $data['inscricao'] ?? null;
        $this->matricula = $data['matricula'] ?? null;
        $this->rg = $data['rg'] ?? null;
        $this->emissorRg = $data['emissorRg'] ?? null;
        $this->ufRg = $data['ufRg'] ?? null;
        $this->dtExpedicaoRg = $data['dtExpedicaoRg'] ?? null;
        $this->nmEstadoCivil = $data['nmEstadoCivil'] ?? null;
        $this->politicamenteExposto = $data['politicamenteExposto'] ?? null;
        $this->nmMae = $data['nmMae'] ?? null;
        $this->nmPai = $data['nmPai'] ?? null;
        $this->logradouro = $data['logradouro'] ?? null;
        $this->numero = $data['numero'] ?? null;
        $this->enderecoComplemento = $data['enderecoComplemento'] ?? null;
        $this->bairro = $data['bairro'] ?? null;
        $this->cidade = $data['cidade'] ?? null;
        $this->enderecoUf = $data['enderecoUf'] ?? null;
        $this->cep = $data['cep'] ?? null;
        $this->telefone = $data['telefone'] ?? null;
        $this->telefoneComercial = $data['telefoneComercial'] ?? null;
        $this->celular = $data['celular'] ?? null;
        $this->dtExercicio = $data['dtExercicio'] ?? null;
        $this->dtInscricaoPlano = $data['dtInscricaoPlano'] ?? null;
        $this->idCargo = $data['idCargo'] ?? null;
        $this->nmCargo = $data['nmCargo'] ?? null;
        $this->idEmpresa = $data['idEmpresa'] ?? null;
        $this->naturalidade = $data['naturalidade'] ?? null;
        $this->ufNaturalidade = $data['ufNaturalidade'] ?? null;
        $this->nacionalidade = $data['nacionalidade'] ?? null;
        $this->nmNacionalidade = $data['nmNacionalidade'] ?? null;
        $this->estadoCivil = $data['estadoCivil'] ?? null;
        $this->email = $data['email'] ?? null;
        $this->emailAdicional1 = $data['emailAdicional1'] ?? null;
        $this->emailAdicional2 = $data['emailAdicional2'] ?? null;
        $this->beneficiarios = $data['beneficiarios'] ?? [];
        $this->dtOpcaoTributacao = $data['dtOpcaoTributacao'] ?? null;
        $this->planoSituacao = $data['planoSituacao'] ?? null;
        $this->planoCategoria = $data['planoCategoria'] ?? null;
        $this->planos = $data['planos'] ?? null;
        $this->patrocinadores = $data['patrocinadores'] ?? null;
    }

    public static function fromParticipanteProfileDTO(ParticipanteProfileDTO $participante): self
    {
        $participante = new self();
        $participante->id = $participante->getId();
        $participante->nome = $participante->getNome();
        $participante->dtNascimento = $participante->getDtNascimento();
        $participante->sexo = $participante->getSexo();
        $participante->inscricao = $participante->getInscricao();
        $participante->matricula = $participante->getMatricula();
        $participante->rg = $participante->getRg();
        $participante->emissorRg = $participante->getEmissorRg();
        $participante->ufRg = $participante->getUfRg();
        $participante->dtExpedicaoRg = $participante->getDtExpedicaoRg();
        $participante->nmEstadoCivil = $participante->getNmEstadoCivil();
        $participante->politicamenteExposto = $participante->getPoliticamenteExposto();
        $participante->nmMae = $participante->getNmMae();
        $participante->nmPai = $participante->getNmPai();
        $participante->logradouro = $participante->getLogradouro();
        $participante->numero = $participante->getNumero();
        $participante->enderecoComplemento = $participante->getEnderecoComplemento();
        $participante->bairro = $participante->getBairro();
        $participante->cidade = $participante->getCidade();
        $participante->enderecoUf = $participante->getEnderecoUf();
        $participante->cep = $participante->getCep();
        $participante->telefone = $participante->getTelefone();
        $participante->telefoneComercial = $participante->getTelefoneComercial();
        $participante->celular = $participante->getCelular();
        $participante->dtExercicio = $participante->getDtExercicio();
        $participante->dtInscricaoPlano = $participante->getDtInscricaoPlano();
        $participante->idCargo = $participante->getIdCargo();
        $participante->nmCargo = $participante->getNmCargo();
        $participante->idEmpresa = $participante->getIdEmpresa();
        $participante->naturalidade = $participante->getNaturalidade();
        $participante->ufNaturalidade = $participante->getUfNaturalidade();
        $participante->nacionalidade = $participante->getNacionalidade();
        $participante->nmNacionalidade = $participante->getNmNacionalidade();
        $participante->estadoCivil = $participante->getEstadoCivil();
        $participante->email = $participante->getEmail();
        $participante->emailAdicional1 = $participante->getEmailAdicional1();
        $participante->emailAdicional2 = $participante->getEmailAdicional2();
        $participante->beneficiarios = $participante->getBeneficiarios();
        $participante->dtOpcaoTributacao = $participante->getDtOpcaoTributacao();
        $participante->planoSituacao = $participante->getPlanoSituacao();
        $participante->planoCategoria = $participante->getPlanoCategoria();
        $participante->planos = $participante->getPlanos();
        $participante->patrocinadores = $participante->getPatrocinadores();
        return $participante;
    }

    /**
     * Get the unique identifier
     *
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * Set the unique identifier
     *
     * @param string|null $id
     * @return $this
     */
    public function setId(?string $id): self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the participant's name
     *
     * @return string|null
     */
    public function getNome(): ?string
    {
        return $this->nome;
    }

    /**
     * Set the participant's name
     *
     * @param string|null $nome
     * @return $this
     */
    public function setNome(?string $nome): self
    {
        $this->nome = $nome;

        return $this;
    }

    /**
     * Get the birth date
     *
     * @return string|null
     */
    public function getDtNascimento(): ?string
    {
        return $this->dtNascimento;
    }

    /**
     * Set the birth date
     *
     * @param string|null $dtNascimento
     * @return $this
     */
    public function setDtNascimento(?string $dtNascimento): self
    {
        $this->dtNascimento = $dtNascimento;

        return $this;
    }

    /**
     * Get the gender
     *
     * @return string|null
     */
    public function getSexo(): ?string
    {
        return $this->sexo;
    }

    /**
     * Set the gender
     *
     * @param string|null $sexo
     * @return $this
     */
    public function setSexo(?string $sexo): self
    {
        $this->sexo = $sexo;

        return $this;
    }

    /**
     * Get the registration number
     *
     * @return string|null
     */
    public function getInscricao(): ?string
    {
        return $this->inscricao;
    }

    /**
     * Set the registration number
     *
     * @param string|null $inscricao
     * @return $this
     */
    public function setInscricao(?string $inscricao): self
    {
        $this->inscricao = $inscricao;

        return $this;
    }

    /**
     * Get the enrollment number
     *
     * @return string|null
     */
    public function getMatricula(): ?string
    {
        return $this->matricula;
    }

    /**
     * Set the enrollment number
     *
     * @param string|null $matricula
     * @return $this
     */
    public function setMatricula(?string $matricula): self
    {
        $this->matricula = $matricula;

        return $this;
    }

    /**
     * Get the RG (identity document) number
     *
     * @return string|null
     */
    public function getRg(): ?string
    {
        return $this->rg;
    }

    /**
     * Set the RG (identity document) number
     *
     * @param string|null $rg
     * @return $this
     */
    public function setRg(?string $rg): self
    {
        $this->rg = $rg;

        return $this;
    }

    /**
     * Get the RG issuing authority
     *
     * @return string|null
     */
    public function getEmissorRg(): ?string
    {
        return $this->emissorRg;
    }

    /**
     * Set the RG issuing authority
     *
     * @param string|null $emissorRg
     * @return $this
     */
    public function setEmissorRg(?string $emissorRg): self
    {
        $this->emissorRg = $emissorRg;

        return $this;
    }

    /**
     * Get the RG state
     *
     * @return string|null
     */
    public function getUfRg(): ?string
    {
        return $this->ufRg;
    }

    /**
     * Set the RG state
     *
     * @param string|null $ufRg
     * @return $this
     */
    public function setUfRg(?string $ufRg): self
    {
        $this->ufRg = $ufRg;

        return $this;
    }

    /**
     * Get the RG issue date
     *
     * @return string|null
     */
    public function getDtExpedicaoRg(): ?string
    {
        return $this->dtExpedicaoRg;
    }

    /**
     * Set the RG issue date
     *
     * @param string|null $dtExpedicaoRg
     * @return $this
     */
    public function setDtExpedicaoRg(?string $dtExpedicaoRg): self
    {
        $this->dtExpedicaoRg = $dtExpedicaoRg;

        return $this;
    }

    /**
     * Get the marital status
     *
     * @return string|null
     */
    public function getNmEstadoCivil(): ?string
    {
        return $this->nmEstadoCivil;
    }

    /**
     * Set the marital status
     *
     * @param string|null $nmEstadoCivil
     * @return $this
     */
    public function setNmEstadoCivil(?string $nmEstadoCivil): self
    {
        $this->nmEstadoCivil = $nmEstadoCivil;

        return $this;
    }

    /**
     * Get the politically exposed person status
     *
     * @return string|null
     */
    public function getPoliticamenteExposto(): ?string
    {
        return $this->politicamenteExposto;
    }

    /**
     * Set the politically exposed person status
     *
     * @param string|null $politicamenteExposto
     * @return $this
     */
    public function setPoliticamenteExposto(?string $politicamenteExposto): self
    {
        $this->politicamenteExposto = $politicamenteExposto;

        return $this;
    }

    /**
     * Get the mother's name
     *
     * @return string|null
     */
    public function getNmMae(): ?string
    {
        return $this->nmMae;
    }

    /**
     * Set the mother's name
     *
     * @param string|null $nmMae
     * @return $this
     */
    public function setNmMae(?string $nmMae): self
    {
        $this->nmMae = $nmMae;

        return $this;
    }

    /**
     * Get the father's name
     *
     * @return string|null
     */
    public function getNmPai(): ?string
    {
        return $this->nmPai;
    }

    /**
     * Set the father's name
     *
     * @param string|null $nmPai
     * @return $this
     */
    public function setNmPai(?string $nmPai): self
    {
        $this->nmPai = $nmPai;

        return $this;
    }

    /**
     * Get the street address
     *
     * @return string|null
     */
    public function getLogradouro(): ?string
    {
        return $this->logradouro;
    }

    /**
     * Set the street address
     *
     * @param string|null $logradouro
     * @return $this
     */
    public function setLogradouro(?string $logradouro): self
    {
        $this->logradouro = $logradouro;

        return $this;
    }

    /**
     * Get the address number
     *
     * @return string|null
     */
    public function getNumero(): ?string
    {
        return $this->numero;
    }

    /**
     * Set the address number
     *
     * @param string|null $numero
     * @return $this
     */
    public function setNumero(?string $numero): self
    {
        $this->numero = $numero;

        return $this;
    }

    /**
     * Get the address complement
     *
     * @return string|null
     */
    public function getEnderecoComplemento(): ?string
    {
        return $this->enderecoComplemento;
    }

    /**
     * Set the address complement
     *
     * @param string|null $enderecoComplemento
     * @return $this
     */
    public function setEnderecoComplemento(?string $enderecoComplemento): self
    {
        $this->enderecoComplemento = $enderecoComplemento;

        return $this;
    }

    /**
     * Get the neighborhood
     *
     * @return string|null
     */
    public function getBairro(): ?string
    {
        return $this->bairro;
    }

    /**
     * Set the neighborhood
     *
     * @param string|null $bairro
     * @return $this
     */
    public function setBairro(?string $bairro): self
    {
        $this->bairro = $bairro;

        return $this;
    }

    /**
     * Get the city
     *
     * @return string|null
     */
    public function getCidade(): ?string
    {
        return $this->cidade;
    }

    /**
     * Set the city
     *
     * @param string|null $cidade
     * @return $this
     */
    public function setCidade(?string $cidade): self
    {
        $this->cidade = $cidade;

        return $this;
    }

    /**
     * Get the state
     *
     * @return string|null
     */
    public function getEnderecoUf(): ?string
    {
        return $this->enderecoUf;
    }

    /**
     * Set the state
     *
     * @param string|null $enderecoUf
     * @return $this
     */
    public function setEnderecoUf(?string $enderecoUf): self
    {
        $this->enderecoUf = $enderecoUf;

        return $this;
    }

    /**
     * Get the postal code
     *
     * @return string|null
     */
    public function getCep(): ?string
    {
        return $this->cep;
    }

    /**
     * Set the postal code
     *
     * @param string|null $cep
     * @return $this
     */
    public function setCep(?string $cep): self
    {
        $this->cep = $cep;

        return $this;
    }

    /**
     * Get the phone number
     *
     * @return string|null
     */
    public function getTelefone(): ?string
    {
        return $this->telefone;
    }

    /**
     * Set the phone number
     *
     * @param string|null $telefone
     * @return $this
     */
    public function setTelefone(?string $telefone): self
    {
        $this->telefone = $telefone;

        return $this;
    }

    /**
     * Get the business phone number
     *
     * @return string|null
     */
    public function getTelefoneComercial(): ?string
    {
        return $this->telefoneComercial;
    }

    /**
     * Set the business phone number
     *
     * @param string|null $telefoneComercial
     * @return $this
     */
    public function setTelefoneComercial(?string $telefoneComercial): self
    {
        $this->telefoneComercial = $telefoneComercial;

        return $this;
    }

    /**
     * Get the mobile phone number
     *
     * @return string|null
     */
    public function getCelular(): ?string
    {
        return $this->celular;
    }

    /**
     * Set the mobile phone number
     *
     * @param string|null $celular
     * @return $this
     */
    public function setCelular(?string $celular): self
    {
        $this->celular = $celular;

        return $this;
    }

    /**
     * Get the exercise date
     *
     * @return string|null
     */
    public function getDtExercicio(): ?string
    {
        return $this->dtExercicio;
    }

    /**
     * Set the exercise date
     *
     * @param string|null $dtExercicio
     * @return $this
     */
    public function setDtExercicio(?string $dtExercicio): self
    {
        $this->dtExercicio = $dtExercicio;

        return $this;
    }

    /**
     * Get the plan registration date
     *
     * @return string|null
     */
    public function getDtInscricaoPlano(): ?string
    {
        return $this->dtInscricaoPlano;
    }

    /**
     * Set the plan registration date
     *
     * @param string|null $dtInscricaoPlano
     * @return $this
     */
    public function setDtInscricaoPlano(?string $dtInscricaoPlano): self
    {
        $this->dtInscricaoPlano = $dtInscricaoPlano;

        return $this;
    }

    /**
     * Get the position ID
     *
     * @return string|null
     */
    public function getIdCargo(): ?string
    {
        return $this->idCargo;
    }

    /**
     * Set the position ID
     *
     * @param string|null $idCargo
     * @return $this
     */
    public function setIdCargo(?string $idCargo): self
    {
        $this->idCargo = $idCargo;

        return $this;
    }

    /**
     * Get the position name
     *
     * @return string|null
     */
    public function getNmCargo(): ?string
    {
        return $this->nmCargo;
    }

    /**
     * Set the position name
     *
     * @param string|null $nmCargo
     * @return $this
     */
    public function setNmCargo(?string $nmCargo): self
    {
        $this->nmCargo = $nmCargo;

        return $this;
    }

    /**
     * Get the place of birth
     *
     * @return string|null
     */
    public function getIdEmpresa(): ?int
    {
        return $this->idEmpresa;
    }

    /**
     * Set the company ID
     *
     * @param int|null $idEmpresa
     * @return $this
     */
    public function setIdEmpresa(?int $idEmpresa): self
    {
        $this->idEmpresa = $idEmpresa;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getNaturalidade(): ?string
    {
        return $this->naturalidade;
    }

    /**
     * Set the place of birth
     *
     * @param string|null $naturalidade
     * @return $this
     */
    public function setNaturalidade(?string $naturalidade): self
    {
        $this->naturalidade = $naturalidade;

        return $this;
    }

    /**
     * Get the state of birth
     *
     * @return string|null
     */
    public function getUfNaturalidade(): ?string
    {
        return $this->ufNaturalidade;
    }

    /**
     * Set the state of birth
     *
     * @param string|null $ufNaturalidade
     * @return $this
     */
    public function setUfNaturalidade(?string $ufNaturalidade): self
    {
        $this->ufNaturalidade = $ufNaturalidade;

        return $this;
    }

    /**
     * Get the nationality
     *
     * @return string|null
     */
    public function getNacionalidade(): ?string
    {
        return $this->nacionalidade;
    }

    /**
     * Set the nationality
     *
     * @param string|null $nacionalidade
     * @return $this
     */
    public function setNacionalidade(?string $nacionalidade): self
    {
        $this->nacionalidade = $nacionalidade;

        return $this;
    }

    /**
     * Get the nationality name
     *
     * @return string|null
     */
    public function getNmNacionalidade(): ?string
    {
        return $this->nmNacionalidade;
    }

    /**
     * Set the nationality name
     *
     * @param string|null $nmNacionalidade
     * @return $this
     */
    public function setNmNacionalidade(?string $nmNacionalidade): self
    {
        $this->nmNacionalidade = $nmNacionalidade;

        return $this;
    }

    /**
     * Get the marital status
     *
     * @return string|null
     */
    public function getEstadoCivil(): ?string
    {
        return $this->estadoCivil;
    }

    /**
     * Set the marital status
     *
     * @param string|null $estadoCivil
     * @return $this
     */
    public function setEstadoCivil(?string $estadoCivil): self
    {
        $this->estadoCivil = $estadoCivil;

        return $this;
    }

    /**
     * Get the email address
     *
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Set the email address
     *
     * @param string|null $email
     * @return $this
     */
    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get the additional email address 1
     *
     * @return string|null
     */
    public function getEmailAdicional1(): ?string
    {
        return $this->emailAdicional1;
    }

    /**
     * Set the additional email address 1
     *
     * @param string|null $emailAdicional1
     * @return $this
     */
    public function setEmailAdicional1(?string $emailAdicional1): self
    {
        $this->emailAdicional1 = $emailAdicional1;

        return $this;
    }

    /**
     * Get the additional email address 2
     *
     * @return string|null
     */
    public function getEmailAdicional2(): ?string
    {
        return $this->emailAdicional2;
    }

    /**
     * Set the additional email address 2
     *
     * @param string|null $emailAdicional2
     * @return $this
     */
    public function setEmailAdicional2(?string $emailAdicional2): self
    {
        $this->emailAdicional2 = $emailAdicional2;

        return $this;
    }

    /**
     * Get the beneficiaries
     *
     * @return array|null
     */
    public function getBeneficiarios(): ?array
    {
        return $this->beneficiarios;
    }

    /**
     * Set the beneficiaries
     *
     * @param array|null $beneficiarios
     * @return $this
     */
    public function setBeneficiarios(?array $beneficiarios): self
    {
        $this->beneficiarios = $beneficiarios;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    /**
     * Get the option tax date
     *
     * @return string|null
     */
    public function getDtOpcaoTributacao(): ?string
    {
        return $this->dtOpcaoTributacao;
    }

    /**
     * Set the option tax date
     *
     * @param string|null $dtOpcaoTributacao
     * @return $this
     */
    public function setDtOpcaoTributacao(?string $dtOpcaoTributacao): self
    {
        $this->dtOpcaoTributacao = $dtOpcaoTributacao;

        return $this;
    }

    public function getPlanoSituacao(): ?string
    {
        return $this->planoSituacao;
    }

    public function setPlanoSituacao(?string $planoSituacao): self
    {
        $this->planoSituacao = $planoSituacao;
        return $this;
    }

    public function getPlanoCategoria(): ?string
    {
        return $this->planoCategoria;
    }

    public function setPlanoCategoria(?string $planoCategoria): self
    {
        $this->planoCategoria = $planoCategoria;
        return $this;
    }

    public function getPlanos(): ?array
    {
        return $this->planos;
    }

    public function setPlanos(?array $planos): self
    {
        $this->planos = $planos;
        return $this;
    }

    public function getPatrocinadores(): ?array
    {
        return $this->patrocinadores;
    }

    public function setPatrocinadores(?array $patrocinadores): self
    {
        $this->patrocinadores = $patrocinadores;
        return $this;
    }
}
