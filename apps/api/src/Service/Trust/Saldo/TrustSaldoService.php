<?php

namespace App\Service\Trust\Saldo;

use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\Enum\Trust\Contribuicao\TipoMantenedorConsolidadoEnum;
use App\Enum\Trust\Contribuicao\TipoValorEnum;
use App\Service\Trust\Contribuicao\TrustContribuicaoService;
use App\Service\Trust\Cotas\TrustCotasService;

class TrustSaldoService
{
    public function __construct(
        private readonly TrustCotasService $trustCotasService,
        private readonly TrustContribuicaoService $trustContribuicaoService,
    ) {}

    /**
     * Retorna o saldo do participante
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     * @return array
     */
    public function getSaldo(string $cpf, ContribuicaoFilterDTO $filter): array
    {
        $saldoCotasPorConta = $this->trustContribuicaoService->getContribuicoesSaldo($cpf);
        $cotaAtual = $this->trustCotasService->getCotasAtual($cpf);
        $cota = $cotaAtual->getValor();
        $saldo = [];
        $totalContribuidoParticipanteRan = 0;
        $totalContribuidoParticipanteRas = 0;
        $totalContribuidoPatrocinadorRan = 0;
        $totalCotasParticipanteRan = 0;
        $totalCotasParticipanteRas = 0;
        $totalCotasPatrocinadorRan = 0;

        foreach ($saldoCotasPorConta as $saldoCotas) {
            switch ($saldoCotas['idConta']) {
                case 1:
                    $totalCotasParticipanteRan += $saldoCotas['totalCotas'];
                    $totalContribuidoParticipanteRan += $saldoCotas['valorContribuicao'];
                    break;
                case 2:
                    $totalCotasPatrocinadorRan += $saldoCotas['totalCotas'];
                    $totalContribuidoPatrocinadorRan += $saldoCotas['valorContribuicao'];
                    break;
                default:
                    $totalCotasParticipanteRas += $saldoCotas['totalCotas'];
                    break;
            }
        }

        $totalCotas = bcadd(bcadd($totalCotasParticipanteRan, $totalCotasParticipanteRas, 12), $totalCotasPatrocinadorRan, 12);
        $totalContribuido = bcadd(bcadd($totalContribuidoParticipanteRan, $totalContribuidoParticipanteRas, 12), $totalContribuidoPatrocinadorRan, 12);
        $totalRentabilizadoParticipanteRan = bcmul($totalCotasParticipanteRan, $cota, 12);
        $totalRentabilizadoParticipanteRas = bcmul($totalCotasParticipanteRas, $cota, 12);
        $totalRentabilizadoPatrocinadorRan = bcmul($totalCotasPatrocinadorRan, $cota, 12);
        $totalRentabilizado = bcmul($totalCotas, $cota, 12);

        $saldo['contribuicaoNormalParticipanteRan']['totalContribuido'] = $totalContribuidoParticipanteRan;
        $saldo['contribuicaoNormalParticipanteRas']['totalContribuido'] = $totalContribuidoParticipanteRas;
        $saldo['contribuicaoNormalPatrocinadorRan']['totalContribuido'] = $totalContribuidoPatrocinadorRan;
        $saldo['totalCotasParticipanteRan'] = $totalCotasParticipanteRan;
        $saldo['totalCotasParticipanteRas'] = $totalCotasParticipanteRas;
        $saldo['totalCotasPatrocinadorRan'] = $totalCotasPatrocinadorRan;
        $saldo['contribuicaoNormalParticipanteRan']['totalRentabilizado'] = $totalRentabilizadoParticipanteRan;
        $saldo['contribuicaoNormalParticipanteRas']['totalRentabilizado'] = $totalRentabilizadoParticipanteRas;
        $saldo['contribuicaoNormalPatrocinadorRan']['totalRentabilizado'] = $totalRentabilizadoPatrocinadorRan;
        $saldo['totalCotas'] = $totalCotas;
        $saldo['totalContribuido'] = $totalContribuido;
        $saldo['saldo'] = $totalRentabilizado;
        $saldo['valorCota'] = $cota;

        return $saldo;
    }
}
