'use client'

// Component Imports
import { useEffect, useState, useCallback } from 'react'

import { MenuItem, MenuSection } from '@menu/vertical-menu'

import { PapeisEPermissoesService2 } from '@/services/PapeisEPermissoesService'
import { useAuth } from '@/contexts/AuthContext'
import type { PermissionType } from '@/types/permissions/PermissionType'
import type { VerticalMenuDataType } from '@/types/menuTypes'
import verticalMenuData from '@/data/navigation/verticalMenuData'

export function VerticalMenuContentData() {
  const [userPermissions, setUserPermissions] = useState<PermissionType[]>([])

  const { user } = useAuth()

  const getUserPermissions = useCallback(async () => {
    if (user?.roles) {
      const permissions = await PapeisEPermissoesService2.getPermissionsUser(user.roles, user.cpf)

      setUserPermissions(permissions || [])
    }
  }, [user?.roles])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  // Renderização síncrona: não criar Promises durante o render
  const items = verticalMenuData().map((item: VerticalMenuDataType) => {
    // Verificação de permissão somente quando disponível; antes disso, permite renderizar
    if ('permissoes' in item) {
      const hasPermission =
        userPermissions.length === 0 ? true : PapeisEPermissoesService2.can(userPermissions, item?.permissoes || [])

      if (!hasPermission) return null
    }

    if (!('label' in item)) return null

    if (!('href' in item)) {
      return <MenuSection key={item.label as string} label={item.label as string} />
    }

    return (
      <MenuItem
        key={item.label as string}
        href={item.href as string}
        icon={<i className={item.icon as string} />}
        {...(item.href?.includes('https') ? { target: '_blank' } : {})}
      >
        {item.label}
      </MenuItem>
    )
  })

  return items
}
