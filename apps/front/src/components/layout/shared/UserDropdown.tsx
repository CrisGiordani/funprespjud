'use client'

// React Imports
import { useRef } from 'react'
import type { PropsWithChildren } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { useSettings } from '@core/hooks/useSettings'
import { AvatarCustomized } from '@/components/ui/AvatarCustomized'

import type { PerfilType } from '@/types/perfil/perfil'

type UserDropdownProps = PropsWithChildren & {
  open: boolean
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  profile: PerfilType
}

const UserDropdown = ({ open, setOpen, children, profile }: UserDropdownProps) => {
  const anchorRef = useRef<HTMLDivElement>(null)

  const { settings } = useSettings()

  return (
    <>
      <div ref={anchorRef} className='flex items-center cursor-pointer gap-1' onClick={() => setOpen(!open)}>
        <div className='w-[40px] h-[40px]'>
          <AvatarCustomized alt={profile.nome} src={profile.fotoPerfil} small />
        </div>
        {open ? <i className='fa-regular fa-chevron-up' /> : <i className='fa-regular fa-chevron-down' />}
      </div>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper
              elevation={settings.skin === 'bordered' ? 0 : 8}
              {...(settings.skin === 'bordered' && { className: 'border' })}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Box>{children}</Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
