<?php

namespace App\DTO\Trust\Input;

use App\Helper\NumberHelper;
use Symfony\Component\Serializer\Annotation\Groups;

class PatrimonioEvolucaoDTO
{
    public const TIPO_ANUAL = 'ANUAL';
    public const TIPO_MENSAL = 'MENSAL';

    #[Groups(['patrimonio_evolucao:read'])]
    private string $cpf;

    #[Groups(['patrimonio_evolucao:read'])]
    private string $tipo;

    #[Groups(['patrimonio_evolucao:read'])]
    private array $evolucao;

    /**
     * @param string $cpf
     * @param string $tipo
     * @param array $evolucao
     */
    public function __construct(string $cpf, string $tipo = self::TIPO_ANUAL, array $evolucao = [])
    {
        $this->cpf = $cpf ?? '';
        $this->tipo = $tipo ?? self::TIPO_ANUAL;
        $this->evolucao = $this->formatEvolucaoData($evolucao);
    }

    /**
     * @return string
     */
    public function getCpf(): string
    {
        return $this->cpf;
    }

    /**
     * @param string $cpf
     *
     * @return void
     */
    public function setCpf(string $cpf): void
    {
        $this->cpf = $cpf;
    }

    /**
     * @return string
     */
    public function getTipo(): string
    {
        return $this->tipo;
    }

    /**
     * @param string $tipo
     *
     * @return void
     */
    public function setTipo(string $tipo): void
    {
        if (! in_array($tipo, [self::TIPO_ANUAL, self::TIPO_MENSAL])) {
            throw new \InvalidArgumentException('Tipo inválido. Deve ser ANUAL ou MENSAL');
        }
        $this->tipo = $tipo;
    }

    /**
     * @return array
     */
    public function getEvolucao(): array
    {
        return $this->evolucao;
    }

    /**
     * @param array $evolucao
     *
     * @return void
     */
    public function setEvolucao(array $evolucao): void
    {
        $this->evolucao = $this->formatEvolucaoData($evolucao);
    }

    /**
     * @return array
     */
    public static function getTiposValidos(): array
    {
        return [
            self::TIPO_ANUAL,
            self::TIPO_MENSAL,
        ];
    }

    /**
     * Formata o valores da evolução para float
     *
     * @param array $evolucao The evolution data to format
     * @return array The formatted evolution data
     */
    private function formatEvolucaoData(array $evolucao): array
    {
        return array_map(function ($item)
        {
            $formattedItem = [
                'ano' => $item['ano'] ?? null,
                'vlNominal' => isset($item['vlNominal']) ? NumberHelper::round($item['vlNominal']) : 0.0,
                'qtCota' => isset($item['qtCota']) ? NumberHelper::round($item['qtCota']) : 0.0,
                'vlAtualizado' => isset($item['vlAtualizado']) ? NumberHelper::round($item['vlAtualizado']) : 0.0,
                'dtIndexador' => $item['dtIndexador'] ?? null,
                'vlIndexador' => isset($item['vlIndexador']) ? NumberHelper::round($item['vlIndexador']) : 0.0,
            ];

            if ($this->tipo === self::TIPO_MENSAL) {
                $formattedItem['mes'] = $item['mes'] ?? null;
            }

            return $formattedItem;
        }, $evolucao);
    }
}
