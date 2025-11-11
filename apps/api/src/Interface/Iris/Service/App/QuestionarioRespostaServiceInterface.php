<?php

namespace App\Interface\Iris\Service\App;

use App\DTO\Iris\App\Input\QuestionarioRespostaDTO;

interface QuestionarioRespostaServiceInterface
{
    /**
     * @return array
     */
    public function getAll(): array;

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function findByCpf(string $cpf): array;

    /**
     * @param QuestionarioRespostaDTO $questionarioRespostaDTO
     *
     * @return void
     */
    public function salvarRespostas(QuestionarioRespostaDTO $questionarioRespostaDTO): void;

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function getUltimaRespostaByCpf(string $cpf): array;
}
