<?php

namespace App\Enum\Iris\Core;

enum TipoDocumentoEnum: int
{
    case CONSELHO_DELIBERATIVO = 1;
    case CONSELHO_FISCAL = 2;
    case DIRETORIA_EXECUTIVA = 3;

    public function getAllValues(): array
    {
        return array_map(fn (TipoDocumentoEnum $tipo) => $tipo->value, self::cases());
    }

    public function getAllLabels(): array
    {
        return array_map(fn (TipoDocumentoEnum $tipo) => $tipo->getLabel(), self::cases());
    }

    public function getLabel(): string
    {
        return match ($this) {
            self::CONSELHO_DELIBERATIVO => 'Conselho Deliberativo',
            self::CONSELHO_FISCAL => 'Conselho Fiscal',
            self::DIRETORIA_EXECUTIVA => 'Diretoria Executiva',
        };
    }

    public static function getAllLabelsValues(): array
    {
        return array_map(
            fn (TipoDocumentoEnum $tipo) => [
                'nome' => $tipo->getLabel(),
                'value' => $tipo->value,
            ],
            self::cases()
        );
    }
}
