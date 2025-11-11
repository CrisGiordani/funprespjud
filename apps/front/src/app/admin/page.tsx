'use client'

// MUI Imports
import { useRouter } from 'next/navigation'

import { Card, CardContent, Typography, Grid, Box } from '@mui/material'

// Component Imports
import { useAuth } from '@/contexts/AuthContext'

const AdminDashboard = () => {
  const router = useRouter()
  const { user } = useAuth()

  // Verificar se o usuário é admin
  const isAdmin = user?.roles?.includes('USER_ADMIN') ?? false

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
        Painel Administrativo
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
            onClick={() => router.push('/admin/usuarios')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <i
                className='material-symbols'
                style={{ fontSize: 48, color: 'var(--mui-palette-primary-main)', marginBottom: 16 }}
              >
                people
              </i>
              <Typography variant='h6' sx={{ mb: 1 }}>
                Usuários
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Gerencie usuários do sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
              onClick={() => router.push('/admin/campanhas')}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <i
                  className='material-symbols'
                  style={{ fontSize: 48, color: 'var(--mui-palette-primary-main)', marginBottom: 16 }}
                >
                  campaign
                </i>
                <Typography variant='h6' sx={{ mb: 1 }}>
                  Campanhas
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Gerencie campanhas e comunicações
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
            onClick={() => router.push('/admin/documentos')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <i
                className='material-symbols'
                style={{ fontSize: 48, color: 'var(--mui-palette-primary-main)', marginBottom: 16 }}
              >
                description
              </i>
              <Typography variant='h6' sx={{ mb: 1 }}>
                Documentos
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Acesse e gerencie documentos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
