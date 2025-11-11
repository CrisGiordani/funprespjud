<?php

namespace App\Service\Iris\Relatorios;

use App\DTO\Iris\Relatorios\ContribuicaoPrevidenciaComplementarDTO;
use App\DTO\Iris\Relatorios\DemonstrativoImpostoRendaDTO;
use App\DTO\Trust\Input\ContribuicaoFilterDTO;
use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\Helper\CpfHelper;
use App\Interface\Iris\Service\Relatorios\DemonstrativoImpostoRendaServiceInterface;
use App\Interface\Trust\Service\TrustContribuicaoServiceInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Service\Jasper\JasperService;

class DemonstrativoImpostoRendaService implements DemonstrativoImpostoRendaServiceInterface
{
    public function __construct(
        private readonly TrustParticipanteServiceInterface $participanteService,
        private readonly JasperService $jasperService,
        private readonly TrustContribuicaoServiceInterface $trustContribuicaoService
    ) {
    }

    public function getDemonstrativoImpostoRenda(string $cpf, string $ano, string $patrocinadorSigla): DemonstrativoImpostoRendaDTO
    {
        if (! CpfHelper::isValidCpf($cpf)) {
            throw new \Exception('CPF inválido');
        }

        if (! is_numeric($ano)) {
            throw new \Exception('Ano inválido');
        }

        foreach ($this->participanteService->getPatrocinador($cpf) as $patrocinador) {
            if($patrocinador->getSigla() === $patrocinadorSigla){
                $particpantePatrocinador = $patrocinador;
                break;
            }
        }
 
        if(empty($particpantePatrocinador)){
            throw new \Exception('Patrocinador não encontrado');
        }


        if (! isset($particpantePatrocinador) || $particpantePatrocinador->getSigla() !== $patrocinadorSigla) {
            throw new \Exception('Patrocinador não encontrado');
        }

        $filter = new ContribuicaoFilterDTO([
            'dataInicial' => "01/{$ano}",
            'dataFinal' => "12/{$ano}",
        ]);
        $contribuicoes = $this->trustContribuicaoService->getContribuicoes($cpf, $filter);

        $contribuicaoPrevidenciaComplementarDTO = new ContribuicaoPrevidenciaComplementarDTO($contribuicoes);
        $participante = $this->participanteService->getParticipante($cpf);

        $participanteWithCpf = ParticipanteProfileDTO::fromParticipanteProfileOutputDTO($participante, $cpf);

        $demonstrativoImpostoRendaDTO = new DemonstrativoImpostoRendaDTO(
            patrocinadorDTO: $particpantePatrocinador,
            participanteProfileDTO: $participanteWithCpf,
            contribuicaoPrevidenciaComplementarDTO: $contribuicaoPrevidenciaComplementarDTO
        );

        $demonstrativoImpostoRendaDTO->setAnoIr($ano);

        return $demonstrativoImpostoRendaDTO;
    }
}
