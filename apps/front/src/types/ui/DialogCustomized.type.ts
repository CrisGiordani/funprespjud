import type { Breakpoint } from '@mui/material'

export type DialogCustomizedProps = {
  id: string
  open: boolean
  onClose?: () => void
  title?: React.ReactNode
  content?: React.ReactNode
  actions?: React.ReactNode
  showCloseButton?: boolean
  textAlign?: 'center' | 'left' | 'right'
  fullWidth?: boolean
  maxWidth?: Breakpoint | false
}
