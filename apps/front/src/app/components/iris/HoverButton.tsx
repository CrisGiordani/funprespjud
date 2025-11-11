import React, { useState } from 'react'

import { Box, Button, Typography } from '@mui/material'

import type { HoverButtonType } from '@/types/ui/HoverButtonType'

export default function HoverButton({ onClick, url }: HoverButtonType) {
  const [hover, setHover] = useState(false)

  const handleClick = () => {
    if (onClick) {
      return onClick()
    }

    return window.open(url, '_blank')
  }

  return (
    <div>
      <Button
        onClick={() => handleClick()}
        variant='outlined'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          border: '1px solid var(--mui-palette-primary-main)',
          borderRadius: '9999px',
          color: 'var(--mui-palette-primary-main)',
          textTransform: 'none',
          transition: 'all 0.2s',
          overflow: 'hidden',
          minWidth: '50px',
          width: '50px',
          height: '50px',
          '&:hover': {
            width: '130px',
            background: '#eaf4fb',
            borderColor: '#1976d2',
            color: '#1976d2'
          }
        }}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{
            transition: 'all 0.3s ease',
            gap: 1,
            width: '100%',
            maxHeight: '100%'
          }}
        >
          <Box
            sx={{
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: hover ? '#eaf4fb' : '#fff',
              transition: 'all 0.2s'
            }}
          >
            <i className='fa-regular fa-eye text-md ms-1' style={{ color: 'var(--mui-palette-primary-main)' }} />
          </Box>
          <Typography
            variant='body1'
            sx={{
              opacity: hover ? 1 : 0,
              width: hover ? '70px' : '0px',
              paddingLeft: hover ? 1 : 0,
              transform: hover ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              color: 'var(--mui-palette-primary-main)',
              display: 'inline-block',
              maxHeight: '100%'
            }}
          >
            Ver PDF
          </Typography>
        </Box>
      </Button>
    </div>
  )
}
