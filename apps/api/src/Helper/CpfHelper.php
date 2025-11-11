<?php

namespace App\Helper;

class CpfHelper
{
    /**
      * Validate CPF number using the official algorithm
      *
      * @param string $cpf
      * @return bool
      */
    public static function isValidCpf(string $cpf): bool
    {
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        // Check for repeated digits
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        // Check if CPF has 11 digits
        if (strlen($cpf) !== 11) {
            return false;
        }

        // Calculate first digit
        $sum = 0;
        for ($i = 0; $i < 9; $i++) {
            $sum += (int) $cpf[$i] * (10 - $i);
        }
        $rest = $sum % 11;
        $digit1 = ($rest < 2) ? 0 : 11 - $rest;

        // Calculate second digit
        $sum = 0;
        for ($i = 0; $i < 10; $i++) {
            $sum += (int) $cpf[$i] * (11 - $i);
        }
        $rest = $sum % 11;
        $digit2 = ($rest < 2) ? 0 : 11 - $rest;

        // Check if calculated digits match the provided ones
        return $digit1 === (int) $cpf[9] && $digit2 === (int) $cpf[10];
    }

    /**
     * Format CPF with mask (XXX.XXX.XXX-XX)
     *
     * @param string $cpf
     * @return string|null Returns formatted CPF or null if invalid
     */
    public static function formatCpf(string $cpf): ?string
    {
        // Remove all non-numeric characters
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        // Validate CPF length
        if (strlen($cpf) !== 11) {
            return null;
        }

        // Apply mask
        return sprintf(
            '%s.%s.%s-%s',
            substr($cpf, 0, 3),
            substr($cpf, 3, 3),
            substr($cpf, 6, 3),
            substr($cpf, 9, 2)
        );
    }
}
