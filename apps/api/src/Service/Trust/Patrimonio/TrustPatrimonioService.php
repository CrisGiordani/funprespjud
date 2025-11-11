<?php

namespace App\Service\Trust\Patrimonio;

use App\DTO\Trust\Output\PatrimonioOutputDTO;
use App\Entity\Iris\Core\ParticipanteDiferencaPatrimonioLog;
use App\Helper\NumberHelper;
use App\Interface\Helpers\CalculationsHelperInterface;
use App\Interface\Iris\Service\Core\TrustCalculosInvestimentosServiceInterface;
use App\Interface\Trust\Repository\TrustPatrimonioRepositoryInterface;
use App\Interface\Trust\Service\TrustContribuicaoServiceInterface;
use App\Interface\Trust\Service\TrustCotasServiceInterface;
use App\Interface\Trust\Service\TrustPatrimonioServiceInterface;
use App\Service\Iris\Core\ParticipanteDiferencaPatrimonioLogServiceInterface;
use Psr\Log\LoggerInterface;

class TrustPatrimonioService implements TrustPatrimonioServiceInterface
{
    public function __construct(
        private readonly TrustContribuicaoServiceInterface $trustContribuicaoService,
        private readonly TrustCotasServiceInterface $trustCotasService,
        private readonly LoggerInterface $logger,
        private readonly TrustPatrimonioRepositoryInterface $trustPatrimonioRepository,
        private readonly CalculationsHelperInterface $calculationsHelper,
        private readonly ParticipanteDiferencaPatrimonioLogServiceInterface $participanteDiferencaPatrimonioLogService,
        private readonly TrustCalculosInvestimentosServiceInterface $trustCalculosInvestimentosService
    ) {}

    /**
     * Retorna o saldo do participante
     * @param string $cpf
     *
     * @return PatrimonioOutputDTO
     */
    public function getPatrimonio(string $cpf): PatrimonioOutputDTO
    {
        $contribuicoesParticipante = $this->trustContribuicaoService->getContribuicoesSaldo($cpf);
        $cotaAtual = $this->trustCotasService->getCotasAtual($cpf);
        $cota = $cotaAtual->getValor();
        // $cota = $cotaAtual['vlCota'];
        $saldo = [];
        $totalContribuidoParticipanteRan = 0;
        $totalContribuidoParticipanteRas = 0;
        $totalContribuidoPatrocinadorRan = 0;
        $totalCotasParticipanteRan = 0;
        $totalCotasParticipanteRas = 0;
        $totalCotasPatrocinadorRan = 0;

        foreach ($contribuicoesParticipante as $contribuicao) {
            switch ($contribuicao['idConta']) {
                case 1:
                    $totalCotasParticipanteRan += $contribuicao['totalCotas'];
                    $totalContribuidoParticipanteRan += $contribuicao['valorContribuicao'];
                    break;
                case 2:
                    $totalCotasPatrocinadorRan += $contribuicao['totalCotas'];
                    $totalContribuidoPatrocinadorRan += $contribuicao['valorContribuicao'];
                    break;
                default:
                    $totalCotasParticipanteRas += $contribuicao['totalCotas'];
                    $totalContribuidoParticipanteRas += $contribuicao['valorContribuicao'];
                    break;
            }
        }

        $totalCotas = bcadd(bcadd($totalCotasParticipanteRan, $totalCotasParticipanteRas, 12), $totalCotasPatrocinadorRan, 12);
        $totalContribuido = bcadd(bcadd($totalContribuidoParticipanteRan, $totalContribuidoParticipanteRas, 12), $totalContribuidoPatrocinadorRan, 12);
        $totalContribuidoParticipante = bcadd($totalContribuidoParticipanteRan, $totalContribuidoParticipanteRas, 12);
        $totalRentabilizadoParticipanteRan = bcmul($totalCotasParticipanteRan, $cota, 12);
        $totalRentabilizadoParticipanteRas = bcmul($totalCotasParticipanteRas, $cota, 12);
        $totalRentabilizadoPatrocinadorRan = bcmul($totalCotasPatrocinadorRan, $cota, 12);
        $totalRentabilizado = bcmul($totalCotas, $cota, 12);


        $percentualRentabilidadeParticipanteRan = $this->calculationsHelper->calculatePercentage($totalRentabilizadoParticipanteRan, $totalContribuidoParticipanteRan);
        $percentualRentabilidadeParticipanteRas = $this->calculationsHelper->calculatePercentage($totalRentabilizadoParticipanteRas, $totalContribuidoParticipanteRas);
        $percentualRentabilidadePatrocinadorRan = $this->calculationsHelper->calculatePercentage($totalRentabilizadoPatrocinadorRan, $totalContribuidoPatrocinadorRan);

        $saldo['contribuicaoNormalParticipanteRan']['totalContribuido'] = $totalContribuidoParticipanteRan;
        $saldo['contribuicaoNormalParticipanteRas']['totalContribuido'] = $totalContribuidoParticipanteRas;
        $saldo['contribuicaoNormalPatrocinadorRan']['totalContribuido'] = $totalContribuidoPatrocinadorRan;

        $saldo['contribuicaoNormalParticipanteRan']['totalRentabilizado'] = $totalRentabilizadoParticipanteRan;
        $saldo['contribuicaoNormalParticipanteRas']['totalRentabilizado'] = $totalRentabilizadoParticipanteRas;
        $saldo['contribuicaoNormalPatrocinadorRan']['totalRentabilizado'] = $totalRentabilizadoPatrocinadorRan;

        $saldo['contribuicaoNormalParticipanteRan']['percentualRentabilidade'] = $percentualRentabilidadeParticipanteRan;
        $saldo['contribuicaoNormalParticipanteRas']['percentualRentabilidade'] = $percentualRentabilidadeParticipanteRas;
        $saldo['contribuicaoNormalPatrocinadorRan']['percentualRentabilidade'] = $percentualRentabilidadePatrocinadorRan;
        $saldo['totalCotasParticipanteRan'] = $totalCotasParticipanteRan;
        $saldo['totalCotasParticipanteRas'] = $totalCotasParticipanteRas;
        $saldo['totalCotasPatrocinadorRan'] = $totalCotasPatrocinadorRan;

        $saldo['totalContribuidoParticipante'] = $totalContribuidoParticipante;
        $saldo['aumentoPatrimonialParticipante'] = bcadd($totalContribuidoPatrocinadorRan, bcsub($totalRentabilizado, $totalContribuido, 12), 12);

        $saldo['aumentoPatrimonialParticipantePercentual'] = $this->calculationsHelper->calculatePercentage($totalContribuidoParticipante, $saldo['aumentoPatrimonialParticipante']);

        $saldo['totalCotas'] = $totalCotas;
        $saldo['totalContribuido'] = $totalContribuido;

        $saldo['rentabilidade'] = bcsub($totalRentabilizado, $totalContribuido, 12);
        $saldo['rentabilidadePercentual'] = NumberHelper::round(
            $this->calculationsHelper->calculatePercentage(
                ($totalContribuidoParticipanteRan + $totalContribuidoParticipanteRas + $totalContribuidoPatrocinadorRan),
                (($totalRentabilizadoParticipanteRan + $totalRentabilizadoParticipanteRas + $totalRentabilizadoPatrocinadorRan) -
                    ($totalContribuidoParticipanteRan + $totalContribuidoParticipanteRas + $totalContribuidoPatrocinadorRan))
            )
        );

        $saldo['patrimonioTotal'] = $totalRentabilizado;

        $saldo['valorCota'] = $cota;

        return new PatrimonioOutputDTO($saldo);
    }

    /**
     * Busca o patrimônio evolução anual do participante
     *
     * @param string $cpf
     *
     * @return array
     */
    public function getPatrimonioEvolucaoAnual(string $cpf): array
    {
        try {
            $dados = $this->trustPatrimonioRepository->getPatrimonioEvolucaoAnual($cpf);
            $cota = $this->trustCotasService->getCotasAtual($cpf);
            $valorIndexador = $cota->getValor();
            $totalCotaAcumulada = 0;
            $retorno = [];
            foreach ($dados as $dado) {                
                $totalCotaAcumulada += $dado['qtCota'];
                $totalRentabilizado = $totalCotaAcumulada * $valorIndexador;
                $retorno[] = [
                    'ano' => $dado['ano'],
                    'totalRentabilizado' => $totalRentabilizado,
                ];
                
            }

            return $retorno;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function buscarDadosAnuais(string $cpf): array
    {
        try {
            $evolucaoPatrimonioAnual =  $this->trustPatrimonioRepository->getPatrimonioEvolucaoAnual($cpf);
            $perfilPlanoParticipante = $this->trustCotasService->getCotasAtual($cpf)->getIndexador();
            $meuInvestimento = $this->prepareDadosMeuInvestimento($this->trustPatrimonioRepository->getMeuInvestimento($cpf, $perfilPlanoParticipante));
            $primeiraContribuicao = date_create($meuInvestimento['dados']['contribuicoes'][0]['dtPagamento']);
            $now = (new \DateTime())->modify('-1 month');
            $interval = $now->diff($primeiraContribuicao);
            $cumpreRequisitoTempoParaExibirCalculos = $interval->y > 0; //calculos so pra quem tem mais de 12 meses.
            $evolucaoPatrimonioUltimoAno = end($evolucaoPatrimonioAnual);
            $saldoTotalPatrimonio = $evolucaoPatrimonioUltimoAno['vlNominal'];

            $this->verificaDiferencaPatrimonioAtualizado($cpf, $saldoTotalPatrimonio, $meuInvestimento['dados']['totais']['patrimonioAtualizado']);
            $valoresCalculados = $meuInvestimento['dados']['totais'];
            $valoresCalculados['cumpreRequisitoTempoParaExibirCalculos'] = $cumpreRequisitoTempoParaExibirCalculos;
            if ($cumpreRequisitoTempoParaExibirCalculos) {

                //* cálculo default
                //* 0 para default; 1 para cdi; 2 para pb

                $aaRi = $this->trustCalculosInvestimentosService->atingirMeta(
                    dados: $meuInvestimento['dados'],
                    tipo: 'RI',
                    codigoTipoCota: 0,
                    a: 0.01,
                    b: 10
                ); // TODO COLUNA X3

                $aaVpp = $this->trustCalculosInvestimentosService->atingirMeta(
                    dados: $meuInvestimento['dados'],
                    tipo: 'VPP',
                    codigoTipoCota: 0,
                    a: 0.01,
                    b: 10
                ); // TODO COLUNA Y3

                $prazoMedioContribuicoes = (252 * (log((1 + ($meuInvestimento['dados']['totais']['apRi']))) / log((1 + $aaRi)))) / 252;

                //*cdi

                $aaRi_CDI = $this->trustCalculosInvestimentosService->atingirMeta(
                    dados: $meuInvestimento['dados'],
                    tipo: 'RI',
                    codigoTipoCota: 1,
                    a: 0.01,
                    b: 10
                );
            
                $aaVpp_CDI =  $this->trustCalculosInvestimentosService->atingirMeta($meuInvestimento['dados'], 'VPP', 0.01, 10, 1);
                //*pb
                $aaRi_PB = 0.10; //*$this->trustCalculosInvestimentosService->atingirMeta($meuInvestimento['dados'], 'RI', 0.01, 10, 2);

                $aaVpp_PB = $this->trustCalculosInvestimentosService->atingirMeta($meuInvestimento['dados'], 'VPP', 0.01, 10, 2);

                $compRI_CDI = $this->formulaComparaativo($aaRi, $aaRi_CDI);
                $compVPP_CDI = $this->formulaComparaativo($aaVpp, $aaRi_CDI);
                $compRI_PB = $this->formulaComparaativo($aaRi, $aaRi_PB);
                $compVPP_PB = $this->formulaComparaativo($aaVpp, $aaRi_PB);
                $valoresCalculados['compRI_CDI'] = round($compRI_CDI);
                $valoresCalculados['compVPP_CDI'] = round($compVPP_CDI);
                $valoresCalculados['compRI_PB'] = round($compRI_PB);
                $valoresCalculados['compVPP_PB'] = round($compVPP_PB);

                $patrimonioAtualizadoEvolucao = number_format(round($saldoTotalPatrimonio, 2), 2, ',', '.');
                $valoresCalculados['patrimonioAtualizado'] = $patrimonioAtualizadoEvolucao;
                $valoresCalculados['apRi'] = number_format(round($valoresCalculados['apRi'] * 100, 2), 2, ',', '');
                $valoresCalculados['apVpp'] = number_format(round($valoresCalculados['apVpp'] * 100, 2), 2, ',', '');
                $valoresCalculados['aaRi'] = number_format(round($aaRi * 100, 2), 2, ',', '');
                $valoresCalculados['aaVpp'] = number_format(round($aaVpp * 100, 2), 2, ',', '');

                $valoresCalculados['patrimonioAtualizado_CDI'] = $meuInvestimento['dados']['totais']['patrimonioAtualizado_CDI'];
                $valoresCalculados['apRi_CDI'] = number_format(round($valoresCalculados['apRi_CDI'] * 100, 2), 2, ',', '');
                $valoresCalculados['apVpp_CDI'] = number_format(round($valoresCalculados['apVpp_CDI'] * 100, 2), 2, ',', '');
                $valoresCalculados['aaRi_CDI'] = number_format(round($aaRi_CDI * 100, 2), 2, ',', '');
                $valoresCalculados['aaVpp_CDI'] = number_format(round($aaVpp_CDI * 100, 2), 2, ',', '');

                $valoresCalculados['patrimonioAtualizado_PB'] = $meuInvestimento['dados']['totais']['patrimonioAtualizado_PB'];
                $valoresCalculados['apRi_PB'] = number_format(round($valoresCalculados['apRi_PB'] * 100, 2), 2, ',', '');
                $valoresCalculados['apVpp_PB'] = number_format(round($valoresCalculados['apVpp_PB'] * 100, 2), 2, ',', '');
                $valoresCalculados['aaRi_PB'] = number_format(round($aaRi_PB * 100, 2), 2, ',', '');
                $valoresCalculados['aaVpp_PB'] = number_format(round($aaVpp_PB * 100, 2), 2, ',', '');

                $valoresCalculados['prazoMedioContribuicoes'] = number_format(round($prazoMedioContribuicoes, 2), 2, ',', '');
            }
            $valoresCalculados['evolucaoPatrimonio'] = $saldoTotalPatrimonio;
            // dump($valoresCalculados);
            // die('passou');
            return $valoresCalculados;
        } catch (\Exception $exception) {
            dump($exception->getMessage());
            // die('Caiu Na Exception!!!');
            $this->logger->error($exception->getMessage());

            throw $exception;
        }
    }

    public function verificaDiferencaPatrimonioAtualizado($cpf, $patrimonioAtualizadoEvolucao, $patrimonioAtualizado)
    {

        $patrimonioAtualizadoRound = round($patrimonioAtualizado, 2);
        $patrimonioAtualizadoEvolucaoRound = round($patrimonioAtualizadoEvolucao, 2);

        if (($patrimonioAtualizadoRound > $patrimonioAtualizadoEvolucaoRound) ||
            ($patrimonioAtualizadoRound < $patrimonioAtualizadoEvolucaoRound)
        ) {

            $logRepository = $this->participanteDiferencaPatrimonioLogService->findByCpf($cpf);
            $log = $logRepository;

            if (!$log) $log = new ParticipanteDiferencaPatrimonioLog();

            $log->setCpf($cpf);
            $log->setVlPatrimonioComposicao($patrimonioAtualizadoRound);
            $log->setVlPatrimonioEvolucao($patrimonioAtualizadoEvolucaoRound);
            $data = new \DateTime();
            $log->setDtLog($data);

            $this->participanteDiferencaPatrimonioLogService->save($log);
        }
    }

     /**
     * @param $dados
     * @return array
     */
    public function prepareDadosMeuInvestimento($dados): array
    {

        /* TODO
            aal = Aporte Adicional Liquido - É a contribuição do patrocinador descontado as taxas como por exemplo FCBE
            Da coluna A6 DATA_PGTO até U6 Rent. Patrocinador - São os dados que vem da SP RentabilidadeParticXTIR

        */
        try {
            // TODO Variáveis de controle
            $i = 0;
            $preparedDados = array();
            $dtLinhaAnterior = '';
            $dtUltimaCotaDateTime = new \DateTime($dados[0]['DT_ULTIMA_COTA_PLANO']);
            $diasUteisUltimaCota = $dados[0]['DIAS_UTEIS'];

            // TODO COLUNAS K5, L5, M5
            $totalFluxo = 0;
            $totalFluxoVpp = 0;

            $totalFluxo_CDI = 0;
            $totalFluxoVpp_CDI = 0;

            $totalFluxo_PB = 0;
            $totalFluxoVpp_PB = 0;

            $contribParticipante = 0; // TODO COLUNA AC8
            $rentabilidadeParticipante = 0; // TODO COLUNA AC10
            $aal = 0; // TODO COLUNA AC9
            $rentabilidadeAal = 0; // TODO COLUNA AC11

            $contribParticipante_CDI = 0;
            $rentabilidadeParticipante_CDI = 0;
            $aal_CDI = 0;
            $rentabilidadeAal_CDI = 0;

            $contribParticipante_PB = 0;
            $rentabilidadeParticipante_PB = 0;
            $aal_PB = 0;
            $rentabilidadeAal_PB = 0;

            // TODO Utilizados no metodo de atingir meta
            $totalFluxoPorData = 0;
            $totalFluxoVppPorData = 0;

            $totalFluxoPorData_CDI = 0;
            $totalFluxoVppPorData_CDI = 0;

            $totalFluxoPorData_PB = 0;
            $totalFluxoVppPorData_PB = 0;

            foreach ($dados as $dado) {
                $dtPagamentoDateTime = new \DateTime($dado['DATA_PGTO']);
                if ($dtPagamentoDateTime > $dtUltimaCotaDateTime) break;

                if ($dtLinhaAnterior == '') $dtLinhaAnterior = $dado['DATA_PGTO'];
                if ($dtLinhaAnterior == $dado['DATA_PGTO']) {
                    $totalFluxoPorData += (float) $dado['FLUXO'];
                    $totalFluxoVppPorData += (float) $dado['FLUXO_VPP'];

                    $totalFluxoPorData_CDI += (float) $dado['FLUXO_CDI'];
                    $totalFluxoVppPorData_CDI += (float) $dado['FLUXO_VPP_CDI'];

                    $totalFluxoPorData_PB += (float) $dado['FLUXO_PB'];
                    $totalFluxoVppPorData_PB += (float) $dado['FLUXO_VPP_PB'];

                } else {
                    $totalFluxoPorData = (float) $dado['FLUXO'];
                    $totalFluxoVppPorData = (float) $dado['FLUXO_VPP'];

                    $totalFluxoPorData_CDI = (float) $dado['FLUXO_CDI'];
                    $totalFluxoVppPorData_CDI = (float) $dado['FLUXO_VPP_CDI'];

                    $totalFluxoPorData_PB = (float) $dado['FLUXO_PB'];
                    $totalFluxoVppPorData_PB = (float) $dado['FLUXO_VPP_PB'];
                }
         
                $preparedDados['contribuicoes'][$i]['cpf'] = $dado['CPF'];
                $preparedDados['contribuicoes'][$i]['dtPagamento'] = $dado['DATA_PGTO'];
                $preparedDados['contribuicoes'][$i]['fluxo'] = (float) $dado['FLUXO'];
                $preparedDados['contribuicoes'][$i]['fluxoVpp'] = (float) $dado['FLUXO_VPP'];
                $preparedDados['contribuicoes'][$i]['totalFluxoPorData'] = $totalFluxoPorData;
                $preparedDados['contribuicoes'][$i]['totalFluxoVppPorData'] = $totalFluxoVppPorData;
                $preparedDados['contribuicoes'][$i]['qtCotas'] = (float) $dado['QTD_COTAS'];
                $preparedDados['contribuicoes'][$i]['qtCotasAcumuladas'] = (float) $dado['QTD_COTAS_ACUMULADAS'];
                $preparedDados['contribuicoes'][$i]['patrimonio'] = (float) $dado['PATRIMONIO'];
                $preparedDados['contribuicoes'][$i]['fluxoRentabilidade'] = (float) $dado['FLUXO_RENTABILIDADE'];
                $preparedDados['contribuicoes'][$i]['rentabilidade'] = (float) $dado['RENTABILIDADE'];
                $preparedDados['contribuicoes'][$i]['RENT_PARTICIPANTE'] = (float) $dado['RENT_PARTICIPANTE'];
                $preparedDados['contribuicoes'][$i]['RENT_PATROCINADOR'] = (float) $dado['RENT_PATROCINADOR'];

                //cdi
                $preparedDados['contribuicoes'][$i]['fluxo_CDI'] = (float) $dado['FLUXO_CDI'];
                $preparedDados['contribuicoes'][$i]['fluxoVpp_CDI'] = (float) $dado['FLUXO_VPP_CDI'];
                $preparedDados['contribuicoes'][$i]['totalFluxoPorData_CDI'] = $totalFluxoPorData_CDI;
                $preparedDados['contribuicoes'][$i]['totalFluxoVppPorData_CDI'] = $totalFluxoVppPorData_CDI;
                $preparedDados['contribuicoes'][$i]['qtCotas_CDI'] = (float) $dado['QTD_COTAS_CDI'];
                $preparedDados['contribuicoes'][$i]['qtCotasAcumuladas_CDI'] = (float) $dado['QTD_COTAS_ACUMULADAS_CDI'];
                $preparedDados['contribuicoes'][$i]['patrimonio_CDI'] = (float) $dado['PATRIMONIO_CDI'];
                $preparedDados['contribuicoes'][$i]['fluxoRentabilidade_CDI'] = (float) $dado['FLUXO_RENTABILIDADE_CDI'];
                $preparedDados['contribuicoes'][$i]['rentabilidade_CDI'] = (float) $dado['RENTABILIDADE_CDI'];
                $preparedDados['contribuicoes'][$i]['RENT_PARTICIPANTE_CDI'] = (float) $dado['RENT_PARTICIPANTE_CDI'];
                $preparedDados['contribuicoes'][$i]['RENT_PATROCINADOR_CDI'] = (float) $dado['RENT_PATROCINADOR_CDI'];

                //PB
                $preparedDados['contribuicoes'][$i]['fluxo_PB'] = (float) $dado['FLUXO_PB'];
                $preparedDados['contribuicoes'][$i]['fluxoVpp_PB'] = (float) $dado['FLUXO_VPP_PB'];
                $preparedDados['contribuicoes'][$i]['totalFluxoPorData_PB'] = $totalFluxoPorData_PB;
                $preparedDados['contribuicoes'][$i]['totalFluxoVppPorData_PB'] = $totalFluxoVppPorData_PB;
                $preparedDados['contribuicoes'][$i]['qtCotas_PB'] = (float) $dado['QTD_COTAS_PB'];
                $preparedDados['contribuicoes'][$i]['qtCotasAcumuladas_PB'] = (float) $dado['QTD_COTAS_ACUMULADAS_PB'];
                $preparedDados['contribuicoes'][$i]['patrimonio_PB'] = (float) $dado['PATRIMONIO_PB'];
                $preparedDados['contribuicoes'][$i]['fluxoRentabilidade_PB'] = (float) $dado['FLUXO_RENTABILIDADE_PB'];
                $preparedDados['contribuicoes'][$i]['rentabilidade_PB'] = (float) $dado['RENTABILIDADE_PB'];
                $preparedDados['contribuicoes'][$i]['RENT_PARTICIPANTE_PB'] = (float) $dado['RENT_PARTICIPANTE_PB'];
                $preparedDados['contribuicoes'][$i]['RENT_PATROCINADOR_PB'] = (float) $dado['RENT_PATROCINADOR_PB'];

                $preparedDados['contribuicoes'][$i]['diasUteisApartirPrimeiraContribuicao'] = (int) $dado['DIAS_UTEIS_INVERTIDO'];
                $preparedDados['contribuicoes'][$i]['diasUteisUltimaCota'] = (int) $diasUteisUltimaCota;
                $preparedDados['contribuicoes'][$i]['dtPagamentoDateTime'] = $dtPagamentoDateTime;
                $preparedDados['contribuicoes'][$i]['dtUltimaCotaDateTime'] = $dtUltimaCotaDateTime;

                $totalFluxo += $preparedDados['contribuicoes'][$i]['fluxo'];
                $totalFluxoVpp += $preparedDados['contribuicoes'][$i]['fluxoVpp'];

                //cdi

                $totalFluxo_CDI += $preparedDados['contribuicoes'][$i]['fluxo_CDI'];
                $totalFluxoVpp_CDI += $preparedDados['contribuicoes'][$i]['fluxoVpp_CDI'];

                //pb

                $totalFluxo_PB += $preparedDados['contribuicoes'][$i]['fluxo_PB'];
                $totalFluxoVpp_PB += $preparedDados['contribuicoes'][$i]['fluxoVpp_PB'];

                if ($dado['MANTENEDOR'] == 'PARTICIPANTE' || $dado['MANTENEDOR'] == 'AUTOPATROCINADO') {
                    $contribParticipante += $preparedDados['contribuicoes'][$i]['fluxo'];
                    $rentabilidadeParticipante += $preparedDados['contribuicoes'][$i]['rentabilidade'];

                    //cdi
                    $contribParticipante_CDI += $preparedDados['contribuicoes'][$i]['fluxo_CDI'];
                    $rentabilidadeParticipante_CDI += $preparedDados['contribuicoes'][$i]['rentabilidade_CDI'];

                    //pb
                    $contribParticipante_PB += $preparedDados['contribuicoes'][$i]['fluxo_PB'];
                    $rentabilidadeParticipante_PB += $preparedDados['contribuicoes'][$i]['rentabilidade_PB'];
                }

                if ($dado['MANTENEDOR'] == 'PATROCINADOR') {
                    $aal += $preparedDados['contribuicoes'][$i]['fluxo'];
                    $rentabilidadeAal += $preparedDados['contribuicoes'][$i]['RENT_PATROCINADOR'];
                    //cdi
                    $aal_CDI += $preparedDados['contribuicoes'][$i]['fluxo_CDI'];
                    $rentabilidadeAal_CDI += $preparedDados['contribuicoes'][$i]['RENT_PATROCINADOR_CDI'];
                    //pb
                    $aal_PB += $preparedDados['contribuicoes'][$i]['fluxo_PB'];
                    $rentabilidadeAal_PB += $preparedDados['contribuicoes'][$i]['RENT_PATROCINADOR_PB'];
                }
                $i++;
                $dtLinhaAnterior = $dado['DATA_PGTO'];
            }

            $preparedDados['totais']['contribParticipante'] = $contribParticipante;
            $preparedDados['totais']['aal'] = $aal;
            $preparedDados['totais']['rentabilidadeParticipante'] = $rentabilidadeParticipante;
            $preparedDados['totais']['rentabilidadeAal'] = $rentabilidadeAal;

            $totalFluxoRentabilidade = $contribParticipante + $rentabilidadeParticipante + $aal + $rentabilidadeAal;
            $preparedDados['totais']['patrimonioAtualizado'] = $totalFluxoRentabilidade; // TODO COLUNA U2 E AC12
            $preparedDados['totais']['apRi'] = (($totalFluxoRentabilidade / $totalFluxo) - 1); // TODO COLUNA X2
            $preparedDados['totais']['apVpp'] = (($totalFluxoRentabilidade / $totalFluxoVpp) - 1); // TODO COLUNA Y2

            //CDI
            $preparedDados['totais']['contribParticipante_CDI'] = $contribParticipante_CDI;
            $preparedDados['totais']['aal_CDI'] = $aal_CDI;
            $preparedDados['totais']['rentabilidadeParticipante_CDI'] = $rentabilidadeParticipante_CDI;
            $preparedDados['totais']['rentabilidadeAal_CDI'] = $rentabilidadeAal_CDI;
            $totalFluxoRentabilidade_CDI = $contribParticipante_CDI + $rentabilidadeParticipante_CDI + $aal_CDI + $rentabilidadeAal_CDI;
            $preparedDados['totais']['patrimonioAtualizado_CDI'] = $totalFluxoRentabilidade_CDI;
            $preparedDados['totais']['apRi_CDI'] = (($totalFluxoRentabilidade_CDI / $totalFluxo_CDI) - 1);
            $preparedDados['totais']['apVpp_CDI'] = (($totalFluxoRentabilidade_CDI / $totalFluxoVpp_CDI) - 1);
//
//            //PB
            $preparedDados['totais']['contribParticipante_PB'] = $contribParticipante_PB;
            $preparedDados['totais']['aal_PB'] = $aal_PB;
            $preparedDados['totais']['rentabilidadeParticipante_PB'] = $rentabilidadeParticipante_PB;
            $preparedDados['totais']['rentabilidadeAal_PB'] = $rentabilidadeAal_PB;
            $totalFluxoRentabilidade_PB = $contribParticipante_PB + $rentabilidadeParticipante_PB + $aal_PB + $rentabilidadeAal_PB;
            $preparedDados['totais']['patrimonioAtualizado_PB'] = $totalFluxoRentabilidade_PB;
            $preparedDados['totais']['apRi_PB'] = (($totalFluxoRentabilidade_PB / $totalFluxo_PB) - 1);
            $preparedDados['totais']['apVpp_PB'] = (($totalFluxoRentabilidade_PB / $totalFluxoVpp_PB) - 1);

//            Var_dump($preparedDados);die;

            return [
                'erro' => 0,
                'mensagem' => '',
                'dados' => $preparedDados
            ];
        } catch (\Exception $e) {
//            var_dump($e->getMessage());die;
            return [
                'erro' => 1,
                'mensagem' => $e->getMessage(),
                'dados' => []
            ];
        }
    }


    private function prepareMeuInvestimentoTeste(array $dados): array
    {
        try {
            $preparedDados = [];
            $dtUltimaCotaDateTime = new \DateTime($dados[0]['DT_ULTIMA_COTA_PLANO']);
            $diasUteisUltimaCota = $dados[0]['DIAS_UTEIS'];

            // Processar dados por tipo de índice

            $reservaData = $this->processReservaData($dados, $dtUltimaCotaDateTime, $diasUteisUltimaCota);
            $cdiData = $this->processCdiData($dados, $dtUltimaCotaDateTime, $diasUteisUltimaCota);
            $pbData = $this->processPbData($dados, $dtUltimaCotaDateTime, $diasUteisUltimaCota);

            // Combinar dados processados
            $preparedDados = $this->combineProcessedData($reservaData, $cdiData, $pbData);

            return [
                'erro' => 0,
                'mensagem' => '',
                'dados' => $preparedDados
            ];
        } catch (\Exception $e) {
            return [
                'erro' => 1,
                'mensagem' => $e->getMessage(),
                'dados' => []
            ];
        }
    }

    /**
     * Processa dados do índice Reserva
     */
    private function processReservaData(array $dados, \DateTime $dtUltimaCotaDateTime, int $diasUteisUltimaCota): array
    {
        $i = 0;
        $dtLinhaAnterior = '';
        $totalFluxo = 0;
        $totalFluxoVpp = 0;
        $contribParticipante = 0;
        $rentabilidadeParticipante = 0;
        $aal = 0;
        $rentabilidadeAal = 0;
        $totalFluxoPorData = 0;
        $totalFluxoVppPorData = 0;
        $contribuicoes = [];

        foreach ($dados as $dado) {

            $dtPagamentoDateTime = new \DateTime($dado['DATA_PGTO']);
            if ($dtPagamentoDateTime > $dtUltimaCotaDateTime) break;

            // Processar fluxo por data
            $fluxoData = $this->processFluxoPorData($dado, $dtLinhaAnterior, $totalFluxoPorData, $totalFluxoVppPorData);
            $totalFluxoPorData = $fluxoData['totalFluxo'];
            $totalFluxoVppPorData = $fluxoData['totalFluxoVpp'];

            // Preparar dados da contribuição
            $contribuicoes[$i] = $this->prepareContribuicaoReserva($dado, $dtPagamentoDateTime, $dtUltimaCotaDateTime, $diasUteisUltimaCota, $totalFluxoPorData, $totalFluxoVppPorData);

            // Acumular totais
            $totalFluxo += $contribuicoes[$i]['fluxo'];
            $totalFluxoVpp += $contribuicoes[$i]['fluxoVpp'];

            // Processar por mantenedor
            $mantenedorData = $this->processMantenedorReserva($dado, $contribuicoes[$i], $contribParticipante, $rentabilidadeParticipante, $aal, $rentabilidadeAal);
            $contribParticipante = $mantenedorData['contribParticipante'];
            $rentabilidadeParticipante = $mantenedorData['rentabilidadeParticipante'];
            $aal = $mantenedorData['aal'];
            $rentabilidadeAal = $mantenedorData['rentabilidadeAal'];

            $i++;
            $dtLinhaAnterior = $dado['DATA_PGTO'];
        }

        return [
            'contribuicoes' => $contribuicoes,
            'totais' => $this->calculateTotaisReserva($totalFluxo, $totalFluxoVpp, $contribParticipante, $rentabilidadeParticipante, $aal, $rentabilidadeAal)
        ];
    }

    /**
     * Processa dados do índice CDI
     */
    private function processCdiData(array $dados, \DateTime $dtUltimaCotaDateTime, int $diasUteisUltimaCota): array
    {
        $i = 0;
        $dtLinhaAnterior = '';
        $totalFluxo = 0;
        $totalFluxoVpp = 0;
        $contribParticipante = 0;
        $rentabilidadeParticipante = 0;
        $aal = 0;
        $rentabilidadeAal = 0;
        $totalFluxoPorData = 0;
        $totalFluxoVppPorData = 0;
        $contribuicoes = [];

        foreach ($dados as $dado) {
            $dtPagamentoDateTime = new \DateTime($dado['DATA_PGTO']);
            if ($dtPagamentoDateTime > $dtUltimaCotaDateTime) break;

            // Processar fluxo por data CDI
            $fluxoData = $this->processFluxoPorDataCdi($dado, $dtLinhaAnterior, $totalFluxoPorData, $totalFluxoVppPorData);
            $totalFluxoPorData = $fluxoData['totalFluxo'];
            $totalFluxoVppPorData = $fluxoData['totalFluxoVpp'];

            // Preparar dados da contribuição CDI
            $contribuicoes[$i] = $this->prepareContribuicaoCdi($dado, $dtPagamentoDateTime, $dtUltimaCotaDateTime, $diasUteisUltimaCota, $totalFluxoPorData, $totalFluxoVppPorData);

            // Acumular totais CDI
            $totalFluxo += $contribuicoes[$i]['fluxo_CDI'];
            $totalFluxoVpp += $contribuicoes[$i]['fluxoVpp_CDI'];

            // Processar por mantenedor CDI
            $mantenedorData = $this->processMantenedorCdi($dado, $contribuicoes[$i], $contribParticipante, $rentabilidadeParticipante, $aal, $rentabilidadeAal);
            $contribParticipante = $mantenedorData['contribParticipante'];
            $rentabilidadeParticipante = $mantenedorData['rentabilidadeParticipante'];
            $aal = $mantenedorData['aal'];
            $rentabilidadeAal = $mantenedorData['rentabilidadeAal'];

            $i++;
            $dtLinhaAnterior = $dado['DATA_PGTO'];
        }

        return [
            'contribuicoes' => $contribuicoes,
            'totais' => $this->calculateTotaisCdi($totalFluxo, $totalFluxoVpp, $contribParticipante, $rentabilidadeParticipante, $aal, $rentabilidadeAal)
        ];
    }

    /**
     * Processa dados do índice PB
     */
    private function processPbData(array $dados, \DateTime $dtUltimaCotaDateTime, int $diasUteisUltimaCota): array
    {
        $i = 0;
        $dtLinhaAnterior = '';
        $totalFluxo = 0;
        $totalFluxoVpp = 0;
        $contribParticipante = 0;
        $rentabilidadeParticipante = 0;
        $aal = 0;
        $rentabilidadeAal = 0;
        $totalFluxoPorData = 0;
        $totalFluxoVppPorData = 0;
        $contribuicoes = [];

        foreach ($dados as $dado) {
            $dtPagamentoDateTime = new \DateTime($dado['DATA_PGTO']);
            if ($dtPagamentoDateTime > $dtUltimaCotaDateTime) break;

            // Processar fluxo por data PB
            $fluxoData = $this->processFluxoPorDataPb($dado, $dtLinhaAnterior, $totalFluxoPorData, $totalFluxoVppPorData);
            $totalFluxoPorData = $fluxoData['totalFluxo'];
            $totalFluxoVppPorData = $fluxoData['totalFluxoVpp'];

            // Preparar dados da contribuição PB
            $contribuicoes[$i] = $this->prepareContribuicaoPb($dado, $dtPagamentoDateTime, $dtUltimaCotaDateTime, $diasUteisUltimaCota, $totalFluxoPorData, $totalFluxoVppPorData);

            // Acumular totais PB
            $totalFluxo += $contribuicoes[$i]['fluxo_PB'];
            $totalFluxoVpp += $contribuicoes[$i]['fluxoVpp_PB'];

            // Processar por mantenedor PB
            $mantenedorData = $this->processMantenedorPb($dado, $contribuicoes[$i], $contribParticipante, $rentabilidadeParticipante, $aal, $rentabilidadeAal);
            $contribParticipante = $mantenedorData['contribParticipante'];
            $rentabilidadeParticipante = $mantenedorData['rentabilidadeParticipante'];
            $aal = $mantenedorData['aal'];
            $rentabilidadeAal = $mantenedorData['rentabilidadeAal'];

            $i++;
            $dtLinhaAnterior = $dado['DATA_PGTO'];
        }

        return [
            'contribuicoes' => $contribuicoes,
            'totais' => $this->calculateTotaisPb($totalFluxo, $totalFluxoVpp, $contribParticipante, $rentabilidadeParticipante, $aal, $rentabilidadeAal)
        ];
    }

    /**
     * Processa fluxo por data para Reserva
     */
    private function processFluxoPorData(array $dado, string $dtLinhaAnterior, float $totalFluxoPorData, float $totalFluxoVppPorData): array
    {
        if ($dtLinhaAnterior == '') {
            $dtLinhaAnterior = $dado['DATA_PGTO'];
        }

        if ($dtLinhaAnterior == $dado['DATA_PGTO']) {
            $totalFluxoPorData += (float) $dado['FLUXO'];
            $totalFluxoVppPorData += (float) $dado['FLUXO_VPP'];
        } else {
            $totalFluxoPorData = (float) $dado['FLUXO'];
            $totalFluxoVppPorData = (float) $dado['FLUXO_VPP'];
        }

        return [
            'totalFluxo' => $totalFluxoPorData,
            'totalFluxoVpp' => $totalFluxoVppPorData,
        ];
    }

    /**
     * Processa fluxo por data para CDI
     */
    private function processFluxoPorDataCdi(array $dado, string $dtLinhaAnterior, float $totalFluxoPorData, float $totalFluxoVppPorData): array
    {
        if ($dtLinhaAnterior == '') {
            $dtLinhaAnterior = $dado['DATA_PGTO'];
        }

        if ($dtLinhaAnterior == $dado['DATA_PGTO']) {
            $totalFluxoPorData += (float) $dado['FLUXO_CDI'];
            $totalFluxoVppPorData += (float) $dado['FLUXO_VPP_CDI'];
        } else {
            $totalFluxoPorData = (float) $dado['FLUXO_CDI'];
            $totalFluxoVppPorData = (float) $dado['FLUXO_VPP_CDI'];
        }

        return [
            'totalFluxo' => $totalFluxoPorData,
            'totalFluxoVpp' => $totalFluxoVppPorData,
        ];
    }

    /**
     * Processa fluxo por data para PB
     */
    private function processFluxoPorDataPb(array $dado, string $dtLinhaAnterior, float $totalFluxoPorData, float $totalFluxoVppPorData): array
    {
        if ($dtLinhaAnterior == '') {
            $dtLinhaAnterior = $dado['DATA_PGTO'];
        }

        if ($dtLinhaAnterior == $dado['DATA_PGTO']) {
            $totalFluxoPorData += (float) $dado['FLUXO_PB'];
            $totalFluxoVppPorData += (float) $dado['FLUXO_VPP_PB'];
        } else {
            $totalFluxoPorData = (float) $dado['FLUXO_PB'];
            $totalFluxoVppPorData = (float) $dado['FLUXO_VPP_PB'];
        }

        return [
            'totalFluxo' => $totalFluxoPorData,
            'totalFluxoVpp' => $totalFluxoVppPorData,
        ];
    }

    /**
     * Prepara dados da contribuição para Reserva
     */
    private function prepareContribuicaoReserva(array $dado, \DateTime $dtPagamentoDateTime, \DateTime $dtUltimaCotaDateTime, int $diasUteisUltimaCota, float $totalFluxoPorData, float $totalFluxoVppPorData): array
    {

        return [
            'cpf' => $dado['CPF'],
            'dtPagamento' => $dado['DATA_PGTO'],
            'fluxo' => (float) $dado['FLUXO'],
            'fluxoVpp' => (float) $dado['FLUXO_VPP'],
            'totalFluxoPorData' => $totalFluxoPorData,
            'totalFluxoVppPorData' => $totalFluxoVppPorData,
            'qtCotas' => (float) $dado['QTD_COTAS'],
            'qtCotasAcumuladas' => (float) $dado['QTD_COTAS_ACUMULADAS'],
            'patrimonio' => (float) $dado['PATRIMONIO'],
            'fluxoRentabilidade' => (float) $dado['FLUXO_RENTABILIDADE'],
            'rentabilidade' => (float) $dado['RENTABILIDADE'],
            'RENT_PARTICIPANTE' => (float) ($dado['RENT_PARTICIPANTE'] ?? 0),
            'RENT_PATROCINADOR' => (float) ($dado['RENT_PATROCINADOR'] ?? 0),
            'diasUteisApartirPrimeiraContribuicao' => (int) $dado['DIAS_UTEIS_INVERTIDO'],
            'diasUteisUltimaCota' => (int) $diasUteisUltimaCota,
            'dtPagamentoDateTime' => $dtPagamentoDateTime,
            'dtUltimaCotaDateTime' => $dtUltimaCotaDateTime
        ];
    }

    /**
     * Prepara dados da contribuição para CDI
     */
    private function prepareContribuicaoCdi(array $dado, \DateTime $dtPagamentoDateTime, \DateTime $dtUltimaCotaDateTime, int $diasUteisUltimaCota, float $totalFluxoPorData, float $totalFluxoVppPorData): array
    {
        return [
            'fluxo_CDI' => (float) $dado['FLUXO_CDI'],
            'fluxoVpp_CDI' => (float) $dado['FLUXO_VPP_CDI'],
            'totalFluxoPorData_CDI' => $totalFluxoPorData,
            'totalFluxoVppPorData_CDI' => $totalFluxoVppPorData,
            'qtCotas_CDI' => (float) $dado['QTD_COTAS_CDI'],
            'qtCotasAcumuladas_CDI' => (float) $dado['QTD_COTAS_ACUMULADAS_CDI'],
            'patrimonio_CDI' => (float) $dado['PATRIMONIO_CDI'],
            'fluxoRentabilidade_CDI' => (float) $dado['FLUXO_RENTABILIDADE_CDI'],
            'rentabilidade_CDI' => (float) $dado['RENTABILIDADE_CDI'],
            'RENT_PARTICIPANTE_CDI' => (float) ($dado['RENT_PARTICIPANTE_CDI'] ?? 0),
            'RENT_PATROCINADOR_CDI' => (float) ($dado['RENT_PATROCINADOR_CDI'] ?? 0)
        ];
    }

    /**
     * Prepara dados da contribuição para PB
     */
    private function prepareContribuicaoPb(array $dado, \DateTime $dtPagamentoDateTime, \DateTime $dtUltimaCotaDateTime, int $diasUteisUltimaCota, float $totalFluxoPorData, float $totalFluxoVppPorData): array
    {
        return [
            'fluxo_PB' => (float) $dado['FLUXO_PB'],
            'fluxoVpp_PB' => (float) $dado['FLUXO_VPP_PB'],
            'totalFluxoPorData_PB' => $totalFluxoPorData,
            'totalFluxoVppPorData_PB' => $totalFluxoVppPorData,
            'qtCotas_PB' => (float) $dado['QTD_COTAS_PB'],
            'qtCotasAcumuladas_PB' => (float) $dado['QTD_COTAS_ACUMULADAS_PB'],
            'patrimonio_PB' => (float) $dado['PATRIMONIO_PB'],
            'fluxoRentabilidade_PB' => (float) $dado['FLUXO_RENTABILIDADE_PB'],
            'rentabilidade_PB' => (float) $dado['RENTABILIDADE_PB'],
            'RENT_PARTICIPANTE_PB' => (float) ($dado['RENT_PARTICIPANTE_PB'] ?? 0),
            'RENT_PATROCINADOR_PB' => (float) ($dado['RENT_PATROCINADOR_PB'] ?? 0)
        ];
    }

    /**
     * Processa dados por mantenedor para Reserva
     */
    private function processMantenedorReserva(array $dado, array $contribuicao, float $contribParticipante, float $rentabilidadeParticipante, float $aal, float $rentabilidadeAal): array
    {
        if ($dado['MANTENEDOR'] == 'PARTICIPANTE' || $dado['MANTENEDOR'] == 'AUTOPATROCINADO') {
            $contribParticipante += $contribuicao['fluxo'];
            $rentabilidadeParticipante += $contribuicao['rentabilidade'];
        }

        if ($dado['MANTENEDOR'] == 'PATROCINADOR') {
            $aal += $contribuicao['fluxo'];
            $rentabilidadeAal += $contribuicao['RENT_PATROCINADOR'];
        }

        return [
            'contribParticipante' => $contribParticipante,
            'rentabilidadeParticipante' => $rentabilidadeParticipante,
            'aal' => $aal,
            'rentabilidadeAal' => $rentabilidadeAal
        ];
    }

    /**
     * Processa dados por mantenedor para CDI
     */
    private function processMantenedorCdi(array $dado, array $contribuicao, float $contribParticipante, float $rentabilidadeParticipante, float $aal, float $rentabilidadeAal): array
    {
        if ($dado['MANTENEDOR'] == 'PARTICIPANTE' || $dado['MANTENEDOR'] == 'AUTOPATROCINADO') {
            $contribParticipante += $contribuicao['fluxo_CDI'];
            $rentabilidadeParticipante += $contribuicao['rentabilidade_CDI'];
        }

        if ($dado['MANTENEDOR'] == 'PATROCINADOR') {
            $aal += $contribuicao['fluxo_CDI'];
            $rentabilidadeAal += $contribuicao['RENT_PATROCINADOR_CDI'];
        }

        return [
            'contribParticipante' => $contribParticipante,
            'rentabilidadeParticipante' => $rentabilidadeParticipante,
            'aal' => $aal,
            'rentabilidadeAal' => $rentabilidadeAal
        ];
    }

    /**
     * Processa dados por mantenedor para PB
     */
    private function processMantenedorPb(array $dado, array $contribuicao, float $contribParticipante, float $rentabilidadeParticipante, float $aal, float $rentabilidadeAal): array
    {
        if ($dado['MANTENEDOR'] == 'PARTICIPANTE' || $dado['MANTENEDOR'] == 'AUTOPATROCINADO') {
            $contribParticipante += $contribuicao['fluxo_PB'];
            $rentabilidadeParticipante += $contribuicao['rentabilidade_PB'];
        }

        if ($dado['MANTENEDOR'] == 'PATROCINADOR') {
            $aal += $contribuicao['fluxo_PB'];
            $rentabilidadeAal += $contribuicao['RENT_PATROCINADOR_PB'];
        }

        return [
            'contribParticipante' => $contribParticipante,
            'rentabilidadeParticipante' => $rentabilidadeParticipante,
            'aal' => $aal,
            'rentabilidadeAal' => $rentabilidadeAal
        ];
    }

    /**
     * Calcula totais para Reserva
     */
    private function calculateTotaisReserva(float $totalFluxo, float $totalFluxoVpp, float $contribParticipante, float $rentabilidadeParticipante, float $aal, float $rentabilidadeAal): array
    {
        $totalFluxoRentabilidade = $contribParticipante + $rentabilidadeParticipante + $aal + $rentabilidadeAal;

        return [
            'contribParticipante' => $contribParticipante,
            'aal' => $aal,
            'rentabilidadeParticipante' => $rentabilidadeParticipante,
            'rentabilidadeAal' => $rentabilidadeAal,
            'patrimonioAtualizado' => $totalFluxoRentabilidade,
            'apRi' => (($totalFluxoRentabilidade / $totalFluxo) - 1),
            'apVpp' => (($totalFluxoRentabilidade / $totalFluxoVpp) - 1),
        ];
    }

    /**
     * Calcula totais para CDI
     */
    private function calculateTotaisCdi(float $totalFluxo, float $totalFluxoVpp, float $contribParticipante, float $rentabilidadeParticipante, float $aal, float $rentabilidadeAal): array
    {
        $totalFluxoRentabilidade = $contribParticipante + $rentabilidadeParticipante + $aal + $rentabilidadeAal;

        return [
            'contribParticipante_CDI' => $contribParticipante,
            'aal_CDI' => $aal,
            'rentabilidadeParticipante_CDI' => $rentabilidadeParticipante,
            'rentabilidadeAal_CDI' => $rentabilidadeAal,
            'patrimonioAtualizado_CDI' => $totalFluxoRentabilidade,
            'apRi_CDI' => (($totalFluxoRentabilidade / $totalFluxo) - 1),
            'apVpp_CDI' => (($totalFluxoRentabilidade / $totalFluxoVpp) - 1),
        ];
    }

    /**
     * Calcula totais para PB
     */
    private function calculateTotaisPb(float $totalFluxo, float $totalFluxoVpp, float $contribParticipante, float $rentabilidadeParticipante, float $aal, float $rentabilidadeAal): array
    {
        $totalFluxoRentabilidade = $contribParticipante + $rentabilidadeParticipante + $aal + $rentabilidadeAal;

        return [
            'contribParticipante_PB' => $contribParticipante,
            'aal_PB' => $aal,
            'rentabilidadeParticipante_PB' => $rentabilidadeParticipante,
            'rentabilidadeAal_PB' => $rentabilidadeAal,
            'patrimonioAtualizado_PB' => $totalFluxoRentabilidade,
            'apRi_PB' => (($totalFluxoRentabilidade / $totalFluxo) - 1),
            'apVpp_PB' => (($totalFluxoRentabilidade / $totalFluxoVpp) - 1),
        ];
    }

    /**
     * Combina dados processados de todos os índices
     */
    private function combineProcessedData(array $reservaData, array $cdiData, array $pbData): array
    {
        $preparedDados = [];
        $contribuicoes = [];

        // Combinar contribuições
        foreach ($reservaData['contribuicoes'] as $index => $reservaContrib) {
            $contribuicoes[$index] = array_merge(
                $reservaContrib,
                $cdiData['contribuicoes'][$index] ?? [],
                $pbData['contribuicoes'][$index] ?? []
            );
        }

        $preparedDados['contribuicoes'] = $contribuicoes;

        // Combinar totais
        $preparedDados['totais'] = array_merge(
            $reservaData['totais'],
            $cdiData['totais'],
            $pbData['totais']
        );

        return $preparedDados;
    }

    private function formulaComparaativo(string $x, string $y)
    {
        $x = floatval($x);
        $y = floatval($y);
        $ret = (pow((1 + $x), (1 / 252)) - 1) / (pow((1 + $y), (1 / 252)) - 1);
        return abs(round($ret * 100, 2));
    }
}
