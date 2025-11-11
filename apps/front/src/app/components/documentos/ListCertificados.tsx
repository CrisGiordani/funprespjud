import { Box, Typography } from '@mui/material'

import HoverButton from '../iris/HoverButton'
import type { DocumentosType } from '../../../types/documentos/DocumentosType'
import { useAuth } from '../../../contexts/AuthContext'
import useEmitirCertificado from '../../../hooks/useEmitirCertificado'
import { useToast } from '../../../@layouts/components/customized/Toast'

const certificadosList: DocumentosType[] = [
  {
    nome: 'Certificado do Participante'
  }
]

export default function ListCertificados() {
  const { Toast, showToast } = useToast()

  const { user } = useAuth()

  const { emitirCertificado } = useEmitirCertificado()

  const handleEmitirCertificado = async (cpf: string) => {
    try {
      return await emitirCertificado({ cpf: cpf })
    } catch (error) {
      showToast('Certificado não emitido', 'warning')
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <Toast />
      {certificadosList.map((certificado: DocumentosType, index: number) => (
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
            <Typography variant='body1'>{certificado.nome}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HoverButton onClick={() => handleEmitirCertificado(user?.cpf || '')} />
          </Box>
        </Box>
      ))}
    </div>
  )
}
