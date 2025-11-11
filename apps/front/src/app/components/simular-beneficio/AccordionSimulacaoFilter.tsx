import React from 'react'

import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { styled } from '@mui/material/styles'
import type { AccordionProps } from '@mui/material/Accordion'
import { Typography, Box } from '@mui/material'

import type { AccordionSimulacaoFilterPropsType } from '@/types/simulacao-beneficio/AccordionSimulacaoPropsTypes'

const StyledAccordion = styled(MuiAccordion)<AccordionProps>(() => ({
  marginTop: '1rem !important',
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
  '& .accordion-title': {
    color: 'var(--mui-palette-text-primary)',
    fontSize: '1.25rem',
    fontWeight: 400
  },
  '& .fa-chevron-down': {
    color: 'var(--mui-palette-text-secondary)'
  }
}))

export function AccordionSimulacaoFilter({ title, expanded, onChange, children }: AccordionSimulacaoFilterPropsType) {
  return (
    <StyledAccordion expanded={expanded} onChange={onChange}>
      <StyledAccordionSummary expandIcon={<i className='fa-regular fa-chevron-down' />}>
        <Box>
          <Typography variant='h4' className='accordion-title'>
            {title}
          </Typography>
        </Box>
      </StyledAccordionSummary>
      <MuiAccordionDetails sx={{ padding: '0', marginTop: '0.5rem' }}>{children}</MuiAccordionDetails>
    </StyledAccordion>
  )
}
