'use client'

// Third-party Imports
import type { PropsWithChildren } from 'react'
import React, { useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import classnames from 'classnames'

// Component Imports
import { Box, Button, Divider, Drawer, Typography } from '@mui/material'

import ModeDropdown from '@components/layout/shared/ModeDropdown'
import { ViewerModeIndicator } from '@components/layout/shared/ViewerModeIndicator'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import verticalMenuData from '@/data/navigation/verticalMenuData'
import useVerticalNav from '@/@menu/hooks/useVerticalNav'
import RoleBasedProfileBox from '../vertical/RoleBasedProfileBox'
import { VerticalMenuContentData } from '../vertical/VerticalMenuContentData'
import StyledVerticalMenu from '@/@menu/styles/vertical/StyledVerticalMenu'

// Util Imports
import { menuClasses } from '@/@menu/utils/menuClasses'

// Style Imports
import styles from '@/@menu/styles/styles.module.css'
import { useAuth } from '@/contexts/AuthContext'
import TextWithLegend from '@/components/ui/TextWithLegend'
import { apiNode, clearTokenCache } from '@/lib/api'
import { useProfile } from '@/contexts/ProfileContext'
import type { PerfilType } from '@/types/perfil/perfil'
import UserDropdown from '../shared/UserDropdown'
import { useViewerMode } from '@/hooks/useViewerMode'
import Logo from '@/@core/svg/Logo'

type MenuDataProps = {
  open?: boolean
  setOpen: (open: boolean) => void
  isMobile?: boolean
  profile?: PerfilType
  logout: () => void
}

function MenuContent({ setOpen, profile, isMobile, logout }: MenuDataProps) {
  return (
    <Box className='flex flex-col gap-4 p-4' sx={{ width: 300 }}>
      {isMobile && (
        <Box className='text-right p-0'>
          <Button className='p-0' onClick={() => setOpen(false)}>
            <i className='fa-regular fa-xmark text-xl text-black' />
          </Button>
        </Box>
      )}

      <Box>{profile && <TextWithLegend text={profile.nome} legend={profile.email} legendPosition='bottom' />}</Box>

      <RoleBasedProfileBox />

      {isMobile && (
        <>
          <Divider />

          <Box>
            <StyledVerticalMenu className={classnames(menuClasses.root)}>
              <ul className={styles.ul} onClick={() => setOpen(false)}>
                <VerticalMenuContentData />
              </ul>
            </StyledVerticalMenu>
          </Box>
        </>
      )}

      <Divider />

      <Box className='w-full px-4'>
        <Button
          fullWidth
          variant='contained'
          color='error'
          endIcon={<i className='fa-regular fa-right-from-bracket' />}
          onClick={logout}
        >
          Sair
        </Button>
      </Box>
    </Box>
  )
}

type MenuHamburgerProps = PropsWithChildren & {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
}

function MenuHamburger({ open, setOpen, children }: MenuHamburgerProps) {
  return (
    <React.Fragment>
      {!open ? (
        <Button onClick={() => setOpen(true)}>
          <i className='fa-regular fa-bars text-2xl text-black' />
        </Button>
      ) : (
        <Drawer anchor={'right'} open={open} onClose={() => setOpen(false)}>
          {children}
        </Drawer>
      )}
    </React.Fragment>
  )
}

const NavbarContent = () => {
  const [open, setOpen] = useState<boolean>(false)

  const router = useRouter()
  const pathname = usePathname()

  const { exitViewerMode } = useViewerMode()
  const { isBreakpointReached: isBreakpointReachedContext } = useVerticalNav()
  const { clearUser } = useAuth()
  const { profile } = useProfile()

  const getTitle = () => {
    const menu = verticalMenuData()

    const menuItem = menu.find(item => 'href' in item && item.href === pathname)

    return menuItem && 'label' in menuItem ? menuItem.label : undefined
  }

  const clearSessionData = () => {
    if (typeof window === 'undefined') return
    sessionStorage.clear()
  }

  const handleUserLogout = async () => {
    try {
      // Limpa o usuário e cache imediatamente para evitar requisições desnecessárias
      clearUser()
      clearTokenCache()
      exitViewerMode()

      const response = await apiNode.get('/auth/logout')

      if (!response.data) {
        throw new Error('Logout response is empty')
      }

      clearSessionData()

      router.push('/login')
    } catch (error) {
      clearUser()
      clearTokenCache()

      if (typeof window !== 'undefined') {
        sessionStorage.clear()
      }

      router.push('/login')
    }
  }

  return (
    <div
      className={classnames(
        horizontalLayoutClasses.navbarContent,
        'flex items-center justify-between gap-4 is-full py-2'
      )}
    >
      <div className='flex items-center gap-2'>
        {isBreakpointReachedContext && <Logo className='w-[35px] h-[35px]' />}
        <Typography
          variant={isBreakpointReachedContext ? 'h5' : 'h3'}
          sx={{ color: 'var(--mui-palette-text-secondary)' }}
        >
          {getTitle()}
        </Typography>
        <ViewerModeIndicator />
      </div>
      <div className='flex items-center'>
        <ModeDropdown />
        {isBreakpointReachedContext ? (
          <MenuHamburger open={open} setOpen={setOpen}>
            <MenuContent open={open} setOpen={setOpen} profile={profile} isMobile logout={handleUserLogout} />
          </MenuHamburger>
        ) : (
          <UserDropdown open={open} setOpen={setOpen} profile={profile}>
            <MenuContent open={open} setOpen={setOpen} profile={profile} logout={handleUserLogout} />
          </UserDropdown>
        )}
      </div>
    </div>
  )
}

export default NavbarContent
