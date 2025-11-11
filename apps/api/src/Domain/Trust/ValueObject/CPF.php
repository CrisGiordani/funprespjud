<?php

namespace App\Domain\Trust\ValueObject;

class CPF {
    private string $numero;

    public function __construct(string $numero) {
        $this->validarCPF($numero);
        $this->numero = $this->limparCPF($numero);
    }

    private function validarCPF(string $cpf): void {
        $cpf = $this->limparCPF($cpf);

        if (strlen($cpf) != 11) {
            throw new \InvalidArgumentException('CPF deve conter 11 dígitos');
        }

        if (preg_match('/(\d)\1{10}/', $cpf)) {
            throw new \InvalidArgumentException('CPF inválido');
        }

        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                throw new \InvalidArgumentException('CPF inválido');
            }
        }
    }

    private function limparCPF(string $cpf): string {
        return preg_replace('/[^0-9]/', '', $cpf);
    }

    public function getNumero(): string {
        return $this->numero;
    }

    public function __toString(): string {
        return $this->numero;
    }

    public function equals(CPF $outro): bool {
        return $this->numero === $outro->numero;
    }
}
