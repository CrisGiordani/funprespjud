<?php

namespace App\DTO\Trust\Input;

use Symfony\Component\Serializer\Annotation\Groups;

class IndexadorValorDTO
{
    #[Groups(['cotas:read'])]
    private ?string $indexador = null;

    #[Groups(['cotas:read'])]
    private ?string $dt_indexador = null;

    #[Groups(['cotas:read'])]
    private ?float $valor = null;

    #[Groups(['cotas:read'])]
    private ?string $percentual = null;

    #[Groups(['cotas:read'])]
    private ?string $previa = null;



    public function __construct(
        string $indexador,
        string $dt_indexador,
        float $valor,
        float $percentual,
        string $previa
    ) {
        $this->indexador = $indexador;
        $this->dt_indexador = $dt_indexador;
        $this->valor = $valor;
        $this->percentual = $percentual;
        $this->previa = $previa;
    }

    public function getIndexador(): string
    {
        return $this->indexador;
    }

    public function getDtIndexador(): string
    {
        return $this->dt_indexador;
    }

    public function getValor(): float
    {
        return $this->valor;
    }

    public function getPercentual(): float
    {
        return $this->percentual;
    }

    public function getPrevia(): string
    {
        return $this->previa;
    }
}
