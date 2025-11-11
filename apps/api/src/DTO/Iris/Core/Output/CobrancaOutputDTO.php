<?php

namespace App\DTO\Iris\Core\Output;

use App\Entity\Iris\Core\Cobranca;

class CobrancaOutputDTO
{
    public int $id;
    public string $nossoNumero;
    public string $dataEmissao;
    public string $usuarioEmissao;
    public int $numConvenio;
    public int $numCarteira;
    public int $numVariacaoCarteira;
    public int $codModalidade;
    public string $dataVencimento;
    public string $valorOriginal;
    public string $codAceite;
    public int $codTipoTitulo;
    public string $indicadorRecebimentoParcial;
    public string $tituloBeneficiario;
    public string $textoBeneficiario;
    public string $cnpjPagador;
    public string $indicadorPix;
    public int $idLote;
    public ?string $codigoBarras;
    public ?string $linhaDigitavel;
    public string $statusBoleto;
    public string $tipoSegregacaoBoleto;
    public ?string $dataCancelamento;
    public ?string $usuarioCancelamento;
    public ?string $observacao;
    public ?string $pixUrl;
    public ?string $pixTxId;
    public ?string $pixEmv;

    public function __construct(Cobranca $cobranca)
    {
        $this->id = $cobranca->getId();
        $this->nossoNumero = $cobranca->getNossoNumero();
        $this->dataEmissao = $cobranca->getDataEmissao()->format('Y-m-d H:i:s') ?? null;
        $this->usuarioEmissao = $cobranca->getUsuarioEmissao();
        $this->numConvenio = $cobranca->getNumConvenio();
        $this->numCarteira = $cobranca->getNumCarteira();
        $this->numVariacaoCarteira = $cobranca->getNumVariacaoCarteira();
        $this->codModalidade = $cobranca->getCodModalidade();
        $this->dataVencimento = $cobranca->getDataVencimento()->format('Y-m-d H:i:s') ?? null;
        $this->valorOriginal = $cobranca->getValorOriginal();
        $this->codAceite = $cobranca->getCodAceite();
        $this->codTipoTitulo = $cobranca->getCodTipoTitulo();
        $this->indicadorRecebimentoParcial = $cobranca->getIndicadorRecebimentoParcial();
        $this->tituloBeneficiario = $cobranca->getTituloBeneficiario();
        $this->textoBeneficiario = $cobranca->getTextoBeneficiario();
        $this->cnpjPagador = $cobranca->getCnpjPagador();
        $this->indicadorPix = $cobranca->getIndicadorPix();
        $this->idLote = $cobranca->getIdLote();
        $this->codigoBarras = $cobranca->getCodigoBarras();
        $this->linhaDigitavel = $cobranca->getLinhaDigitavel();
        $this->statusBoleto = $cobranca->getStatusBoleto();
        $this->tipoSegregacaoBoleto = $cobranca->getTipoSegregacaoBoleto();
        $this->dataCancelamento = $cobranca->getDataCancelamento() ?? null;
        $this->usuarioCancelamento = $cobranca->getUsuarioCancelamento();
        $this->observacao = $cobranca->getObservacao();
        $this->pixUrl = $cobranca->getPixUrl();
        $this->pixTxId = $cobranca->getPixTxId();
        $this->pixEmv = $cobranca->getPixEmv();
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }

    public static function fromCobranca(Cobranca $cobranca): self
    {
        return new self($cobranca);
    }
}
