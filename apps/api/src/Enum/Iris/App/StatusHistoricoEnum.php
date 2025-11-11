<?php

namespace App\Enum\Iris\App;

use App\Entity\Iris\App\Historico;

/**
 * @enum StatusHistoricoEnum
 * Status do histórico do APP
 */
enum StatusHistoricoEnum: int
{
    case NUNCA_PREENCHIDO = 0;
    case PREENCHIDO_APTO_ALTERAR_PERFIL = 4;
    case PREENCHIDO_MAS_AINDA_VALIDO = 5;
    case PREENCHIDO_MAS_NAO_VALIDO = 6;
    //status do antigo sistema
    case PREENCHIDO = 1;
    case NAO_PREENCHIDO_OPCAO_PARTICIPANTE = 2;
    case NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR = 3;

    /**
     * @return string
     */
    public function getDescricao(): string
    {
        return match ($this) {
            self::NUNCA_PREENCHIDO => 'Nunca preenchido.',
            self::PREENCHIDO_APTO_ALTERAR_PERFIL => 'Preenchido, mas apto a alterar perfil.',
            self::PREENCHIDO_MAS_AINDA_VALIDO => 'Preenchido, mas ainda válido.',
            self::PREENCHIDO_MAS_NAO_VALIDO => 'Preenchido, mas não válido.',
            self::PREENCHIDO => 'APP preenchido com êxito.',
            self::NAO_PREENCHIDO_OPCAO_PARTICIPANTE => 'APP não preenchido por opção do participante após aviso de preenchimento.',
            self::NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR => 'APP não preenchido por opção do participante e solicitação de não mostrar novamente mensagem de alerta de preenchimento.',
            // self::PREENCHIDO => 'Preenchido novamente.',
            // self::NAO_PREENCHIDO_OPCAO_PARTICIPANTE => 'Não respondido.',
            // self::NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR => 'Não respondido e desejo de não ser notificado.',
        };
    }

    public static function ruleAptoParaAlterarPerfil(Historico $historico): bool
    {
        if ($historico->getStatus()->getCdStatus() != self::PREENCHIDO->value) {
            return false;
        }

        $dtEventoCalculado = $historico->getDtEvento();
        $dataAtual = new \DateTime();
        $diferenca = $dataAtual->diff($dtEventoCalculado);

        if (self::ruleAppValido($historico) && $diferenca->days < 30 * 6) {
            return true;
        }

        return false;
    }

    public static function ruleAppValido(Historico $historico): bool
    {
        if ($historico->getStatus()->getCdStatus() != self::PREENCHIDO->value) {
            return false;
        }

        $dtEventoCalculado = $historico->getDtEvento();
        $dataAtual = new \DateTime();
        $diferenca = $dataAtual->diff($dtEventoCalculado);

        if ($diferenca->days < 30 * 36) {
            return true;
        }

        return false;
    }
}
