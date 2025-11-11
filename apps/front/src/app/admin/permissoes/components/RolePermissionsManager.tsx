'use client'

import { useState } from 'react'

import { Box, Chip, CircularProgress } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

import { AddPermissionToRole } from './AddPermissionToRole'
import type { RoleType } from '@/types/permissions/RolesType'
import type { PermissionType } from '@/types/permissions/PermissionType'
import { apiNode } from '@/lib/api'

type RolePermissionsManagerProps = {
  role: RoleType
  permissions: PermissionType[]
  fetchRoles: () => Promise<void>
}

export function RolePermissionsManager({ role, permissions, fetchRoles }: RolePermissionsManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const removePermission = async (permissionId: number) => {
    setIsUpdating(true)

    try {
      const updatedPermissions = role.permissions.filter(rolePermission => rolePermission.id !== permissionId)

      await apiNode
        .put('/permissions/roles', {
          roleId: role.id,
          permissions: updatedPermissions.map(rolePermission => rolePermission.id)
        })
        .then(async () => {
          await fetchRoles()
        })
        .catch(error => {
          console.error('Erro ao remover permissão:', error)
        })
    } catch (error) {
      console.error('Erro ao remover permissão:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getPermissionDescription = (permissionId: number) => {
    return permissions.find(p => p.id === permissionId)?.name || `Permissão ${permissionId}`
  }

  const rolePermissions = {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions.length > 0 ? role.permissions.map(permission => permission.id) : []
  }

  if (role.permissions.length === 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
          <span>Nenhuma permissão atribuída</span>
        </Box>
        <AddPermissionToRole role={rolePermissions} permissions={permissions} onSuccess={fetchRoles} />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {role.permissions.map(rolePermission => (
          <Chip
            key={rolePermission.id}
            label={getPermissionDescription(rolePermission.id)}
            onDelete={() => removePermission(rolePermission.id)}
            deleteIcon={isUpdating ? <CircularProgress size={16} /> : <DeleteIcon />}
            disabled={isUpdating}
            color='primary'
            variant='outlined'
            size='small'
          />
        ))}
      </Box>

      <AddPermissionToRole role={rolePermissions} permissions={permissions} onSuccess={fetchRoles} />
    </Box>
  )
}
