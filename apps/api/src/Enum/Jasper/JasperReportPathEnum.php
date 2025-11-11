<?php

namespace App\Enum\Jasper;

enum JasperReportPathEnum: string
{
    case REPORT_IR = '/Relatorios/RelatorioIR';
    case REPORT_CERTIFICADO = '/Relatorios/Certificado';
    case REPORT_EXTRATO = '/Relatorios/ExtratoCompleto';

    //* ALERTAS DO PERFIL DE INVESTIMENTO
    case REPORT_RELATORIO_PERFIL_INVESTIMENTO = '/Relatorios/PerfilInvestimento';
    case REPORT_RELATORIO_QUESTIONARIO = '/Relatorios/questionario';
    case REPORT_RELATORIO_QUESTIONARIO_NAO_RESPONDIDO = '/Relatorios/questionario_nao_respondido';
    case REPORT_RELATORIO_QUESTIONARIO_NAO_RESPONDIDO_SEM_NOTIFICACAO = '/Relatorios/questionario_nao_respondido_e_sem_mensagem';
}
