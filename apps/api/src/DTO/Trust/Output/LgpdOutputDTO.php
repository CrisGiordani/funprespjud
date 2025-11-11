<?php

namespace App\DTO\Trust\Output;

use App\DTO\Trust\Input\LgpdDTO;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Output Data Transfer Object for LGPD (Brazilian General Data Protection Law) information
 *
 * This DTO represents the data structure for LGPD consent and registration information
 * in API responses.
 */
class LgpdOutputDTO
{
    #[Groups(['lgpd:output'])]
    private ?int $id = null;

    #[Groups(['lgpd:output'])]
    private ?int $idPessoa = null;

    #[Groups(['lgpd:output'])]
    private ?string $dtCadastro = null;

    #[Groups(['lgpd:output'])]
    private ?string $ativo = null;

    /**
     * Create a new instance from a LgpdDTO
     *
     * @param LgpdDTO $lgpd The input DTO to convert
     * @return self
     */
    public static function fromLgpdDTO(LgpdDTO $lgpd): self
    {
        $output = new self();
        $output->id = $lgpd->getId();
        $output->idPessoa = $lgpd->getIdPessoa();
        $output->dtCadastro = $lgpd->getDtCadastro();
        $output->ativo = $lgpd->getAtivo();

        return $output;
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
}
