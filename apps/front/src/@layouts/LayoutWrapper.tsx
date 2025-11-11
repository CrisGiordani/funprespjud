'use client'

// React Imports
import { useCallback, useEffect, useState, type ReactElement } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useLayoutInit from '@core/hooks/useLayoutInit'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import verticalMenuData from '@/data/navigation/verticalMenuData'
import { VerticalMenuDataType } from '@/types/menuTypes'
import { useToast } from './components/customized/Toast'
import { PapeisEPermissoesService2 } from '@/services/PapeisEPermissoesService'

type LayoutWrapperProps = {
  systemMode: SystemMode
  verticalLayout: ReactElement
  horizontalLayout: ReactElement
}

const LayoutWrapper = (props: LayoutWrapperProps) => {
  // Props
  const { systemMode, verticalLayout, horizontalLayout } = props

  // Hooks
  const { settings } = useSettings()
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { Toast, showToast } = useToast()
  useLayoutInit(systemMode)

  const permissoesPagina = verticalMenuData().find(
    (item): item is VerticalMenuDataType => 'href' in item && 'permissoes' in item && item.href === pathname
  )

  const getUserPermissions = useCallback(async () => {
    if (user?.roles) {
      const permissions = await PapeisEPermissoesService2.getPermissionsUser(user.roles, user.cpf)

      const hasPermission =
        permissoesPagina && permissoesPagina.permissoes && Array.isArray(permissoesPagina.permissoes)
          ? PapeisEPermissoesService2.can(permissions, permissoesPagina.permissoes)
          : true

      if (!hasPermission) {
        showToast(`Você não tem permissão para acessar a página: ${permissoesPagina?.label}`, 'warning')
        router.push('/inicio')
      }
    }
  }, [user?.roles])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  // Return the layout based on the layout context
  return (
    <div className='flex flex-col flex-auto' data-skin={settings.skin}>
      <Toast />
      {settings.layout === 'horizontal' ? horizontalLayout : verticalLayout}
    </div>
  )
}

export default LayoutWrapper
