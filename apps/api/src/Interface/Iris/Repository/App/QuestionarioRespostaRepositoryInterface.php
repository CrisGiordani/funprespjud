<?php

namespace App\Interface\Iris\Repository\App;

use App\Entity\Iris\App\QuestionarioResposta;

interface QuestionarioRespostaRepositoryInterface
{
    /**
     * @param string $cpf
     *
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
     * @param QuestionarioResposta $questionarioResposta
     *
     * @return void
     */
    public function save(QuestionarioResposta $questionarioResposta): void;

    /**
     * @param QuestionarioResposta $questionarioResposta
     *
     * @return void
     */
    public function persist(QuestionarioResposta $questionarioResposta): void;

    /**
     * @return void
     */
    public function flush(): void;

    /**
     * @return void
     */
    public function beginTransaction(): void;

    /**
     * @return void
     */
    public function commit(): void;

    /**
     * @return void
     */
    public function rollback(): void;

    /**
     * @param string $cpf
     *
     * @return array
     */
    public function getUltimaRespostaByCpf(string $cpf): array;
}
