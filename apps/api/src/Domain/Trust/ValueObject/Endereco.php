<?php

namespace App\Domain\Trust\ValueObject;

class Endereco {
    private string $logradouro;
    private string $numero;
    private ?string $complemento;
    private string $bairro;
    private string $cidade;
    private string $uf;
    private string $cep;

    public function __construct(
        string $logradouro,
        string $numero,
        ?string $complemento,
        string $bairro,
        string $cidade,
        string $uf,
        string $cep
    ) {
        $this->validarUF($uf);
        $this->validarCEP($cep);

        $this->logradouro = trim($logradouro);
        $this->numero = trim($numero);
        $this->complemento = $complemento ? trim($complemento) : null;
        $this->bairro = trim($bairro);
        $this->cidade = trim($cidade);
        $this->uf = strtoupper(trim($uf));
        $this->cep = $this->limparCEP($cep);
    }

    private function validarUF(string $uf): void {
        $ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

        if (! in_array(strtoupper($uf), $ufs)) {
            throw new \InvalidArgumentException('UF inválida');
        }
    }

    private function validarCEP(string $cep): void {
        $cep = $this->limparCEP($cep);
        if (strlen($cep) !== 8) {
            throw new \InvalidArgumentException('CEP deve conter 8 dígitos');
        }
    }

    private function limparCEP(string $cep): string {
        return preg_replace('/[^0-9]/', '', $cep);
    }

    public function getLogradouro(): string {
        return $this->logradouro;
    }

    public function getNumero(): string {
        return $this->numero;
    }

    public function getComplemento(): ?string {
        return $this->complemento;
    }

    public function getBairro(): string {
        return $this->bairro;
    }

    public function getCidade(): string {
        return $this->cidade;
    }

    public function getUF(): string {
        return $this->uf;
    }

    public function getCEP(): string {
        return $this->cep;
    }

    public function equals(Endereco $outro): bool {
        return $this->logradouro === $outro->logradouro
            && $this->numero === $outro->numero
            && $this->complemento === $outro->complemento
            && $this->bairro === $outro->bairro
            && $this->cidade === $outro->cidade
            && $this->uf === $outro->uf
            && $this->cep === $outro->cep;
    }
}
