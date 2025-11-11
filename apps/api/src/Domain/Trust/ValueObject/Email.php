<?php

namespace App\Domain\Trust\ValueObject;

class Email {
    private string $endereco;

    public function __construct(string $endereco) {
        $this->validarEmail($endereco);
        $this->endereco = strtolower(trim($endereco));
    }

    private function validarEmail(string $email): void {
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }

    public function getEndereco(): string {
        return $this->endereco;
    }

    public function __toString(): string {
        return $this->endereco;
    }

    public function equals(Email $outro): bool {
        return $this->endereco === $outro->endereco;
    }
}
