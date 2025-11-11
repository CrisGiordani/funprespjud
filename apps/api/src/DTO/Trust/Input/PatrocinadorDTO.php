<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class PatrocinadorDTO
{
    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'O ID do patrocinador é obrigatório')]
    private string $id;

    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'O CNPJ do patrocinador é obrigatório')]
    private string $cnpj;

    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'O ID do patrocinador é obrigatório')]
    private string $idPessoa;

    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'A sigla do patrocinador é obrigatória')]
    private string $sigla;

    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'O nome do patrocinador é obrigatório')]
    private string $nome;

    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'A data de exercício é obrigatória')]
    #[Assert\Regex(
        pattern: '/^\d{2}\/\d{2}\/\d{4}$/',
        message: 'A data de exercício deve estar no formato dd/mm/aaaa'
    )]
    private string $dtExercicio;

    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'A data de inscrição no plano é obrigatória')]
    #[Assert\Regex(
        pattern: '/^\d{2}\/\d{2}\/\d{4}$/',
        message: 'A data de inscrição no plano deve estar no formato dd/mm/aaaa'
    )]
    private string $dtInscricaoPlano;

    #[Groups(['patrocinador:read', 'salario:read'])]
    #[Assert\NotBlank(message: 'O nome do cargo é obrigatório')]
    private string $nmCargo;

    #[Groups(['salario:read'])]
    #[Assert\Type('float')]
    private ?float $salario = null;

    #[Groups(['salario:read'])]
    #[Assert\Type('string')]
    private ?string $idCargo = null;

    #[Groups(['salario:read'])]
    #[Assert\Type('int')]
    private ?int $idEmpresa = null;

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? '';
        $this->idPessoa = $data['idPessoa'] ?? '';
        $this->sigla = $data['sigla'] ?? '';
        $this->cnpj = $data['cnpj'] ?? '';
        $this->nome = ucwords(mb_strtolower($data['nome'], 'UTF-8')) ?? '';
        $this->dtExercicio = $data['dtExercicio'] ?? '';
        $this->dtInscricaoPlano = $data['dtInscricaoPlano'] ?? '';
        $this->nmCargo = $data['nmCargo'] ?? '';
        $this->salario = $data['salario'] ?? null;
        $this->idCargo = $data['idCargo'] ?? null;
        $this->idEmpresa = $data['idEmpresa'] ?? null;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @param string $id
     * @return self
     */
    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return string
     */
    public function getSigla(): string
    {
        return $this->sigla;
    }

    /**
     * @param string $sigla
     * @return self
     */
    public function setSigla(string $sigla): self
    {
        $this->sigla = $sigla;

        return $this;
    }

    /**
     * @return string
     */
    public function getCnpj(): string
    {
        return $this->cnpj;
    }

    /**
     * @param string $cnpj
     * @return self
     */
    public function setCnpj(string $cnpj): self
    {
        $this->cnpj = $cnpj;

        return $this;
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
    public function getDtExercicio(): string
    {
        return $this->dtExercicio;
    }

    /**
     * @param string $dtExercicio
     * @return self
     */
    public function setDtExercicio(string $dtExercicio): self
    {
        $this->dtExercicio = $dtExercicio;

        return $this;
    }

    /**
     * @return string
     */
    public function getDtInscricaoPlano(): string
    {
        return $this->dtInscricaoPlano;
    }

    /**
     * @param string $dtInscricaoPlano
     * @return self
     */
    public function setDtInscricaoPlano(string $dtInscricaoPlano): self
    {
        $this->dtInscricaoPlano = $dtInscricaoPlano;

        return $this;
    }

    /**
     * @return string
     */
    public function getNmCargo(): string
    {
        return $this->nmCargo;
    }

    /**
     * @param string $nmCargo
     * @return self
     */
    public function setNmCargo(string $nmCargo): self
    {
        $this->nmCargo = $nmCargo;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getSalario(): ?float
    {
        return $this->salario;
    }

    /**
     * @param float|null $salario
     * @return self
     */
    public function setSalario(?float $salario): self
    {
        $this->salario = $salario;

        return $this;
    }

    /**
     * @return string
     */
    public function getIdPessoa(): string
    {
        return $this->idPessoa;
    }

    /**
     * @param string $idPessoa
     * @return self
     */
    public function setIdPessoa(string $idPessoa): self
    {
        $this->idPessoa = $idPessoa;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getIdCargo(): ?string
    {
        return $this->idCargo;
    }

    /**
     * @param string|null $idCargo
     * @return self
     */
    public function setIdCargo(?string $idCargo): self
    {
        $this->idCargo = $idCargo;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getIdEmpresa(): ?int
    {
        return $this->idEmpresa;
    }

    /**
     * @param int|null $idEmpresa
     * @return self
     */
    public function setIdEmpresa(?int $idEmpresa): self
    {
        $this->idEmpresa = $idEmpresa;

        return $this;
    }
}
