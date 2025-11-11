'use client'

import { useEffect, useState } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Card, Box, Typography, Button, Grid, Divider, CircularProgress, Alert, Tooltip } from '@mui/material'
import { getCookie } from 'cookies-next'

import { aplicarMascaraCPF } from '@/app/utils/formatters'
import { useViewerMode } from '@/hooks/useViewerMode'
import { useAuth } from '@/contexts/AuthContext'
import type { User } from '@/generated/prisma'

import { useToast } from '@/@layouts/components/customized/Toast'

interface UserDetails extends User {
  telefoneResidencial?: string | null
  emailAlternativo?: string | null
  celular?: string | null
  cpfEncrypted?: string
  profile?: {
    telefone: string
  }
}

const roleDisplayNames: Record<string, string> = {
  USER_PARTICIPANT: 'Participante',
  USER_OPERATOR: 'Operador',
  USER_ADMIN: 'Administrador',
  USER_SPONSOR: 'Patrocinador',
  USER_REPRESENTATIVE: 'Representante'
}

const roleIconMap: Record<string, string> = {
  USER_PARTICIPANT: 'fa-user',
  USER_OPERATOR: 'fa-headset',
  USER_ADMIN: 'fa-crown',
  USER_SPONSOR: 'fa-landmark',
  USER_REPRESENTATIVE: 'fa-person-chalkboard'
}

export default function UserDetailsPage() {
  const router = useRouter()
  const params = useParams()

  const { Toast, showToast } = useToast()

  const userCpf = params.id as string
  const { user: currentUser } = useAuth()
  const { activateViewerMode, loading: viewerLoading, error: viewerError } = useViewerMode()

  const [returnPage, setReturnPage] = useState('1')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const page = searchParams.get('page') || '1'

      setReturnPage(page)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingReset, setLoadingReset] = useState(false)
  const [loadingSync, setLoadingSync] = useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userCpf) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/users/get-user?cpf=${encodeURIComponent(userCpf)}`)

        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário')
        }

        const userData = await response.json()

        const userDetails: UserDetails = {
          ...userData,
          telefoneResidencial: userData.profile?.telefone || null,
          emailAlternativo: userData.emailAlternativo || null,
          celular: userData.celular || null
        }

        setUser(userDetails)
      } catch (err) {
        setError('Erro ao carregar dados do usuário')
        console.error('Error fetching user:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userCpf])

  const handleBack = () => {
    router.push(`/admin/usuarios?page=${returnPage}`)
  }

  const handleResetPassword = async () => {
    setLoadingReset(true)

    try {
      const response = await fetch(`/api/auth/recuperacao-senha-email`, {
        method: 'POST',
        body: JSON.stringify({
          cpf: user?.cpf,
          email: user?.email
        })
      })

      if (response.status !== 200) {
        const errorData = await response.json()

        throw new Error(errorData.message || 'Erro ao redefinir senha')
      }

      showToast('Solicitação de redefinição de senha enviada com sucesso', 'success')

      setLoadingReset(false)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao redefinir senha', 'error')

      setLoadingReset(false)
    }
  }

  const handleSyncEmail = async () => {
    if (!user?.cpfEncrypted) return

    setLoadingSync(true)

    try {
      // Obtém o token JWT dos cookies
      const token = getCookie('jwtToken')

      if (!token) {
        showToast('Sessão expirada. Faça login novamente.', 'error')
        setLoadingSync(false)

        return
      }

      const response = await fetch(`/api/sync/email-by-cpf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cpf: user.cpfEncrypted
        })
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message || 'Email sincronizado com sucesso', 'success')
        
        // Atualiza os dados do usuário se o email mudou
        if (data.emailNovo && data.emailNovo !== user.email) {
          setUser({
            ...user,
            email: data.emailNovo
          })
        }
      } else {
        showToast(data.message || 'Erro ao sincronizar email', 'error')
      }

      setLoadingSync(false)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao sincronizar email', 'error')
      setLoadingSync(false)
    }
  }

  const handleDeactivateUser = () => {
    //*TODO: Implementar lógica de inativação do usuário
    console.log('Inativar usuário:', user?.cpf)
  }

  const handleViewerMode = async () => {
    if (!user?.cpf) return

    try {
      await activateViewerMode(userCpf)
    } catch (err) {
      console.error('Erro ao ativar modo viewer:', err)
    }
  }

  // Verificar se pode usar modo viewer
  // Deve ter role ADMIN ou OPERATOR e não estar em modo viewer
  const hasAdminRole =
    currentUser?.roles?.some((role: string) => role === 'USER_ADMIN' || role === 'USER_OPERATOR') ?? false

  const canUseViewerMode = hasAdminRole && !currentUser?.viewerMode

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error' sx={{ mb: 2 }}>
          {error || 'Usuário não encontrado'}
        </Alert>
        <Button variant='outlined' onClick={handleBack}>
          ← Voltar
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Toast />
        <Card
          sx={{
            width: '100%',
            mx: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant='h5' sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant='body2' sx={{ color: '#666', fontWeight: 500 }}>
                  Acessos:
                </Typography>
                {user.role.map((role, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <i
                      className={`fas ${roleIconMap[role]}`}
                      style={{
                        fontSize: '14px',
                        color: '#1976d2',
                        marginRight: '4px'
                      }}
                    />
                    <Typography variant='body2' sx={{ color: '#666' }}>
                      {roleDisplayNames[role]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Button
              variant='outlined'
              onClick={handleBack}
              sx={{
                borderColor: '#2196f3',
                color: '#2196f3',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(33, 150, 243, 0.04)'
                }
              }}
            >
              ← Voltar
            </Button>
          </Box>

          <Divider sx={{ mx: 3 }} />

          <Box sx={{ p: 3 }}>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: '#495057',
                mb: 3,
                fontSize: '1rem'
              }}
            >
              DADOS PESSOAIS
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ color: '#666', mb: 0.5 }}>
                    CPF
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#333', fontWeight: 500 }}>
                    {aplicarMascaraCPF(user.cpf)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ color: '#666', mb: 0.5 }}>
                    Telefone residencial
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#333', fontWeight: 500 }}>
                    {user.telefoneResidencial || '(não disponível)'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ color: '#666', mb: 0.5 }}>
                    E-mail principal
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#333', fontWeight: 500 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ color: '#666', mb: 0.5 }}>
                    Órgão
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#333', fontWeight: 500 }}>
                    {user.orgao || 'TRF1'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ color: '#666', mb: 0.5 }}>
                    Celular
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#333', fontWeight: 500 }}>
                    {user.celular || '(não disponível)'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant='body2' sx={{ color: '#666', mb: 0.5 }}>
                    E-mail alternativo
                  </Typography>
                  <Typography variant='body1' sx={{ color: '#333', fontWeight: 500 }}>
                    {user.emailAlternativo || '(não disponível)'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mx: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {canUseViewerMode && (
              <Tooltip title='Visualizar como este usuário (abre em nova janela)'>
                <Button
                  variant='contained'
                  onClick={handleViewerMode}
                  disabled={viewerLoading}
                  startIcon={
                    viewerLoading ? <CircularProgress size={16} color='inherit' /> : <i className='fas fa-eye' />
                  }
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc'
                    }
                  }}
                >
                  {viewerLoading ? 'Abrindo...' : 'Modo Consulta'}
                </Button>
              </Tooltip>
            )}

            <Button
              variant='outlined'
              onClick={handleResetPassword}
              disabled={loadingReset}
              sx={{
                borderColor: '#2196f3',
                color: '#2196f3',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(33, 150, 243, 0.04)'
                }
              }}
            >
              {loadingReset ? 'Enviando e-mail...' : 'Redefinir senha'}
            </Button>
            <Button
              variant='outlined'
              onClick={handleSyncEmail}
              disabled={loadingSync}
              startIcon={
                loadingSync ? <CircularProgress size={16} color='inherit' /> : <i className='fas fa-sync-alt' />
              }
              sx={{
                borderColor: '#ff9800',
                color: '#ff9800',
                '&:hover': {
                  borderColor: '#f57c00',
                  backgroundColor: 'rgba(255, 152, 0, 0.04)'
                }
              }}
            >
              {loadingSync ? 'Sincronizando...' : 'Sincronizar E-mail'}
            </Button>
            <Button
              variant='outlined'
              onClick={handleDeactivateUser}
              sx={{
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(244, 67, 54, 0.04)'
                }
              }}
            >
              Inativar usuário
            </Button>
          </Box>

          {viewerError && (
            <Box sx={{ px: 3, pb: 3 }}>
              <Alert severity='error' onClose={() => {}}>
                {viewerError}
              </Alert>
            </Box>
          )}
        </Card>
      </Box>
    </>
  )
}
