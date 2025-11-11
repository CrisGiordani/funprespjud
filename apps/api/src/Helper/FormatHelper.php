<?php

namespace App\Helper;

class FormatHelper
{
    public static function formatDate(string $date): string
    {
        return date('d/m/Y', strtotime($date));
    }

    public static function formatCpf(string $cpf): string
    {
        return preg_replace('/(\d{3})(\d{3})(\d{3})(\d{2})/', '$1.$2.$3-$4', $cpf);
    }

    public static function formatCnpj(string $cnpj): string
    {
        return preg_replace('/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/', '$1.$2.$3/$4-$5', $cnpj);
    }

    public static function formatPhone(?string $phone): string
    {
        if (! $phone) {
            return '';
        }
        // Remove caracteres não numéricos
        $phone = preg_replace('/[^\d]/', '', $phone);

        // Se tem 11 dígitos (celular): (82) 99982-9382
        if (strlen($phone) === 11) {
            return preg_replace('/(\d{2})(\d{5})(\d{4})/', '($1) $2-$3', $phone);
        }

        // Se tem 10 dígitos (telefone fixo): (82) 3482-2900
        if (strlen($phone) === 10) {
            return preg_replace('/(\d{2})(\d{4})(\d{4})/', '($1) $2-$3', $phone);
        }

        // Se não atende aos padrões, retorna o número original
        return $phone;
    }
}
