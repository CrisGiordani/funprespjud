<?php

namespace App\Service\Trust\Plano;

use App\DTO\Trust\Output\DadosPlanoOutputDTO;
use App\Exception\PlanoNotFoundException;
use App\Interface\Trust\Repository\TrustPlanoRepositoryInterface;
use App\Interface\Trust\Service\TrustPlanoServiceInterface;
use Psr\Log\LoggerInterface;

final class TrustPlanoService implements TrustPlanoServiceInterface
{
    public function __construct(
        private readonly TrustPlanoRepositoryInterface $trustPlanoRepository,
        private readonly LoggerInterface $logger
    ) {}

    /**
     * @param string $cpf
     * @return DadosPlanoOutputDTO[]
     */
    public function getPlanosByCpf(string $cpf, bool $allPlanos = false): array
    {
        $this->logger->info('Buscando planos por CPF', ['cpf' => $cpf]);

        try {
            $planos = $this->trustPlanoRepository->getPlanosByCpf($cpf, $allPlanos);

            if (empty($planos)) {
                $this->logger->warning('Nenhum plano encontrado para o CPF', ['cpf' => $cpf]);

                throw new PlanoNotFoundException('Nenhum plano encontrado para o CPF');
            }

            $this->logger->info('Planos encontrados com sucesso', ['cpf' => $cpf, 'count' => count($planos)]);

            return $planos;
        } catch (PlanoNotFoundException $exception) {
            $this->logger->error('Plano não encontrado: ' . $exception->getMessage(), ['cpf' => $cpf]);

            throw $exception;
        } catch (\Exception $exception) {
            $this->logger->error('Erro ao buscar planos por CPF: ' . $exception->getMessage(), ['cpf' => $cpf]);

            throw $exception;
        }
    }

    /**
     * @param string $cpf
     * @param int $id
     * @return DadosPlanoOutputDTO|null
     */
    public function getPlanoById(string $cpf, int $id): ?DadosPlanoOutputDTO
    {
        $this->logger->info('Buscando plano por ID', ['cpf' => $cpf, 'id' => $id]);

        try {
            $plano = $this->trustPlanoRepository->getPlanoById($cpf, $id);

            if (! $plano) {
                $this->logger->warning('Plano não encontrado', ['cpf' => $cpf, 'id' => $id]);

                throw new PlanoNotFoundException('Plano não encontrado');
            }

            $this->logger->info('Plano encontrado com sucesso', ['cpf' => $cpf, 'id' => $id]);

            return $plano;
        } catch (PlanoNotFoundException $exception) {
            $this->logger->error('Plano não encontrado: ' . $exception->getMessage(), ['cpf' => $cpf, 'id' => $id]);

            throw $exception;
        } catch (\Exception $exception) {
            $this->logger->error('Erro ao buscar plano por ID: ' . $exception->getMessage(), ['cpf' => $cpf, 'id' => $id]);

            throw $exception;
        }
    }
}
