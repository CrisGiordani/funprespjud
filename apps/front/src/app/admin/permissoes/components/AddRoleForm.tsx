'use client'

import { useState } from 'react'

import { Box, CircularProgress, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import EditableTextField from '@/@layouts/components/customized/EditableTextField'
import { apiNode } from '@/lib/api'
import type { PermissionType } from '@/types/permissions/PermissionType'

export function AddRoleForm({
  permissions,
  onSuccess
}: {
  permissions: PermissionType[]
  onSuccess: () => Promise<void>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [roleNameInput, setRoleNameInput] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.target as typeof e.target & {
        name: { value: string }
        description: { value: string }
      }

      if (roleNameInput && form.description.value) {
        await apiNode
          .post('/permissions/roles', {
            name: roleNameInput,
            description: form.description.value,
            permissions: selectedPermissions
          })
          .then(async () => {
            form.name.value = ''
            form.description.value = ''
            setRoleNameInput('')
            setSelectedPermissions([])
            await onSuccess()
          })
          .catch(error => {
            console.error('Erro ao adicionar papel:', error)
          })
      }
    } catch (error) {
      console.error('Erro ao adicionar papel:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <EditableTextField
            sx={{ width: '100%' }}
            name='name'
            label='Nome do papel'
            disabled={isSubmitting}
            required
            value={roleNameInput}
            onChange={e => setRoleNameInput(e.target.value)}
          />
          <EditableTextField
            sx={{ width: '100%' }}
            name='description'
            label='Descrição do papel'
            disabled={isSubmitting}
            required
          />
          <FormControl variant='filled' fullWidth disabled={isSubmitting}>
            <InputLabel id='permissions-label'>Permissões</InputLabel>
            <Select
              labelId='permissions-label'
              id='permissions'
              multiple
              value={selectedPermissions}
              onChange={e => setSelectedPermissions(e.target.value as string[])}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map(value => (
                    <Chip
                      key={value}
                      label={permissions.find(p => p.id === Number(value))?.name || value}
                      size='small'
                    />
                  ))}
                </Box>
              )}
            >
              {permissions.map(permission => (
                <MenuItem key={permission.id} value={permission.id}>
                  {permission.name} - {permission.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <ButtonCustomized type='submit' variant='contained' disabled={isSubmitting} sx={{ width: '250px' }}>
            {isSubmitting ? <CircularProgress size={20} /> : 'Adicionar papel'}
          </ButtonCustomized>
        </Box>
      </form>
    </Box>
  )
}
