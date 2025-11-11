<?php

namespace App\DTO\Iris\App\Input;

class TotalDistribuicaoSolicitacoesDTO
{

    public DistribuicaoSolicitacoesDTO $horizonte2040;
    public DistribuicaoSolicitacoesDTO $horizonte2050;
    public DistribuicaoSolicitacoesDTO $horizonteProtegido;

    public function __construct(array $data)
    {

        $this->horizonte2040 = $data['Horizonte2040'] ?? 0;
        $this->horizonte2050 = $data['Horizonte2050'] ?? 0;
        $this->horizonteProtegido = $data['HorizonteProtegido'] ?? 0;
    }

    public function getHorizonte2040(): DistribuicaoSolicitacoesDTO
    {
        return $this->horizonte2040;
    }

    public function getHorizonte2050(): DistribuicaoSolicitacoesDTO
    {
        return $this->horizonte2050;
    }

    public function getHorizonteProtegido(): DistribuicaoSolicitacoesDTO
    {
        return $this->horizonteProtegido;
    }

    public function toArray(): array
    {
        return [
            'horizonte2040' => $this->horizonte2040,
            'horizonte2050' => $this->horizonte2050,
            'horizonteProtegido' => $this->horizonteProtegido,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
