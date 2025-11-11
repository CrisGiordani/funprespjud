<?php

namespace App\Service\Trust\Simulador;

class TrustSimuladorConstants
{
    /**
     * Taxa FCBE
     */
    public const FCBE = 0.1324; // 13.24

    /**
     * Taxa administrativa
     */
    public const TAXA_ADMINISTRATIVA = 0.035;

    /**
     * Taxa de rentabilidade padrão
     */
    public const TAXA_RENTABILIDADE_PADRAO = 4.15;

    /**
     * Taxa de rentabilidade alternativa
     */
    public const TAXA_RENTABILIDADE_ALTERNATIVA = 4.50;

    /**
     * Rentabilidade alternativa
     */
    public const RENTABILIDADE_ALTERNATIVA = 4.5;

    /**
     * Idade mínima para aposentadoria
     */
    public const IDADE_MINIMA_APOSENTADORIA = 48;

    /**
     * Idade máxima para aposentadoria
     */
    public const IDADE_MAXIMA_APOSENTADORIA = 70;

    /**
     * Tamanho do chunk para processamento
     */
    public const CHUNK_SIZE = 1000;

    /**
     * Percentual mínimo para contribuição facultativa
     */
    public const PERCENTUAL_MINIMO_CONTRIBUICAO_FACULTATIVA = 0.5;

    /**
     * Percentual vinculado
     */
    public const PERCENTUAL_VINCULADO = 6.5;

    /**
     * Conta RAN normal participante
     */
    public const CONTA_RAN_NORMAL_PARTIC = 'RAN_NORMAL_PARTIC';

    /**
     * Conta RAN normal patrocinador
     */
    public const CONTA_RAN_NORMAL_PATROC = 'RAN_NORMAL_PATROC';

    /**
     * Conta RAN normal participante
     */
    public const CONTA_RAN_AUTOPATROCINADO = 'RAN_AUTOPATROCINADO';

    /**
     * Conta RAS facultativa
     */
    public const CONTA_RAS_FACULTATIVA = 'RAS_FACULTATIVA';

    /**
     * Conta RAS vinculado
     */
    public const CONTA_RAS_VINCULADO = 'RAS_VINCULADO';

    /**
     * Situação patrocinado
     */
    public const SITUACAO_PATROCINADO = 'PATROCINADO';

    /**
     * Situação vinculado
     */
    public const SITUACAO_VINCULADO = 'VINCULADO';

    /**
     * Situação autopatrocinado
     */
    public const SITUACAO_AUTOPATROCINADO = 'AUTOPATROCINADO';

    /**
     * Situação patrocinado CJ
     */
    public const SITUACAO_PATROCINADO_CJ = 'PATROCINADO - CJ/CC/FC';

    /**
     * Situação BPD deposito
     */
    public const SITUACAO_BPD_DEPOSITO = 'BPD - DEPOSITO';

    /**
     * Situação BPD saldo
     */
    public const SITUACAO_BPD_SALDO = 'BPD - SALDO';

    /**
     * Total de URPs para vincualdos
     */
    public const TOTAL_URPS = 10;
}
