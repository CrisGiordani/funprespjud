<?php

namespace App\Enum\Trust\Avatar;

use App\Interface\Enum\AvatarEnumInterface;

enum AvatarEnum: string implements AvatarEnumInterface
{
    case AVATAR_DEFAULT = 'nobody.png';
    case ERROR_NO_FILE = 'Nenhum arquivo foi enviado';
    case ERROR_INVALID_TYPE = 'O arquivo deve ser uma imagem (JPEG, PNG ou GIF)';
    case ERROR_UPLOAD = 'Erro ao fazer upload do avatar: %s';
    case SUCCESS_UPLOAD = 'Avatar atualizado com sucesso';
    case ERROR_UPLOAD_SIZE = 'O arquivo deve ter no máximo 3MB';

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @param string|null $additionalInfo
     *
     * @return string
     */
    public function getErrorMessage(?string $additionalInfo = null): string
    {
        return match($this) {
            self::ERROR_UPLOAD => sprintf($this->value, $additionalInfo ?? ''),
            default => $this->value
        };
    }

    /**
     * @return string
     */
    public static function getDefaultAvatar(): string
    {
        return self::AVATAR_DEFAULT->getValue();
    }

    /**
     * @return int
     */
    public static function getMaxSize(): int
    {
        return 3 * 1024 * 1024; //! 3 * 1024 * 1024
    }

    /**
     * @return string
     */
    public static function getErrorUploadSize(): string
    {
        return self::ERROR_UPLOAD_SIZE->getValue();
    }

    /**
     * @return array
     */
    public static function getAllowedMimeTypes(): array
    {
        return ['image/jpeg', 'image/png', 'image/gif'];
    }

    /**
     * @param string $cpf
     * @param string $extension
     *
     * @return string
     */
    public static function generateFileNameAvatar(string $cpf, string $extension): string
    {
        return 'avatar'. $cpf. '.'. $extension;
    }
}
