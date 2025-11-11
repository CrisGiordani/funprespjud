<?php

namespace App\Interface\Trust\Service;

interface TrustSaldoServiceInterface
{
    public function getSaldo(string $cpf, array $filter = []): array;
}
