'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { getUserFromToken } from '@/lib/auth'
import { apiNode } from '@/lib/api'
import type { UserType } from '@/types/UserType'

interface AuthContextType {
  user: UserType | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Rotas públicas que não devem redirecionar para login
const PUBLIC_ROUTES = ['/login', '/cadastro', '/api/auth']

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)

      // Se estamos em uma rota pública, não precisamos verificar autenticação
      if (isPublicRoute(pathname)) {
        setUser(null)
        setLoading(false)

        return
      }

      let consultaCpf = null

      // Verificar se está em modo viewer de três formas:
      // 1. window.name começa com 'viewer-' (mais confiável - indica janela viewer)
      // 2. Query parameter 'viewer' na URL
      // 3. Cookie 'viewerMode' (apenas se já estiver em uma janela viewer)
      let detectedViewerCpf = null

      if (typeof window !== 'undefined') {
        // Verificar window.name primeiro (mais confiável - indica que é janela viewer)
        const viewerId = window.name?.startsWith('viewer-') ? window.name.replace('viewer-', '') : null
        const urlViewerCpf = new URLSearchParams(window.location.search).get('viewer')

        // Se window.name indica viewer OU tem query parameter, então está em modo viewer
        if (viewerId || urlViewerCpf) {
          detectedViewerCpf = urlViewerCpf || viewerId || null
        } else {
          // Se não tem window.name nem query param, verificar cookie apenas se estiver em área não-admin
          // (para evitar usar cookie quando está na janela principal de admin)
          const isAdminArea = pathname.startsWith('/admin')

          if (!isAdminArea) {
            const viewerCookie = document.cookie
              .split('; ')
              .find(row => row.startsWith('viewerMode='))
              ?.split('=')[1]

            if (viewerCookie) {
              detectedViewerCpf = viewerCookie
            }
          }
        }
      }

      if (typeof window !== 'undefined' && detectedViewerCpf) {
        consultaCpf = detectedViewerCpf
        sessionStorage.setItem('modoViewer', 'true')
        sessionStorage.setItem('cpfConsulta', consultaCpf)

        // Criar cookie que persiste durante a navegação (1 hora de duração)
        // O middleware pode ler este cookie
        document.cookie = `viewerMode=${consultaCpf}; path=/; max-age=3600; SameSite=Lax`
      } else {
        consultaCpf = null
        sessionStorage.removeItem('modoViewer')
        sessionStorage.removeItem('cpfConsulta')

        // Remover cookie quando não está em modo viewer
        if (typeof window !== 'undefined') {
          document.cookie = 'viewerMode=; path=/; max-age=0'
        }
      }

      if (consultaCpf) {
        const response = await apiNode.get(`/users/get-user?cpf=${consultaCpf}`)

        if (response.data) {
          const userData = response.data

          const userWithRoles = {
            ...userData,
            id: userData.id,
            nome: userData.name,
            roles: userData.roles || [],
            viewerMode: true,
            originalAdminCpf: typeof window !== 'undefined' ? sessionStorage.getItem('adminCpf') : null,
            cpf: consultaCpf,
            sexo: userData.sexo || userData.profile?.sexo,
            cpfDisplay: userData.cpf
          } as UserType

          setUser(userWithRoles)
        } else {
          throw new Error('Erro ao buscar usuário de consulta')
        }
      } else {
        const userData = await getUserFromToken()

        if (userData) {
          const roles = Array.isArray(userData.roles) ? userData.roles : []

          // Adiciona o CPF do usuário para as permissões individuais
          roles.push(userData.cpf)

          const userWithRoles = {
            ...userData,
            roles: roles
          } as UserType

          setUser(userWithRoles)
        } else {
          setUser(null)

          // Só redireciona se não estamos em uma rota pública
          if (!isPublicRoute(pathname)) {
            router.push('/login')
          }
        }
      }
    } catch (err) {
      setError('Erro ao buscar dados do usuário')
      setUser(null)

      // Só redireciona se não estamos em uma rota pública
      if (!isPublicRoute(pathname)) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const clearUser = useCallback(() => {
    setUser(null)
    setError(null)
  }, [])

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <AuthContext.Provider value={{ user, loading, error, refetch: fetchUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  )
}
