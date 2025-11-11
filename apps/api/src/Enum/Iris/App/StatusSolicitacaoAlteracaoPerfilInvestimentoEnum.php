<?php

namespace App\Enum\Iris\App;

enum StatusSolicitacaoAlteracaoPerfilInvestimentoEnum: int
{
    case SOLICITACAO_PROCESSADA = 1;
    case CANCELADO_NOVA_SOLICITACAO_REGISTRADA = 2;
    case CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE = 3;
    case CONFIRMACAO_PENDENTE = 4;
    case FORMULARIO_FISICO = 5;
    case SOLICITACAO_RECEBIDA = 6;
    case ERRO_NO_PROCESSAMENTO = 7;

    public function getDescricao(): string
    {
        return match ($this) {
            self::FORMULARIO_FISICO => 'Formulario Fisico',
            self::SOLICITACAO_PROCESSADA => 'Solicitação Processada',
            self::CANCELADO_NOVA_SOLICITACAO_REGISTRADA => 'Cancelado - Nova Solicitação Registrada',
            self::CANCELADO_POR_SOLICITACAO_DO_PARTICIPANTE => 'Cancelado - Por Solicitação do Participante',
            self::CONFIRMACAO_PENDENTE => 'Confirmação Pendente: Valide seu Token',
            self::SOLICITACAO_RECEBIDA => 'Solicitação Recebida',
            self::ERRO_NO_PROCESSAMENTO => 'Erro no Processamento',
        };
    }
}
