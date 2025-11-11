import { Box, Typography } from '@mui/material'

import type { DocumentosType } from '../../../types/documentos/DocumentosType'

import HoverButton from '../iris/HoverButton'

const documentosInstitucionaisList: DocumentosType[] = [
  {
    nome: 'Regulamento do plano de benefícios',
    link: 'https://www.funprespjud.com.br/wp-content/uploads/2015/07/Plano-de-Benef%c3%adcios-Funpresp-Jud_2015_modelo2.pdf'
  },
  {
    nome: 'Estatuto da Funpresp-Jud',
    link: 'https://www.funprespjud.com.br/wp-content/uploads/2023/04/estatuto-social-funprespjud.pdf'
  }
]

export default function ListDocumentosInstitucionais() {
  return (
    <div className='flex flex-col gap-3'>
      {documentosInstitucionaisList.map((documentoInstitucional: DocumentosType, index: number) => (
        <Box
          key={index}
          component='section'
          sx={{
            height: '100px',
            p: '1rem',
            border: '1px solid var(--mui-palette-divider)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <i className='fa-regular fa-file-pdf text-2xl' style={{ color: '#0578BE' }} />
            <Typography variant='body1'>{documentoInstitucional.nome}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HoverButton url={documentoInstitucional.link || ''} />
          </Box>
        </Box>
      ))}
    </div>
  )
}
