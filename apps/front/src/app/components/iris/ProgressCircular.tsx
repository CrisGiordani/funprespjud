'use client'
import { styled } from '@mui/material/styles'

import CircularProgress from '@mui/material/CircularProgress'
import type { CircularProgressProps } from '@mui/material/CircularProgress'

const CircularProgressDeterminate = styled(CircularProgress)<CircularProgressProps>(() => ({
  color: 'var(--mui-palette-customColors-trackBg)'
}))

const CircularProgressIndeterminate = styled(CircularProgress)<CircularProgressProps>(({ theme }) => ({
  left: 0,
  position: 'absolute',
  animationDuration: '550ms',
  color: '#1a90ff',
  ...theme.applyStyles('dark', {
    color: '#308fe8'
  })
}))

const ProgressWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',

  // zIndex: 9999
  zIndex: -1
})

export default function ProgressCircular() {
  return (
    <ProgressWrapper>
      <div className='relative'>
        <CircularProgressDeterminate variant='determinate' size={50} thickness={5} value={100} />
        <CircularProgressIndeterminate variant='indeterminate' disableShrink size={50} thickness={5} />
      </div>
    </ProgressWrapper>
  )
}
