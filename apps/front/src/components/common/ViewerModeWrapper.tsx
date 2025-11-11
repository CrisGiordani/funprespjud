'use client'

import type { ReactNode } from 'react'

import { Box, Alert } from '@mui/material'

import { useAuth } from '@/contexts/AuthContext'

interface ViewerModeWrapperProps {
  children: ReactNode
  showAlert?: boolean
  alertMessage?: string
  disabled?: boolean
}

const ViewerModeWrapper = ({
  children,
  showAlert = true,
  alertMessage = 'Esta funcionalidade está desabilitada no modo consulta',
  disabled = false
}: ViewerModeWrapperProps) => {
  const { user } = useAuth()
  const isViewerMode = user?.viewerMode === true
  const shouldDisable = isViewerMode || disabled

  if (shouldDisable) {
    return (
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <Box sx={{ opacity: 0.6, pointerEvents: 'none' }}>{children}</Box>

        {showAlert && isViewerMode && (
          <Alert
            severity='info'
            sx={{
              mt: 1,
              fontSize: '12px',
              '& .MuiAlert-message': {
                fontSize: '12px'
              }
            }}
          >
            {alertMessage}
          </Alert>
        )}
      </Box>
    )
  }

  return <>{children}</>
}

export default ViewerModeWrapper
