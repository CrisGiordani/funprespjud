<?php

namespace App\DTO\Trust\Input;

use App\DTO\Trust\Output\ParticipanteProfileOutputDTO;
use App\Helper\CpfHelper;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class ParticipanteProfileDTO
{
    #[Groups(['participant_profile:read'])]
    private ?string $id = null;

    #[Assert\NotBlank(message: 'O nome do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $nome = null;

    #[Groups(['participant_profile:read'])]
    private ?string $conjuge = null;

    #[Assert\NotBlank(message: 'A data de nascimento do participante é obrigatória')]
    #[Assert\Regex(
        pattern: '/^\d{2}\/\d{2}\/\d{4}$/',
        message: 'A data de nascimento deve estar no formato dd/mm/aaaa'
    )]
    #[Groups(['participant_profile:read'])]
    private ?string $dtNascimento = null;

    #[Assert\NotBlank(message: 'O sexo do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $sexo = null;

    #[Groups(['participant_profile:read'])]
    private ?string $cpf = null;

    #[Groups(['participant_profile:read'])]
    private ?string $inscricao = null;

    #[Groups(['participant_profile:read'])]
    private ?string $matricula = null;

    #[Assert\NotBlank(message: 'O RG do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $rg = null;

    #[Assert\NotBlank(message: 'O emissor do RG do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $emissorRg = null;

    #[Assert\NotBlank(message: 'A UF do RG do participante é obrigatória')]
    #[Groups(['participant_profile:read'])]
    private ?string $ufRg = null;

    #[Groups(['participant_profile:read'])]
    private ?string $dtExpedicaoRg = null;

    #[Assert\NotBlank(message: 'O estado civil do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $estadoCivil = null;

    #[Groups(['participant_profile:read'])]
    private ?string $nmEstadoCivil = null;

    #[Groups(['participant_profile:read'])]
    private ?string $politicamenteExposto = null;

    #[Assert\NotBlank(message: 'O nome da mãe do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $nmMae = null;

    #[Groups(['participant_profile:read'])]
    private ?string $nmPai = null;

    #[Assert\NotBlank(message: 'O logradouro do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $logradouro = null;

    #[Assert\NotBlank(message: 'O número do endereço do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $numero = null;

    #[Groups(['participant_profile:read'])]
    private ?string $enderecoComplemento = null;

    #[Assert\NotBlank(message: 'O bairro do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $bairro = null;

    #[Assert\NotBlank(message: 'A cidade do participante é obrigatória')]
    #[Groups(['participant_profile:read'])]
    private ?string $cidade = null;

    #[Groups(['participant_profile:read'])]
    private ?string $enderecoUf = null;

    #[Groups(['participant_profile:read'])]
    private ?string $cep = null;

    #[Groups(['participant_profile:read'])]
    private ?string $telefone = null;

    #[Groups(['participant_profile:read'])]
    private ?string $telefoneComercial = null;

    #[Groups(['participant_profile:read'])]
    private ?string $celular = null;

    #[Groups(['participant_profile:read'])]
    private ?string $dtExercicio = null;

    #[Groups(['participant_profile:read'])]
    private ?string $dtInscricaoPlano = null;

    #[Groups(['participant_profile:read'])]
    private ?string $idCargo = null;

    #[Groups(['participant_profile:read'])]
    private ?string $nmCargo = null;

    #[Assert\NotBlank(message: 'A naturalidade do participante é obrigatória')]
    #[Groups(['participant_profile:read'])]
    private ?string $naturalidade = null;

    #[Assert\NotBlank(message: 'A UF da naturalidade do participante é obrigatória')]
    #[Groups(['participant_profile:read'])]
    private ?string $ufNaturalidade = null;

    #[Assert\NotBlank(message: 'A nacionalidade do participante é obrigatória')]
    #[Groups(['participant_profile:read'])]
    private ?string $nacionalidade = null;

    #[Groups(['participant_profile:read'])]
    private ?string $nmNacionalidade = null;

    #[Assert\NotBlank(message: 'O email princiapal do participante é obrigatório')]
    #[Groups(['participant_profile:read'])]
    private ?string $email = null;

    #[Groups(['participant_profile:read'])]
    private ?string $emailAdicional1 = null;

    #[Groups(['participant_profile:read'])]
    private ?string $emailAdicional2 = null;

    #[Groups(['participant_profile:read'])]
    private array $beneficiarios = [];

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->nome = $data['nome'] ?? null;
        $this->conjuge = $data['nomeConjuge'] ?? null;
        $this->dtNascimento = $data['dtNascimento'] ?? null;
        $this->sexo = $data['sexo'] ?? null;
        $this->cpf = $data['cpf'] ?? null;
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
        $this->naturalidade = $data['naturalidade'] ?? null;
        $this->ufNaturalidade = $data['ufNaturalidade'] ?? null;
        $this->nacionalidade = $data['nacionalidade'] ?? null;
        $this->nmNacionalidade = $data['nmNacionalidade'] ?? null;
        $this->estadoCivil = $data['estadoCivil'] ?? null;
        $this->email = $data['email'] ?? null;
        $this->emailAdicional1 = $data['emailAdicional1'] ?? null;
        $this->emailAdicional2 = $data['emailAdicional2'] ?? null;
        $this->beneficiarios = $data['beneficiarios'] ?? [];
    }

    /**
     * Converte ParticipanteProfileOutputDTO para ParticipanteProfileDTO
     */
    public static function fromParticipanteProfileOutputDTO(ParticipanteProfileOutputDTO $participante, string $cpf): ParticipanteProfileDTO
    {
        $data = [
            'id' => $participante->getId(),
            'nome' => $participante->getNome(),
            'dtNascimento' => $participante->getDtNascimento(),
            'sexo' => $participante->getSexo(),
            'cpf' => CpfHelper::formatCpf($cpf),
            'inscricao' => $participante->getInscricao(),
            'matricula' => $participante->getMatricula(),
            'rg' => $participante->getRg(),
            'emissorRg' => $participante->getEmissorRg(),
            'ufRg' => $participante->getUfRg(),
            'dtExpedicaoRg' => $participante->getDtExpedicaoRg(),
            'nmEstadoCivil' => $participante->getNmEstadoCivil(),
            'politicamenteExposto' => $participante->getPoliticamenteExposto(),
            'nmMae' => $participante->getNmMae(),
            'nmPai' => $participante->getNmPai(),
            'logradouro' => $participante->getLogradouro(),
            'numero' => $participante->getNumero(),
            'enderecoComplemento' => $participante->getEnderecoComplemento(),
            'bairro' => $participante->getBairro(),
            'cidade' => $participante->getCidade(),
            'enderecoUf' => $participante->getEnderecoUf(),
            'cep' => $participante->getCep(),
            'telefone' => $participante->getTelefone(),
            'telefoneComercial' => $participante->getTelefoneComercial(),
            'celular' => $participante->getCelular(),
            'dtExercicio' => $participante->getDtExercicio(),
            'dtInscricaoPlano' => $participante->getDtInscricaoPlano(),
            'idCargo' => $participante->getIdCargo(),
            'nmCargo' => $participante->getNmCargo(),
            'naturalidade' => $participante->getNaturalidade(),
            'ufNaturalidade' => $participante->getUfNaturalidade(),
            'nacionalidade' => $participante->getNacionalidade(),
            'nmNacionalidade' => $participante->getNmNacionalidade(),
            'estadoCivil' => $participante->getEstadoCivil(),
            'email' => $participante->getEmail(),
            'emailAdicional1' => $participante->getEmailAdicional1(),
            'emailAdicional2' => $participante->getEmailAdicional2(),
            'beneficiarios' => $participante->getBeneficiarios() ?? [],
        ];

        return new ParticipanteProfileDTO($data);
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getNome(): ?string
    {
        return $this->nome;
    }

    public function setNome(?string $nome): self
    {
        $this->nome = $nome;

        return $this;
    }

    public function getDtNascimento(): ?string
    {
        return $this->dtNascimento;
    }

    public function setDtNascimento(?string $dtNascimento): self
    {
        $this->dtNascimento = $dtNascimento;

        return $this;
    }

    public function getSexo(): ?string
    {
        return $this->sexo;
    }

    public function setSexo(?string $sexo): self
    {
        $this->sexo = $sexo;

        return $this;
    }

    public function getCpf(): ?string
    {
        return $this->cpf;
    }

    public function setCpf(?string $cpf): self
    {
        $this->cpf = $cpf;

        return $this;
    }

    public function getInscricao(): ?string
    {
        return $this->inscricao;
    }

    public function setInscricao(?string $inscricao): self
    {
        $this->inscricao = $inscricao;

        return $this;
    }

    public function getMatricula(): ?string
    {
        return $this->matricula;
    }

    public function setMatricula(?string $matricula): self
    {
        $this->matricula = $matricula;

        return $this;
    }

    public function getRg(): ?string
    {
        return $this->rg;
    }

    public function setRg(?string $rg): self
    {
        $this->rg = $rg;

        return $this;
    }

    public function getEmissorRg(): ?string
    {
        return $this->emissorRg;
    }

    public function setEmissorRg(?string $emissorRg): self
    {
        $this->emissorRg = $emissorRg;

        return $this;
    }

    public function getUfRg(): ?string
    {
        return $this->ufRg;
    }

    public function setUfRg(?string $ufRg): self
    {
        $this->ufRg = $ufRg;

        return $this;
    }

    public function getDtExpedicaoRg(): ?string
    {
        return $this->dtExpedicaoRg;
    }

    public function setDtExpedicaoRg(?string $dtExpedicaoRg): self
    {
        $this->dtExpedicaoRg = $dtExpedicaoRg;

        return $this;
    }

    public function getNmEstadoCivil(): ?string
    {
        return $this->nmEstadoCivil;
    }

    public function setNmEstadoCivil(?string $nmEstadoCivil): self
    {
        $this->nmEstadoCivil = $nmEstadoCivil;

        return $this;
    }

    public function getPoliticamenteExposto(): ?string
    {
        return $this->politicamenteExposto;
    }

    public function setPoliticamenteExposto(?string $politicamenteExposto): self
    {
        $this->politicamenteExposto = $politicamenteExposto;

        return $this;
    }

    public function getNmMae(): ?string
    {
        return $this->nmMae;
    }

    public function setNmMae(?string $nmMae): self
    {
        $this->nmMae = $nmMae;

        return $this;
    }

    public function getNmPai(): ?string
    {
        return $this->nmPai;
    }

    public function setNmPai(?string $nmPai): self
    {
        $this->nmPai = $nmPai;

        return $this;
    }

    public function getLogradouro(): ?string
    {
        return $this->logradouro;
    }

    public function setLogradouro(?string $logradouro): self
    {
        $this->logradouro = $logradouro;

        return $this;
    }

    public function getNumero(): ?string
    {
        return $this->numero;
    }

    public function setNumero(?string $numero): self
    {
        $this->numero = $numero;

        return $this;
    }

    public function getEnderecoComplemento(): ?string
    {
        return $this->enderecoComplemento;
    }

    public function setEnderecoComplemento(?string $enderecoComplemento): self
    {
        $this->enderecoComplemento = $enderecoComplemento;

        return $this;
    }

    public function getBairro(): ?string
    {
        return $this->bairro;
    }

    public function setBairro(?string $bairro): self
    {
        $this->bairro = $bairro;

        return $this;
    }

    public function getCidade(): ?string
    {
        return $this->cidade;
    }

    public function setCidade(?string $cidade): self
    {
        $this->cidade = $cidade;

        return $this;
    }

    public function getEnderecoUf(): ?string
    {
        return $this->enderecoUf;
    }

    public function setEnderecoUf(?string $enderecoUf): self
    {
        $this->enderecoUf = $enderecoUf;

        return $this;
    }

    public function getCep(): ?string
    {
        return $this->cep;
    }

    public function setCep(?string $cep): self
    {
        $this->cep = $cep;

        return $this;
    }

    public function getTelefone(): ?string
    {
        return $this->telefone;
    }

    public function setTelefone(?string $telefone): self
    {
        $this->telefone = $telefone;

        return $this;
    }

    public function getTelefoneComercial(): ?string
    {
        return $this->telefoneComercial;
    }

    public function setTelefoneComercial(?string $telefoneComercial): self
    {
        $this->telefoneComercial = $telefoneComercial;

        return $this;
    }

    public function getCelular(): ?string
    {
        return $this->celular;
    }

    public function setCelular(?string $celular): self
    {
        $this->celular = $celular;

        return $this;
    }

    public function getDtExercicio(): ?string
    {
        return $this->dtExercicio;
    }

    public function setDtExercicio(?string $dtExercicio): self
    {
        $this->dtExercicio = $dtExercicio;

        return $this;
    }

    public function getDtInscricaoPlano(): ?string
    {
        return $this->dtInscricaoPlano;
    }

    public function setDtInscricaoPlano(?string $dtInscricaoPlano): self
    {
        $this->dtInscricaoPlano = $dtInscricaoPlano;

        return $this;
    }

    public function getIdCargo(): ?string
    {
        return $this->idCargo;
    }

    public function setIdCargo(?string $idCargo): self
    {
        $this->idCargo = $idCargo;

        return $this;
    }

    public function getNmCargo(): ?string
    {
        return $this->nmCargo;
    }

    public function setNmCargo(?string $nmCargo): self
    {
        $this->nmCargo = $nmCargo;

        return $this;
    }

    public function getNaturalidade(): ?string
    {
        return $this->naturalidade;
    }

    public function setNaturalidade(?string $naturalidade): self
    {
        $this->naturalidade = $naturalidade;

        return $this;
    }

    public function getUfNaturalidade(): ?string
    {
        return $this->ufNaturalidade;
    }

    public function setUfNaturalidade(?string $ufNaturalidade): self
    {
        $this->ufNaturalidade = $ufNaturalidade;

        return $this;
    }

    public function getNacionalidade(): ?string
    {
        return $this->nacionalidade;
    }

    public function setNacionalidade(?string $nacionalidade): self
    {
        $this->nacionalidade = $nacionalidade;

        return $this;
    }

    public function getNmNacionalidade(): ?string
    {
        return $this->nmNacionalidade;
    }

    public function setNmNacionalidade(?string $nmNacionalidade): self
    {
        $this->nmNacionalidade = $nmNacionalidade;

        return $this;
    }

    public function getEstadoCivil(): ?string
    {
        return $this->estadoCivil;
    }

    public function setEstadoCivil(?string $estadoCivil): self
    {
        $this->estadoCivil = $estadoCivil;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getEmailAdicional1(): ?string
    {
        return $this->emailAdicional1;
    }

    public function setEmailAdicional1(?string $emailAdicional1): self
    {
        $this->emailAdicional1 = $emailAdicional1;

        return $this;
    }

    public function getEmailAdicional2(): ?string
    {
        return $this->emailAdicional2;
    }

    public function setEmailAdicional2(?string $emailAdicional2): self
    {
        $this->emailAdicional2 = $emailAdicional2;

        return $this;
    }

    public function getBeneficiarios(): array
    {
        return $this->beneficiarios;
    }

    public function setBeneficiarios(array $beneficiarios): self
    {
        $this->beneficiarios = $beneficiarios;

        return $this;
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}