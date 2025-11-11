<?php

namespace App\Interface\Trust\Service;

use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Input\PatrocinadorDTO;
use App\DTO\Trust\Output\CoberturaOutputDTO;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface TrustParticipanteServiceInterface
{
    /**
     * @param string $cpf
     *
     * @return mixed
     */
    public function getParticipante(string $cpf): mixed;

    /**
     * @param string $cpf
     * 
     * @return array<ParticipanteProfileDTO>
     */
    public function getDadosParticipanteAtivo(string $cpf): array;

    /**
     * @param string $cpf
     *
     * @return mixed
     */
    public function getEmailsAdicionaisParticipante(string $cpf): mixed;

    /**
     * @param string $cpf
     * @param ParticipanteProfileDTO $dados
     *
     * @return bool
     */
    public function updateParticipante(string $cpf, ParticipanteProfileDTO $dados): bool;

    /**
     * @param string $avatarDir
     * @param string $cpf
     *
     * @return string
     */
    public function getUrlAvatar(string $filename, string $cpf): string;

    /**
     * @param string $filename
     *
     * @return BinaryFileResponse
     */
    public function serveImage(string $filename): BinaryFileResponse;

    /**
     * @param string $cpf
     * @param UploadedFile $file
     *
     * @return string
     */
    public function uploadAvatar(string $cpf, UploadedFile $file): string;

    /**
     * @param string $cpf
     *
     * @return array|null|PatrocinadorDTO
     */
    public function getPatrocinador(string $cpf): array|null|PatrocinadorDTO;

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
    public function getPerfilAtual(string $cpf): array|null;

    /**
     * @param string $cpf
     *
     * @return float
     */
    public function getSalarioParticipante(string $cpf): float;

    /**
     * @param string $cpf
     *
     * @return CoberturaOutputDTO[]|null
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
