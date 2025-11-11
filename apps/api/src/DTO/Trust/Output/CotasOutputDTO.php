<?php

namespace App\DTO\Trust\Output;

use App\DTO\Trust\Input\CotasDTO;
use Symfony\Component\Serializer\Annotation\Groups;

class CotasOutputDTO
{
    #[Groups(['cotas:read'])]
    private ?string $idIndexador = null;

    #[Groups(['cotas:read'])]
    private ?string $dtCota = null;

    #[Groups(['cotas:read'])]
    private ?string $vlCota = null;

    #[Groups(['cotas:read'])]
    private ?string $vlCotaFrm = null;

    #[Groups(['cotas:read'])]
    private ?string $vlVariacao = null;

    #[Groups(['cotas:read'])]
    private ?string $icPrevia = null;

    public static function fromCotasDTO(CotasDTO $cotasDTO): self
    {
        $self = new self();
        $self->idIndexador = $cotasDTO->getIdIndexador();
        $self->dtCota = $cotasDTO->getDtCota();
        $self->vlCota = $cotasDTO->getVlCota();
        $self->vlCotaFrm = $cotasDTO->getVlCotaFrm();
        $self->vlVariacao = $cotasDTO->getVlVariacao();
        $self->icPrevia = $cotasDTO->getIcPrevia();

        return $self;
    }

    public function toArray(): array
    {
        return [
            'idIndexador' => $this->idIndexador,
            'dtCota' => $this->dtCota,
            'vlCota' => $this->vlCota,
            'vlCotaFrm' => $this->vlCotaFrm,
            'vlVariacao' => $this->vlVariacao,
            'icPrevia' => $this->icPrevia,
        ];
    }
}
