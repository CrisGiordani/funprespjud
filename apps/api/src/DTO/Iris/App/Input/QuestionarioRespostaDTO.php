<?php

namespace App\DTO\Iris\App\Input;

use App\Exception\QuestionarioException;
use App\Helper\CpfHelper;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Data Transfer Object for questionnaire responses
 *
 * This DTO represents the data structure for questionnaire responses,
 * including participant information and their answers to questions.
 */
class QuestionarioRespostaDTO
{
    #[Groups(['questionario_resposta:read'])]
    #[Assert\NotBlank(message: 'O CPF é obrigatório')]
    #[Assert\Regex(
        pattern: '/^\d{11}$/',
        message: 'O CPF deve conter 11 dígitos numéricos'
    )]
    private ?string $cpf = null;

    #[Groups(['questionario_resposta:read'])]
    private ?string $data_resposta = null;

    #[Groups(['questionario_resposta:read'])]
    private array $respostas = [];

    /**
     * Constructor for QuestionarioRespostaDTO
     *
     * @param array<string, mixed> $data Array containing questionnaire response data
     */
    public function __construct(array $data = [])
    {
        $this->cpf = $data['cpf'] ?? null;
        $this->data_resposta = $data['data_resposta'] ?? null;
        $this->respostas = $data['respostas'] ?? [];
    }

    /**
     * Get the participant's CPF (tax ID)
     *
     * @return string|null
     */
    public function getCpf(): ?string
    {
        return $this->cpf;
    }

    /**
     * Set the participant's CPF (tax ID)
     *
     * @param string|null $cpf
     * @return $this
     */
    public function setCpf(?string $cpf): self
    {
        $this->cpf = $cpf;

        return $this;
    }

    /**
     * Get the response date
     *
     * @return string|null
     */
    public function getDataResposta(): ?string
    {
        return $this->data_resposta;
    }

    /**
     * Set the response date
     *
     * @param string|null $data_resposta
     * @return $this
     */
    public function setDataResposta(?string $data_resposta): self
    {
        $this->data_resposta = $data_resposta;

        return $this;
    }

    /**
     * Get the array of responses
     *
     * @return array
     */
    public function getRespostas(): array
    {
        return $this->respostas;
    }

    /**
     * Set the array of responses
     *
     * @param array $respostas
     * @return $this
     */
    public function setRespostas(array $respostas): self
    {
        $this->respostas = $respostas;

        return $this;
    }

    /**
     * Add a response to the array
     *
     * @param array $resposta
     * @return $this
     */
    public function addResposta(array $resposta): self
    {
        $this->respostas[] = $resposta;

        return $this;
    }

    /**
     * Convert the DTO to an array
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'cpf' => $this->cpf,
            'data_resposta' => $this->data_resposta,
            'respostas' => $this->respostas,
        ];
    }

    /**
     * Create a new instance from an array
     *
     * @param array<string, mixed> $data
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }

    /**
     * Validate if the responses array has exactly 8 items and follows the required format
     * Also validates the CPF format and number
     *
     * @return bool
     * @throws QuestionarioException
     */
    public function validateRespostas(): bool
    {
        // Validate CPF
        if (empty($this->cpf)) {
            throw new QuestionarioException('O CPF é obrigatório');
        }

        // Remove any non-numeric characters
        $cpf = preg_replace('/[^0-9]/', '', $this->cpf);

        // Validate CPF format
        if (strlen($cpf) !== 11) {
            throw new QuestionarioException('O CPF deve conter 11 dígitos numéricos');
        }

        // Validate CPF number
        if (! CpfHelper::isValidCpf($cpf)) {
            throw new QuestionarioException('CPF inválido');
        }
        // Validate responses array
        if (count($this->respostas) !== 8) {
            throw new QuestionarioException('O array de respostas deve conter exatamente 8 itens.');
        }

        $requiredKeys = ['id_app_questionario', 'id_app_pergunta', 'id_app_alternativa'];

        foreach ($this->respostas as $index => $resposta) {
            if (! is_array($resposta)) {
                throw new QuestionarioException(sprintf('A resposta no índice %d deve ser um array.', $index));
            }

            foreach ($requiredKeys as $key) {
                if (! isset($resposta[$key]) || ! is_numeric($resposta[$key])) {
                    throw new QuestionarioException(sprintf('A resposta no índice %d deve conter a chave "%s" com um valor numérico.', $index, $key));
                }
            }

            // Verifica se há chaves extras
            $extraKeys = array_diff(array_keys($resposta), $requiredKeys);
            if (! empty($extraKeys)) {
                throw new QuestionarioException(sprintf('A resposta no índice %d contém chaves extras não permitidas: %s', $index, implode(', ', $extraKeys)));
            }
        }

        return true;
    }
}
