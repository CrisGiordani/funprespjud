<?php

namespace App\Service\Trust\Lgpd;

use App\Exception\LgpdNotFoundException;
use App\Interface\Trust\Repository\TrustLgpdRepositoryInterface;
use App\Interface\Trust\Service\TrustLgpdServiceInterface;
use Psr\Log\LoggerInterface;

final class TrustLgpdService implements TrustLgpdServiceInterface
{
    public function __construct(
        private TrustLgpdRepositoryInterface $trustLgpdRepository,
        private LoggerInterface $logger
    ) {
    }

    /**
     * @param int $idTrust
     *
     * @return mixed
     */
    public function getConsentimentoLgpd(int $idTrust): mixed
    {
        try {
            return $this->trustLgpdRepository->getConsentimentoLgpd($idTrust);
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @param array $dados
     * @param int $idTrust
     *
     * @return mixed
     */
    public function saveConsentimentoLgpd(array $dados, int $idTrust): mixed
    {
        try {
            $lgpd = $this->trustLgpdRepository->saveConsentimentoLgpd($dados, $idTrust);
            if (! $lgpd) {
                throw new LgpdNotFoundException();
            }

            return $lgpd;
        } catch (\Exception $exception) {
            $this->logger->error($exception->getMessage());

            throw $exception;
        }
    }
}
