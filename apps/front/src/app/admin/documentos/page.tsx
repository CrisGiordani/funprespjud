// MUI Imports
import { Typography, Box } from '@mui/material'

const DocumentosPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        Gerenciamento de Documentos
      </Typography>

      <Typography variant='body1' color='text.secondary'>
        Página para acessar e gerenciar documentos do sistema.
      </Typography>
    </Box>
  )
}

export default DocumentosPage
