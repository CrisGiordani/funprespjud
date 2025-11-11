<?php

namespace App\Interface\Iris\Repository\Core;

use App\Entity\Iris\Core\Cobranca;

interface CobrancaRepositoryInterface
{
    public function save(Cobranca $cobranca): Cobranca;

    public function update(Cobranca $cobranca): Cobranca;

    public function findOneByNossoNumero(string $nossoNumero): ?Cobranca;

    public function findAll(array $filter = []): array;

    public function cancelarCobranca(Cobranca $cobranca): void;
}
