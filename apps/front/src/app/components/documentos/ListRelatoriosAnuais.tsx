import { Box, Typography } from '@mui/material'

import HoverButton from '../iris/HoverButton'
import type { DocumentosType } from '../../../types/documentos/DocumentosType'

const relatoriosAnuaisList: DocumentosType[] = [
  {
    nome: 'Livro 1',
    link: 'https://www.funprespjud.com.br/wp-content/uploads/2025/04/rai-2024-livro1.pdf'
  },
  {
    nome: 'Livro 2',
    link: 'https://www.funprespjud.com.br/wp-content/uploads/2025/04/rai-2024-livro2.pdf'
  }
]

export default function ListRelatoriosAnuais() {
  return (
    <div className='flex flex-col gap-3'>
      {relatoriosAnuaisList.map((relatorioAnual: DocumentosType, index: number) => (
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
            <Typography variant='body1'>{relatorioAnual.nome}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HoverButton url={relatorioAnual.link || ''} />
          </Box>
        </Box>
      ))}
    </div>
  )
}
