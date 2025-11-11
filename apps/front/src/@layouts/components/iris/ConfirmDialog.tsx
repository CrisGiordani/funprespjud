import { useState, useCallback } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  useTheme,
  Grid
} from '@mui/material'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  confirmIcon?: string
  cancelLabel?: string
  cancelIcon?: string
  confirmColor?: 'info' | 'warning' | 'error'
  cancelColor?: 'info' | 'warning' | 'error'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title = 'Confirmação',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  confirmIcon,
  confirmColor = 'info',
  onCancel,
  cancelIcon,
  cancelColor = 'info'
}: ConfirmDialogProps) {
  const theme = useTheme()

  return (
    <Dialog open={open} onClose={onCancel} maxWidth='sm' fullWidth>
      {title && (
        <DialogTitle variant='h4' className='text-center'>
          {title}
        </DialogTitle>
      )}
      <DialogContent>
        <Typography variant='body1'>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ButtonCustomized
              onClick={onConfirm}
              variant='contained'
              color={confirmColor}
              startIcon={confirmIcon ? <i className={confirmIcon} /> : undefined}
            >
              {confirmLabel}
            </ButtonCustomized>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonCustomized
              variant='outlined'
              color={cancelColor}
              onClick={onCancel}
              startIcon={cancelIcon ? <i className={cancelIcon} /> : undefined}
            >
              {cancelLabel}
            </ButtonCustomized>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

// Hook para facilitar o uso do ConfirmDialog
export function useConfirmDialog() {
  const [open, setOpen] = useState(false)

  const [config, setConfig] = useState<Omit<ConfirmDialogProps, 'open' | 'onConfirm' | 'onCancel'>>({
    message: '',
    title: 'Confirmação',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    confirmIcon: undefined,
    cancelIcon: undefined,
    confirmColor: 'info',
    cancelColor: 'info'
  })

  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback(
    (
      message: string,
      options: Partial<Omit<ConfirmDialogProps, 'open' | 'onConfirm' | 'onCancel' | 'message'>> = {}
    ) => {
      setConfig({
        message,
        title: options.title ?? 'Confirmação',
        confirmLabel: options.confirmLabel ?? 'Confirmar',
        cancelLabel: options.cancelLabel ?? 'Cancelar',
        confirmIcon: options.confirmIcon ?? undefined,
        cancelIcon: options.cancelIcon ?? undefined,
        confirmColor: options.confirmColor ?? 'info',
        cancelColor: options.cancelColor ?? 'info'
      })
      setOpen(true)

      return new Promise<boolean>(resolve => {
        setResolvePromise(() => resolve)
      })
    },
    []
  )

  const handleConfirm = useCallback(() => {
    setOpen(false)
    resolvePromise?.(true)
  }, [resolvePromise])

  const handleCancel = useCallback(() => {
    setOpen(false)
    resolvePromise?.(false)
  }, [resolvePromise])

  return {
    ConfirmDialog: () => <ConfirmDialog open={open} {...config} onConfirm={handleConfirm} onCancel={handleCancel} />,
    confirm
  }
}
