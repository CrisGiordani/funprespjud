'use client'

import { useCallback, useEffect, useState } from 'react'

import { Box, Card, Grid, Typography } from '@mui/material'

import { TableCustomized } from '@/components/ui/TableCustomized'
import { AddPermissionForm } from './components/AddPermissionForm'
import { AddRoleForm } from './components/AddRoleForm'
import { RolePermissionsManager } from './components/RolePermissionsManager'
import type { PermissionsResponseType } from '@/types/permissions/PermissionType'
import type { RolesResponseType, RoleType } from '@/types/permissions/RolesType'
import { apiNode } from '@/lib/api'

export default function Permissoes() {
  const [roles, setRoles] = useState<RolesResponseType | null>(null)
  const [permissions, setPermissions] = useState<PermissionsResponseType | null>(null)

  const fetchRoles = useCallback(async () => {
    try {
      const roles = await apiNode.get('/permissions/roles')

      setRoles(roles.data)
    } catch (error) {
      console.error('Erro ao buscar papéis:', error)
    }
  }, [])

  const fetchPermissions = useCallback(async () => {
    try {
      const permissions = await apiNode.get('/permissions')

      setPermissions(permissions.data)
    } catch (error) {
      console.error('Erro ao buscar permissões:', error)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])

  return (
    <div className='flex gap-4'>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, flex: 1 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
                Papéis
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Gerencie os papéis do sistema
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <AddRoleForm onSuccess={fetchRoles} permissions={permissions?.permissions || []} />
              <TableCustomized
                headers={['Papel', 'Descrição', 'Permissões']}
                rows={
                  Array.isArray(roles?.roles) && roles?.roles.length > 0
                    ? roles?.roles.map((role: RoleType) => [
                        role.name,
                        role.description,
                        <RolePermissionsManager
                          key={role.id}
                          role={role}
                          permissions={permissions?.permissions || []}
                          fetchRoles={fetchRoles}
                        />
                      ])
                    : []
                }
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, flex: 1 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
                Permissões
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Gerencie as permissões do sistema
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <AddPermissionForm onSuccess={fetchPermissions} />
              <TableCustomized
                headers={['Permissão', 'Descrição']}
                rows={
                  Array.isArray(permissions?.permissions) && permissions?.permissions.length > 0
                    ? permissions.permissions.map((permission: { id: number; name: string; description: string }) => [
                        permission.name,
                        permission.description
                      ])
                    : []
                }
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
