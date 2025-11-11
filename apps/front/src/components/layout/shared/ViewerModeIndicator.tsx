'use client'
import { Chip, Button } from '@mui/material'

import { useViewerMode } from '@/hooks/useViewerMode'
import { useAuth } from '@/contexts/AuthContext'

export const ViewerModeIndicator = () => {
  const { isViewerMode, exitViewerMode } = useViewerMode()
  const { user } = useAuth()

  if (!isViewerMode() || !window.opener) {
    return null
  }

  const displayText = `MODO CONSULTA ATIVADO: ${user?.nome.toUpperCase() || 'Usuário'}`

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Chip
        icon={<i className='fa-regular fa-eye' />}
        label={displayText}
        sx={{
          height: '38px',
          borderRadius: '10px',
          padding: '0 16px',
          gap: '8px',
          backgroundColor: '#F7B731',
          color: '#000000'
        }}
        color='warning'
        size='small'
        variant='filled'
      />
      <Button size='small' variant='outlined' color='error' onClick={exitViewerMode}>
        Sair
      </Button>
    </div>
  )
}
