// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useAuth } from '@/contexts/AuthContext'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import adminMenuItemStyles from '@core/styles/vertical/adminMenuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => {
  return (
    <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
      <i className='ri-arrow-right-s-line' />
    </StyledVerticalNavExpandIcon>
  )
}

const AdminMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { user } = useAuth()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  // Verificar se o usuário é admin
  const isAdmin = user?.roles?.includes('USER_ADMIN') ?? false

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Admin Menu - Menu exclusivo para administração */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={adminMenuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/admin' exactMatch={true} icon={<i className='ri-home-line' />} className='!bg-[#1a1a1a]'>
          Início
        </MenuItem>
        <MenuItem
          href='/admin/usuarios'
          icon={<i className='ri-group-line' />}
          exactMatch={false}
          activeUrl='/admin/usuarios'
          className='!bg-[#1a1a1a]'
        >
          Usuários
        </MenuItem>
        <MenuItem
          href='/admin/documentos'
          icon={<i className='ri-file-text-line' />}
          exactMatch={false}
          activeUrl='/admin/documentos'
          className='!bg-[#1a1a1a]'
        >
          Documentos
        </MenuItem>
        {isAdmin && (
          <MenuItem
            href='/admin/campanhas'
            icon={<i className='ri-megaphone-line' />}
            exactMatch={false}
            activeUrl='/admin/campanhas'
            className='!bg-[#1a1a1a]'
          >
            Campanhas
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem
            href='/admin/permissoes'
            icon={<i className='ri-shield-keyhole-line' />}
            exactMatch={false}
            activeUrl='/admin/permissoes'
            className='!bg-[#1a1a1a]'
          >
            Permissões
          </MenuItem>
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default AdminMenu
