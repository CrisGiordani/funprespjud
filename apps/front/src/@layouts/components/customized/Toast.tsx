import { useState, useCallback } from 'react'

import type { AlertColor } from '@mui/material'
import { Snackbar, Alert } from '@mui/material'

interface ToastProps {
  open: boolean
  message: string
  severity: AlertColor
  onClose: () => void
  autoHideDuration?: number
  customIcon?: React.ReactNode
  customStyles?: React.CSSProperties
}

export default function Toast({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
  customIcon,
  customStyles
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        variant='filled'
        onClose={onClose}
        severity={severity}
        icon={customIcon}
        sx={{
          width: '100%',
          opacity: 1,
          '& .MuiAlert-icon': {
            opacity: 1
          },
          zIndex: 10000,
          ...customStyles
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

// Hook para gerenciar o estado do Toast
export function useToast() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('info')
  const [customIcon, setCustomIcon] = useState<React.ReactNode | undefined>(undefined)
  const [customStyles, setCustomStyles] = useState<React.CSSProperties | undefined>(undefined)

  const showToast = useCallback(
    (message: string, severity: AlertColor = 'info', icon?: React.ReactNode, styles?: React.CSSProperties) => {
      // Usar setTimeout para garantir que o estado seja atualizado corretamente
      setTimeout(() => {
        setMessage(message)
        setSeverity(severity)
        setCustomIcon(icon)
        setCustomStyles(styles)
        setOpen(true)
      }, 0)
    },
    [open]
  )

  const hideToast = useCallback(() => {
    setOpen(false)
  }, [])

  const ToastComponent = useCallback(() => {
    return (
      <Toast
        open={open}
        message={message}
        severity={severity}
        onClose={hideToast}
        customIcon={customIcon}
        customStyles={customStyles}
      />
    )
  }, [open, message, severity, hideToast, customIcon, customStyles])

  return {
    Toast: ToastComponent,
    showToast,
    hideToast
  }
}
