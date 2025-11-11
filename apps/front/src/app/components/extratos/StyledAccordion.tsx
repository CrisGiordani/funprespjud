import { styled } from '@mui/material/styles'
import type { AccordionProps } from '@mui/material/Accordion'
import MuiAccordion from '@mui/material/Accordion'

// Styled Components para Accordion
export const StyledAccordion = styled(MuiAccordion)<AccordionProps>(() => ({
  boxShadow: 'none !important',
  border: 'none !important',
  borderBottomLeftRadius: '0 !important',
  borderBottomRightRadius: '0 !important',
  borderTopLeftRadius: '0 !important',
  borderTopRightRadius: '0 !important',
  overflow: 'hidden',
  '& .MuiAccordionDetails-root': {
    paddingTop: '40px !important',
    paddingBottom: '40px !important',
    paddingLeft: '130px !important',
    paddingRight: '60px !important',
    '@media (max-width: 768px)': {
      padding: '1.5rem 1rem !important'
    }
  },
  '& .Mui-expanded': {
    margin: '0 !important'
  }
}))
