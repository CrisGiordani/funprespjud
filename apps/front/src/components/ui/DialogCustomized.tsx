import * as React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import type { DialogCustomizedProps } from '@/types/ui/DialogCustomized.type'

export function DialogCustomized({
  id,
  open,
  onClose = () => {},
  title,
  content,
  actions,
  showCloseButton = true,
  textAlign = 'left',
  ...props
}: DialogCustomizedProps) {
  return (
    <Dialog
      id={id}
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          padding: '1rem',
          borderRadius: '8px',
          '@media (max-width: 600px)': {
            width: 'calc(100% - 1rem)',
            margin: '0',
            padding: '0'
          }
        }
      }}
      {...props}
    >
      <div className='flex items-center justify-center relative sm:px-2 px-0'>
        {title && (
          <DialogTitle
            id='customized-dialog-title'
            textAlign={textAlign}
            sx={{
              paddingBottom: 0,
              width: '100%',
              fontSize: '1.5rem'
            }}
          >
            {title}
          </DialogTitle>
        )}
        {showCloseButton && (
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={theme => ({
              position: 'absolute',
              right: 0,
              top: 0,
              color: theme.palette.grey[500]
            })}
            className='hover:bg-transparent'
          >
            <CloseIcon sx={{ width: '30px', height: '30px' }} />
          </IconButton>
        )}
      </div>

      <DialogContent>{content}</DialogContent>

      {actions && <DialogActions className='flex flex-col items-center justify-center gap-4'>{actions}</DialogActions>}
    </Dialog>
  )
}
