<?php

namespace App\Interface\Enum;

interface AvatarEnumInterface
{
    /**
     * Retorna o valor do enum
     *
     * @return string
     */
    public function getValue(): string;

    /**
     * Retorna a mensagem de erro formatada
     *
     * @param string|null $additionalInfo Informação adicional para a mensagem de erro
     * @return string
     */
    public function getErrorMessage(?string $additionalInfo = null): string;

    /**
     * Retorna o nome do arquivo do avatar padrão
     *
     * @return string
     */
    public static function getDefaultAvatar(): string;

    /**
     * Retorna o tamanho máximo permitido para upload em bytes
     *
     * @return int
     */
    public static function getMaxSize(): int;

    /**
     * Retorna a mensagem de erro para arquivo muito grande
     *
     * @return string
     */
    public static function getErrorUploadSize(): string;

    /**
     * Retorna os tipos MIME permitidos para upload
     *
     * @return array
     */
    public static function getAllowedMimeTypes(): array;

    /**
     * @param string $cpf
     * @param string $extension
     *
     * @return string
     */
    public static function generateFileNameAvatar(string $cpf, string $extension): string;
}
