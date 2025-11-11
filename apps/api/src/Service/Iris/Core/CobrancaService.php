<?php

namespace App\Service\Iris\Core;

use App\DTO\Iris\Core\Output\CobrancaOutputDTO;
use App\Entity\Iris\Core\Cobranca;
use App\Interface\Iris\Repository\Core\CobrancaRepositoryInterface;
use App\Interface\Iris\Service\Core\CobrancaServiceInterface;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;

class CobrancaService implements CobrancaServiceInterface
{
    public function __construct(
        private readonly CobrancaRepositoryInterface $cobrancaRepository,
        private readonly PaginatorInterface $paginator
    ) {
    }

    public function criarCobranca(array $data): CobrancaOutputDTO
    {
        $cobranca = new Cobranca();
        $cobranca->setNossoNumero($data['nosso_numero']);
        $cobranca->setDataEmissao($data['data_emissao']);
        $cobranca->setUsuarioEmissao($data['usuario_emissao']);
        $cobranca->setNumConvenio($data['num_convenio']);
        $cobranca->setNumCarteira($data['num_carteira']);
        $cobranca->setNumVariacaoCarteira($data['num_variacao_carteira']);
        $cobranca->setCodModalidade($data['cod_modalidade']);
        $cobranca->setDataVencimento($data['data_vencimento']);
        $cobranca->setValorOriginal($data['valor_original']);
        $cobranca->setCodAceite($data['cod_aceite']);
        $cobranca->setCodTipoTitulo($data['cod_tipo_titulo']);
        $cobranca->setIndicadorRecebimentoParcial($data['indicador_recebimento_parcial']);
        $cobranca->setTituloBeneficiario($data['titulo_beneficiario']);
        $cobranca->setTextoBeneficiario($data['texto_beneficiario']);
        $cobranca->setCnpjPagador($data['cnpj_pagador']);
        $cobranca->setIndicadorPix($data['indicador_pix']);
        $cobranca->setIdLote($data['id_lote']);
        $cobranca->setCodigoBarras($data['codigo_barras']);
        $cobranca->setLinhaDigitavel($data['linha_digitavel']);
        $cobranca->setStatusBoleto($data['status_boleto']);
        $cobranca->setTipoSegregacaoBoleto($data['tipo_segregacao_boleto']);
        $cobranca->setObservacao($data['observacao']);
        $this->cobrancaRepository->save($cobranca);

        return new CobrancaOutputDTO($cobranca);
    }

    public function obterCobranca(string $nossoNumero): ?CobrancaOutputDTO
    {
        $cobranca = $this->cobrancaRepository->findOneByNossoNumero($nossoNumero);

        return $cobranca ? new CobrancaOutputDTO($cobranca) : null;
    }

    public function editarCobranca(string $nossoNumero, array $data): CobrancaOutputDTO
    {
        $cobranca = $this->cobrancaRepository->findOneByNossoNumero($nossoNumero);
        $cobranca->setNossoNumero($data['nosso_numero']);
        $cobranca->setDataEmissao($data['data_emissao']);
        $cobranca->setUsuarioEmissao($data['usuario_emissao']);
        $cobranca->setNumConvenio($data['num_convenio']);
        $cobranca->setNumCarteira($data['num_carteira']);
        $cobranca->setNumVariacaoCarteira($data['num_variacao_carteira']);
        $cobranca->setCodModalidade($data['cod_modalidade']);
        $cobranca->setDataVencimento($data['data_vencimento']);
        $cobranca->setValorOriginal($data['valor_original']);
        $cobranca->setCodAceite($data['cod_aceite']);
        $cobranca->setCodTipoTitulo($data['cod_tipo_titulo']);
        $cobranca->setIndicadorRecebimentoParcial($data['indicador_recebimento_parcial']);
        $cobranca->setTituloBeneficiario($data['titulo_beneficiario']);
        $cobranca->setTextoBeneficiario($data['texto_beneficiario']);
        $cobranca->setCnpjPagador($data['cnpj_pagador']);
        $cobranca->setIndicadorPix($data['indicador_pix']);
        $cobranca->setIdLote($data['id_lote']);
        $cobranca->setCodigoBarras($data['codigo_barras']);
        $cobranca->setLinhaDigitavel($data['linha_digitavel']);
        $cobranca->setStatusBoleto($data['status_boleto']);
        $cobranca->setTipoSegregacaoBoleto($data['tipo_segregacao_boleto']);
        $cobranca->setObservacao($data['observacao']);
        $this->cobrancaRepository->update($cobranca);

        return new CobrancaOutputDTO($cobranca);
    }

    public function cancelarCobranca(string $nossoNumero): CobrancaOutputDTO
    {
        $cobranca = $this->cobrancaRepository->findOneByNossoNumero($nossoNumero);
        if ($cobranca) {
            $this->cobrancaRepository->cancelarCobranca($cobranca);
        }

        return new CobrancaOutputDTO($cobranca);
    }

    /**
     * @param array<string, mixed> $filter
     * @return PaginationInterface
     */
    public function listarCobrancas(array $filter = []): PaginationInterface
    {
        $cobrancas = $this->cobrancaRepository->findAll($filter);
        $cobrancasOutput = array_map(fn (Cobranca $cobranca) => CobrancaOutputDTO::fromCobranca($cobranca), $cobrancas);

        return $this->paginator->paginate(
            $cobrancasOutput,
            $filter['pageIndex'] ?? 1,
            $filter['pageSize'] ?? 10
        );
    }
}
