<?php

namespace App\Entity\Iris\Core;

use App\Repository\Iris\Core\CobrancaRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CobrancaRepository::class)]
#[ORM\Table(
    name: 'patrocinador_cobranca',
    uniqueConstraints: [
        new ORM\UniqueConstraint(name: 'uniq_cobranca_nosso_numero', columns: ['nosso_numero']),
    ],
    indexes: [
        new ORM\Index(name: 'idx_cobranca_cnpj_pagador', columns: ['cnpj_pagador']),
        new ORM\Index(name: 'idx_cobranca_id_lote', columns: ['id_lote']),
        new ORM\Index(name: 'idx_cobranca_status', columns: ['status_boleto']),
    ]
)]
class Cobranca
{
    /**
     * Chave primária (mapeada para coluna legada `id_boleto`).
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id_boleto', type: 'integer')]
    private ?int $id = null;

    /** Nosso número do boleto. */
    #[ORM\Column(name: 'nosso_numero', type: 'string', length: 50, nullable: false)]
    private ?string $nossoNumero = null;

    /** Data de emissão do boleto. */
    #[ORM\Column(name: 'data_emissao', type: 'datetime', nullable: false)]
    private ?\DateTime $dataEmissao = null;

    /** Usuário responsável pela emissão. */
    #[ORM\Column(name: 'usuario_emissao', type: 'string', length: 40, nullable: false)]
    private ?string $usuarioEmissao = null;

    /** Número do convênio bancário. */
    #[ORM\Column(name: 'num_convenio', type: 'integer', nullable: false)]
    private ?int $numConvenio = null;

    /** Número da carteira. */
    #[ORM\Column(name: 'num_carteira', type: 'integer', nullable: false)]
    private ?int $numCarteira = null;

    /** Variação da carteira. */
    #[ORM\Column(name: 'num_variacao_carteira', type: 'integer', nullable: false)]
    private ?int $numVariacaoCarteira = null;

    /** Código da modalidade. */
    #[ORM\Column(name: 'cod_modalidade', type: 'integer', nullable: false)]
    private ?int $codModalidade = null;

    /** Data de vencimento do boleto. */
    #[ORM\Column(name: 'data_vencimento', type: 'datetime', nullable: false)]
    private ?\DateTime $dataVencimento = null;

    /** Valor original do boleto (usar decimal para evitar perda de precisão). */
    #[ORM\Column(name: 'valor_original', type: 'decimal', precision: 15, scale: 2, nullable: false)]
    private ?string $valorOriginal = null;

    /** Código de aceite. */
    #[ORM\Column(name: 'cod_aceite', type: 'string', length: 10, nullable: false)]
    private ?string $codAceite = null;

    /** Código do tipo de título. */
    #[ORM\Column(name: 'cod_tipo_titulo', type: 'integer', nullable: false)]
    private ?int $codTipoTitulo = null;

    /** Indicador de recebimento parcial. */
    #[ORM\Column(name: 'indicador_recebimento_parcial', type: 'string', length: 10, nullable: false)]
    private ?string $indicadorRecebimentoParcial = null;

    /** Título apresentado ao beneficiário. */
    #[ORM\Column(name: 'titulo_beneficiario', type: 'string', length: 30, nullable: false)]
    private ?string $tituloBeneficiario = null;

    /** Texto adicional para o beneficiário. */
    #[ORM\Column(name: 'texto_beneficiario', type: 'string', length: 30, nullable: true)]
    private ?string $textoBeneficiario = null;

    /** CNPJ do pagador (somente dígitos). */
    #[ORM\Column(name: 'cnpj_pagador', type: 'string', length: 20, nullable: false)]
    private ?string $cnpjPagador = null;

    /** Indicador se é PIX. */
    #[ORM\Column(name: 'indicador_pix', type: 'string', length: 10, nullable: true)]
    private ?string $indicadorPix = null;

    /** Identificador do lote (se aplicável). */
    #[ORM\Column(name: 'id_lote', type: 'integer', nullable: true)]
    private ?int $idLote = null;

    /** Código de barras do boleto. */
    #[ORM\Column(name: 'codigo_barras', type: 'string', length: 50, nullable: true)]
    private ?string $codigoBarras = null;

    /** Linha digitável do boleto. */
    #[ORM\Column(name: 'linha_digitavel', type: 'string', length: 50, nullable: true)]
    private ?string $linhaDigitavel = null;

    /** Status atual do boleto. */
    #[ORM\Column(name: 'status_boleto', type: 'string', length: 20, nullable: false)]
    private ?string $statusBoleto = null;

    /** Tipo de segregação do boleto. */
    #[ORM\Column(name: 'tipo_segregacao_boleto', type: 'string', length: 32, nullable: false)]
    private ?string $tipoSegregacaoBoleto = null;

    /** Data de cancelamento (se houver). */
    #[ORM\Column(name: 'data_cancelamento', type: 'datetime', nullable: true)]
    private ?\DateTime $dataCancelamento = null;

    /** Usuário responsável pelo cancelamento (se houver). */
    #[ORM\Column(name: 'usuario_cancelamento', type: 'string', length: 20, nullable: true)]
    private ?string $usuarioCancelamento = null;

    /** Observações gerais sobre a cobrança. */
    #[ORM\Column(name: 'observacao', type: 'string', length: 255, nullable: true)]
    private ?string $observacao = null;

    /** URL do payload PIX (se houver). */
    #[ORM\Column(name: 'pix_url', type: 'string', length: 255, nullable: true)]
    private ?string $pixUrl = null;

    /** TxID do PIX (se houver). */
    #[ORM\Column(name: 'pix_tx_id', type: 'string', length: 255, nullable: true)]
    private ?string $pixTxId = null;

    /** EMV do PIX (se houver). */
    #[ORM\Column(name: 'pix_emv', type: 'string', length: 255, nullable: true)]
    private ?string $pixEmv = null;

    // ===== Getters e Setters =====

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNossoNumero(): ?string
    {
        return $this->nossoNumero;
    }

    public function setNossoNumero(string $nossoNumero): static
    {
        $this->nossoNumero = $nossoNumero;

        return $this;
    }

    public function getDataEmissao(): ?\DateTime
    {
        return $this->dataEmissao;
    }

    public function setDataEmissao(\DateTime $dataEmissao): static
    {
        $this->dataEmissao = $dataEmissao;

        return $this;
    }

    public function getUsuarioEmissao(): ?string
    {
        return $this->usuarioEmissao;
    }

    public function setUsuarioEmissao(string $usuarioEmissao): static
    {
        $this->usuarioEmissao = $usuarioEmissao;

        return $this;
    }

    public function getNumConvenio(): ?int
    {
        return $this->numConvenio;
    }

    public function setNumConvenio(int $numConvenio): static
    {
        $this->numConvenio = $numConvenio;

        return $this;
    }

    public function getNumCarteira(): ?int
    {
        return $this->numCarteira;
    }

    public function setNumCarteira(int $numCarteira): static
    {
        $this->numCarteira = $numCarteira;

        return $this;
    }

    public function getNumVariacaoCarteira(): ?int
    {
        return $this->numVariacaoCarteira;
    }

    public function setNumVariacaoCarteira(int $numVariacaoCarteira): static
    {
        $this->numVariacaoCarteira = $numVariacaoCarteira;

        return $this;
    }

    public function getCodModalidade(): ?int
    {
        return $this->codModalidade;
    }

    public function setCodModalidade(int $codModalidade): static
    {
        $this->codModalidade = $codModalidade;

        return $this;
    }

    public function getDataVencimento(): ?\DateTime
    {
        return $this->dataVencimento;
    }

    public function setDataVencimento(\DateTime $dataVencimento): static
    {
        $this->dataVencimento = $dataVencimento;

        return $this;
    }

    /**
     * Retorna o valor original em string (decimal) para preservar precisão.
     */
    public function getValorOriginal(): ?string
    {
        return $this->valorOriginal;
    }

    /**
     * Define o valor original em string (decimal), ex.: '1234.56'.
     */
    public function setValorOriginal(string $valorOriginal): static
    {
        $this->valorOriginal = $valorOriginal;

        return $this;
    }

    public function getCodAceite(): ?string
    {
        return $this->codAceite;
    }

    public function setCodAceite(string $codAceite): static
    {
        $this->codAceite = $codAceite;

        return $this;
    }

    public function getCodTipoTitulo(): ?int
    {
        return $this->codTipoTitulo;
    }

    public function setCodTipoTitulo(int $codTipoTitulo): static
    {
        $this->codTipoTitulo = $codTipoTitulo;

        return $this;
    }

    public function getIndicadorRecebimentoParcial(): ?string
    {
        return $this->indicadorRecebimentoParcial;
    }

    public function setIndicadorRecebimentoParcial(string $indicadorRecebimentoParcial): static
    {
        $this->indicadorRecebimentoParcial = $indicadorRecebimentoParcial;

        return $this;
    }

    public function getTituloBeneficiario(): ?string
    {
        return $this->tituloBeneficiario;
    }

    public function setTituloBeneficiario(string $tituloBeneficiario): static
    {
        $this->tituloBeneficiario = $tituloBeneficiario;

        return $this;
    }

    public function getTextoBeneficiario(): ?string
    {
        return $this->textoBeneficiario;
    }

    public function setTextoBeneficiario(?string $textoBeneficiario): static
    {
        $this->textoBeneficiario = $textoBeneficiario;

        return $this;
    }

    public function getCnpjPagador(): ?string
    {
        return $this->cnpjPagador;
    }

    public function setCnpjPagador(string $cnpjPagador): static
    {
        $this->cnpjPagador = $cnpjPagador;

        return $this;
    }

    public function getIndicadorPix(): ?string
    {
        return $this->indicadorPix;
    }

    public function setIndicadorPix(?string $indicadorPix): static
    {
        $this->indicadorPix = $indicadorPix;

        return $this;
    }

    public function getIdLote(): ?int
    {
        return $this->idLote;
    }

    public function setIdLote(?int $idLote): static
    {
        $this->idLote = $idLote;

        return $this;
    }

    public function getCodigoBarras(): ?string
    {
        return $this->codigoBarras;
    }

    public function setCodigoBarras(?string $codigoBarras): static
    {
        $this->codigoBarras = $codigoBarras;

        return $this;
    }

    public function getLinhaDigitavel(): ?string
    {
        return $this->linhaDigitavel;
    }

    public function setLinhaDigitavel(?string $linhaDigitavel): static
    {
        $this->linhaDigitavel = $linhaDigitavel;

        return $this;
    }

    public function getStatusBoleto(): ?string
    {
        return $this->statusBoleto;
    }

    public function setStatusBoleto(string $statusBoleto): static
    {
        $this->statusBoleto = $statusBoleto;

        return $this;
    }

    public function getTipoSegregacaoBoleto(): ?string
    {
        return $this->tipoSegregacaoBoleto;
    }

    public function setTipoSegregacaoBoleto(string $tipoSegregacaoBoleto): static
    {
        $this->tipoSegregacaoBoleto = $tipoSegregacaoBoleto;

        return $this;
    }

    public function getDataCancelamento(): ?\DateTime
    {
        return $this->dataCancelamento;
    }

    public function setDataCancelamento(?\DateTime $dataCancelamento): static
    {
        $this->dataCancelamento = $dataCancelamento;

        return $this;
    }

    public function getUsuarioCancelamento(): ?string
    {
        return $this->usuarioCancelamento;
    }

    public function setUsuarioCancelamento(?string $usuarioCancelamento): static
    {
        $this->usuarioCancelamento = $usuarioCancelamento;

        return $this;
    }

    public function getObservacao(): ?string
    {
        return $this->observacao;
    }

    public function setObservacao(?string $observacao): static
    {
        $this->observacao = $observacao;

        return $this;
    }

    public function getPixUrl(): ?string
    {
        return $this->pixUrl;
    }

    public function setPixUrl(?string $pixUrl): static
    {
        $this->pixUrl = $pixUrl;

        return $this;
    }

    public function getPixTxId(): ?string
    {
        return $this->pixTxId;
    }

    public function setPixTxId(?string $pixTxId): static
    {
        $this->pixTxId = $pixTxId;

        return $this;
    }

    public function getPixEmv(): ?string
    {
        return $this->pixEmv;
    }

    public function setPixEmv(?string $pixEmv): static
    {
        $this->pixEmv = $pixEmv;

        return $this;
    }
}
