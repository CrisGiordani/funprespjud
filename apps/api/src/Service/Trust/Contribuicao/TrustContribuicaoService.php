<?php

namespace App\Service\Trust\Contribuicao;

use App\DTO\Trust\Input\ContribuicaoDoMesDTO;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\DTO\Trust\Input\ContribuicaoMesOrigemDTO;
use App\DTO\Trust\Input\DemonstrativoAnaliticoImpostoRendaDTO;
use App\Enum\Trust\Contribuicao\TipoMantenedorConsolidadoEnum;
use App\Exception\ContribuicaoDoMesNotFoundException;
use App\Interface\Trust\Repository\TrustContribuicaoRepositoryInterface;
use App\Interface\Trust\Repository\TrustParticipanteRepositoryInterface;
use App\Interface\Trust\Repository\TrustSimuladorRepositoryInterface;
use App\Interface\Trust\Service\TrustContribuicaoServiceInterface;

class TrustContribuicaoService implements TrustContribuicaoServiceInterface
{
    public function __construct(
        private readonly TrustContribuicaoRepositoryInterface $repository,
        private readonly TrustSimuladorRepositoryInterface $simuladorRepository,
        private readonly TrustParticipanteRepositoryInterface $participanteRepository,
    ) {}

    /**
     * Busca as contribuições do participante
     *
     * @param string $cpf
     * @param ContribuicaoFilterDTO|null $filter
     *
     * @return array
     */
    public function getContribuicoes(string $cpf, ?ContribuicaoFilterDTO $filter): array
    {
        if ($filter === null) {
            $filter = new ContribuicaoFilterDTO();
        }

        return $this->repository->getContribuicoes($cpf, $filter);
    }

    public function getContribuicoesPERFIL(string $cpf, ?ContribuicaoFilterDTO $filter): array
    {
        return $this->repository->getContribuicoesPERFIL($cpf, $filter);
    }

    /**
     * Busca as contribuições do participante
     *
     * @param string $cpf
     *
     * @return ContribuicaoDoMesDTO
     */
    public function getContribuicaoDoMes(string $cpf): ContribuicaoDoMesDTO
    {
        $contribuicaoPatrocinador = $this->repository->getContribuicaoDoMes($cpf, TipoMantenedorConsolidadoEnum::PATROCINADOR);
        $contribuicaoParticipante = $this->repository->getContribuicaoDoMes($cpf, TipoMantenedorConsolidadoEnum::PARTICIPANTE);
        $contribuicaoAutopatrocinado = $this->repository->getContribuicaoDoMes($cpf, TipoMantenedorConsolidadoEnum::AUTOPATROCINADO);


        if (empty($contribuicaoPatrocinador) && empty($contribuicaoParticipante)) {
            throw new ContribuicaoDoMesNotFoundException();
        }

        $mesAnoCompetenciaPatrocinador = $contribuicaoPatrocinador['mesCompetencia'] ?? null;
        $anoCompetenciaPatrocinador = $contribuicaoPatrocinador['anoCompetencia'] ?? null;
        $dataUltimoAportePatrocinador = $contribuicaoPatrocinador['dtUltimoAporte'] ?? null;
        $mesAnoUltimoAportePatrocinador = is_string($dataUltimoAportePatrocinador) ? date('m/y', strtotime($dataUltimoAportePatrocinador)) : null;

        $mesAnoCompetenciaParticipante = $contribuicaoParticipante['mesCompetencia'] ?? null;
        $anoCompetenciaParticipante = $contribuicaoParticipante['anoCompetencia'] ?? null;
        $dataUltimoAporteParticipante = $contribuicaoParticipante['dtUltimoAporte'] ?? null;
        $mesAnoUltimoAporteParticipante = is_string($dataUltimoAporteParticipante) ? date('m/y', strtotime($dataUltimoAporteParticipante)) : null;

        $mesAnoCompetenciaAutopatrocinado = $contribuicaoAutopatrocinado['mesCompetencia'] ?? null;
        $anoCompetenciaAutopatrocinado = $contribuicaoAutopatrocinado['anoCompetencia'] ?? null;
        $dataUltimoAporteAutopatrocinado = $contribuicaoAutopatrocinado['dtUltimoAporte'] ?? null;
        $mesAnoUltimoAporteAutopatrocinado = is_string($dataUltimoAporteAutopatrocinado) ? date('m/y', strtotime($dataUltimoAporteAutopatrocinado)) : null;

        $dataUltimoAporte = array_reduce(
            [
                $dataUltimoAporteAutopatrocinado,
                $dataUltimoAporteParticipante,
                $dataUltimoAportePatrocinador
            ],
            function ($carry, $data) {
                if ($data === null) {
                    return $carry;
                }
                if ($carry === null) {
                    return $data;
                }
                return $data > $carry ? $data : $carry;
            },
            null
        );

        // Adiciona zero à esquerda no mês, se ambos mês e ano não forem nulos
        $mesAnoCompetenciaPatrocinador = (! is_null($mesAnoCompetenciaPatrocinador) && ! is_null($anoCompetenciaPatrocinador))
            ? str_pad((string)$mesAnoCompetenciaPatrocinador, 2, '0', STR_PAD_LEFT) . '/' . (string)$anoCompetenciaPatrocinador
            : null;
        $mesAnoCompetenciaParticipante = (! is_null($mesAnoCompetenciaParticipante) && ! is_null($anoCompetenciaParticipante))
            ? str_pad((string)$mesAnoCompetenciaParticipante, 2, '0', STR_PAD_LEFT) . '/' . (string)$anoCompetenciaParticipante
            : null;
        $mesAnoCompetenciaAutopatrocinado = (! is_null($mesAnoCompetenciaAutopatrocinado) && ! is_null($anoCompetenciaAutopatrocinado))
            ? str_pad((string)$mesAnoCompetenciaAutopatrocinado, 2, '0', STR_PAD_LEFT) . '/' . (string)$anoCompetenciaAutopatrocinado
            : null;

        $mesAnoCompetencia = array_reduce(
            [
                $mesAnoCompetenciaPatrocinador,
                $mesAnoCompetenciaParticipante,
                $mesAnoCompetenciaAutopatrocinado
            ],
            function ($carry, $mesAno) {
                if ($mesAno === null) {
                    return $carry;
                }
                if ($carry === null) {
                    return $mesAno;
                }
                return $mesAno < $carry ? $mesAno : $carry;
            },
            null
        );

        $mesAnoUltimoAporte = is_string($dataUltimoAporte) ? date('m/y', strtotime($dataUltimoAporte)) : null;

        $contribuicaoParticipante = $mesAnoUltimoAporteParticipante === $mesAnoUltimoAporte ? $contribuicaoParticipante : null;
        $contribuicaoPatrocinador = $mesAnoUltimoAportePatrocinador === $mesAnoUltimoAporte ? $contribuicaoPatrocinador : null;
        $contribuicaoAutopatrocinado = $mesAnoUltimoAporteAutopatrocinado === $mesAnoUltimoAporte ? $contribuicaoAutopatrocinado : null;

        $contribuicaoParticipante['totalContribuicaoDoMes'] = bcadd(
            $contribuicaoParticipante['totalContribuicaoDoMes'] ?? '0.00',
            $contribuicaoAutopatrocinado['totalContribuicaoDoMes'] ?? '0.00',
            2
        );

        $contribuicaoTotal = bcadd(
            $contribuicaoPatrocinador['totalContribuicaoDoMes'] ?? '0.00',
            $contribuicaoParticipante['totalContribuicaoDoMes'] ?? '0.00',
            2
        );

        return new ContribuicaoDoMesDTO(
            [
                'dataUltimoAporte' => $dataUltimoAporte,
                'mesAnoCompetencia' => $mesAnoCompetencia,
                'contribuicaoTotal' => $contribuicaoTotal,
                'contribuicaoParticipante' => $contribuicaoParticipante['totalContribuicaoDoMes'] ?? '0.00',
                'contribuicaoPatrocinador' => $contribuicaoPatrocinador['totalContribuicaoDoMes'] ?? '0.00',
            ]
        );
    }

    /**
     * Busca o demonstrativo analítico do imposto de renda
     *
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     *
     * @return array
     */
    public function demonstrativoAnaliticoImpostoRenda(string $cpf, ContribuicaoFilterDTO $filter): array
    {
        $contribuicoesParticipante = $this->repository->demonstrativoAnaliticoImpostoRenda($cpf, $filter, TipoMantenedorConsolidadoEnum::PARTICIPANTE->getValue());
        $contribuicoesPatrocinador = $this->repository->demonstrativoAnaliticoImpostoRenda($cpf, $filter, TipoMantenedorConsolidadoEnum::PATROCINADOR->getValue());

        $demonstrativoAnaliticoImpostoRenda = new DemonstrativoAnaliticoImpostoRendaDTO(
            contribuicoesParticipante: $contribuicoesParticipante,
            contribuicoesPatrocinador: $contribuicoesPatrocinador
        );

        return $demonstrativoAnaliticoImpostoRenda->getContribuicoesCombinadas();
    }

    /**
     * Organiza as contribuições do participante
     *
     * @param string $cpf
     * @param ContribuicaoFilterDTO $filter
     *
     * @return array
     */
    public function organizarContribuicoes(string $cpf, ContribuicaoFilterDTO $filter): array
    {
        $contribuicoes = $this->getContribuicoes($cpf, $filter);

        $contribuicoesDTO = new ContribuicaoMesOrigemDTO($contribuicoes);

        return $contribuicoesDTO->organizarContribuicoes();
    }

    /**
     * Busca as contribuições facultativas do participante
     *
     * @param int $idPessoa
     *
     * @return array
     */
    public function getUltimaContribuicaoFacultativaByCpf(int $idPessoa): ?array
    {
        try {
            return $this->repository->getUltimaContribuicaoFacultativaByCpf($idPessoa);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function getContribuicoesSaldo(string $cpf): array
    {
        return $this->repository->getContribuicoesSaldo($cpf);
    }

    public function getPercentualContribuicaoAtual(string $cpf): array
    {
        $dadosParticipante = $this->participanteRepository->getParticipante($cpf);

        $percentualNormal = $this->simuladorRepository->getPercentualContribuicaoNormal(['idParticipante' => $dadosParticipante->getId()]);
        $percentualFacultativa = $this->simuladorRepository->getPercentualContribuicaoFacultativa(['idParticipante' => $dadosParticipante->getId()]);

        return [
            'percentualNormal' => $percentualNormal,
            'percentualFacultativa' => $percentualFacultativa
        ];
    }
}
