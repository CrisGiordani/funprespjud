<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO para atualização de beneficiário
 * CPF não é obrigatório pois não pode ser alterado após o cadastro
 */
class BeneficiarioUpdateDTO
{
    private ?string $nome;
    private ?string $celular;
    private ?string $email;

    #[Assert\Regex(
        pattern: '/^\d{4}-\d{2}-\d{2}$/',
        message: 'A data de nascimento deve estar no formato aaaa-mm-dd'
    )]
    private ?string $dtNascimento;

    #[Assert\Choice(['M', 'F'], message: 'O sexo deve ser M ou F')]
    private ?string $sexo;

    private ?string $grauParentesco;

    #[Assert\Choice(['S', 'N'], message: 'O campo inválido deve ser S ou N')]
    private ?string $invalido;

    /**
     * @param array{
     *     nome?: string|null,
     *     celular?: string|null,
     *     email?: string|null,
     *     dtNascimento?: string|null,
     *     sexo?: string|null,
     *     grauParentesco?: string|null,
     *     invalido?: string|null
     * } $data
     */
    public function __construct(
        public array $data
    ) {
        $this->nome = $data['nome'] ?? null;
        $this->celular = $data['celular'] ?? null;
        $this->email = $data['email'] ?? null;
        $this->dtNascimento = $data['dtNascimento'] ?? null;
        $this->sexo = $data['sexo'] ?? null;
        $this->grauParentesco = $data['grauParentesco'] ?? null;
        $this->invalido = $data['invalido'] ?? null;
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;
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

    public function getGrauParentesco(): ?string
    {
        return $this->grauParentesco;
    }

    public function setGrauParentesco(?string $grauParentesco): self
    {
        $this->grauParentesco = $grauParentesco;
        return $this;
    }

    public function getInvalido(): ?string
    {
        return $this->invalido;
    }

    public function setInvalido(?string $invalido): self
    {
        $this->invalido = $invalido;
        return $this;
    }
}
