import type { SyntheticEvent } from 'react'
import { useState } from 'react'

import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import type { AccordionProps } from '@mui/material/Accordion'
import type { AccordionDetailsProps } from '@mui/material/AccordionDetails'

import { Grid } from '@mui/material'

import TableContribuicoes from './table/TableContribuicoes'
import TableDemonstrativo from './table/TableDemonstrativo'
import type { PatrocinadorDTOType } from '@/types/patrocinador/PatrocinadorDTOType'
import { aplicarMascaraCNPJ } from '@/app/utils/formatters'
import type { UserType } from '@/types/UserType'
import TextWithLegend from '@/components/ui/TextWithLegend'

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
    fontSize: '1.25rem',
    color: 'var(--mui-palette-text-secondary)'
  },
  '& .accordion-title': {
    color: 'var(--mui-palette-text-primary)'
  },
  '& .fa-chevron-down': {
    color: 'var(--mui-palette-text-secondary)'
  }
}))

// Styled component for AccordionDetails component
const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(() => ({
  padding: `0.5rem 0 !important`
}))

export default function AccordionPreVisualizacao({
  patrocinador,
  ano,
  user
}: {
  patrocinador: PatrocinadorDTOType
  ano: string | null | number
  user: UserType
}) {
  const [expandeds, setExpanded] = useState<string[]>(['panel2'])

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? [...expandeds, panel] : expandeds.filter(p => p !== panel))
  }

  return (
    <>
      <StyledAccordion expanded={expandeds.includes('panel1')} onChange={handleChange('panel1')}>
        <StyledAccordionSummary expandIcon={<i className='fa-regular fa-chevron-down' />}>
          <Typography variant='h5' className='accordion-title'>
            1. Informações do Órgão Patrocinador
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={8}>
              <TextWithLegend legend='Órgão Patrocinador' text={patrocinador?.nome} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextWithLegend legend='CNPB' text={'2013.0017-38'} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextWithLegend legend='Data de ingresso no Órgão' text={patrocinador?.dtInscricaoPlano} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextWithLegend legend='CNPJ' text={aplicarMascaraCNPJ(patrocinador?.cnpj)} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextWithLegend legend='Cargo Efetivo' text={patrocinador?.nmCargo} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </StyledAccordion>

      <StyledAccordion expanded={expandeds.includes('panel2')} onChange={handleChange('panel2')}>
        <StyledAccordionSummary expandIcon={<i className='fa-regular fa-chevron-down' />}>
          <Typography variant='h5' className='accordion-title'>
            2. Contribuições para previdência complementar/FAPI/FUNPRESP
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <TableContribuicoes ano={ano} patrocinador={patrocinador} user={user} />
        </AccordionDetails>
      </StyledAccordion>

      <StyledAccordion expanded={expandeds.includes('panel3')} onChange={handleChange('panel3')}>
        <StyledAccordionSummary expandIcon={<i className='fa-regular fa-chevron-down' />}>
          <Typography variant='h5' className='accordion-title'>
            3. Demonstrativo analítico do Imposto de Renda
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <TableDemonstrativo ano={ano || new Date().getFullYear()} patrocinador={patrocinador} user={user} />
        </AccordionDetails>
      </StyledAccordion>
    </>
  )
}
