<?php

namespace App\DTO\Iris\App\Output;

use App\Entity\Iris\App\PerfilInvestimentoAlteracao;

class PerfilInvestimentoAlteracaoOutputDTO
{
    public int $id;
    public int $idTrust;
    public string $dt_solicitacao;
    public string $owncloud;
    public string $protocolo;
    public string $status;
    public string $perfilInvestimentoDescricao;
    public string $campanhaDescricao;

    public function __construct(PerfilInvestimentoAlteracao $perfilInvestimentoAlteracao)
    {
        $this->id = $perfilInvestimentoAlteracao->getId();
        $this->idTrust = $perfilInvestimentoAlteracao->getIdTrust();
        $this->dt_solicitacao = $perfilInvestimentoAlteracao->getDtSolicitacao()->format('Y-m-d H:i:s');
        $this->owncloud = $perfilInvestimentoAlteracao->getOwncloud();
        $this->protocolo = $perfilInvestimentoAlteracao->getProtocolo();
        $this->status = $perfilInvestimentoAlteracao->getStatus();
        $this->perfilInvestimentoDescricao = $perfilInvestimentoAlteracao->getPerfilInvestimento()->getDescricao();
        $this->campanhaDescricao = $perfilInvestimentoAlteracao->getCampanha()->getDescricao();
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
