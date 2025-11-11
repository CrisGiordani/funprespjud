'use client'

// React Imports
import { useState, useRef } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

import { Portal } from '@mui/material'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useAuth } from '@/contexts/AuthContext'
import { useRoleNavigation } from '@/hooks/useRoleNavigation'
import { useViewerMode } from '@/hooks/useViewerMode'

// Styled Components
const ProfileBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  padding: '1rem 0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
}))

const CompactProfileBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  margin: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  minHeight: '40px',
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
}))

const ProfileInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  margin: 0
})

// Papeis de usuário (Postgres)
export const PAPEIS: Record<string, string> = {
  USER_ADMIN: 'ADMINISTRADOR',
  USER_OPERATOR: 'OPERADOR',
  USER_PARTICIPANT: 'PARTICIPANTE',
  USER_SPONSOR: 'PATROCINADOR'
}

// Função para obter o nome da role
const getRoleDisplayName = (role: string): string => {
  return PAPEIS[role] || role
}

const RoleBasedProfileBox = () => {
  // States
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)

  // Hooks
  const { isCollapsed, isHovered, isBreakpointReached } = useVerticalNav()
  const { user } = useAuth()
  const { navigateToRole } = useRoleNavigation()
  const { exitViewerMode } = useViewerMode()

  const roles = user?.roles.filter(role => Object.keys(PAPEIS).includes(role))

  // Se não há usuário ou roles, não renderizar
  if (!user || !roles || roles.length === 0) {
    return null
  }

  const primaryRole = roles[0]

  // Determinar a role atual baseada na URL
  const getCurrentRole = () => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname

      if (pathname.startsWith('/admin')) {
        // Se está na área admin, procurar por USER_ADMIN ou USER_OPERATOR
        return roles.find(role => role === 'USER_ADMIN' || role === 'USER_OPERATOR') || primaryRole
      } else {
        // Se está na área principal, procurar por USER_PARTICIPANT ou USER_SPONSOR
        return roles.find(role => role === 'USER_PARTICIPANT' || role === 'USER_SPONSOR') || primaryRole
      }
    }

    return primaryRole
  }

  const currentRole = getCurrentRole()
  const hasMultipleRoles = roles.length > 1

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleRoleSelect = (role: string) => {
    exitViewerMode()
    navigateToRole(role)
    setOpen(false)
  }

  // Show compact version when collapsed and not hovered
  const showCompact = !isBreakpointReached && isCollapsed && !isHovered

  if (showCompact) {
    return (
      <CompactProfileBox>
        <i className='ri-user-line text-lg' />
      </CompactProfileBox>
    )
  }

  if (!hasMultipleRoles) {
    return null
  }

  return (
    <div className={`flex flex-col gap-1`}>
      <ProfileBox
        ref={anchorRef}
        onClick={hasMultipleRoles ? handleToggle : undefined}
        style={{
          backgroundColor: 'rgb(var(--mui-mainColorChannels-gray))',
          padding: '.5rem .8rem',
          borderRadius: '5px'
        }}
      >
        <ProfileInfo>
          <Typography variant='body1' className='font-semibold'>
            {getRoleDisplayName(currentRole)}
          </Typography>
        </ProfileInfo>
        {hasMultipleRoles && (
          <i className='fa-regular fa-arrow-up-arrow-down text-[var(--mui-palette-text-secondary)]' />
        )}
      </ProfileBox>

      {open ? (
        <Portal container={() => container.current!}>
          <MenuList>
            {roles.map((role, index) => (
              <MenuItem key={index} onClick={() => handleRoleSelect(role)} className='gap-3 pli-4'>
                <Typography color='text.primary'>{getRoleDisplayName(role)}</Typography>
              </MenuItem>
            ))}
          </MenuList>
        </Portal>
      ) : null}
      <Box ref={container} />
    </div>
  )
}

export default RoleBasedProfileBox
