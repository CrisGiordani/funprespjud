'use client'

import { useEffect } from 'react'

import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material'

import { useToast } from '@/@layouts/components/customized/Toast'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminProfilePage() {
  const { Toast, showToast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      showToast('Usuário não encontrado', 'error')
    }
  }, [user, showToast])

  if (!user) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Toast />

      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        Perfil do Administrador
      </Typography>

      <Card>
        <CardContent>
          <Box display='flex' alignItems='center' gap={3} mb={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
              {user.nome?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {user.nome}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {user.email}
              </Typography>
              <Box display='flex' gap={1} mt={1}>
                {user.roles?.map((role, index) => (
                  <Chip key={index} label={role.replace('USER_', '')} color='primary' variant='outlined' size='small' />
                ))}
              </Box>
            </Box>
          </Box>

          <Typography variant='h6' sx={{ mb: 2 }}>
            Informações do Sistema
          </Typography>

          <Box display='flex' flexDirection='column' gap={2}>
            <Box>
              <Typography variant='body2' color='text.secondary'>
                CPF
              </Typography>
              <Typography variant='body1'>{user.cpf}</Typography>
            </Box>

            <Box>
              <Typography variant='body2' color='text.secondary'>
                ID do Usuário
              </Typography>
              <Typography variant='body1'>{user.id}</Typography>
            </Box>

            <Box>
              <Typography variant='body2' color='text.secondary'>
                Permissões
              </Typography>
              <Box display='flex' gap={1} mt={1}>
                {user.roles?.map((role, index) => <Chip key={index} label={role} color='secondary' size='small' />)}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}
