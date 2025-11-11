<?php

namespace App\Interface\Iris\Service\Core;

use App\Entity\Iris\Core\Documento;
use App\Exception\FileException;
use Knp\Component\Pager\Pagination\PaginationInterface;

interface DocumentoServiceInterface
{
    /**
     * @param array<string, mixed> $filter
     * @return PaginationInterface
     */
    public function getAll(array $filter = []): PaginationInterface;

    /**
     * @param int $usuarioId
     *
     * @return Documento[]
     */
    public function getByUsuarioId(int $usuarioId);

    /**
     * @param int $id
     *
     * @return Documento|\Exception|FileException
     */
    public function getById(int $id): Documento|\Exception|FileException;

    /**
     * @param Documento $documento
     *
     * @return Documento
     */
    public function save(Documento $documento): Documento;

    /**
     * @param Documento $documento
     *
     * @return Documento
     */
    public function update(Documento $documento, array $dados): Documento;

    /**
     * @param Documento $documento
     *
     * @return void
     */
    public function softDelete(int $id): void;

    /**
     * @param Documento $documento
     *
     * @return void
     */
    public function restore(Documento $documento): void;

    public function getDadosUsuario(string $cpf);

    /**
     * @return array<string, int>
     */
    public function getTipoDocumento(): array;
}
