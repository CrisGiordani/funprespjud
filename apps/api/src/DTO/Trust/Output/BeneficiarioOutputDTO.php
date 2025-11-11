<?php

namespace App\DTO\Trust\Output;

use Symfony\Component\Serializer\Annotation\Groups;

class BeneficiarioOutputDTO
{
    #[Groups(['beneficiario:read'])]
    private ?string $id = null;

    #[Groups(['beneficiario:read'])]
    private ?string $nome = null;

    #[Groups(['beneficiario:read'])]
    private ?string $dtNascimento = null;

    #[Groups(['beneficiario:read'])]
    private ?string $dtRecadastramento = null;

    #[Groups(['beneficiario:read'])]
    private ?string $sexo = null;

    #[Groups(['beneficiario:read'])]
    private ?string $nmParentesco = null;

    #[Groups(['beneficiario:read'])]
    private ?string $invalido = null;

    #[Groups(['beneficiario:read'])]
    private ?string $email = null;

    #[Groups(['beneficiario:read'])]
    private ?string $celular = null;

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->nome = $data['nome'] ?? null;
        $this->dtNascimento = $data['dtNascimento'] ?? null;
        $this->dtRecadastramento = $data['dtRecadastramento'] ?? null;
        $this->sexo = $data['sexo'] ?? null;
        $this->nmParentesco = $data['nmParentesco'] ?? null;
        $this->invalido = $data['invalido'] ?? null;
        $this->email = $data['nmEmail'] ?? null;
        $this->celular = $data['nrCelular'] ?? null;
    }

    /**
     * @return string
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getNome(): ?string
    {
        return $this->nome;
    }

    /**
     * @param string $nome
     * @return self
     */
    public function setNome(?string $nome): self
    {
        $this->nome = $nome;

        return $this;
    }

    /**
     * @return string
     */
    public function getDtNascimento(): ?string
    {
        return $this->dtNascimento;
    }

    /**
     * @param string $dtNascimento
     * @return self
     */
    public function setDtNascimento(?string $dtNascimento): self
    {
        $this->dtNascimento = $dtNascimento;

        return $this;
    }

    /**
     * @return string
     */
    public function getDtRecadastramento(): ?string
    {
        return $this->dtRecadastramento;
    }

    /**
     * @param string $dtRecadastramento
     * @return self
     */
    public function setDtRecadastramento(?string $dtRecadastramento): self
    {
        $this->dtRecadastramento = $dtRecadastramento;

        return $this;
    }

    /**
     * @return string
     */
    public function getSexo(): ?string
    {
        return $this->sexo;
    }

    /**
     * @param string $sexo
     * @return self
     */
    public function setSexo(?string $sexo): self
    {
        $this->sexo = $sexo;

        return $this;
    }

    /**
     * @return string
     */
    public function getGrauParentesco(): ?string
    {
        return $this->nmParentesco;
    }

    /**
     * @param string $grauParentesco
     * @return self
     */
    public function setGrauParentesco(?string $nmParentesco): self
    {
        $this->nmParentesco = $nmParentesco;

        return $this;
    }

    /**
     * @return string
     */
    public function getInvalido(): ?string
    {
        return $this->invalido;
    }

    /**
     * @param string $invalido
     * @return self
     */
    public function setInvalido(?string $invalido): self
    {
        $this->invalido = $invalido;

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

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'dtNascimento' => $this->dtNascimento,
            'dtRecadastramento' => $this->dtRecadastramento,
            'sexo' => $this->sexo,
            'grauParentesco' => $this->nmParentesco,
            'invalido' => $this->invalido,
            'email' => $this->email,
            'celular' => $this->celular,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
