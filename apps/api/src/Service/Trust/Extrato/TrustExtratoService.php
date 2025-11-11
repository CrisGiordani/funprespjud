<?php

namespace App\Service\Trust\Extrato;

use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\DTO\Trust\Output\ContribuicaoOutputDTO;
use App\Enum\Trust\Contribuicao\TipoValorEnum;
use App\Helper\CpfHelper;
use App\Service\Trust\Contribuicao\TrustContribuicaoService;
use App\Service\Trust\Cotas\TrustCotasService;
use App\Service\Trust\Participante\TrustParticipanteService;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;
use App\Enum\Trust\IndexadorValor\IndexadorValorEnum;
use App\Interface\Trust\Service\IndexadorValorServiceInterface;

class TrustExtratoService
{
    public function __construct(
        private readonly TrustCotasService $trustCotasService,
        private readonly TrustContribuicaoService $trustContribuicaoService,
        private readonly TrustParticipanteService $trustParticipanteService,
        private readonly PaginatorInterface $paginator,
        private readonly IndexadorValorServiceInterface $indexadorValorService

    ) {}

    /**
     * Formata valor para moeda brasileira (2 casas decimais)
     * @param float $valor
     * @return float
     */
    private function formatarMoeda(float $valor): float
    {
        return round($valor, 2);
    }

    /**
     * Retorna o extrato de contribuições do participante
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     * @return PaginationInterface
     */
    public function getExtrato(string $cpf, ContribuicaoFilterDTO $filter): PaginationInterface
    {
        if (! CpfHelper::isValidCpf($cpf)) {
            throw new \Exception('CPF inválido');
        }

        $perfilAtual = $this->trustParticipanteService->getPerfilAtual($cpf);
        $indexador = IndexadorValorEnum::getCodigoPerfilInvestimentoByIdIndexadorTrust($perfilAtual['idPerfil']);
        $cota = $this->indexadorValorService->getLastValueByCodigo($indexador);
        $valorCotaPerfil = $cota[0]->getValor();

        if ($filter->getTipo() == 'TRANSFERENCIA') {
            $contribuicoesParticipante = $this->trustContribuicaoService->getContribuicoesPERFIL($cpf, $filter);
        } else {
            $contribuicoesParticipante = $this->trustContribuicaoService->getContribuicoes($cpf, $filter);
        }


        $extrato = [];

        $extrato = array_merge(
            $extrato,
            $this->processarContribuicoesRanRas($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarContribuicoesCAR($contribuicoesParticipante, $cpf),
            $this->processarContribuicoesPortabilidade($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarEstornos($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarBPD($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarNAT($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarMULTA($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarPAGTOBENEFICIO($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarTransferenciaDePerfil($contribuicoesParticipante, $valorCotaPerfil),
        );


        $extratoOrdenado = $this->ordenarExtrato($extrato);
        $extratoCollection = new \Doctrine\Common\Collections\ArrayCollection($extratoOrdenado);
        // Usa a mesma lógica de paginação do DocumentoService
        return $this->paginator->paginate(
            $extratoCollection,
            $filter->getPageIndex() + 1, // KnpPaginator uses 1-based page numbers
            $filter->getPageSize()
        );
    }

    /**
     * Retorna o extrato completo de contribuições do participante sem paginação
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     * @return array
     */
    public function getExtratoCompleto(string $cpf, ContribuicaoFilterDTO $filter): array
    {
        if (! CpfHelper::isValidCpf($cpf)) {
            throw new \Exception('CPF inválido');
        }


        $perfilAtual = $this->trustParticipanteService->getPerfilAtual($cpf);
        $indexador = IndexadorValorEnum::getCodigoPerfilInvestimentoByIdIndexadorTrust($perfilAtual['idPerfil']);
        $cota = $this->indexadorValorService->getLastValueByCodigo($indexador);
        $valorCotaPerfil = $cota[0]->getValor();

        if ($filter->getTipo() == 'TRANSFERENCIA') {
            $contribuicoesParticipante = $this->trustContribuicaoService->getContribuicoesPERFIL($cpf, $filter);
        } else {
            $contribuicoesParticipante = $this->trustContribuicaoService->getContribuicoes($cpf, $filter);
        }


        $extrato = [];

        $extrato = array_merge(
            $extrato,
            $this->processarContribuicoesRanRas($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarContribuicoesCAR($contribuicoesParticipante, $cpf),
            $this->processarContribuicoesPortabilidade($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarEstornos($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarBPD($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarNAT($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarMULTA($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarPAGTOBENEFICIO($contribuicoesParticipante, $valorCotaPerfil),
            $this->processarTransferenciaDePerfil($contribuicoesParticipante, $valorCotaPerfil),
        );
        // Ordena o extrato por data de recolhimento (mais recente primeiro)
        return $this->ordenarExtrato($extrato);
    }



    /**
     * Processa contribuições do tipo RAN e RAS
     * @param array $contribuicoesParticipante
     * @param float $valorCotaPerfil
     * @return array
     */
    private function processarContribuicoesRanRas(array|ContribuicaoOutputDTO $contribuicoesParticipante, float $valorCotaPerfil): array|ContribuicaoOutputDTO
    {
        $resultado = [];
        $contribuicoesRanRas = array_filter($contribuicoesParticipante, function ($item) {
            // Exclui contribuições que contenham ESTORNO, NAT ou TRANSFERÊNCIA DE PERFIL
            if (
                str_contains($item->getContribuicao(), 'ESTORNO') ||
                str_contains($item->getContribuicao(), 'NAT') ||
                str_contains($item->getContribuicao(), 'TRANSF PERFIL') ||
                $item->getGrupoContribuicao() === 'TRANSFERÊNCIA DE PERFIL'
            ) {
                return false;
            }

            return TipoValorEnum::isRanOrRas($item->getTipoValor());
        });

        foreach ($contribuicoesRanRas as $item) {
            // Usa o novo padrão consistente para calcular todos os campos
            $camposCalculados = $this->calcularCamposContribuicao($contribuicoesParticipante, $item, $valorCotaPerfil);

            $resultado[] = [
                'contribuidor' => $item->getContribuidor(),
                'patrocinador' => $item->getPatrocinador(),
                'dtRecolhimento' => $item->getDtRecolhimento(),
                'tipoContribuicao' => $item->getContribuicao() . ' - ' . $item->getMantenedorContribuicao(),
                'mantenedorContribuicao' => $item->getMantenedorContribuicao(),
                'valorContribuicao' => $this->formatarMoeda($camposCalculados['totalContribuicao']),
                'taxaCarregamento' => $this->formatarMoeda($camposCalculados['taxaCarregamento']),
                'fcbe' => $this->formatarMoeda($camposCalculados['fcbe']),
                'car' => $this->formatarMoeda($camposCalculados['car']),
                'ran' => $this->formatarMoeda($camposCalculados['ran']),
                'ras' => $this->formatarMoeda($camposCalculados['ras']),
                'ranCotas' => $camposCalculados['ranCotas'], // Mantém todas as casas decimais
                'rasCotas' => $camposCalculados['rasCotas'], // Mantém todas as casas decimais
                'rentabilidade' => $this->formatarMoeda($camposCalculados['rentabilidade']), // Usa rentabilidade calculada das contribuições associadas
                'competencia' => $item->getMesCompetencia() . '/' . $item->getAnoCompetencia(),
                'mesCompetencia' => $item->getMesCompetencia(),
                'anoCompetencia' => $item->getAnoCompetencia(),
                'isCAR' => false,
                'grupoContribuicao' => $item->getGrupoContribuicao(),
            ];
        }

        return $resultado;
    }


    /**
     * Processa contribuições do tipo CAR (SEGURO)
     * @param array $contribuicoesParticipante
     * @param string $cpf
     * @return array
     */
    private function processarContribuicoesCAR(array $contribuicoesParticipante, string $cpf): array
    {
        $resultado = [];
        // Busca os dados de cobertura do participante
        $coberturas = null;
        try {
            $coberturas = $this->trustParticipanteService->getCoberturasCAR($cpf);
        } catch (\Exception $e) {
            // Se não conseguir buscar coberturas, continua sem os dados específicos
        }

        $contribuicoesCAR = array_filter($contribuicoesParticipante, function ($item) {
            return TipoValorEnum::isSeguro($item->getTipoValor());
        });

        // Agrupa contribuições CAR por competência e patrocinador para consolidar
        $grupos = [];
        foreach ($contribuicoesCAR as $item) {
            $chave = $item->getAnoCompetencia() . '_' . $item->getMesCompetencia() . '_' . $item->getPatrocinador();
            if (!isset($grupos[$chave])) {
                $grupos[$chave] = [];
            }
            $grupos[$chave][] = $item;
        }

        foreach ($grupos as $grupo) {
            // Pega o primeiro item como base (todos têm mesma competência e patrocinador)
            $itemBase = $grupo[0];

            // Usa o novo padrão consistente para calcular todos os campos
            $camposCalculados = $this->calcularCamposContribuicao($contribuicoesParticipante, $itemBase, 0);

            // Formatação da data de pagamento
            $dataPagamento = null;
            if ($itemBase->getDtRecolhimento()) {
                $dataObj = \DateTime::createFromFormat('Y-m-d', $itemBase->getDtRecolhimento());
                if ($dataObj !== false) {
                    $dataPagamento = $dataObj->format('d/m/Y');
                }
            }

            // Formatação da competência
            $competenciaFormatada = $itemBase->getMesCompetencia() . '/' . $itemBase->getAnoCompetencia();

            // Detalhes da movimentação organizados
            $detalhesMovimentacao = [
                'coberturas' => [
                    'morte' => [
                        'nome' => 'Cobertura adicional morte',
                        'valorSeguro' => $coberturas && isset($coberturas['morte']) ? $coberturas['morte']->getValorSeguro() : null,
                        'mensalidade' => $coberturas && isset($coberturas['morte']) ? $coberturas['morte']->getMensalidade() : null
                    ],
                    'invalidez' => [
                        'nome' => 'Cobertura adicional invalidez',
                        'valorSeguro' => $coberturas && isset($coberturas['invalidez']) ? $coberturas['invalidez']->getValorSeguro() : null,
                        'mensalidade' => $coberturas && isset($coberturas['invalidez']) ? $coberturas['invalidez']->getMensalidade() : null
                    ]
                ],
                'datas' => [
                    'dataPagamento' => $dataPagamento,
                    'competencia' => $competenciaFormatada
                ]
            ];

            // Calcula valor total das coberturas
            $valorTotalCoberturas = 0;
            if ($coberturas) {
                if (isset($coberturas['morte'])) {
                    $valorTotalCoberturas += floatval($coberturas['morte']->getMensalidade());
                }
                if (isset($coberturas['invalidez'])) {
                    $valorTotalCoberturas += floatval($coberturas['invalidez']->getMensalidade());
                }
            }

            $resultado[] = [
                'contribuidor' => $itemBase->getContribuidor(),
                'patrocinador' => $itemBase->getPatrocinador(),
                'dtRecolhimento' => $itemBase->getDtRecolhimento(),
                'tipoContribuicao' => 'CAR - COBERTURAS CONSOLIDADAS - ' . $itemBase->getMantenedorContribuicao(),
                'mantenedorContribuicao' => $itemBase->getMantenedorContribuicao(),
                'valorContribuicao' => $this->formatarMoeda($valorTotalCoberturas),
                'taxaCarregamento' => $this->formatarMoeda($camposCalculados['taxaCarregamento']),
                'fcbe' => $this->formatarMoeda($camposCalculados['fcbe']),
                'car' => $this->formatarMoeda($camposCalculados['car']),
                'ran' => $this->formatarMoeda($camposCalculados['ran']),
                'ras' => $this->formatarMoeda($camposCalculados['ras']),
                'ranCotas' => $camposCalculados['ranCotas'], // Mantém todas as casas decimais
                'rasCotas' => $camposCalculados['rasCotas'], // Mantém todas as casas decimais
                'rentabilidade' => $this->formatarMoeda($camposCalculados['rentabilidade']),
                'competencia' => $competenciaFormatada,
                'mesCompetencia' => $itemBase->getMesCompetencia(),
                'anoCompetencia' => $itemBase->getAnoCompetencia(),
                'isCAR' => true,
                'tipoSeguro' => 'CONSOLIDADO',
                'grupoContribuicao' => $itemBase->getGrupoContribuicao(),
                'detalhesMovimentacao' => $detalhesMovimentacao,
            ];
        }

        return $resultado;
    }

    /**
     * Processa contribuições do tipo PORTABILIDADE
     * @param array $contribuicoesParticipante
     * @param float $cota
     * @return array
     */
    private function processarContribuicoesPortabilidade(array $contribuicoesParticipante, float $cota): array
    {
        $resultado = [];

        $contribuicoesPortabilidade = array_filter($contribuicoesParticipante, function ($item) {
            return $item->getTipoValor() === TipoValorEnum::PORTABILIDADE->value;
        });

        foreach ($contribuicoesPortabilidade as $item) {
            // Usa o novo padrão consistente para calcular todos os campos
            $camposCalculados = $this->calcularCamposContribuicao($contribuicoesParticipante, $item, $cota);

            $resultado[] = [
                'contribuidor' => $item->getContribuidor(),
                'patrocinador' => $item->getPatrocinador(),
                'dtRecolhimento' => $item->getDtRecolhimento(),
                'tipoContribuicao' => $item->getContribuicao() . ' - ' . $item->getMantenedorContribuicao(),
                'mantenedorContribuicao' => $item->getMantenedorContribuicao(),
                'valorContribuicao' => $this->formatarMoeda(floatval($item->getValorContribuicao())),
                'taxaCarregamento' => $this->formatarMoeda($camposCalculados['taxaCarregamento']),
                'fcbe' => $this->formatarMoeda($camposCalculados['fcbe']),
                'car' => $this->formatarMoeda($camposCalculados['car']),
                'ran' => $this->formatarMoeda($camposCalculados['ran']),
                'ras' => $this->formatarMoeda($camposCalculados['ras']),
                'ranCotas' => floatval($item->getQtdCota()), // Cotas vêm diretamente do banco para PORTABILIDADE
                'rasCotas' => $camposCalculados['rasCotas'], // Mantém todas as casas decimais
                'rentabilidade' => $this->formatarMoeda($camposCalculados['rentabilidade']),
                'competencia' => $item->getMesCompetencia() . '/' . $item->getAnoCompetencia(),
                'mesCompetencia' => $item->getMesCompetencia(),
                'anoCompetencia' => $item->getAnoCompetencia(),
                'isPortabilidade' => true,
                'isCAR' => false,
                'grupoContribuicao' => $item->getGrupoContribuicao(),
            ];
        }

        return $resultado;
    }

    /**
     * Agrupa contribuições por competência e patrocinador para evitar duplicação
     * @param array $contribuicoes
     * @return array
     */
    private function agruparContribuicoes(array $contribuicoes): array
    {
        $grupos = [];
        foreach ($contribuicoes as $item) {
            $chave = $item->getAnoCompetencia() . '_' . $item->getMesCompetencia() . '_' . $item->getPatrocinador();
            if (!isset($grupos[$chave])) {
                $grupos[$chave] = $item; // Usa o primeiro item como representante do grupo
            }
        }
        return $grupos;
    }

    /**
     * Processa contribuições do tipo ESTORNO
     * @param array $contribuicoesParticipante
     * @param float $cota
     * @return array
     */
    private function processarEstornos(array $contribuicoesParticipante, float $cota): array
    {
        $resultado = [];

        // Filtrar APENAS estornos - filtro mais restritivo
        $contribuicoesEstorno = array_filter($contribuicoesParticipante, function ($item) {
            // Deve conter ESTORNO E ser do tipo seguro, RAN, RAS, FCBE ou carregamento
            $temEstorno = str_contains($item->getContribuicao(), 'ESTORNO');
            $tipoValor = $item->getTipoValor();

            // Só processa se for estorno E tiver um tipo válido
            return $temEstorno && (
                $tipoValor === TipoValorEnum::SEGURO->value ||
                $tipoValor === TipoValorEnum::RAN->value ||
                $tipoValor === TipoValorEnum::RAS->value ||
                $tipoValor === TipoValorEnum::FCBE->value ||
                $tipoValor === TipoValorEnum::CARREGAMENTO->value
            );
        });

        // Agrupar por competência, patrocinador, contribuidor e mantenedor
        $grupos = [];
        foreach ($contribuicoesEstorno as $item) {
            $chave = $item->getAnoCompetencia() . '_' .
                $item->getMesCompetencia() . '_' .
                $item->getPatrocinador() . '_' .
                $item->getContribuidor() . '_' .
                $item->getMantenedorContribuicao();

            if (!isset($grupos[$chave])) {
                $grupos[$chave] = [];
            }
            $grupos[$chave][] = $item;
        }

        foreach ($grupos as $grupo) {
            // Usa o primeiro item do grupo para obter informações básicas
            $itemBase = reset($grupo);

            // Calcula campos consolidados para todo o grupo
            $camposCalculados = $this->calcularCamposContribuicao($contribuicoesParticipante, $itemBase, $cota);

            // Determina se é estorno de PARTIC ou PATROC
            $isParticipante = str_contains($itemBase->getContribuicao(), 'PARTIC');
            $isViaMapa = str_contains($itemBase->getContribuicao(), 'VIA MAPA');

            // Determina o tipo de contribuição baseado no grupo
            $grupoContribuicao = $itemBase->getGrupoContribuicao();
            $tipoContribuicao = '';

            if ($grupoContribuicao === 'NORMAL') {
                $tipoContribuicao = 'ESTORNO - NORMAL - ' . ($isParticipante ? 'PARTICIPANTE' : 'PATROCINADOR') . ($isViaMapa ? ' - VIA MAPA' : '');
            } elseif ($grupoContribuicao === 'FACULTATIVA') {
                $tipoContribuicao = 'ESTORNO - FACULTATIVA - ' . ($isParticipante ? 'PARTICIPANTE' : 'PATROCINADOR') . ($isViaMapa ? ' - VIA MAPA' : '');
            } else {
                $tipoContribuicao = $itemBase->getContribuicao();
            }

            $estorno = [
                'contribuidor' => $itemBase->getContribuidor(),
                'patrocinador' => $itemBase->getPatrocinador(),
                'dtRecolhimento' => $itemBase->getDtRecolhimento(),
                'tipoContribuicao' => $tipoContribuicao,
                'mantenedorContribuicao' => $itemBase->getMantenedorContribuicao(),
                'valorContribuicao' => $this->formatarMoeda($camposCalculados['totalContribuicao']),
                'taxaCarregamento' => $this->formatarMoeda($camposCalculados['taxaCarregamento']),
                'fcbe' => $this->formatarMoeda($camposCalculados['fcbe']),
                'car' => $this->formatarMoeda($camposCalculados['car']),
                'ran' => $this->formatarMoeda($camposCalculados['ran']),
                'ras' => $this->formatarMoeda($camposCalculados['ras']),
                'ranCotas' => $camposCalculados['ranCotas'], // Mantém todas as casas decimais
                'rasCotas' => $camposCalculados['rasCotas'], // Mantém todas as casas decimais
                'rentabilidade' => $this->formatarMoeda($camposCalculados['rentabilidade']),
                'competencia' => $itemBase->getMesCompetencia() . '/' . $itemBase->getAnoCompetencia(),
                'mesCompetencia' => $itemBase->getMesCompetencia(),
                'anoCompetencia' => $itemBase->getAnoCompetencia(),
                'isEstorno' => true,
                'isParticipante' => $isParticipante,
                'isViaMapa' => $isViaMapa,
                'isCAR' => false,
                'grupoContribuicao' => $grupoContribuicao,
            ];

            $resultado[] = $estorno;
        }

        return $resultado;
    }

    /**
     * Processa contribuições do tipo BPD
     * @param array $contribuicoesParticipante
     * @param float $cota
     * @return array
     */
    private function processarBPD(array $contribuicoesParticipante, float $cota): array
    {
        $resultado = [];

        $contribuicoesBPD = array_filter($contribuicoesParticipante, function ($item) {
            return str_contains($item->getContribuicao(), 'BPD');
        });

        // Agrupa BPDs por competência, patrocinador e tipo (SALDO/DÉBITO juntos, DEPÓSITO separado)
        $grupos = [];
        foreach ($contribuicoesBPD as $item) {
            $isDebito = str_contains($item->getContribuicao(), 'DÉBITO');
            $isSaldo = str_contains($item->getContribuicao(), 'SALDO');
            $isDeposito = str_contains($item->getContribuicao(), 'DEPÓSITO');

            $tipoGrupo = ($isSaldo || $isDebito) ? 'SALDO' : ($isDeposito ? 'DEPOSITO' : 'OUTRO');
            $chave = $item->getAnoCompetencia() . '_' . $item->getMesCompetencia() . '_' . $item->getPatrocinador() . '_' . $tipoGrupo;

            if (!isset($grupos[$chave])) {
                $grupos[$chave] = [];
            }
            $grupos[$chave][] = $item;
        }

        // Processa cada grupo consolidado
        foreach ($grupos as $grupo) {
            $itemBase = $grupo[0];

            // Determina o tipo do grupo
            $isDebito = str_contains($itemBase->getContribuicao(), 'DÉBITO');
            $isSaldo = str_contains($itemBase->getContribuicao(), 'SALDO');
            $isDeposito = str_contains($itemBase->getContribuicao(), 'DEPÓSITO');
            $isCredito = str_contains($itemBase->getContribuicao(), 'CRÉDITO');

            // Consolida valores e campos calculados do grupo
            $valorTotal = 0;
            $ranTotal = 0;
            $rasTotal = 0;
            $ranCotasTotal = 0;
            $rasCotasTotal = 0;

            foreach ($grupo as $item) {
                $camposItem = $this->calcularCamposContribuicao($contribuicoesParticipante, $item, $cota);
                $valorItem = floatval($item->getValorContribuicao());

                // Só soma valores positivos (SALDO), ignora negativos (DÉBITO)
                if ($valorItem > 0) {
                    $valorTotal += $valorItem;
                }

                $ranTotal += abs($camposItem['ran']);
                $rasTotal += abs($camposItem['ras']);
                $ranCotasTotal += abs(floatval($item->getQtdCota()));
                $rasCotasTotal += abs($camposItem['rasCotas']);
            }

            // Ajusta o sinal conforme o tipo de BPD
            if ($isSaldo || $isDebito) {
                // BPD - SALDO/DÉBITO: valores negativos (retirada)
                $taxaCarregamento = -$valorTotal;
                $ran = -$ranTotal;
                $ras = -$rasTotal;
                $ranCotas = -$ranCotasTotal;
                $rasCotas = -$rasCotasTotal;
                $tipoContribuicao = 'TAXA CARREGAMENTO BPD - SALDO';
                $mantenedorContribuicao = 'BPD - SALDO';
            } elseif ($isDeposito) {
                // BPD - DEPÓSITO: valores positivos (adição)
                $taxaCarregamento = $valorTotal;
                $ran = $ranTotal;
                $ras = $rasTotal;
                $ranCotas = $ranCotasTotal;
                $rasCotas = $rasCotasTotal;
                $tipoContribuicao = $itemBase->getContribuicao();
                $mantenedorContribuicao = $itemBase->getMantenedorContribuicao();
            } else {
                // BPD - Outros: valores negativos
                $taxaCarregamento = -$valorTotal;
                $ran = -$ranTotal;
                $ras = -$rasTotal;
                $ranCotas = -$ranCotasTotal;
                $rasCotas = -$rasCotasTotal;
                $tipoContribuicao = $itemBase->getContribuicao();
                $mantenedorContribuicao = $itemBase->getMantenedorContribuicao();
            }

            $resultado[] = [
                'contribuidor' => $itemBase->getContribuidor(),
                'patrocinador' => $itemBase->getPatrocinador(),
                'dtRecolhimento' => $itemBase->getDtRecolhimento(),
                'tipoContribuicao' => $tipoContribuicao,
                'mantenedorContribuicao' => $mantenedorContribuicao,
                'valorContribuicao' => $valorTotal,
                'taxaCarregamento' => $taxaCarregamento,
                'fcbe' => 0,
                'car' => 0,
                'ran' => $ran,
                'ras' => $ras,
                'ranCotas' => $ranCotas,
                'rasCotas' => $rasCotas,
                'rentabilidade' => 0,
                'competencia' => $itemBase->getMesCompetencia() . '/' . $itemBase->getAnoCompetencia(),
                'mesCompetencia' => $itemBase->getMesCompetencia(),
                'anoCompetencia' => $itemBase->getAnoCompetencia(),
                'isBPD' => true,
                'isDebito' => false,
                'isCredito' => $isCredito,
                'isSaldo' => ($isSaldo || $isDebito),
                'isDeposito' => $isDeposito,
                'grupoContribuicao' => $itemBase->getGrupoContribuicao(),
            ];
        }

        return $resultado;
    }


    /**
     * Calcula todos os campos de contribuição usando a lógica do sistema antigo
     * @param array $contribuicoesParticipante
     * @param ContribuicaoOutputDTO $item
     * @param float $cota
     * @return array
     */
    private function calcularCamposContribuicao(array $contribuicoesParticipante, ContribuicaoOutputDTO $item, float $valorCotaPerfil): array
    {
        // CORREÇÃO: Segue a lógica do sistema antigo - inclui data de recolhimento no agrupamento
        // para manter separadas as aplicações da mesma competência em datas diferentes
        $isAutopatrocinado = $item->getMantenedorContribuicao() === 'AUTOPATROCINADO';

        $contribuicoesAssociadas = array_filter($contribuicoesParticipante, function ($contribuicao) use ($item, $isAutopatrocinado) {
            $match = $contribuicao->getAnoCompetencia() == $item->getAnoCompetencia() &&
                $contribuicao->getMesCompetencia() == $item->getMesCompetencia() &&
                $contribuicao->getPatrocinador() == $item->getPatrocinador() &&
                $contribuicao->getTipoContribuicao() == $item->getTipoContribuicao() &&
                $contribuicao->getContribuidor() == $item->getContribuidor() &&
                $contribuicao->getMantenedorContribuicao() == $item->getMantenedorContribuicao() &&
                $contribuicao->getDtRecolhimento() == $item->getDtRecolhimento();

            // Para autopatrocinados: separa RAN, FCBE e TAXA CARREGAMENTO por tipo (PARTIC vs PATROC)
            if ($isAutopatrocinado) {
                $contribuicaoTipoValor = $contribuicao->getTipoValor();

                // Se for RAN, FCBE ou TAXA CARREGAMENTO, verifica se ambos são PARTIC ou ambos são PATROC
                if ($contribuicaoTipoValor === 'RAN' || $contribuicaoTipoValor === 'FCBE' || $contribuicaoTipoValor === 'TAXA CARREGAMENTO') {
                    $itemTipoParticipante = str_contains($item->getContribuicao(), 'PARTIC') && !str_contains($item->getContribuicao(), 'PATROC');
                    $contribuicaoTipoParticipante = str_contains($contribuicao->getContribuicao(), 'PARTIC') && !str_contains($contribuicao->getContribuicao(), 'PATROC');
                    $match = $match && ($itemTipoParticipante === $contribuicaoTipoParticipante);
                }
                // Para RAS, CAR e outros tipos, não separa (inclui todos)
            }

            return $match;
        });

        // Calcula valores individuais
        $taxaCarregamento = 0;
        $fcbe = 0;
        $car = 0;
        $ran = 0;
        $ras = 0;
        $multa = 0;
        $ranCotas = 0;
        $rasCotas = 0;
        $juros = 0;
        $portabilidade = 0;
        $totalContribuicao = 0;
        $rentabilidade = 0;
        $rentabilidadeRan = 0;
        $rentabilidadeRas = 0;
        $rentabilidadeJuros = 0;
        $rentabilidadePortabilidade = 0;

        foreach ($contribuicoesAssociadas as $contribuicao) {
            $valor = floatval($contribuicao->getValorContribuicao());
            $tipoValor = $contribuicao->getTipoValor();
            $valorAtualizado = $contribuicao->getQtdCota() * floatval($valorCotaPerfil);


            switch ($tipoValor) {
                case 'TAXA CARREGAMENTO':
                    $taxaCarregamento += $valor;
                    break;
                case 'FCBE':
                    $fcbe += $valor;
                    break;
                case 'SEGURO':
                    $car += $valor;
                    break;
                case 'RAN':
                    $ran += $valor;
                    $ranCotas += floatval($contribuicao->getQtdCota());
                    $rentabilidadeRan += $valorAtualizado;
                    break;
                case 'RAS':
                    $ras = $valor;
                    $rasCotas += floatval($contribuicao->getQtdCota());
                    $rentabilidadeRas += $valorAtualizado;
                    break;
                case 'JURO':
                    $juros += $valor;
                    $rentabilidadeJuros += $valorAtualizado;
                    break;
                case 'PORTABILIDADE':
                    $portabilidade += $valor;
                    $rentabilidadePortabilidade += $valorAtualizado;
                    break;
                case 'MULTA':
                    $multa += $valor;
                    break;
                case 'CONCESSÃO':
                case 'RESGATE - RAN':
                case 'RESGATE - RAS':
                case 'BAIXA':
                case 'BENEFÍCIO CONCEDIDO':
                    // PAGTO BENEFÍCIO, CONCESSÃO, RESGATES e BAIXAS: não processam cotas individuais
                    // O valor já está em valorContribuicao, deixa campos calculados zerados
                    break;
            }
        }


        $totalContribuicao = (
            $taxaCarregamento +
            $fcbe +
            $car +
            $ran +
            $ras +
            $multa +
            $juros +
            $portabilidade);


        $totalRentabilidade = (
            $rentabilidadeRan +
            $rentabilidadeRas +
            $rentabilidadeJuros +
            $rentabilidadePortabilidade);



        $rentabilidade = $totalRentabilidade - ($totalContribuicao - $fcbe - $taxaCarregamento - $car);

        return [
            'taxaCarregamento' => $taxaCarregamento,
            'fcbe' => $fcbe,
            'car' => $car,
            'ran' => $ran,
            'ras' => $ras,
            'ranCotas' => $ranCotas,
            'rasCotas' => $rasCotas,
            'totalContribuicao' => $totalContribuicao,
            'rentabilidade' => $rentabilidade
        ];
    }



    /**
     * Ordena o extrato por competência
     * @param array $extrato
     * @return array
     */
    private function ordenarExtrato(array $extrato): array
    {
        usort($extrato, function ($a, $b) {

            $ano_comp = $b['anoCompetencia'] <=> $a['anoCompetencia'];
            if ($ano_comp !== 0) {
                return $ano_comp;
            }
            $mes_comp = $b['mesCompetencia'] <=> $a['mesCompetencia'];
            if ($mes_comp !== 0) {
                return $mes_comp;
            }

            //* Retorna 0 se os valores de ambos os lados são iguais.
            //* Retorna 1 se o valor à esquerda é maior.
            //* Retorna -1 se o valor à direita é maior.
            return $b['dtRecolhimento'] <=> $a['dtRecolhimento'];
        });
        return $extrato;
    }

    /**
     * Extrai o tipo de seguro da descrição da contribuição
     * @param string $contribuicao
     * @return string
     */
    private function extrairTipoSeguro(string $contribuicao): string
    {
        if (str_contains($contribuicao, 'MORTE')) {
            return 'MORTE';
        }
        if (str_contains($contribuicao, 'INVALIDEZ')) {
            return 'INVALIDEZ';
        }
        if (str_contains($contribuicao, 'SOBREVIDA')) {
            return 'SOBREVIDA';
        }

        return 'OUTROS';
    }

    /**
     * Processa contribuições do tipo NAT (mês 13)
     * @param array $contribuicoesParticipante
     * @param float $cota
     * @return array
     */
    private function processarNAT(array $contribuicoesParticipante, float $cota): array
    {
        $resultado = [];

        // Filtrar contribuições NAT (mês 13 OU tipoContribuicao contendo NAT)
        $contribuicoesNAT = array_filter($contribuicoesParticipante, function ($item) {
            $temNAT = str_contains($item->getContribuicao(), 'NAT') ||
                str_contains($item->getTipoContribuicao(), 'NAT') ||
                str_contains($item->getMantenedorContribuicao(), 'NAT');
            $mes13 = $item->getMesCompetencia() == '13';

            // Processa se for mês 13 OU se contiver NAT em qualquer campo
            return $temNAT || $mes13;
        });

        // Agrupar por competência, patrocinador, contribuidor e mantenedor
        $grupos = [];
        foreach ($contribuicoesNAT as $item) {
            $chave = $item->getAnoCompetencia() . '_' .
                $item->getMesCompetencia() . '_' .
                $item->getPatrocinador() . '_' .
                $item->getContribuidor() . '_' .
                $item->getMantenedorContribuicao();

            if (!isset($grupos[$chave])) {
                $grupos[$chave] = [];
            }
            $grupos[$chave][] = $item;
        }

        foreach ($grupos as $grupo) {
            // Usa o primeiro item do grupo para obter informações básicas
            $itemBase = reset($grupo);

            // Calcula campos consolidados para todo o grupo
            $camposCalculados = $this->calcularCamposContribuicao($contribuicoesParticipante, $itemBase, $cota);

            // Determina o tipo de contribuição baseado no grupo
            $grupoContribuicao = $itemBase->getGrupoContribuicao();
            $tipoContribuicao = '';

            if ($grupoContribuicao === 'NORMAL') {
                $tipoContribuicao = 'NORMAL - GR. NATALINA - ' . $itemBase->getMantenedorContribuicao();
            } elseif ($grupoContribuicao === 'FACULTATIVA') {
                $tipoContribuicao = 'FACULTATIVA - GR. NATALINA - ' . $itemBase->getMantenedorContribuicao();
            } else {
                $tipoContribuicao = $itemBase->getContribuicao() . ' - ' . $itemBase->getMantenedorContribuicao();
            }

            $nat = [
                'contribuidor' => $itemBase->getContribuidor(),
                'patrocinador' => $itemBase->getPatrocinador(),
                'dtRecolhimento' => $itemBase->getDtRecolhimento(),
                'tipoContribuicao' => $tipoContribuicao,
                'mantenedorContribuicao' => $itemBase->getMantenedorContribuicao(),
                'valorContribuicao' => $this->formatarMoeda($camposCalculados['totalContribuicao']),
                'taxaCarregamento' => $this->formatarMoeda($camposCalculados['taxaCarregamento']),
                'fcbe' => $this->formatarMoeda($camposCalculados['fcbe']),
                'car' => $this->formatarMoeda($camposCalculados['car']),
                'ran' => $this->formatarMoeda($camposCalculados['ran']),
                'ras' => $this->formatarMoeda($camposCalculados['ras']),
                'ranCotas' => $camposCalculados['ranCotas'], // Mantém todas as casas decimais
                'rasCotas' => $camposCalculados['rasCotas'], // Mantém todas as casas decimais
                'rentabilidade' => $this->formatarMoeda($camposCalculados['rentabilidade']),
                'competencia' => $itemBase->getMesCompetencia() . '/' . $itemBase->getAnoCompetencia(),
                'mesCompetencia' => $itemBase->getMesCompetencia(),
                'anoCompetencia' => $itemBase->getAnoCompetencia(),
                'isNAT' => true,
                'isCAR' => false,
                'grupoContribuicao' => $grupoContribuicao,
            ];

            $resultado[] = $nat;
        }

        return $resultado;
    }

    /**
     * Processa contribuições do tipo MULTA
     * @param array $contribuicoesParticipante
     * @param float $cota
     * @return array
     */
    private function processarMULTA(array $contribuicoesParticipante, float $cota): array
    {
        $resultado = [];

        // Filtrar contribuições MULTA
        $contribuicoesMULTA = array_filter($contribuicoesParticipante, function ($item) {
            return str_contains($item->getTipoContribuicao(), 'MULTA') ||
                str_contains($item->getContribuicao(), 'MULTA') ||
                $item->getGrupoContribuicao() === 'MULTA';
        });

        foreach ($contribuicoesMULTA as $item) {
            // Usa o novo padrão consistente para calcular todos os campos
            $camposCalculados = $this->calcularCamposContribuicao($contribuicoesParticipante, $item, $cota);

            $multa = [
                'contribuidor' => $item->getContribuidor(),
                'patrocinador' => $item->getPatrocinador(),
                'dtRecolhimento' => $item->getDtRecolhimento(),
                'tipoContribuicao' => $item->getContribuicao() . ' - ' . $item->getMantenedorContribuicao(),
                'mantenedorContribuicao' => $item->getMantenedorContribuicao(),
                'valorContribuicao' => $this->formatarMoeda(floatval($item->getValorContribuicao())),
                'taxaCarregamento' => $this->formatarMoeda($camposCalculados['taxaCarregamento']),
                'fcbe' => $this->formatarMoeda($camposCalculados['fcbe']),
                'car' => $this->formatarMoeda($camposCalculados['car']),
                'ran' => $this->formatarMoeda($camposCalculados['ran']),
                'ras' => $this->formatarMoeda($camposCalculados['ras']),
                'ranCotas' => $camposCalculados['ranCotas'], // Mantém todas as casas decimais
                'rasCotas' => $camposCalculados['rasCotas'], // Mantém todas as casas decimais
                'rentabilidade' => $this->formatarMoeda($camposCalculados['rentabilidade']),
                'competencia' => $item->getMesCompetencia() . '/' . $item->getAnoCompetencia(),
                'mesCompetencia' => $item->getMesCompetencia(),
                'anoCompetencia' => $item->getAnoCompetencia(),
                'isMULTA' => true,
                'isCAR' => false,
                'isNAT' => false,
                'isBPD' => false,
                'isPortabilidade' => false,
                'grupoContribuicao' => $item->getGrupoContribuicao(),
            ];

            $resultado[] = $multa;
        }

        return $resultado;
    }

    /**
     * Processa contribuições do tipo PAGTO BENEFÍCIO
     * @param array $contribuicoesParticipante
     * @param float $cota
     * @return array
     */
    private function processarPAGTOBENEFICIO(array $contribuicoesParticipante, float $cota): array
    {
        $resultado = [];

        // Filtrar contribuições PAGTO BENEFÍCIO
        $contribuicoesPAGTOBENEFICIO = array_filter($contribuicoesParticipante, function ($item) {
            return str_contains($item->getContribuicao(), 'PAGTO BENEFÍCIO') ||
                str_contains($item->getTipoContribuicao(), 'CONCESSÃO') ||
                $item->getGrupoContribuicao() === 'CONCESSÃO';
        });

        foreach ($contribuicoesPAGTOBENEFICIO as $item) {
            // Usa o novo padrão consistente para calcular todos os campos
            $camposCalculados = $this->calcularCamposContribuicao($contribuicoesParticipante, $item, $cota);

            // Determina se é benefício ativo ou passivo (baseado no valor)
            $isBeneficioAtivo = floatval($item->getValorContribuicao()) > 0;
            $isBeneficioPassivo = floatval($item->getValorContribuicao()) < 0;

            $pagtoBeneficio = [
                'contribuidor' => $item->getContribuidor(),
                'patrocinador' => $item->getPatrocinador(),
                'dtRecolhimento' => $item->getDtRecolhimento(),
                'dtAporte' => $item->getDtAporte(),
                'tipoContribuicao' => $item->getContribuicao() . ' - ' . $item->getMantenedorContribuicao(),
                'mantenedorContribuicao' => $item->getMantenedorContribuicao(),
                'valorContribuicao' => $this->formatarMoeda(floatval($item->getValorContribuicao())),
                'taxaCarregamento' => $this->formatarMoeda($camposCalculados['taxaCarregamento']),
                'fcbe' => $this->formatarMoeda($camposCalculados['fcbe']),
                'car' => $this->formatarMoeda($camposCalculados['car']),
                'ran' => $this->formatarMoeda($camposCalculados['ran']),
                'ras' => $this->formatarMoeda($camposCalculados['ras']),
                'ranCotas' => $camposCalculados['ranCotas'], // Mantém todas as casas decimais
                'rasCotas' => $camposCalculados['rasCotas'], // Mantém todas as casas decimais
                'rentabilidade' => $this->formatarMoeda($camposCalculados['rentabilidade']),
                'competencia' => $item->getMesCompetencia() . '/' . $item->getAnoCompetencia(),
                'mesCompetencia' => $item->getMesCompetencia(),
                'anoCompetencia' => $item->getAnoCompetencia(),
                'isPAGTOBENEFICIO' => true,
                'isBeneficioAtivo' => $isBeneficioAtivo,
                'isBeneficioPassivo' => $isBeneficioPassivo,
                'isCAR' => false,
                'isNAT' => false,
                'isBPD' => false,
                'isMULTA' => false,
                'isPortabilidade' => false,
                'grupoContribuicao' => $item->getGrupoContribuicao(),
            ];

            $resultado[] = $pagtoBeneficio;
        }

        return $resultado;
    }

    /**
     * Processa contribuições do tipo TRANSFERÊNCIA DE PERFIL
     * @param array $contribuicoesParticipante
     * @param float $cota
     * @return array
     */
    private function processarTransferenciaDePerfil(array $contribuicoesParticipante, float $cotaPerfil): array
    {
        try {
            $resultado = [];

            // Filtra apenas transferências de perfil
            $transferencias = array_filter($contribuicoesParticipante, function ($item) {
                return $item->getGrupoContribuicao() === 'TRANSFERÊNCIA DE PERFIL' ||
                    str_contains($item->getTipoContribuicao(), 'TRANSFERÊNCIA DE PERFIL');
            });
            if (empty($transferencias)) {
                return $resultado;
            }

            // Agrupa por competência e patrocinador para consolidar transferências
            $grupos = [];
            foreach ($transferencias as $item) {
                $chave = $item->getAnoCompetencia() . '_' . $item->getMesCompetencia() . '_' . $item->getPatrocinador();
                if (!isset($grupos[$chave])) {
                    $grupos[$chave] = [];
                }
                $grupos[$chave][] = $item;
            }
            foreach ($grupos as $grupo) {
                // Separa por perfil (anterior e novo) baseado no ID do perfil
                $perfis = [];
                foreach ($grupo as $item) {
                    $idPerfil = $item->getIdPerfil();
                    if (!isset($perfis[$idPerfil])) {
                        $perfis[$idPerfil] = [];
                    }
                    $perfis[$idPerfil][] = $item;
                }


                // Se há pelo menos 2 perfis diferentes, processa a transferência
                if (count($perfis) >= 2) {
                    try {
                        $perfilIds = array_keys($perfis);
                        $perfilAnterior = $perfis[$perfilIds[0]];
                        $perfilNovo = $perfis[$perfilIds[1]];


                        // Calcula perfil anterior usando o método calcularPerfilTransferencia
                        $dadosPerfilAnterior = $this->calcularPerfilTransferencia($perfilAnterior);

                        $dadosPerfilNovo = $this->calcularPerfilTransferencia($perfilNovo);

                        if ($dadosPerfilAnterior && $dadosPerfilNovo) {
                            $primeiroItem = reset($perfilAnterior);
                            $competenciaFormatada = str_pad($primeiroItem->getMesCompetencia(), 2, '0', STR_PAD_LEFT) . '/' . $primeiroItem->getAnoCompetencia();
                            $resultado[] = [
                                'patrocinador' => $primeiroItem->getPatrocinador(),
                                'competencia' => $competenciaFormatada,
                                'anoCompetencia' => $primeiroItem->getAnoCompetencia(),
                                'mesCompetencia' => $primeiroItem->getMesCompetencia(),
                                'dtRecolhimento' => $primeiroItem->getDtRecolhimento(),
                                'perfilAnterior' => [
                                    'idPerfil' => (int) $dadosPerfilAnterior['idPerfil'],
                                    'nmPerfil' => $dadosPerfilAnterior['nmPerfil'],
                                    'valorCota' => $dadosPerfilAnterior['valorCota'],
                                    'RAN_participante' => $dadosPerfilAnterior['RAN_participante'],
                                    'RAN_patrocinador' => $dadosPerfilAnterior['RAN_patrocinador'],
                                    'RAS_participante' => $dadosPerfilAnterior['RAS_participante']
                                ],
                                'perfilNovo' => [
                                    'idPerfil' => (int) $dadosPerfilNovo['idPerfil'],
                                    'nmPerfil' => $dadosPerfilNovo['nmPerfil'],
                                    'valorCota' => $dadosPerfilNovo['valorCota'],
                                    'RAN_participante' => $dadosPerfilNovo['RAN_participante'],
                                    'RAN_patrocinador' => $dadosPerfilNovo['RAN_patrocinador'],
                                    'RAS_participante' => $dadosPerfilNovo['RAS_participante']
                                ],
                                'dataTransferencia' => $primeiroItem->getDtAporte()
                            ];
                        }
                    } catch (\Exception $e) {
                        error_log('Erro ao processar transferência: ' . $e->getMessage());
                        error_log('Stack trace: ' . $e->getTraceAsString());
                    }
                }
            }

            return $resultado;
        } catch (\Exception $e) {
            // Log do erro para debug
            error_log('Erro em processarTransferenciaDePerfil: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return [];
        }
    }

    private function calcularPerfilTransferencia(array $contribuicoes): ?array
    {
        try {
            if (empty($contribuicoes)) {
                return null;
            }

            $totalRAN = 0;
            $totalRAS = 0;
            $ranParticipante = 0;
            $ranPatrocinador = 0;

            foreach ($contribuicoes as $contribuicao) {
                try {
                    $valor = abs((float) $contribuicao->getValorContribuicao());
                    $tipoValor = $contribuicao->getTipoValor() ?? '';
                    $mantenedor = $contribuicao->getContribuidor() ?? 'PARTICIPANTE';

                    // Para transferências de perfil, todos os valores FCBE são tratados como RAN
                    if ($tipoValor === 'FCBE') {
                        $totalRAN += $valor;
                        if ($mantenedor === 'PARTICIPANTE') {
                            $ranParticipante += $valor;
                        } else {
                            $ranPatrocinador += $valor;
                        }
                    } elseif ($tipoValor === 'RAN') {
                        $totalRAN += $valor;
                        if ($mantenedor === 'PARTICIPANTE') {
                            $ranParticipante += $valor;
                        } else {
                            $ranPatrocinador += $valor;
                        }
                    } elseif ($tipoValor === 'RAS') {
                        $totalRAS += $valor;
                    } else {
                        // Se não especificado, assume RAN
                        $totalRAN += $valor;
                        if ($mantenedor === 'PARTICIPANTE') {
                            $ranParticipante += $valor;
                        } else {
                            $ranPatrocinador += $valor;
                        }
                    }
                } catch (\Exception $e) {
                    error_log('Erro ao processar contribuição: ' . $e->getMessage());
                    continue;
                }
            }

            // Se não há separação por mantenedor, divide igualmente
            if ($ranParticipante == 0 && $ranPatrocinador == 0 && $totalRAN > 0) {
                $ranParticipante = $totalRAN / 2;
                $ranPatrocinador = $totalRAN / 2;
            }

            return [
                'idPerfil' => $contribuicoes[0]->getIdPerfil() ?? 0,
                'nmPerfil' => $contribuicoes[0]->getNmPerfil() ?? 'PERFIL',
                'valorCota' => $totalRAN + $totalRAS,
                'RAN_participante' => $ranParticipante,
                'RAN_patrocinador' => $ranPatrocinador,
                'RAS_participante' => $totalRAS
            ];
        } catch (\Exception $e) {
            error_log('Erro em calcularPerfilTransferencia: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return null;
        }
    }
}
