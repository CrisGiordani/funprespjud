<?php

namespace App\Service\Trust\Patrocinador;

use App\DTO\Trust\Output\CargoOutputDTO;
use App\Exception\ParticipanteNotFoundException;
use App\Exception\PatrocinadorException;
use App\Interface\Trust\Repository\TrustPatrocinadorRepositoryInterface;
use App\Interface\Trust\Service\TrustParticipanteServiceInterface;
use App\Interface\Trust\Service\TrustPatrocinadorServiceInterface;

final class TrustPatrocinadorService implements TrustPatrocinadorServiceInterface
{
    public function __construct(
        private TrustPatrocinadorRepositoryInterface  $trustPatrocinadorRepository,
        private TrustParticipanteServiceInterface $trustParticipanteService
    ) {
    }

    /**
     * @param string $cpf
     *
     * @return array<CargoOutputDTO>
     */
    public function listarCargosPatrocinador(string $cpf): array
    {
        try {
            $participante = $this->trustParticipanteService->getParticipante($cpf);

            if (! $participante) {
                throw new ParticipanteNotFoundException();
            }

            $listaCargos = $this->trustPatrocinadorRepository->listarCargosPatrocinador($participante->getIdEmpresa());

            if (empty($listaCargos)) {
                throw new PatrocinadorException('Não há cargos para o patrocinador');
            }

            return $listaCargos;
        } catch (ParticipanteNotFoundException $exception) {
            throw $exception;
        } catch (PatrocinadorException $exception) {
            throw $exception;
        } catch (\Exception $exception) {
            throw $exception;
        }
    }
}
