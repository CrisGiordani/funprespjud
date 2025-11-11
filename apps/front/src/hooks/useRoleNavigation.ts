import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'

// Função para obter a rota baseada na role
const getRoleRoute = (role: string): string => {
  const roleRoutes: Record<string, string> = {
    USER_ADMIN: '/admin',
    USER_OPERATOR: '/admin',
    USER_PARTICIPANT: '/inicio',
    USER_SPONSOR: '/inicio'
  }

  return roleRoutes[role] || '/inicio'
}

// Função para obter a rota do perfil baseada na role
const getProfileRoute = (role: string): string => {
  const profileRoutes: Record<string, string> = {
    USER_ADMIN: '/admin/perfil',
    USER_OPERATOR: '/admin/perfil',
    USER_PARTICIPANT: '/pessoal/perfil',
    USER_SPONSOR: '/pessoal/perfil'
  }

  return profileRoutes[role] || '/pessoal/perfil'
}

export const useRoleNavigation = () => {
  const router = useRouter()
  const { user } = useAuth()

  const navigateToRole = (role: string) => {
    const route = getRoleRoute(role)

    router.push(route)
  }

  const navigateToProfile = (role?: string) => {
    const targetRole = role || user?.roles?.[0]

    if (targetRole) {
      const route = getProfileRoute(targetRole)

      router.push(route)
    }
  }

  const getCurrentRoleRoute = () => {
    const primaryRole = user?.roles?.[0]

    return primaryRole ? getRoleRoute(primaryRole) : '/inicio'
  }

  const getCurrentProfileRoute = () => {
    const primaryRole = user?.roles?.[0]

    return primaryRole ? getProfileRoute(primaryRole) : '/pessoal/perfil'
  }

  return {
    navigateToRole,
    navigateToProfile,
    getCurrentRoleRoute,
    getCurrentProfileRoute,
    getRoleRoute,
    getProfileRoute
  }
}
