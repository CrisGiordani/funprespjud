<?php

namespace App\Exception;

use Symfony\Component\HttpFoundation\Response;

class CpfEncryptionException extends ApiException
{
    public const INVALID_FORMAT = 'CPF_001';
    public const INVALID_HEX = 'CPF_002';
    public const DECRYPTION_ERROR = 'CPF_003';
    public const INVALID_CPF = 'CPF_004';
    public const INVALID_KEY = 'CPF_005';
    public const INVALID_IV = 'CPF_006';

    private static array $errorMessages = [
        self::INVALID_FORMAT => 'O CPF informado não está criptografado ou não é um hexadecimal válido',
        self::INVALID_HEX => 'Formato de CPF criptografado inválido',
        self::DECRYPTION_ERROR => 'Erro ao descriptografar CPF',
        self::INVALID_CPF => 'Resultado da descriptografia não é um CPF válido',
        self::INVALID_KEY => 'A chave de criptografia é inválida',
        self::INVALID_IV => 'O IV de criptografia é inválido',
    ];

    public function __construct(
        string $code = self::INVALID_FORMAT,
        string $message = null
    ) {
        parent::__construct(
            message: $message ?? self::$errorMessages[$code],
            statusCode: Response::HTTP_BAD_REQUEST,
            errors: [
                [
                    'field' => 'cpf',
                    'code' => $code,
                    'message' => $message ?? self::$errorMessages[$code],
                ],
            ]
        );
    }
}
