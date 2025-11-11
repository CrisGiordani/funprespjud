<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Data Transfer Object for LGPD (Brazilian General Data Protection Law) information
 *
 * This DTO represents the data structure for LGPD consent and registration information.
 */
class LgpdDTO
{
    #[Groups(['lgpd:read'])]
    private ?int $id = null;

    #[Groups(['lgpd:read'])]
    private ?int $idPessoa = null;

    #[Groups(['lgpd:read'])]
    private ?string $dtCadastro = null;

    #[Groups(['lgpd:read'])]
    private ?string $ativo = null;

    /**
     * Constructor for LgpdDTO
     *
     * @param array<string, mixed> $data Array containing LGPD data
     */
    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->idPessoa = $data['idPessoa'] ?? null;
        $this->dtCadastro = $data['dtCadastro'] ?? null;
        $this->ativo = $data['ativo'] ?? null;
    }

    /**
     * Get the unique identifier
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Set the unique identifier
     *
     * @param int|null $id
     * @return $this
     */
    public function setId(?int $id): self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the person ID
     *
     * @return int|null
     */
    public function getIdPessoa(): ?int
    {
        return $this->idPessoa;
    }

    /**
     * Set the person ID
     *
     * @param int|null $idPessoa
     * @return $this
     */
    public function setIdPessoa(?int $idPessoa): self
    {
        $this->idPessoa = $idPessoa;

        return $this;
    }

    /**
     * Get the registration date
     *
     * @return string|null
     */
    public function getDtCadastro(): ?string
    {
        return $this->dtCadastro;
    }

    /**
     * Set the registration date
     *
     * @param string|null $dtCadastro
     * @return $this
     */
    public function setDtCadastro(?string $dtCadastro): self
    {
        $this->dtCadastro = $dtCadastro;

        return $this;
    }

    /**
     * Get the active status
     *
     * @return string|null
     */
    public function getAtivo(): ?string
    {
        return $this->ativo;
    }

    /**
     * Set the active status
     *
     * @param string|null $ativo
     * @return $this
     */
    public function setAtivo(?string $ativo): self
    {
        $this->ativo = $ativo;

        return $this;
    }

    /**
     * Convert the DTO to an array
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'idPessoa' => $this->idPessoa,
            'dtCadastro' => $this->dtCadastro,
            'ativo' => $this->ativo,
        ];
    }

    /**
     * Create a new instance from an array
     *
     * @param array<string, mixed> $data
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
