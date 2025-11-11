'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, CircularProgress } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import EditableTextField from '@/@layouts/components/customized/EditableTextField'
import { apiNode } from '@/lib/api'

export function AddPermissionForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [permissionNameInput, setPermissionNameInput] = useState('')
  const router = useRouter()

  // Função para formatar o nome da permissão
  const formatPermissionName = (name: string) => {
    return name
      .toUpperCase() // Converte para maiúsculo
      .normalize('NFD') // Remove acentos
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
      .replace(/ç/g, 'C') // Substitui ç por C
      .replace(/Ç/g, 'C') // Substitui Ç por C
      .replace(/[^A-Z0-9\s]/g, '') // Remove caracteres especiais exceto espaços
      .replace(/\s+/g, '_') // Substitui espaços por underscore
      .replace(/_+/g, '_') // Remove underscores duplicados
      .replace(/^_|_$/g, '') // Remove underscores do início e fim
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.target as typeof e.target & {
        name: { value: string }
        description: { value: string }
      }

      if (form.name.value && form.description.value) {
        await apiNode
          .post('/permissions', {
            name: formatPermissionName(form.name.value),
            description: form.description.value
          })
          .then(response => {
            console.log('response', response.data)
            form.name.value = ''
            form.description.value = ''
            setPermissionNameInput('')

            // Recarrega os dados do servidor
            router.refresh()

            onSuccess()
          })
          .catch(error => {
            console.error('Erro ao adicionar permissão:', error)
          })
      }
    } catch (error) {
      console.error('Erro ao adicionar permissão:', error)
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
            label='Nome da permissão'
            disabled={isSubmitting}
            required
            value={permissionNameInput}
            onChange={e => setPermissionNameInput(e.target.value)}
            helperText={
              permissionNameInput
                ? `Será salvo como: ${formatPermissionName(permissionNameInput)}`
                : 'Digite o nome da permissão (será convertido para maiúsculo, sem acentos, com underscores)'
            }
          />
          <EditableTextField
            sx={{ width: '100%' }}
            name='description'
            label='Descrição da permissão'
            disabled={isSubmitting}
            required
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <ButtonCustomized type='submit' variant='contained' disabled={isSubmitting} sx={{ width: '250px' }}>
            {isSubmitting ? <CircularProgress size={20} /> : 'Adicionar permissão'}
          </ButtonCustomized>
        </Box>
      </form>
    </Box>
  )
}
