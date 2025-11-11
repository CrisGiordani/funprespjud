<?php

namespace App\Entity\Iris\App;

use App\Repository\Iris\App\PerfilInvestimentoAlteracaoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * Entity class representing investment profile changes
 *
 * This class tracks changes made to participant investment profiles,
 * including campaign information and verification details.
 */
#[ORM\Entity(repositoryClass: PerfilInvestimentoAlteracaoRepository::class)]
#[ORM\Table(name: 'participante_perfil_investimento_alteracao')]
class PerfilInvestimentoAlteracao
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: PerfilInvestimento::class, fetch: 'EAGER')]
    #[ORM\JoinColumn(name: 'id_perfil_investimento', referencedColumnName: 'id')]
    #[Groups(['perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read', 'perfilInvestimento:read'])]
    #[MaxDepth(1)]
    private ?PerfilInvestimento $perfilInvestimento = null;

    #[ORM\OneToOne(targetEntity: Campanha::class, fetch: 'EAGER')]
    #[ORM\JoinColumn(name: 'id_campanha', referencedColumnName: 'id')]
    #[Groups(['perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read'])]
    #[MaxDepth(1)]
    private ?Campanha $campanha = null;

    #[ORM\Column(name: 'id_trust')]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?int $idTrust = null;

    #[ORM\Column(length: 255)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?string $cpf = null;

    #[ORM\Column(length: 255)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 255, name: 'ip_maquina')]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?string $ipMaquina = null;

    #[ORM\Column(name: 'ip_maquina_verificacao_token', length: 255)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?string $ipMaquinaVerificacaoToken = null;

    #[ORM\Column(length: 255)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?string $protocolo = null;

    #[ORM\Column(length: 255)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?string $token = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read'])]
    private ?\DateTime $dt_solicitacao = null;

    #[ORM\Column]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?bool $verificado = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?\DateTimeInterface $dt_verificado = null;

    #[ORM\Column(name: 'dt_envio_token', type: Types::DATETIME_MUTABLE)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?\DateTimeInterface $dt_envioToken = null;

    #[ORM\Column]
    #[Groups(['perfilInvestimentoAlteracao:read', 'ultimaSolicitacaoAlteracaoPerfil:read'])]
    private ?bool $ativo = null;

    #[ORM\Column(length: 255)]
    #[Groups(['perfilInvestimentoAlteracao:read',  'ultimaSolicitacaoAlteracaoPerfil:read'])]
    private ?string $status = null;

    #[ORM\Column(length: 255)]
    #[Groups(['perfilInvestimentoAlteracao:read'])]
    private ?string $owncloud = null;

    #[ORM\Column(name: 'dados_simulacao_json', type: Types::JSON)]
    #[Groups(['perfilInvestimentoAlteracaoHistorico:read'])]
    private string|array|null $dados_simulacao_json = null;

    /**
     * Get the unique identifier of the profile change record
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get the associated investment profile
     *
     * @return PerfilInvestimento|null
     */
    public function getPerfilInvestimento(): ?PerfilInvestimento
    {
        return $this->perfilInvestimento;
    }

    /**
     * Set the associated investment profile
     *
     * @param PerfilInvestimento|null $perfilInvestimento
     * @return $this
     */
    public function setPerfilInvestimento(?PerfilInvestimento $perfilInvestimento): static
    {
        $this->perfilInvestimento = $perfilInvestimento;

        return $this;
    }

    /**
     * Get the associated campaign
     *
     * @return Campanha|null
     */
    public function getCampanha(): ?Campanha
    {
        return $this->campanha;
    }

    /**
     * Set the associated campaign
     *
     * @param Campanha|null $campanha
     * @return $this
     */
    public function setCampanha(?Campanha $campanha): static
    {
        $this->campanha = $campanha;

        return $this;
    }

    /**
     * Get the Trust ID
     *
     * @return int|null
     */
    public function getIdTrust(): ?int
    {
        return $this->idTrust;
    }

    /**
     * Set the Trust ID
     *
     * @param int $idTrust
     * @return $this
     */
    public function setIdTrust(int $idTrust): static
    {
        $this->idTrust = $idTrust;

        return $this;
    }

    /**
     * Get the participant's CPF (tax ID)
     *
     * @return string|null
     */
    public function getCpf(): ?string
    {
        return $this->cpf;
    }

    /**
     * Set the participant's CPF (tax ID)
     *
     * @param string $cpf
     * @return $this
     */
    public function setCpf(string $cpf): static
    {
        $this->cpf = $cpf;

        return $this;
    }

    /**
     * Get the participant's email
     *
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Set the participant's email
     *
     * @param string $email
     * @return $this
     */
    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get the machine IP address
     *
     * @return string|null
     */
    public function getIpMaquina(): ?string
    {
        return $this->ipMaquina;
    }

    /**
     * Set the machine IP address
     *
     * @param string $ipMaquina
     * @return $this
     */
    public function setIpMaquina(string $ipMaquina): static
    {
        $this->ipMaquina = $ipMaquina;

        return $this;
    }

    /**
     * Get the machine verification token
     *
     * @return string|null
     */
    public function getIpMaquinaVerificacaoToken(): ?string
    {
        return $this->ipMaquinaVerificacaoToken;
    }

    /**
     * Set the machine verification token
     *
     * @param string $ipMaquinaVerificacaoToken
     * @return $this
     */
    public function setIpMaquinaVerificacaoToken(string $ipMaquinaVerificacaoToken): static
    {
        $this->ipMaquinaVerificacaoToken = $ipMaquinaVerificacaoToken;

        return $this;
    }

    /**
     * Get the protocol number
     *
     * @return string|null
     */
    public function getProtocolo(): ?string
    {
        return $this->protocolo;
    }

    /**
     * Set the protocol number
     *
     * @param string $protocolo
     * @return $this
     */
    public function setProtocolo(string $protocolo): static
    {
        $this->protocolo = $protocolo;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public function getDtSolicitacao(): ?\DateTimeInterface
    {
        return $this->dt_solicitacao;
    }

    public function setDtSolicitacao(\DateTimeInterface $dt_solicitacao): static
    {
        $this->dt_solicitacao = $dt_solicitacao;

        return $this;
    }

    public function isVerificado(): ?bool
    {
        return $this->verificado;
    }

    public function setVerificado(bool $verificado): static
    {
        $this->verificado = $verificado;

        return $this;
    }

    public function getDtVerificado(): ?\DateTimeInterface
    {
        return $this->dt_verificado;
    }

    public function setDtVerificado(\DateTimeInterface $dt_verificado): static
    {
        $this->dt_verificado = $dt_verificado;

        return $this;
    }

    public function getDtEnvioToken(): ?\DateTimeInterface
    {
        return $this->dt_envioToken;
    }

    public function setDtEnvioToken(\DateTimeInterface $dt_envioToken): static
    {
        $this->dt_envioToken = $dt_envioToken;

        return $this;
    }

    public function isAtivo(): ?bool
    {
        return $this->ativo;
    }

    public function setAtivo(bool $ativo): static
    {
        $this->ativo = $ativo;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getOwncloud(): ?string
    {
        return $this->owncloud;
    }

    public function setOwncloud(string $owncloud): static
    {
        $this->owncloud = $owncloud;

        return $this;
    }

    public function getDadosSimulacaoJson(): string|array|null
    {
        return $this->dados_simulacao_json;
    }

    public function setDadosSimulacaoJson(string|array|null $dados_simulacao_json): static
    {
        $this->dados_simulacao_json = $dados_simulacao_json;

        return $this;
    }
}
