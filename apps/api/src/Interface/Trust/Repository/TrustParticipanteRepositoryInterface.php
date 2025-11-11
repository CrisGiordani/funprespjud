<?php

namespace App\Interface\Trust\Repository;

use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Input\PatrocinadorDTO;
use App\DTO\Trust\Output\ParticipanteProfileOutputDTO;

interface TrustParticipanteRepositoryInterface
{
    /**
     * @param string $cpf
     *
     * @return array|null|ParticipanteProfileOutputDTO
     */
    public function getParticipante(string $cpf): array|null|ParticipanteProfileOutputDTO;

    /**
     * @param string $cpf
     * 
     * @return array<ParticipanteProfileDTO>
     */
    public function getDadosParticipanteAtivo(string $cpf): array;

    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getEmailsAdicionaisParticipante(string $cpf): array|null;

    /**
     * @param string $cpf
     * @param ParticipanteProfileDTO $dados
     *
     * @return bool
     */
    public function updateParticipante(string $cpf, ParticipanteProfileDTO $dados): bool;

    /**
     * @param string $cpf
     *
     * @return array<PatrocinadorDTO>|null
     */
    public function getPatrocinadoresSalario(string $cpf): array|null;

    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getPatrocinadores(string $cpf): array|null;

    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getPatrocinador(string $cpf): array|null;

    /**
     * @param string $idParticipanteTrust
     *
     * @return array|null
     */
    public function getPerfilAtual(string $idParticipanteTrust): array|null;

    /**
     * @param int $idPessoa
     *
     * @return float
     */
    public function getSalarioParticipante(int $idPessoa): float;

    /**
     * @param string $cpf
     *
     * @return array|null
     */
    public function getCoberturasCAR(string $cpf): array|null;

    /**
     * @param string $cpf
     * @param array $dados
     *
     * @return bool
     */
    public function updateCargo(string $cpf, array $dados): bool;

    /**
     * @param string $cpf
     * 
     * @return array|null
     */
    public function getDadosPessoa(string $cpf): array|null;
}

