<?php

namespace App\DTO\Iris\Relatorios;

use App\DTO\Trust\Input\ParticipanteProfileDTO;
use App\DTO\Trust\Output\PatrimonioOutputDTO;
use App\DTO\Trust\Output\ParticipanteProfileOutputDTO;

class ExtratoDTO
{
    public function __construct(
        private readonly ParticipanteProfileDTO $dadosPessoais,
        private readonly array $contribuicao,
        private readonly PatrimonioOutputDTO $patrimonio,
        private readonly bool $paginate = false,
        private readonly ?ParticipanteProfileOutputDTO $dadosPessoaisCompletos = null
    ) {}

    /**
     * Formata valor monetário com símbolo R$ e separadores brasileiros
     */
    private function formatMoeda($valor): string
    {
        if (is_null($valor) || $valor === '') {
            return 'R$ 0,00';
        }

        $valorFloat = is_numeric($valor) ? (float) $valor : 0;
        return 'R$ ' . number_format($valorFloat, 2, ',', '.');
    }

    private function formatDataToView($data): string
    {
        if (is_null($data)) {
            return '';
        }

        if (is_bool($data)) {
            return $data ? '1' : '0';
        }

        if (is_numeric($data)) {
            return (string) $data;
        }

        if (!is_string($data)) {
            return '';
        }

        if (empty($data)) {
            return '';
        }

        try {
            // Se a data já estiver no formato dd/mm/yyyy, retorna ela mesma
            if (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $data)) {
                return $data;
            }

            // Se a data estiver no formato yyyy-mm-dd
            if (preg_match('/^\d{4}-\d{2}-\d{2}/', $data)) {
                $date = new \DateTime($data);

                return $date->format('d/m/Y');
            }

            // Tenta converter a data para o formato correto
            $date = \DateTime::createFromFormat('Y-m-d', $data);
            if ($date) {
                return $date->format('d/m/Y');
            }

            // Se não conseguir converter, retorna a data original
            return $data;
        } catch (\Exception $e) {
            // Em caso de erro, retorna a data original
            return $data;
        }
    }

    /**
     * Sanitiza um valor para garantir que seja compatível com JSON
     */
    private function sanitizeValue($value)
    {
        if (is_null($value)) {
            return '';
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        if (is_string($value)) {
            return $value;
        }

        if (is_array($value)) {
            return array_map([$this, 'sanitizeValue'], $value);
        }

        // Para qualquer outro tipo, converte para string
        return (string) $value;
    }

    /**
     * Sanitiza recursivamente um array para garantir que todos os valores sejam compatíveis com JSON
     */
    private function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
            } else {
                $sanitized[$key] = $this->sanitizeValue($value);
            }
        }

        return $sanitized;
    }

    /**
     * Normaliza o regime tributário de abreviação para nome completo
     * 
     * Para participantes que aderiram após a Lei 14.803/2024 (11/01/2024) e não fizeram
     * opção pelo regime tributário, retorna "Não informado" em vez de "Progressivo".
     * 
     * @param string|null $regimeTributacao
     * @param string|null $dataAdesao Data de adesão do participante (formato dd/mm/yyyy)
     * @param string|null $dataOpcaoTributacao Data de opção pelo regime tributário (formato dd/mm/yyyy ou null)
     * @return string
     */
    private function normalizarRegimeTributacao(?string $regimeTributacao, ?string $dataAdesao = null, ?string $dataOpcaoTributacao = null): string
    {
        // Se o regime está vazio/null, verifica se deve retornar "Não informado"
        if (empty($regimeTributacao)) {
            // Verifica se aderiu após a Lei 14.803/2024 (11/01/2024) e não fez opção
            if ($dataAdesao && empty($dataOpcaoTributacao)) {
                try {
                    $dataAdesaoObj = null;

                    // Tenta parsear em formato brasileiro (dd/mm/yyyy)
                    $dataAdesaoObj = \DateTime::createFromFormat('d/m/Y', $dataAdesao);

                    // Se falhar, tenta formato ISO (yyyy-mm-dd)
                    if (!$dataAdesaoObj) {
                        $dataAdesaoObj = \DateTime::createFromFormat('Y-m-d', $dataAdesao);
                    }

                    // Se ainda falhar, tenta criar diretamente
                    if (!$dataAdesaoObj) {
                        $dataAdesaoObj = new \DateTime($dataAdesao);
                    }

                    if ($dataAdesaoObj) {
                        $dataLei = new \DateTime('2024-01-11');
                        $dataLei->setTime(0, 0, 0);
                        $dataAdesaoObj->setTime(0, 0, 0);

                        if ($dataAdesaoObj >= $dataLei) {
                            return 'Não informado';
                        }
                    }
                } catch (\Exception $e) {
                    // Se houver erro ao parsear a data, mantém o comportamento padrão
                }
            }

            return 'Progressivo';
        }

        $regimeTributacao = strtoupper(trim($regimeTributacao));

        return match ($regimeTributacao) {
            'R', 'REGRESSIVO' => 'Regressivo',
            'P', 'PROGRESSIVO' => 'Progressivo',
            'NÃO INFORMADO', 'NAO INFORMADO', 'N', 'NI' => 'Não informado',
            default => 'Progressivo', // Padrão
        };
    }

    /**
     * Obtém o regime de tributação do participante a partir dos planos
     * 
     * @return string
     */
    private function obterRegimeTributacao(): string
    {
        $regimeTributacao = null;
        $dataAdesao = $this->dadosPessoais->getDtExercicio();
        $dataOpcaoTributacao = null;

        // Se temos os dados completos do participante, busca o regime dos planos
        if ($this->dadosPessoaisCompletos) {
            $planos = $this->dadosPessoaisCompletos->getPlanos();
            $dataOpcaoTributacao = $this->dadosPessoaisCompletos->getDtOpcaoTributacao();

            // Busca o regime de tributação do primeiro plano ativo (não encerrado)
            if ($planos && is_array($planos)) {
                foreach ($planos as $plano) {
                    // Verifica se o plano é um objeto DadosPlanoOutputDTO
                    if (is_object($plano) && method_exists($plano, 'getRegimeTributacao')) {
                        $regimePlano = $plano->getRegimeTributacao();
                        if (!empty($regimePlano)) {
                            $regimeTributacao = $regimePlano;
                            break;
                        }
                    }
                    // Se for um array, tenta acessar diretamente
                    elseif (is_array($plano) && isset($plano['regimeTributacao'])) {
                        $regimePlano = $plano['regimeTributacao'];
                        if (!empty($regimePlano)) {
                            $regimeTributacao = $regimePlano;
                            break;
                        }
                    }
                }
            }
        }

        return $this->normalizarRegimeTributacao($regimeTributacao, $dataAdesao, $dataOpcaoTributacao);
    }

    public function toArray(): array
    {
        // Dados do patrimônio usando valores diretos
        $dadosSaldo = [
            'contribuicaoNormalParticipanteRan' => [
                'totalContribuido' => $this->formatMoeda($this->patrimonio->getTotalContribuidoParticipanteRan() ?? 0),
                'totalRentabilizado' => $this->formatMoeda($this->patrimonio->getTotalRentabilizadoParticipanteRan() ?? 0),
            ],
            'contribuicaoNormalPatrocinadorRan' => [
                'totalContribuido' => $this->formatMoeda($this->patrimonio->getTotalContribuidoPatrocinadorRan() ?? 0),
                'totalRentabilizado' => $this->formatMoeda($this->patrimonio->getTotalRentabilizadoPatrocinadorRan() ?? 0),
            ],
            'contribuicaoNormalParticipanteRas' => [
                'totalContribuido' => $this->formatMoeda($this->patrimonio->getTotalContribuidoParticipanteRas() ?? 0),
                'totalRentabilizado' => $this->formatMoeda($this->patrimonio->getTotalRentabilizadoParticipanteRas() ?? 0),
            ],
        ];

        // Usar valores diretos do patrimônio
        $totalContribuido = (float) ($this->patrimonio->getTotalContribuido() ?? 0);

        // dd( $this->patrimonio->getPatrimonioTotal() ?? 0);
        $totalRentabilizado = $this->patrimonio->getPatrimonioTotal();
        $rentabilidade = (float) ($this->patrimonio->getRentabilidade() ?? 0);
        $rentabilidadePercentual = (float) ($this->patrimonio->getRentabilidadePercentual() ?? 0);

        // Adicionar totais ao saldo
        $dadosSaldo['patrimonioAcumulado'] = $this->formatMoeda($totalRentabilizado);
        $dadosSaldo['rentabilidade'] = $this->formatMoeda($rentabilidade);
        $dadosSaldo['rentabilidadePercentual'] = number_format($rentabilidadePercentual, 2, ',', '.') . ' %';
        $dadosSaldo['reservaTotal'] = $this->formatMoeda($totalContribuido);
        $dadosSaldo['acumuladoTotal'] = $this->formatMoeda($totalRentabilizado);

        // Dados pessoais do cabeçalho - garantir que todos sejam strings
        $dadosPessoaisCabecalho = [
            'cnpb' => '2013.0017-38',
            'orgaoPatrocinador' => (string) ($this->dadosPessoais->getNmCargo() ?? ''),
            'cpf' => (string) ($this->dadosPessoais->getCpf() ?? ''),
            'nome' => (string) ($this->dadosPessoais->getNome() ?? ''),
            'dtIngresso' => $this->formatDataToView($this->dadosPessoais->getDtExercicio()),
            'cargoEfetivo' => (string) ($this->dadosPessoais->getNmCargo() ?? ''),
            'sexo' => $this->dadosPessoais->getSexo() === 'M' ? 'Masculino' : ($this->dadosPessoais->getSexo() === 'F' ? 'Feminino' : ''),
            'dtNascimento' => $this->formatDataToView($this->dadosPessoais->getDtNascimento()),
            'naturalidade' => (string) ($this->dadosPessoais->getNaturalidade() ?? ''),
            'nacionalidade' => (string) ($this->dadosPessoais->getNmNacionalidade() ?? ''),
            'estadoCivil' => (string) ($this->dadosPessoais->getNmEstadoCivil() ?? ''),
            'identidade' => (string) ($this->dadosPessoais->getRg() ?? ''),
            'orgaoExpedidorRg' => (string) ($this->dadosPessoais->getEmissorRg() ?? ''),
            'dataExpedicao' => $this->formatDataToView($this->dadosPessoais->getDtExpedicaoRg()),
            'nomePai' => (string) ($this->dadosPessoais->getNmPai() ?? ''),
            'nomeMae' => (string) ($this->dadosPessoais->getNmMae() ?? ''),
            'endereco' => (string) ($this->dadosPessoais->getLogradouro() ?? ''),
            'bairro' => (string) ($this->dadosPessoais->getBairro() ?? ''),
            'cidade' => (string) ($this->dadosPessoais->getCidade() ?? ''),
            'uf' => (string) ($this->dadosPessoais->getEnderecoUf() ?? ''),
            'cep' => (string) ($this->dadosPessoais->getCep() ?? ''),
            'email' => (string) ($this->dadosPessoais->getEmail() ?? ''),
            'celular' => (string) ($this->dadosPessoais->getCelular() ?? ''),
            'telResidencial' => (string) ($this->dadosPessoais->getTelefone() ?? ''),
            'telComercial' => (string) ($this->dadosPessoais->getTelefoneComercial() ?? ''),
            'regimeTributacao' => $this->obterRegimeTributacao(),
        ];

        // Campos monetários que devem receber formatação com R$
        $camposMonetarios = [
            'valorContribuicao',
            'taxaCarregamento',
            'fcbe',
            'car',
            'ran',
            'ras',
            'rentabilidade'
        ];

        // Dados das contribuições - sanitizar todos os campos para garantir compatibilidade
        $dadosContribuicoes = array_map(function ($item) use ($camposMonetarios) {
            $sanitizedItem = [];

            // Processar todos os campos do item, incluindo campos booleanos
            foreach ($item as $key => $value) {
                if ($key === 'dtRecolhimento') {
                    $sanitizedItem[$key] = $this->formatDataToView($value);
                } elseif (in_array($key, $camposMonetarios)) {
                    // Aplica formatação de moeda com R$
                    $sanitizedItem[$key] = $this->formatMoeda($value);
                } else {
                    $sanitizedItem[$key] = $this->sanitizeValue($value);
                }
            }

            return $sanitizedItem;
        }, $this->contribuicao);

        return $this->sanitizeArray([
            'dadosPessoaisCabecalho' => $dadosPessoaisCabecalho,
            'dadosContribuicoes' => $dadosContribuicoes,
            'dadosSaldo' => $dadosSaldo,
        ]);
    }
}