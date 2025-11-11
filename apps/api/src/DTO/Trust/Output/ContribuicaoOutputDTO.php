<?php

namespace App\DTO\Trust\Output;

use Symfony\Component\Serializer\Annotation\Groups;

class ContribuicaoOutputDTO
{
    #[Groups(['contribuicao:read'])]
    private ?string $patrocinador = null;

    #[Groups(['contribuicao:read'])]
    private ?string $mesCompetencia = null;

    #[Groups(['contribuicao:read'])]
    private ?string $anoCompetencia = null;

    #[Groups(['contribuicao:read'])]
    private ?string $dtRecolhimento = null;

    #[Groups(['contribuicao:read'])]
    private ?string $dtAporte = null;

    #[Groups(['contribuicao:read'])]
    private ?string $contribuicao = null;

    #[Groups(['contribuicao:read'])]
    private ?string $idContribuicao = null;

    #[Groups(['contribuicao:read'])]
    private ?string $tipoContribuicao = null;

    #[Groups(['contribuicao:read'])]
    private ?string $tipoValor = null;

    #[Groups(['contribuicao:read'])]
    private ?string $contribuidor = null;

    #[Groups(['contribuicao:read'])]
    private ?string $origemRecurso = null;

    #[Groups(['contribuicao:read'])]
    private ?string $mantenedorConsolidado = null;

    #[Groups(['contribuicao:read'])]
    private ?string $mantenedorContribuicao = null;

    #[Groups(['contribuicao:read'])]
    private ?string $compoeIr = null;

    #[Groups(['contribuicao:read'])]
    private ?float $valorContribuicao = null;

    #[Groups(['contribuicao:read'])]
    private ?float $qtdCota = null;

    #[Groups(['contribuicao:read'])]
    private ?string $grupoContribuicao = null;

    #[Groups(['contribuicao:read'])]
    private ?float $valorAtualizado = null;

    // Novos campos adicionados
    #[Groups(['contribuicao:read'])]
    private ?string $idContribuicaoHistorico = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPessoa = null;

    #[Groups(['contribuicao:read'])]
    private ?string $CPF = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPlano = null;

    #[Groups(['contribuicao:read'])]
    private ?string $dtVigencia = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPerfil = null;

    #[Groups(['contribuicao:read'])]
    private ?string $nmPerfil = null;

    #[Groups(['contribuicao:read'])]
    private ?string $icContabil = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idEmpCtb = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPlanoCtb = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPerfilCompet = null;

    #[Groups(['contribuicao:read'])]
    private ?string $icAtivo = null;

    #[Groups(['contribuicao:read'])]
    private ?string $icPermitePre = null;

    #[Groups(['contribuicao:read'])]
    private ?string $icPermiteBenef = null;

    #[Groups(['contribuicao:read'])]
    private ?string $icPatrimonio = null;

    #[Groups(['contribuicao:read'])]
    private ?float $vlSldMinOrdem = null;

    #[Groups(['contribuicao:read'])]
    private ?string $icOrdemInvest = null;

    #[Groups(['contribuicao:read'])]
    private ?string $nmPerfilOrdem = null;

    #[Groups(['contribuicao:read'])]
    private ?string $nmPerfilOrdemPass = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPerfilPre = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPessoaOrdemInvest = null;

    #[Groups(['contribuicao:read'])]
    private ?int $idPerfilConfig = null;

    public function __construct(array $data = [])
    {
        $this->patrocinador = $data['patrocinador'] ?? null;
        $this->mesCompetencia = $data['mesCompetencia'] ?? null;
        $this->anoCompetencia = $data['anoCompetencia'] ?? null;
        $this->dtRecolhimento = $data['dtRecolhimento'] ?? null;
        $this->dtAporte = $data['dtAporte'] ?? null;
        $this->contribuicao = $data['contribuicao'] ?? null;
        $this->idContribuicao = $data['idContribuicao'] ?? null;
        $this->tipoContribuicao = $data['tipoContribuicao'] ?? null;
        $this->tipoValor = $data['tipoValor'] ?? null;
        $this->contribuidor = $data['contribuidor'] ?? null;
        $this->origemRecurso = $data['origem_recurso'] ?? null;
        $this->mantenedorConsolidado = $data['mantenedor_consolidado'] ?? null;
        $this->mantenedorContribuicao = $data['mantenedor_contribuicao'] ?? null;
        $this->compoeIr = $data['compoeIr'] ?? null;
        $this->valorContribuicao = $data['valorContribuicao'] ?? null;
        $this->qtdCota = $data['qtdCota'] ?? null;
        $this->grupoContribuicao = $data['grupoContribuicao'] ?? null;
        $this->valorAtualizado = $data['valorAtualizado'] ?? null;
        $this->idContribuicaoHistorico = $data['idContribuicaoHistorico'] ?? null;
        $this->idPessoa = $data['idPessoa'] ?? null;
        $this->CPF = $data['CPF'] ?? null;
        $this->idPlano = $data['idPlano'] ?? null;
        $this->dtVigencia = $data['dtVigencia'] ?? null;
        $this->idPerfil = $data['idPerfil'] ?? null;
        $this->nmPerfil = $data['nmPerfil'] ?? null;
        $this->icContabil = $data['icContabil'] ?? null;
        $this->idEmpCtb = $data['idEmpCtb'] ?? null;
        $this->idPlanoCtb = $data['idPlanoCtb'] ?? null;
        $this->idPerfilCompet = $data['idPerfilCompet'] ?? null;
        $this->icAtivo = $data['icAtivo'] ?? null;
        $this->icPermitePre = $data['icPermitePre'] ?? null;
        $this->icPermiteBenef = $data['icPermiteBenef'] ?? null;
        $this->icPatrimonio = $data['icPatrimonio'] ?? null;
        $this->vlSldMinOrdem = $data['vlSldMinOrdem'] ?? null;
        $this->icOrdemInvest = $data['icOrdemInvest'] ?? null;
        $this->nmPerfilOrdem = $data['nmPerfilOrdem'] ?? null;
        $this->nmPerfilOrdemPass = $data['nmPerfilOrdemPass'] ?? null;
        $this->idPerfilPre = $data['idPerfilPre'] ?? null;
        $this->idPessoaOrdemInvest = $data['idPessoaOrdemInvest'] ?? null;
        $this->idPerfilConfig = $data['idPerfilConfig'] ?? null;
    }

    public function getPatrocinador(): ?string
    {
        return $this->patrocinador;
    }

    public function setPatrocinador(?string $patrocinador): self
    {
        $this->patrocinador = $patrocinador;

        return $this;
    }

    public function getMesCompetencia(): ?string
    {
        return $this->mesCompetencia;
    }

    public function setMesCompetencia(?string $mesCompetencia): self
    {
        $this->mesCompetencia = $mesCompetencia;

        return $this;
    }

    public function getAnoCompetencia(): ?string
    {
        return $this->anoCompetencia;
    }

    public function setAnoCompetencia(?string $anoCompetencia): self
    {
        $this->anoCompetencia = $anoCompetencia;

        return $this;
    }

    public function getDtRecolhimento(): ?string
    {
        return $this->dtRecolhimento;
    }

    public function setDtRecolhimento(?string $dtRecolhimento): self
    {
        $this->dtRecolhimento = $dtRecolhimento;

        return $this;
    }

    public function getDtAporte(): ?string
    {
        return $this->dtAporte;
    }

    public function setDtAporte(?string $dtAporte): self
    {
        $this->dtAporte = $dtAporte;

        return $this;
    }

    public function getContribuicao(): ?string
    {
        return $this->contribuicao;
    }

    public function setContribuicao(?string $contribuicao): self
    {
        $this->contribuicao = $contribuicao;

        return $this;
    }

    public function getIdContribuicao(): ?string
    {
        return $this->idContribuicao;
    }

    public function setIdContribuicao(?string $idContribuicao): self
    {
        $this->idContribuicao = $idContribuicao;

        return $this;
    }

    public function getTipoContribuicao(): ?string
    {
        return $this->tipoContribuicao;
    }

    public function setTipoContribuicao(?string $tipoContribuicao): self
    {
        $this->tipoContribuicao = $tipoContribuicao;

        return $this;
    }

    public function getTipoValor(): ?string
    {
        return $this->tipoValor;
    }

    public function setTipoValor(?string $tipoValor): self
    {
        $this->tipoValor = $tipoValor;

        return $this;
    }

    public function getContribuidor(): ?string
    {
        return $this->contribuidor;
    }

    public function setContribuidor(?string $contribuidor): self
    {
        $this->contribuidor = $contribuidor;

        return $this;
    }

    public function getOrigemRecurso(): ?string
    {
        return $this->origemRecurso;
    }

    public function setOrigemRecurso(?string $origemRecurso): self
    {
        $this->origemRecurso = $origemRecurso;

        return $this;
    }

    public function getMantenedorConsolidado(): ?string
    {
        return $this->mantenedorConsolidado;
    }

    public function setMantenedorConsolidado(?string $mantenedorConsolidado): self
    {
        $this->mantenedorConsolidado = $mantenedorConsolidado;

        return $this;
    }

    public function getMantenedorContribuicao(): ?string
    {
        return $this->mantenedorContribuicao;
    }

    public function setMantenedorContribuicao(?string $mantenedorContribuicao): self
    {
        $this->mantenedorContribuicao = $mantenedorContribuicao;

        return $this;
    }

    public function getCompoeIr(): ?string
    {
        return $this->compoeIr;
    }

    public function setCompoeIr(?string $compoeIr): self
    {
        $this->compoeIr = $compoeIr;

        return $this;
    }

    public function getValorContribuicao(): ?float
    {
        return $this->valorContribuicao;
    }

    public function setValorContribuicao(?float $valorContribuicao): self
    {
        $this->valorContribuicao = $valorContribuicao;

        return $this;
    }

    public function getQtdCota(): ?float
    {
        return $this->qtdCota;
    }

    public function setQtdCota(?float $qtdCota): self
    {
        $this->qtdCota = $qtdCota;

        return $this;
    }

    public function getGrupoContribuicao(): ?string
    {
        return $this->grupoContribuicao;
    }

    public function setGrupoContribuicao(?string $grupoContribuicao): self
    {
        $this->grupoContribuicao = $grupoContribuicao;

        return $this;
    }

    public function getValorAtualizado(): ?float
    {
        return $this->valorAtualizado;
    }

    public function setValorAtualizado(?float $valorAtualizado): self
    {
        $this->valorAtualizado = $valorAtualizado;

        return $this;
    }

    // Getters e Setters para os novos campos
    public function getIdContribuicaoHistorico(): ?string
    {
        return $this->idContribuicaoHistorico;
    }

    public function setIdContribuicaoHistorico(?string $idContribuicaoHistorico): self
    {
        $this->idContribuicaoHistorico = $idContribuicaoHistorico;
        return $this;
    }

    public function getIdPessoa(): ?int
    {
        return $this->idPessoa;
    }

    public function setIdPessoa(?int $idPessoa): self
    {
        $this->idPessoa = $idPessoa;
        return $this;
    }

    public function getCPF(): ?string
    {
        return $this->CPF;
    }

    public function setCPF(?string $CPF): self
    {
        $this->CPF = $CPF;
        return $this;
    }

    public function getIdPlano(): ?int
    {
        return $this->idPlano;
    }

    public function setIdPlano(?int $idPlano): self
    {
        $this->idPlano = $idPlano;
        return $this;
    }

    public function getDtVigencia(): ?string
    {
        return $this->dtVigencia;
    }

    public function setDtVigencia(?string $dtVigencia): self
    {
        $this->dtVigencia = $dtVigencia;
        return $this;
    }

    public function getIdPerfil(): ?int
    {
        return $this->idPerfil;
    }

    public function setIdPerfil(?int $idPerfil): self
    {
        $this->idPerfil = $idPerfil;
        return $this;
    }

    public function getNmPerfil(): ?string
    {
        return $this->nmPerfil;
    }

    public function setNmPerfil(?string $nmPerfil): self
    {
        $this->nmPerfil = $nmPerfil;
        return $this;
    }

    public function getIcContabil(): ?string
    {
        return $this->icContabil;
    }

    public function setIcContabil(?string $icContabil): self
    {
        $this->icContabil = $icContabil;
        return $this;
    }

    public function getIdEmpCtb(): ?int
    {
        return $this->idEmpCtb;
    }

    public function setIdEmpCtb(?int $idEmpCtb): self
    {
        $this->idEmpCtb = $idEmpCtb;
        return $this;
    }

    public function getIdPlanoCtb(): ?int
    {
        return $this->idPlanoCtb;
    }

    public function setIdPlanoCtb(?int $idPlanoCtb): self
    {
        $this->idPlanoCtb = $idPlanoCtb;
        return $this;
    }

    public function getIdPerfilCompet(): ?int
    {
        return $this->idPerfilCompet;
    }

    public function setIdPerfilCompet(?int $idPerfilCompet): self
    {
        $this->idPerfilCompet = $idPerfilCompet;
        return $this;
    }

    public function getIcAtivo(): ?string
    {
        return $this->icAtivo;
    }

    public function setIcAtivo(?string $icAtivo): self
    {
        $this->icAtivo = $icAtivo;
        return $this;
    }

    public function getIcPermitePre(): ?string
    {
        return $this->icPermitePre;
    }

    public function setIcPermitePre(?string $icPermitePre): self
    {
        $this->icPermitePre = $icPermitePre;
        return $this;
    }

    public function getIcPermiteBenef(): ?string
    {
        return $this->icPermiteBenef;
    }

    public function setIcPermiteBenef(?string $icPermiteBenef): self
    {
        $this->icPermiteBenef = $icPermiteBenef;
        return $this;
    }

    public function getIcPatrimonio(): ?string
    {
        return $this->icPatrimonio;
    }

    public function setIcPatrimonio(?string $icPatrimonio): self
    {
        $this->icPatrimonio = $icPatrimonio;
        return $this;
    }

    public function getVlSldMinOrdem(): ?float
    {
        return $this->vlSldMinOrdem;
    }

    public function setVlSldMinOrdem(?float $vlSldMinOrdem): self
    {
        $this->vlSldMinOrdem = $vlSldMinOrdem;
        return $this;
    }

    public function getIcOrdemInvest(): ?string
    {
        return $this->icOrdemInvest;
    }

    public function setIcOrdemInvest(?string $icOrdemInvest): self
    {
        $this->icOrdemInvest = $icOrdemInvest;
        return $this;
    }

    public function getNmPerfilOrdem(): ?string
    {
        return $this->nmPerfilOrdem;
    }

    public function setNmPerfilOrdem(?string $nmPerfilOrdem): self
    {
        $this->nmPerfilOrdem = $nmPerfilOrdem;
        return $this;
    }

    public function getNmPerfilOrdemPass(): ?string
    {
        return $this->nmPerfilOrdemPass;
    }

    public function setNmPerfilOrdemPass(?string $nmPerfilOrdemPass): self
    {
        $this->nmPerfilOrdemPass = $nmPerfilOrdemPass;
        return $this;
    }

    public function getIdPerfilPre(): ?int
    {
        return $this->idPerfilPre;
    }

    public function setIdPerfilPre(?int $idPerfilPre): self
    {
        $this->idPerfilPre = $idPerfilPre;
        return $this;
    }

    public function getIdPessoaOrdemInvest(): ?int
    {
        return $this->idPessoaOrdemInvest;
    }

    public function setIdPessoaOrdemInvest(?int $idPessoaOrdemInvest): self
    {
        $this->idPessoaOrdemInvest = $idPessoaOrdemInvest;
        return $this;
    }

    public function getIdPerfilConfig(): ?int
    {
        return $this->idPerfilConfig;
    }

    public function setIdPerfilConfig(?int $idPerfilConfig): self
    {
        $this->idPerfilConfig = $idPerfilConfig;
        return $this;
    }

    public function toArray(): array
    {
        return [
            'patrocinador' => $this->patrocinador,
            'mesCompetencia' => $this->mesCompetencia,
            'anoCompetencia' => $this->anoCompetencia,
            'dtRecolhimento' => $this->dtRecolhimento,
            'dtAporte' => $this->dtAporte,
            'contribuicao' => $this->contribuicao,
            'idContribuicao' => $this->idContribuicao,
            'tipoContribuicao' => $this->tipoContribuicao,
            'tipoValor' => $this->tipoValor,
            'contribuidor' => $this->contribuidor,
            'origemRecurso' => $this->origemRecurso,
            'mantenedorConsolidado' => $this->mantenedorConsolidado,
            'mantenedorContribuicao' => $this->mantenedorContribuicao,
            'compoeIr' => $this->compoeIr,
            'valorContribuicao' => $this->valorContribuicao,
            'qtdCota' => $this->qtdCota,
            'grupoContribuicao' => $this->grupoContribuicao,
            'valorAtualizado' => $this->valorAtualizado,
            'idContribuicaoHistorico' => $this->idContribuicaoHistorico,
            'idPessoa' => $this->idPessoa,
            'CPF' => $this->CPF,
            'idPlano' => $this->idPlano,
            'dtVigencia' => $this->dtVigencia,
            'idPerfil' => $this->idPerfil,
            'nmPerfil' => $this->nmPerfil,
            'icContabil' => $this->icContabil,
            'idEmpCtb' => $this->idEmpCtb,
            'idPlanoCtb' => $this->idPlanoCtb,
            'idPerfilCompet' => $this->idPerfilCompet,
            'icAtivo' => $this->icAtivo,
            'icPermitePre' => $this->icPermitePre,
            'icPermiteBenef' => $this->icPermiteBenef,
            'icPatrimonio' => $this->icPatrimonio,
            'vlSldMinOrdem' => $this->vlSldMinOrdem,
            'icOrdemInvest' => $this->icOrdemInvest,
            'nmPerfilOrdem' => $this->nmPerfilOrdem,
            'nmPerfilOrdemPass' => $this->nmPerfilOrdemPass,
            'idPerfilPre' => $this->idPerfilPre,
            'idPessoaOrdemInvest' => $this->idPessoaOrdemInvest,
            'idPerfilConfig' => $this->idPerfilConfig,
        ];
    }
}