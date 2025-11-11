<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Validator\Constraints as Assert;

class BeneficiarioDTO
{
    #[Assert\NotBlank(message: 'O nome do beneficiário é obrigatório')]
    private string $nome;

    #[Assert\NotBlank(message: 'O CPF do beneficiário é obrigatório')]
    #[Assert\Regex(
        pattern: '/^\d{11}$/',
        message: 'O CPF deve conter 11 dígitos numéricos'
    )]
    private string $cpf;

    private ?string $celular;
    private ?string $email;

    #[Assert\NotBlank(message: 'A data de nascimento é obrigatória')]
    #[Assert\Regex(
        pattern: '/^\d{4}-\d{2}-\d{2}$/',
        message: 'A data de nascimento deve estar no formato aaaa-mm-dd'
    )]
    private string $dtNascimento;

    #[Assert\NotBlank(message: 'O sexo é obrigatório')]
    #[Assert\Choice(['M', 'F'], message: 'O sexo deve ser M ou F')]
    private string $sexo;

    #[Assert\NotBlank(message: 'O grau de parentesco é obrigatório')]
    private string $grauParentesco;

    #[Assert\NotBlank(message: 'O campo inválido é obrigatório')]
    #[Assert\Choice(['S', 'N'], message: 'O campo inválido deve ser S ou N')]
    private string $invalido;

    /**
     * @param array{
     *     nome?: string,
     *     cpf?: string,
     *     celular?: string|null,
     *     email?: string|null,
     *     dtNascimento?: string,
     *     sexo?: string,
     *     grauParentesco?: string,
     *     invalido?: string
     * } $data
     */
    public function __construct(
        public array $data
    ) {
        $this->nome = $data['nome'] ?? '';
        $this->cpf = $data['cpf'] ?? '';
        $this->celular = $data['celular'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->dtNascimento = $data['dtNascimento'] ?? '';
        $this->sexo = $data['sexo'] ?? '';
        $this->grauParentesco = $data['grauParentesco'] ?? '';
        $this->invalido = $data['invalido'] ?? '';
    }

    /**
     * @return string
     */
    public function getNome(): string
    {
        return $this->nome;
    }

    /**
     * @param string $nome
     * @return self
     */
    public function setNome(string $nome): self
    {
        $this->nome = $nome;

        return $this;
    }

    /**
     * @return string
     */
    public function getCpf(): string
    {
        return $this->cpf;
    }

    /**
     * @param string $cpf
     * @return self
     */
    public function setCpf(string $cpf): self
    {
        $this->cpf = $cpf;

        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return self
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return string
     */
    public function getCelular(): ?string
    {
        return $this->celular;
    }

    /**
     * @param string $celular
     * @return self
     */
    public function setCelular(string $celular): self
    {
        $this->celular = $celular;

        return $this;
    }

    /**
     * @return string
     */
    public function getDtNascimento(): string
    {
        return $this->dtNascimento;
    }

    /**
     * @param string $dtNascimento
     * @return self
     */
    public function setDtNascimento(string $dtNascimento): self
    {
        $this->dtNascimento = $dtNascimento;

        return $this;
    }

    /**
     * @return string
     */
    public function getSexo(): string
    {
        return $this->sexo;
    }

    /**
     * @param string $sexo
     * @return self
     */
    public function setSexo(string $sexo): self
    {
        $this->sexo = $sexo;

        return $this;
    }

    /**
     * @return string
     */
    public function getGrauParentesco(): string
    {
        return $this->grauParentesco;
    }

    /**
     * @param string $grauParentesco
     * @return self
     */
    public function setGrauParentesco(string $grauParentesco): self
    {
        $this->grauParentesco = $grauParentesco;

        return $this;
    }

    /**
     * @return string
     */
    public function getInvalido(): string
    {
        return $this->invalido;
    }

    /**
     * @param string $invalido
     * @return self
     */
    public function setInvalido(string $invalido): self
    {
        $this->invalido = $invalido;

        return $this;
    }
}
