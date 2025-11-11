<?php

namespace App\Interface\Trust\Repository;

use App\DTO\Trust\Input\BeneficiarioDTO;
use App\DTO\Trust\Input\BeneficiarioUpdateDTO;

interface TrustBeneficiarioRepositoryInterface
{
    /**
     * @param string $cpf
     *
     * @return array<BeneficiarioDTO>|null
     */
    public function getBeneficiarios(string $cpf): array|null;

    /**
     * @param array $dadosParticipante
     * @param BeneficiarioDTO $dados
     * @param int $idBeneficiario
     * 
     * @return bool
     */
    public function insertBeneficiario(array $dadosParticipante, BeneficiarioDTO $dados, int $idBeneficiario): bool;


    /**
     * @param string $cpf
     * @param string $id
     * @param BeneficiarioDTO|BeneficiarioUpdateDTO $dados
     * 
     * @return bool
     */
    public function updateBeneficiario(string $cpf, string $id, BeneficiarioDTO|BeneficiarioUpdateDTO $dados): bool;

    /**
     * @param string $id
     * 
     * @return bool
     */
    public function deleteBeneficiario(string $id): bool;


    /**
     * @param array $dadosParticipante
     * @param int $idBeneficiario
     * 
     * @return bool
     */
    public function isVinculado(array $dadosParticipante, int $idBeneficiario): bool;


    /**
     * @param array $dadosParticipante
     * @param int $idBeneficiario
     * 
     * @return array
     */
    public function filterDadosParticipanteNaoVinculadosAoBeneficiario(array $dadosParticipante, int $idBeneficiario): array;

    /**
     * @param array $dadosParticipante
     * @param string $cpf
     * 
     * @return bool
     */
    public function hasBeneficiarioComCpf(array $dadosParticipante, string $cpf): bool;

    /**
     * @param array $dadosParticipante
     * @param string $grauParentesco
     * 
     * @return bool
     */
    public function hasConjugeVinculado(array $dadosParticipante, string $grauParentesco): bool;

    /**
     * @return void
     */
    public function beginTransaction(): void;

    /**
     * @return void
     */
    public function commitTransaction(): void;

    /**
     * @return void
     */
    public function rollbackTransaction(): void;
}
