import { Box, Typography } from '@mui/material'

import HoverButton from '../iris/HoverButton'

import type { DocumentosType } from '../../../types/documentos/DocumentosType'

const cartilhasParticipantesList: DocumentosType[] = [
  {
    nome: 'Cartilha de patrocinados',
    link: 'https://www.funprespjud.com.br/wp-content/uploads/2023/05/cartilha-patrocinado.pdf'
  },
  {
    nome: 'Cartilha de vinculados',
    link: 'https://www.funprespjud.com.br/wp-content/uploads/2023/05/cartilha-vinculado.pdf'
  }
]

export default function ListCartilhasParticipantes() {
  return (
    <div className='flex flex-col gap-3'>
      {cartilhasParticipantesList.map((cartilhaParticipantes: DocumentosType, index: number) => (
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
            <Typography variant='body1'>{cartilhaParticipantes.nome}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HoverButton url={cartilhaParticipantes.link || ''} />
          </Box>
        </Box>
      ))}
    </div>
  )
}
