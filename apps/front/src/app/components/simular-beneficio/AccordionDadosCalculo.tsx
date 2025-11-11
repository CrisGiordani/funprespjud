import React from 'react'

import { Typography, Box, Card, Grid } from '@mui/material'

import { AccordionSimulacao } from './AccordionSimulacao'
import type { AccordionPropsType } from '@/types/simulacao-beneficio/AccordionPropsTypes'
import { TitleSubtitleSection } from './TitleSubtitleSection'
import { TableCustomized } from '@/components/ui/TableCustomized'
import { formatarDataBR, formatCurrency, formatPercentage } from '@/app/utils/formatters'

export function AccordionDadosCalculo({ simulacao, expanded, onChange, subtitle }: AccordionPropsType) {
  const dados = [
    {
      icon: 'fa-regular fa-star',
      label: 'Data de nascimento',
      value: simulacao.dadosParticipante.data_nascimento
    },
    {
      icon: 'fa-regular fa-id-card-clip',
      label: 'Tipo de Participante',
      value: simulacao.dadosParticipante.tipo_participante
    },
    {
      icon: 'fa-regular fa-calendar-plus',
      label: 'Data de adesão',
      value: simulacao.dadosSimulacao.dtInscricaoPlano ? formatarDataBR(simulacao.dadosSimulacao.dtInscricaoPlano) : '-'
    },
    {
      icon: 'fa-regular fa-calendar-check',
      label: 'Idade provável de aposentadoria',
      value: simulacao.dadosParticipante.idade_provavel_aposentadoria
    },
    {
      icon: 'fa-regular fa-calendar-heart',
      label: 'Prazo de recebimento da aposentadoria normal',
      value: simulacao.dadosParticipante.prazo_recebimento_aposentadoria_normal
    },
    {
      icon: 'fa-regular fa-calendar-clock',
      label: 'Prazo de recebimento da aposentadoria suplementar',
      value: simulacao.dadosParticipante.prazo_recebimento_aposentadoria_suplementar
    }
  ]

  return (
    <AccordionSimulacao
      simulacao={simulacao}
      title='5. Dados usados para os cálculos'
      subtitle={subtitle}
      expanded={expanded}
      onChange={onChange}
    >
      <Box sx={{ marginTop: '-2rem' }}>
        <TitleSubtitleSection title='Dados do Participante' />

        <Card variant='outlined' sx={{ padding: '1rem' }}>
          {dados.map((item, idx) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '.5rem',
                bgcolor: idx % 2 === 1 ? '#F2F2F2' : '#FFFFFF'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <i className={`${item.icon} text-primary-main text-xl`} />
                <Typography variant='body1'>{item.label}</Typography>
              </Box>
              <Typography
                variant='body1'
                sx={{ fontWeight: 700, textAlign: 'right', color: 'var(--mui-palette-text-primary) !important' }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Card>
      </Box>

      <TitleSubtitleSection title='Informações adicionais' />

      <Grid container spacing={2}>
        <Grid item md={12} lg={4}>
          <Card
            variant='outlined'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'center',
              padding: '1rem',
              height: '100%'
            }}
          >
            <Typography variant='body1'>Aporte extraordinário ou portabilidade</Typography>
            <Typography variant='h5' sx={{ fontSize: '1.25rem', color: 'var(--mui-palette-text-primary) !important' }}>
              {simulacao.informacoesAdicionais.aporte_extraordinario_ou_portabilidade}
            </Typography>
          </Card>
        </Grid>
        <Grid item md={12} lg={4}>
          <Card
            variant='outlined'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'center',
              padding: '1rem',
              height: '100%'
            }}
          >
            <Typography variant='body1'>Rentabilidade real anual</Typography>
            <Typography variant='h5' sx={{ fontSize: '1.25rem', color: 'var(--mui-palette-text-primary) !important' }}>
              {simulacao.informacoesAdicionais.rentabilidade_real_anual}
            </Typography>
          </Card>
        </Grid>
        <Grid item md={12} lg={4}>
          <Card
            variant='outlined'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'center',
              padding: '1rem',
              height: '100%'
            }}
          >
            <Typography variant='body1'>Saque ({simulacao.informacoesAdicionais.percentual_saque})</Typography>
            <Typography variant='h5' sx={{ fontSize: '1.25rem', color: 'var(--mui-palette-text-primary) !important' }}>
              {simulacao.saldosEBeneficios.saldo_suplementar_total
                ? formatCurrency(
                    simulacao.saldosEBeneficios.saldo_suplementar_total *
                      (simulacao.informacoesAdicionais.percentual_saque.replace('%', '') / 100)
                  )
                : '-'}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <TitleSubtitleSection title='Plano de custeio vigente' />

      <TableCustomized
        headers={['Contribuição', 'RAN', 'RAS', 'FCBE', 'Taxa de carregamento']}
        rows={[
          [
            'Patrocinada',
            `${formatPercentage(simulacao.planoCusteioVigente.patrocinada.RAN)}`,
            `${formatPercentage(simulacao.planoCusteioVigente.patrocinada.RAS)}`,
            `${formatPercentage(simulacao.planoCusteioVigente.patrocinada.FCBE)}`,
            `${formatPercentage(simulacao.planoCusteioVigente.patrocinada.taxa_carregamento)}`
          ],
          [
            'Vinculada',
            simulacao.planoCusteioVigente.vinculada.RAN,
            simulacao.planoCusteioVigente.vinculada.RAS,
            simulacao.planoCusteioVigente.vinculada.FCBE,
            simulacao.planoCusteioVigente.vinculada.taxa_carregamento
          ],
          [
            'Facultativa',
            simulacao.planoCusteioVigente.facultativa.RAN,
            simulacao.planoCusteioVigente.facultativa.RAS,
            simulacao.planoCusteioVigente.facultativa.FCBE,
            simulacao.planoCusteioVigente.facultativa.taxa_carregamento
          ]
        ]}
      />
    </AccordionSimulacao>
  )
}
