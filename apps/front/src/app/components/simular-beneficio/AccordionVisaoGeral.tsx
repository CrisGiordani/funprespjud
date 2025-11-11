import React from 'react'

import { Box } from '@mui/material'

import { AccordionSimulacao } from './AccordionSimulacao'
import { CardsResumoSimulacao } from './CardsResumoSimulacao'
import { CardsContribuicoes } from './CardsContribuicoes'
import { ComparativoDoughnut } from './ComparativoDoughnut'
import type { AccordionVisaoGeralPropsType } from '@/types/simulacao-beneficio/AccordionVisaoGeralPropsTypes'
import { calcularPorcentagem } from '@/utils/math'
import { formatCurrency } from '@/app/utils/formatters'
import { TitleSubtitleSection } from './TitleSubtitleSection'
import { TooltipInfo } from '../common/TooltipInfo'
import type { SimulacaoResponseType } from '@/types/simulacao-beneficio/ParametrosSimulacaoResponseType'
import { PlanoSituacaoEnum } from '@/enum/simulador/PlanoSituacao'

function CalculoBaseContribuicaoNormal({ simulacao }: { simulacao: SimulacaoResponseType }) {
  return (
    <>
      <TitleSubtitleSection
        title='Cálculo da base de contribuição Funpresp-Jud'
        subtitle='Veja abaixo o valor da base de contribuição simulada, definida a partir da diferença entre sua remuneração atual e o teto do Regime Geral de Previdência Social (RGPS).'
      />

      <CardsContribuicoes
        cards={[
          {
            simulacao: '',
            iconClass: '',
            title: 'Remuneração atual',
            value: formatCurrency(simulacao.dadosSimulacao.novoSalarioParticipante),
            percent: ''
          },
          {
            simulacao: '',
            iconClass: 'fa-regular fa-minus',
            title: '',
            value: '',
            percent: ''
          },
          {
            simulacao: '',
            iconClass: '',
            title: 'Teto do RGPS',
            value: formatCurrency(Number(simulacao.tetoRPPS)),
            percent: ''
          },
          {
            simulacao: '',
            iconClass: 'fa-regular fa-equals',
            title: '',
            value: '',
            percent: ''
          },
          {
            simulacao: '',
            iconClass: '',
            title: 'Base de contribuição',
            value: formatCurrency(simulacao.dadosSimulacao.novoSalarioParticipante - Number(simulacao.tetoRPPS)),
            percent: '',
            primary: true
          }
        ]}
      />
    </>
  )
}

export function AccordionVisaoGeral({
  expanded,
  onChange,
  subtitle,
  simulacao,
  isVinculado,
  isBPD,
  isAutopatrocinado
}: AccordionVisaoGeralPropsType) {
  const tituloContribuicao = isVinculado ? 'Vinculada' : isAutopatrocinado ? 'Normal auto patrocinada' : 'Normal'

  const showCalculoBaseContribuicaoNormal = !isVinculado && !isAutopatrocinado && !isBPD

  return (
    <AccordionSimulacao
      simulacao={simulacao}
      title='1. Visão geral da simulação'
      subtitle={subtitle}
      expanded={expanded}
      onChange={onChange}
    >
      <CardsResumoSimulacao
        cards={[
          {
            iconClass: 'fa-kit fa-wallet',
            title: 'Saldo Normal Total (RAN)',
            subtitle: 'Saldo do participante + Saldo do patrocinador',
            value: formatCurrency(simulacao.saldosEBeneficios.saldo_normal_total)
          },
          {
            iconClass: 'fa-regular fa-money-bill-wave',
            title: 'Benefício normal mensal',
            value: formatCurrency(simulacao.saldosEBeneficios.beneficio_normal_mensal)
          },
          {
            iconClass: 'fa-regular fa-money-check-dollar-pen',
            title: 'Saldo Suplementar Total (RAS)',
            subtitle: 'Facultativas + Vinculadas + Portabilidade',
            value: formatCurrency(simulacao.saldosEBeneficios.saldo_suplementar_total)
          },
          {
            iconClass: 'fa-regular fa-money-check-dollar',
            title: 'Benefício suplementar mensal',
            value: formatCurrency(simulacao.saldosEBeneficios.beneficio_suplementar_mensal)
          },
          {
            iconClass: 'fa-regular fa-sack-dollar',
            title: 'Saldo total',
            subtitle: 'Normal + Suplementar',
            value: formatCurrency(simulacao.saldosEBeneficios.saldo_total),
            destaque: true
          },
          {
            iconClass: 'fa-kit fa-regular-money-bill-wave-circle-dollar',
            title: 'Benefício Funpresp-Jud mensal',
            value: formatCurrency(simulacao.saldosEBeneficios.beneficio_mensal_total),
            destaque: true
          }
        ]}
      />

      {showCalculoBaseContribuicaoNormal && <CalculoBaseContribuicaoNormal simulacao={simulacao} />}

      {!isBPD && (
        <>
          <TitleSubtitleSection
            title='Contribuições mensais simuladas'
            subtitle={
              !isBPD ? (
                <>
                  Veja abaixo o cálculo das{' '}
                  <span className='font-bold'>
                    contribuições normal e facultativa que serão realizadas mensalmente.
                  </span>
                </>
              ) : (
                <>
                  Veja abaixo o valor da{' '}
                  <span className='font-bold'>contribuição facultativa que será realizada mensalmente.</span>
                </>
              )
            }
          />

          <CardsContribuicoes
            cards={[
              {
                simulacao: simulacao,
                iconClass: 'fa-kit fa-pay-ran',
                title: (
                  <div className='flex items-center gap-1'>
                    {tituloContribuicao}
                    {!isVinculado && (
                      <TooltipInfo
                        descriptionTooltip={
                          simulacao.dadosSimulacao.planoSituacao.toUpperCase() === PlanoSituacaoEnum.AUTOPATROCINADO
                            ? 'A contribuição de participantes auto patrocinados deverá ser duplicada. Esse valor adicional é referente à contrapartida que, em um modelo patrocinado, seria de responsabilidade do patrocinador.'
                            : 'Valor mensal descontado em folha, com contrapartida de igual valor do patrocinador.'
                        }
                      />
                    )}
                  </div>
                ),
                value: formatCurrency(simulacao.contribuicoesMensaisParticipante.normal.bruto),
                percent: simulacao.contribuicoesMensaisParticipante.normal.percentual + '%'
              },
              {
                simulacao: '',
                iconClass: 'fa-regular fa-plus',
                title: '',
                value: '',
                percent: ''
              },
              {
                simulacao: simulacao,
                iconClass: 'fa-kit fa-pay-ras',
                title: 'Facultativa',
                value: formatCurrency(simulacao.contribuicoesMensaisParticipante.facultativa.valor),
                percent: simulacao.contribuicoesMensaisParticipante.facultativa.percentual + '%'
              },
              {
                simulacao: '',
                iconClass: 'fa-regular fa-equals',
                title: '',
                value: '',
                percent: ''
              },
              {
                simulacao: simulacao,
                iconClass: 'fa-kit fa-pay-total',
                title: 'Total a pagar por mês',
                value: formatCurrency(simulacao.contribuicoesMensaisParticipante.total.bruto),
                percent: simulacao.contribuicoesMensaisParticipante.total.percentual + '%',
                primary: true
              }
            ]}
          />
        </>
      )}

      {/* Gráfico de comparação */}
      <Box sx={{ mt: '1.5rem', mb: '1rem' }}>
        {!isBPD && (
          <>
            <TitleSubtitleSection
              title='Benefício Funpresp-jud mensal x Base de contribuição Funpresp-jud'
              subtitle='Veja quanto da sua base de contribuição Funpresp-Jud o Benefício mensal total dessa simulação representa:'
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: '1rem' }}>
              <ComparativoDoughnut
                simulacao={simulacao}
                label2='Base de contribuição Funpresp-jud'
                valor2={simulacao.informacoesAdicionais.base_contribuicao_funpresp}
                descriptionTooltip2='Valor do seu salário que excede o teto do INSS e serve como base para seus cálculos dentro da fundação.'
                label='Benefício Funpresp-jud mensal'
                valor={formatCurrency(simulacao.saldosEBeneficios.beneficio_mensal_total)}
                percentual={calcularPorcentagem(
                  simulacao.saldosEBeneficios.beneficio_mensal_total,
                  Number(
                    simulacao.informacoesAdicionais.base_contribuicao_funpresp
                      .replace('R$', '')
                      .replace('.', '')
                      .replace(',', '.')
                  )
                )}
              />
            </Box>
          </>
        )}
      </Box>
    </AccordionSimulacao>
  )
}
