<?php

namespace App\Service\Cpf;

use App\Exception\CpfEncryptionException;

/**
 * Serviço para criptografia e descriptografia de CPF usando AES-256-CBC.
 */
class CpfEncryptionService
{
    private const AES_METHOD = 'AES-256-CBC';
    private string $cipherKey;
    private string $iv;

    /**
     * @param string $cipherKey Chave de 32 bytes em hexadecimal
     * @param string $iv IV de 16 bytes em hexadecimal
     */
    public function __construct(string $cipherKey, string $iv)
    {
        $this->cipherKey = hex2bin($cipherKey);
        if ($this->cipherKey === false || strlen($this->cipherKey) !== 32) {
            throw new CpfEncryptionException(CpfEncryptionException::INVALID_KEY);
        }

        $this->iv = hex2bin($iv);
        if ($this->iv === false || strlen($this->iv) !== 16) {
            throw new CpfEncryptionException(CpfEncryptionException::INVALID_IV);
        }
    }

    /**
     * Criptografa um CPF.
     * @param string $cpf CPF com 11 dígitos numéricos
     * @return string Texto cifrado em hexadecimal
     */
    public function encrypt(string $cpf): string
    {
        if (! preg_match('/^\d{11}$/', $cpf)) {
            throw new CpfEncryptionException(CpfEncryptionException::INVALID_CPF);
        }

        $ciphertext = openssl_encrypt(
            $cpf,
            self::AES_METHOD,
            $this->cipherKey,
            OPENSSL_RAW_DATA,
            $this->iv
        );

        if ($ciphertext === false) {
            throw new CpfEncryptionException(CpfEncryptionException::DECRYPTION_ERROR);
        }

        return bin2hex($ciphertext);
    }

    /**
     * Descriptografa um CPF.
     * @param string $encryptedCpf Texto cifrado em hexadecimal
     * @return string CPF de 11 dígitos
     */
    public function decrypt(string $encryptedCpf): string
    {
        // Valida se o parâmetro é um hexadecimal válido (apenas dígitos hex e tamanho par)
        if (! preg_match('/^[a-fA-F0-9]+$/', $encryptedCpf) || (strlen($encryptedCpf) % 2 !== 0)) {
            throw new CpfEncryptionException(CpfEncryptionException::INVALID_FORMAT);
        }

        $ciphertext = hex2bin($encryptedCpf);
        if ($ciphertext === false) {
            throw new CpfEncryptionException(CpfEncryptionException::INVALID_HEX);
        }

        $decrypted = openssl_decrypt(
            $ciphertext,
            self::AES_METHOD,
            $this->cipherKey,
            OPENSSL_RAW_DATA,
            $this->iv
        );

        if ($decrypted === false) {
            throw new CpfEncryptionException(CpfEncryptionException::DECRYPTION_ERROR);
        }

        $decrypted = trim($decrypted, "\0");
        $decrypted = preg_replace('/[^\d]/', '', $decrypted);

        if (! preg_match('/^\d{11}$/', $decrypted)) {
            throw new CpfEncryptionException(CpfEncryptionException::INVALID_CPF);
        }

        return $decrypted;
    }
}
