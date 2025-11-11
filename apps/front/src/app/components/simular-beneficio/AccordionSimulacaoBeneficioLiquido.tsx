import React from 'react'

import { Typography, Box, Divider, Card } from '@mui/material'

import { AccordionSimulacao } from './AccordionSimulacao'
import type { AccordionPropsType } from '@/types/simulacao-beneficio/AccordionPropsTypes'
import { formatCurrency } from '@/app/utils/formatters'

function BeneficioItem({
  title,
  subtitle,
  value,
  icon
}: {
  title: string
  subtitle: string
  value: string
  icon: string
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        pb: 5
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flex: 1 }}>
        <i className={`${icon} text-primary-main text-2xl`} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary) !important' }}>
            {title.toLocaleUpperCase()}
          </Typography>
          <Typography variant='body1'>{subtitle}</Typography>
        </Box>
      </Box>
      <Typography
        variant='h5'
        sx={{
          color: `${value.includes('-') ? 'var(--mui-palette-error-main) !important' : 'var(--mui-palette-text-primary) !important'}`,
          fontWeight: 600
        }}
      >
        {value.includes('-') ? `- ${value.replace('-', '')}` : value}
      </Typography>
    </Box>
  )
}

export function AccordionSimulacaoBeneficioLiquido({ simulacao, expanded, onChange, subtitle }: AccordionPropsType) {
  return (
    <div className='mb-6'>
      <AccordionSimulacao
        simulacao={simulacao}
        title='4. Simulação do benefício líquido (Tributação regressiva)'
        subtitle={subtitle}
        expanded={expanded}
        onChange={onChange}
      >
        <Card
          variant='outlined'
          sx={{
            padding: '1rem'
          }}
        >
          {/* Benefício Bruto */}
          <BeneficioItem
            title='BENEFÍCIO BRUTO PROJETADO NA FUNPRESP-JUD'
            subtitle={`
            - Aposentadoria normal (${formatCurrency(simulacao.saldosEBeneficios.beneficio_normal_mensal)}) +
                Benefício suplementar (${formatCurrency(simulacao.saldosEBeneficios.beneficio_suplementar_mensal)})
          `}
            value={formatCurrency(simulacao.beneficioLiquido.beneficio_bruto)}
            icon='fa-kit fa-funpresp'
          />

          {/* IRPF Regressivo */}
          <BeneficioItem
            title='IRPF REGRESSIVO'
            subtitle={`
            - ${simulacao.beneficioLiquido.irpf_regressivo.percentual}% (considerando o tempo de acumulação maior que 10 anos)
          `}
            value={formatCurrency(simulacao.beneficioLiquido.irpf_regressivo.valor)}
            icon='fa-regular fa-arrow-down-wide-short'
          />

          {/* Contribuição Administrativa */}
          <BeneficioItem
            title='CONTRIBUIÇÃO ADMINISTRATIVA'
            subtitle={`
            - Considerando a contribuição de ${simulacao.beneficioLiquido.contribuicao_administrativa.percentual}%
          `}
            value={formatCurrency(simulacao.beneficioLiquido.contribuicao_administrativa.valor)}
            icon='fa-regular fa-briefcase-arrow-right'
          />

          <Divider sx={{ borderWidth: '1.5px', borderColor: 'var(--mui-palette-divider) !important' }} />

          {/* Resultado Final */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: '1rem'
            }}
          >
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary) !important' }}>
              BENEFÍCIO LÍQUIDO PROJETADO NA FUNPRESP-JUD
            </Typography>
            <Typography
              variant='h5'
              sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--mui-palette-text-primary) !important' }}
            >
              {formatCurrency(simulacao.beneficioLiquido.beneficio_liquido)}
            </Typography>
          </Box>
        </Card>
      </AccordionSimulacao>
    </div>
  )
}
