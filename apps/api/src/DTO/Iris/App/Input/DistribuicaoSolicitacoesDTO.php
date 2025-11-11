<?php

namespace App\DTO\Iris\App\Input;

class DistribuicaoSolicitacoesDTO
{
    public int $total;
    public int $horizonte2040;
    public int $horizonte2050;
    public int $horizonteProtegido;

    /**
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->total = $data['total'] ?? 0;
        $this->horizonte2040 = $data['horizonte2040'] ?? 0;
        $this->horizonte2050 = $data['horizonte2050'] ?? 0;
        $this->horizonteProtegido = $data['horizonteProtegido'] ?? 0;
    }

    /**
     * @return int
     */
    public function getTotal(): int
    {
        return $this->total;
    }

    /**
     * @return int
     */
    public function getHorizonte2040(): int
    {
        return $this->horizonte2040;
    }

    /**
     * @return int
     */
    public function getHorizonte2050(): int
    {
        return $this->horizonte2050;
    }

    /**
     * @return int
     */
    public function getHorizonteProtegido(): int
    {
        return $this->horizonteProtegido;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'total' => $this->total,
            'horizonte2040' => $this->horizonte2040,
            'horizonte2050' => $this->horizonte2050,
            'horizonteProtegido' => $this->horizonteProtegido,
        ];
    }

    /**
     * @param array $data
     * 
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
