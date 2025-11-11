<?php

namespace App\DTO\Trust\Input;

class DemonstrativoAnaliticoImpostoRendaDTO
{
    public function __construct(
        public array $contribuicoesParticipante,
        public array $contribuicoesPatrocinador
    ) {
    }

    public function getQuantidadeContribuicoes(): int
    {
        $quantidadeParticipante = count($this->contribuicoesParticipante);
        $quantidadePatrocinador = count($this->contribuicoesPatrocinador);

        return max($quantidadeParticipante, $quantidadePatrocinador);
    }

    public function getContribuicoesCombinadas(): array
    {
        $contribuicoesCombinadas = [];

        // Processa contribuições do participante
        foreach ($this->contribuicoesParticipante as $contribuicaoParticipante) {
            $competencia = $contribuicaoParticipante->getCompetenciaFormatada();
            $dtRecebimento = $contribuicaoParticipante->getDtRecebimento();

            // Procura contribuição do patrocinador com mesma competência e data
            $contribuicaoPatrocinador = array_filter(
                $this->contribuicoesPatrocinador,
                function ($contribuicao) use ($contribuicaoParticipante)
                {
                    return $contribuicao->getMesCompetencia() == $contribuicaoParticipante->getMesCompetencia() &&
                           $contribuicao->getAnoCompetencia() == $contribuicaoParticipante->getAnoCompetencia() &&
                           $contribuicao->getDtRecebimento() == $contribuicaoParticipante->getDtRecebimento();
                }
            );

            $contribuicoesCombinadas[] = [
                'dtRecebimento' => $dtRecebimento,
                'competenciaFormatada' => $competencia,
                'participante' => $contribuicaoParticipante->getValorRecebido(),
                'patrocinador' => ! empty($contribuicaoPatrocinador) ? reset($contribuicaoPatrocinador)->getValorRecebido() : 0,
            ];
        }

        // Processa contribuições do patrocinador que não foram combinadas
        foreach ($this->contribuicoesPatrocinador as $contribuicaoPatrocinador) {
            $competencia = $contribuicaoPatrocinador->getCompetenciaFormatada();
            $dtRecebimento = $contribuicaoPatrocinador->getDtRecebimento();

            // Verifica se já existe uma entrada com esta competência e data
            $existe = false;
            foreach ($contribuicoesCombinadas as $combinada) {
                if ($combinada['competenciaFormatada'] === $competencia &&
                    $combinada['dtRecebimento'] === $dtRecebimento) {
                    $existe = true;

                    break;
                }
            }

            if (! $existe) {
                $contribuicoesCombinadas[] = [
                    'dtRecebimento' => $dtRecebimento,
                    'competenciaFormatada' => $competencia,
                    'participante' => 0,
                    'patrocinador' => $contribuicaoPatrocinador->getValorRecebido(),
                ];
            }
        }

        // Ordena por data de recebimento e competência
        usort($contribuicoesCombinadas, function ($a, $b)
        {
            $dataA = \DateTime::createFromFormat('d/m/Y', $a['dtRecebimento']);
            $dataB = \DateTime::createFromFormat('d/m/Y', $b['dtRecebimento']);

            if ($dataA == $dataB) {
                // Se as datas forem iguais, ordena por competência
                return strcmp($a['competenciaFormatada'], $b['competenciaFormatada']);
            }

            return $dataA <=> $dataB;
        });

        return $contribuicoesCombinadas;
    }
}
