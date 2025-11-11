<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Validator\Constraints as Assert;

class PessoaDTO
{
    #[Assert\NotBlank(message: 'O ID é obrigatório')]
    #[Assert\Type('integer')]
    public string $id;

    #[Assert\NotBlank(message: 'O CPF é obrigatório')]
    #[Assert\Regex(
        pattern: '/^\d{11}$/',
        message: 'O CPF deve conter 11 dígitos'
    )]
    public string $cpf;

    #[Assert\NotBlank(message: 'O nome é obrigatório')]
    #[Assert\Type('string')]
    public string $nome;

    #[Assert\NotBlank(message: 'A data de nascimento é obrigatória')]
    #[Assert\Regex(
        pattern: '/^\d{4}-\d{2}-\d{2}$/',
        message: 'A data de nascimento deve estar no formato aaaa-mm-dd'
    )]
    public string $dataNascimento;

    #[Assert\NotBlank(message: 'O sexo é obrigatório')]
    #[Assert\Choice(['M', 'F'], message: 'O sexo deve ser M ou F')]
    public string $sexo;

    public function __construct(array $data)
    {
        $this->id = $data['id'];
        $this->cpf = $data['cpf'];
        $this->nome = $data['nome'];
        $this->dataNascimento = $data['dataNascimento'];
        $this->sexo = $data['sexo'];
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getCpf(): string
    {
        return $this->cpf;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function getDataNascimento(): string
    {
        return $this->dataNascimento;
    }

    public function getSexo(): string
    {
        return $this->sexo;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function setCpf(string $cpf): self
    {
        $this->cpf = $cpf;

        return $this;
    }

    public function setNome(string $nome): self
    {
        $this->nome = $nome;

        return $this;
    }

    public function setDataNascimento(string $dataNascimento): self
    {
        $this->dataNascimento = $dataNascimento;

        return $this;
    }

    public function setSexo(string $sexo): self
    {
        $this->sexo = $sexo;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'cpf' => $this->cpf,
            'nome' => $this->nome,
            'dataNascimento' => $this->dataNascimento,
            'sexo' => $this->sexo,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
