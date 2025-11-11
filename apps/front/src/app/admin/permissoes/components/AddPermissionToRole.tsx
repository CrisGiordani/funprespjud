'use client'

import { useState } from 'react'

import { Box, FormControl, InputLabel, Select, MenuItem, IconButton, CircularProgress } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

import { apiNode } from '@/lib/api'
import type { PermissionType } from '@/types/permissions/PermissionType'

type AddPermissionToRoleProps = {
  role: {
    id: number
    name: string
    description: string
    permissions: number[]
  }
  permissions: PermissionType[]
  onSuccess: () => Promise<void>
}

export function AddPermissionToRole({ role, permissions, onSuccess }: AddPermissionToRoleProps) {
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | ''>('')
  const [isAdding, setIsAdding] = useState(false)

  // Filtrar permissões que ainda não estão atribuídas ao papel
  const availablePermissions = permissions.filter(permission => !role.permissions.includes(permission.id))

  const addPermission = async () => {
    if (!selectedPermissionId) return

    setIsAdding(true)

    const updatedPermissions = [...role.permissions, selectedPermissionId]

    await apiNode
      .put('/permissions/roles', {
        roleId: role.id,
        permissions: updatedPermissions
      })
      .then(async () => {
        setSelectedPermissionId('')
        await onSuccess()
      })
      .catch(error => {
        console.error('Erro ao adiciona r permissão:', error)
      })
      .finally(() => {
        setIsAdding(false)
      })
  }

  if (availablePermissions.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
        <span>Todas as permissões já estão atribuídas</span>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      <FormControl variant='outlined' size='small' sx={{ minWidth: 200 }}>
        <InputLabel id='add-permission-label'>Adicionar permissão</InputLabel>
        <Select
          labelId='add-permission-label'
          id='add-permission'
          value={selectedPermissionId}
          onChange={e => setSelectedPermissionId(e.target.value as number)}
          label='Adicionar permissão'
          disabled={isAdding}
        >
          {availablePermissions.map(permission => (
            <MenuItem key={permission.id} value={permission.id}>
              {permission.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <IconButton
        onClick={addPermission}
        disabled={!selectedPermissionId || isAdding}
        color='primary'
        size='small'
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark'
          },
          '&:disabled': {
            bgcolor: 'action.disabled',
            color: 'action.disabled'
          }
        }}
      >
        {isAdding ? <CircularProgress size={16} /> : <AddIcon />}
      </IconButton>
    </Box>
  )
}
