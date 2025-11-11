import React from 'react'

import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { styled } from '@mui/material/styles'
import type { AccordionProps } from '@mui/material/Accordion'
import { Typography, Box } from '@mui/material'

import type { AccordionSimulacaoPropsType } from '@/types/simulacao-beneficio/AccordionSimulacaoPropsTypes'

const StyledAccordion = styled(MuiAccordion)<AccordionProps>(() => ({
  boxShadow: 'none !important',
  border: 'none !important',
  borderTop: '2px solid var(--mui-palette-divider) !important',
  borderRadius: '0 !important',
  '&:not(:last-of-type)': {
    borderBottom: '0 !important'
  }
}))

const StyledAccordionSummary = styled(MuiAccordionSummary)(() => ({
  alignItems: 'flex-start',
  padding: '1rem 0',
  '& .accordion-subtitle': {
    fontWeight: 400,
    color: 'var(--mui-palette-text-secondary)'
  },
  '& .accordion-title': {
    color: 'var(--mui-palette-text-primary)'
  },
  '& .fa-chevron-down': {
    color: 'var(--mui-palette-text-secondary)'
  }
}))

export function AccordionSimulacao({ title, subtitle, expanded, onChange, children }: AccordionSimulacaoPropsType) {
  const match = title.match(/^([0-9]+\.)/)
  const numero = match ? match[1] : ''
  const texto = match ? title.replace(/^([0-9]+\.)\s*/, '') : title

  return (
    <StyledAccordion expanded={expanded} onChange={onChange}>
      <StyledAccordionSummary expandIcon={<i className='fa-regular fa-chevron-down' />}>
        <Box>
          <Typography variant='h4' className='accordion-title'>
            {numero} {texto}
          </Typography>

          {subtitle && (
            <Typography variant='body1' className='accordion-subtitle'>
              {subtitle}
            </Typography>
          )}
        </Box>
      </StyledAccordionSummary>
      <MuiAccordionDetails sx={{ padding: '0', marginTop: '0.5rem' }}>{children}</MuiAccordionDetails>
    </StyledAccordion>
  )
}
