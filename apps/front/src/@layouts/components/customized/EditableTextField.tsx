import React from 'react'
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const EditableTextField = styled(
  React.forwardRef<HTMLDivElement, TextFieldProps & { isDirty?: boolean; suffix?: string }>((props, ref) => {
    const { isDirty, suffix, ...otherProps } = props

    if (suffix) {
      otherProps.inputProps = {
        ...otherProps.inputProps,
        sx: {
          ...otherProps.inputProps?.sx,
          marginTop: '0.5rem',
          width: 'auto',
          fieldSizing: 'content !important'
        }
      }
      otherProps.sx = {
        ...otherProps.sx,
        '& .MuiFilledInput-root': {
          position: 'relative',
          borderBlockEnd: '1px solid var(--mui-palette-text-secondary)',
          '&:after': {
            content: `"${suffix}"`,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderBottom: 'none',
            transform: 'none',
            top: '0.75rem',
            left: '-0.75rem'
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'var(--mui-palette-primary-main)',
            transform: 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease'
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(0, 0, 0, 0.09)',
            '&:before': {
              borderBlockEnd: 'none',
              transform: 'scaleX(1)'
            }
          }
        }
      }
    }

    return (
      <TextField
        ref={ref}
        variant='filled'
        {...otherProps}
        InputProps={{
          ...otherProps.InputProps,
          className: isDirty ? 'Mui-dirty' : undefined
        }}
      />
    )
  })
)(() => ({
  width: '100%',
  '& .MuiFilledInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.09)'
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(0, 0, 0, 0.09)'
    }
  },
  '& .MuiFilledInput-root.Mui-dirty': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.12)'
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(25, 118, 210, 0.12)'
    }
  }
}))

export default EditableTextField
