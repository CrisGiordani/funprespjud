<?php

namespace App\Interface\Trust\Service;

interface TrustExtratoServiceInterface
{
    public function getExtrato(string $cpf, array $filter = []): array;
}
