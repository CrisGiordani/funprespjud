<?php

namespace App\Domain\Trust\Entity;

use App\Domain\Trust\ValueObject\CPF;
use App\Domain\Trust\ValueObject\Email;
use App\Domain\Trust\ValueObject\Endereco;
use DateTimeImmutable;

class Participante {
    private string $id;
    private string $nome;
    private DateTimeImmutable $dataNascimento;
    private string $sexo;
    private CPF $cpf;
    private ?string $inscricao;
    private ?string $matricula;
    private ?string $rg;
    private ?string $emissorRg;
    private ?string $ufRg;
    private ?DateTimeImmutable $dataExpedicaoRg;
    private ?string $estadoCivil;
    private bool $politicamenteExposto;
    private ?string $nomeMae;
    private ?string $nomePai;
    private ?Endereco $endereco;
    private ?string $telefone;
    private ?string $telefoneComercial;
    private ?string $celular;
    private ?DateTimeImmutable $dataExercicio;
    private ?DateTimeImmutable $dataInscricaoPlano;
    private ?string $idCargo;
    private ?string $nomeCargo;
    private ?string $naturalidade;
    private ?string $ufNaturalidade;
    private ?string $nacionalidade;
    private ?string $nomeNacionalidade;
    private ?Email $email;
    private ?Email $emailAdicional1;
    private ?Email $emailAdicional2;
    private array $beneficiarios = [];

    public function __construct(
        string $id,
        string $nome,
        DateTimeImmutable $dataNascimento,
        string $sexo,
        CPF $cpf
    ) {
        $this->validarNome($nome);
        $this->validarSexo($sexo);

        $this->id = $id;
        $this->nome = $nome;
        $this->dataNascimento = $dataNascimento;
        $this->sexo = $sexo;
        $this->cpf = $cpf;
    }

    private function validarNome(string $nome): void {
        if (empty(trim($nome))) {
            throw new \InvalidArgumentException('Nome não pode ser vazio');
        }
    }

    private function validarSexo(string $sexo): void {
        if (! in_array($sexo, ['M', 'F'])) {
            throw new \InvalidArgumentException('Sexo deve ser M ou F');
        }
    }

    public function atualizarDadosPessoais(
        string $nome,
        DateTimeImmutable $dataNascimento,
        string $sexo,
        ?string $rg,
        ?string $emissorRg,
        ?string $ufRg,
        ?DateTimeImmutable $dataExpedicaoRg,
        ?string $estadoCivil,
        ?string $nomeMae,
        ?string $nomePai,
        ?string $naturalidade,
        ?string $ufNaturalidade,
        ?string $nacionalidade,
        ?string $nomeNacionalidade
    ): void {
        $this->validarNome($nome);
        $this->validarSexo($sexo);

        $this->nome = $nome;
        $this->dataNascimento = $dataNascimento;
        $this->sexo = $sexo;
        $this->rg = $rg;
        $this->emissorRg = $emissorRg;
        $this->ufRg = $ufRg;
        $this->dataExpedicaoRg = $dataExpedicaoRg;
        $this->estadoCivil = $estadoCivil;
        $this->nomeMae = $nomeMae;
        $this->nomePai = $nomePai;
        $this->naturalidade = $naturalidade;
        $this->ufNaturalidade = $ufNaturalidade;
        $this->nacionalidade = $nacionalidade;
        $this->nomeNacionalidade = $nomeNacionalidade;
    }

    public function atualizarEndereco(Endereco $endereco): void {
        $this->endereco = $endereco;
    }

    public function atualizarContatos(
        ?string $telefone,
        ?string $telefoneComercial,
        ?string $celular,
        ?Email $email,
        ?Email $emailAdicional1,
        ?Email $emailAdicional2
    ): void {
        $this->telefone = $telefone;
        $this->telefoneComercial = $telefoneComercial;
        $this->celular = $celular;
        $this->email = $email;
        $this->emailAdicional1 = $emailAdicional1;
        $this->emailAdicional2 = $emailAdicional2;
    }

    public function atualizarDadosProfissionais(
        ?string $inscricao,
        ?string $matricula,
        ?DateTimeImmutable $dataExercicio,
        ?DateTimeImmutable $dataInscricaoPlano,
        ?string $idCargo,
        ?string $nomeCargo
    ): void {
        $this->inscricao = $inscricao;
        $this->matricula = $matricula;
        $this->dataExercicio = $dataExercicio;
        $this->dataInscricaoPlano = $dataInscricaoPlano;
        $this->idCargo = $idCargo;
        $this->nomeCargo = $nomeCargo;
    }

    public function marcarComoPoliticamenteExposto(): void {
        $this->politicamenteExposto = true;
    }

    public function desmarcarComoPoliticamenteExposto(): void {
        $this->politicamenteExposto = false;
    }

    public function adicionarBeneficiario(Beneficiario $beneficiario): void {
        // Aqui você pode adicionar regras de negócio como:
        // - Limite máximo de beneficiários
        // - Verificação de parentesco
        // - Verificação de idade
        $this->beneficiarios[] = $beneficiario;
    }

    public function removerBeneficiario(Beneficiario $beneficiario): void {
        $this->beneficiarios = array_filter(
            $this->beneficiarios,
            fn ($b) => $b->getId() !== $beneficiario->getId()
        );
    }

    // Getters
    public function getId(): string {
        return $this->id;
    }

    public function getNome(): string {
        return $this->nome;
    }

    public function getDataNascimento(): DateTimeImmutable {
        return $this->dataNascimento;
    }

    public function getSexo(): string {
        return $this->sexo;
    }

    public function getCpf(): CPF {
        return $this->cpf;
    }

    public function getInscricao(): ?string {
        return $this->inscricao;
    }

    public function getMatricula(): ?string {
        return $this->matricula;
    }

    public function getRg(): ?string {
        return $this->rg;
    }

    public function getEmissorRg(): ?string {
        return $this->emissorRg;
    }

    public function getUfRg(): ?string {
        return $this->ufRg;
    }

    public function getDataExpedicaoRg(): ?DateTimeImmutable {
        return $this->dataExpedicaoRg;
    }

    public function getEstadoCivil(): ?string {
        return $this->estadoCivil;
    }

    public function isPoliticamenteExposto(): bool {
        return $this->politicamenteExposto;
    }

    public function getNomeMae(): ?string {
        return $this->nomeMae;
    }

    public function getNomePai(): ?string {
        return $this->nomePai;
    }

    public function getEndereco(): ?Endereco {
        return $this->endereco;
    }

    public function getTelefone(): ?string {
        return $this->telefone;
    }

    public function getTelefoneComercial(): ?string {
        return $this->telefoneComercial;
    }

    public function getCelular(): ?string {
        return $this->celular;
    }

    public function getDataExercicio(): ?DateTimeImmutable {
        return $this->dataExercicio;
    }

    public function getDataInscricaoPlano(): ?DateTimeImmutable {
        return $this->dataInscricaoPlano;
    }

    public function getIdCargo(): ?string {
        return $this->idCargo;
    }

    public function getNomeCargo(): ?string {
        return $this->nomeCargo;
    }

    public function getNaturalidade(): ?string {
        return $this->naturalidade;
    }

    public function getUfNaturalidade(): ?string {
        return $this->ufNaturalidade;
    }

    public function getNacionalidade(): ?string {
        return $this->nacionalidade;
    }

    public function getNomeNacionalidade(): ?string {
        return $this->nomeNacionalidade;
    }

    public function getEmail(): ?Email {
        return $this->email;
    }

    public function getEmailAdicional1(): ?Email {
        return $this->emailAdicional1;
    }

    public function getEmailAdicional2(): ?Email {
        return $this->emailAdicional2;
    }

    public function getBeneficiarios(): array {
        return $this->beneficiarios;
    }
}
