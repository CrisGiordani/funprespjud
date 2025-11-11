<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\PerfilInvestimentoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PerfilInvestimentoRepository::class)]
#[ORM\Table(name: 'participante_perfil_investimento')]
class PerfilInvestimento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['perfilInvestimento:read', 'perfilInvestimentoAlteracao:read'])]
    private ?int $id = null;

    #[ORM\Column(name: 'id_perfil_trust', type: Types::INTEGER)]
    #[Groups(['perfilInvestimento:read', 'perfilInvestimentoAlteracao:read'])]
    private ?int $idPerfil = null;

    #[ORM\Column(length: 255)]
    #[Groups(['perfilInvestimento:read', 'perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read'])]
    private ?string $descricao = null;

    #[ORM\Column(name: 'dt_cadastro', type: Types::DATETIME_MUTABLE)]
    #[Groups(['perfilInvestimento:read',  'perfilInvestimentoAlteracao:read'])]
    private ?\DateTimeInterface $dataCadastro = null;

    #[ORM\Column(name: 'ativo', type: Types::BOOLEAN)]
    #[Groups(['perfilInvestimento:read',  'perfilInvestimentoAlteracao:read'])]
    private ?bool $ativo = null;

    // #[ORM\OneToOne(mappedBy: 'idPerfilInvestimento', cascade: ['persist', 'remove'])]
    // private ?PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao = null;

    // #[ORM\Column(type: Types::DATE_MUTABLE)]
    // private ?\DateTimeInterface $dataAlvo = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescricao(): ?string
    {
        return $this->descricao;
    }

    public function setDescricao(string $descricao): static
    {
        $this->descricao = $descricao;

        return $this;
    }

    public function getDataCadastro(): ?\DateTimeInterface
    {
        return $this->dataCadastro;
    }

    public function setDataCadastro(\DateTimeInterface $dataCadastro): static
    {
        $this->dataCadastro = $dataCadastro;

        return $this;
    }

    // public function getDataAlvo(): ?\DateTimeInterface
    // {
    //     return $this->dataAlvo;
    // }

    // public function setDataAlvo(\DateTimeInterface $dataAlvo): static
    // {
    //     $this->dataAlvo = $dataAlvo;

    //     return $this;
    // }

    public function getIdPerfil(): ?int
    {
        return $this->idPerfil;
    }

    public function setIdPerfil(int $idPerfil): static
    {
        $this->idPerfil = $idPerfil;

        return $this;
    }

    public function getAtivo(): ?bool
    {
        return $this->ativo;
    }

    public function setAtivo(bool $ativo): static
    {
        $this->ativo = $ativo;

        return $this;
    }

    // public function getPerfilInvestimentoAlteracao(): ?PerfilInvestimentoAlteracao
    // {
    //     return $this->perfilInvestimentoAlteracao;
    // }

    // public function setPerfilInvestimentoAlteracao(?PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao): static
    // {
    //     // unset the owning side of the relation if necessary
    //     if ($perfilInvestimentoAlteracao === null && $this->perfilInvestimentoAlteracao !== null) {
    //         $this->perfilInvestimentoAlteracao->setIdPerfilInvestimento(null);
    //     }

    //     // set the owning side of the relation if necessary
    //     if ($perfilInvestimentoAlteracao !== null && $perfilInvestimentoAlteracao->getIdPerfilInvestimento() !== $this) {
    //         $perfilInvestimentoAlteracao->setIdPerfilInvestimento($this);
    //     }

    //     $this->perfilInvestimentoAlteracao = $perfilInvestimentoAlteracao;

    //     return $this;
    // }
}
