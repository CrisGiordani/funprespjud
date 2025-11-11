<?php

namespace App\Interface\Iris\Repository\Core;

use App\Entity\Iris\Core\Documento;

interface DocumentoRepositoryInterface
{
    /**
     * retorna todos os documentos
     * @param array<string, mixed> $filter
     *
     * @return array<string, mixed>
     */
    public function getAll(array $filter = []);

    /**
     * retorna todos os documentos de um usuário
     * @param int $usuarioId
     *
     */
    public function getByUsuarioId(int $usuarioId);

    /**
     * @param int $id
     *
     */
    public function getById(int $id);

    /**
     * @param Documento $documento
     *
     */
    public function save(Documento $documento): Documento;

    /**
     * @param Documento $documento
     *
     */
    public function update(Documento $documento): Documento;

    /**
     * @param Documento $documento
     *
     */
    public function softDelete(Documento $documento): void;

    /**
     * @param Documento $documento
     *
     */
    public function restore(Documento $documento): void;
}
