import { useState, useCallback } from 'react'

import { useAuth } from '@/contexts/AuthContext'

export const useViewerMode = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activateViewerMode = useCallback(
    async (targetUserCpf: string): Promise<void> => {
      if (!user?.cpf) {
        setError('Usuário não autenticado')

        return
      }

      setLoading(true)
      setError(null)

      try {
        if (typeof window !== 'undefined') {
          if (window.name.startsWith('viewer-')) {
            sessionStorage.setItem('modoViewer', 'true')
            sessionStorage.setItem('cpfConsulta', targetUserCpf)
            sessionStorage.setItem('adminCpf', user.cpf)
          }

          // Dados da nova janela
          // Adicionar query parameter para o middleware identificar modo viewer
          const viewerUrl = `${window.location.origin}/inicio?viewer=${targetUserCpf}`
          const newWindowName = `viewer-${targetUserCpf}`

          window.open(viewerUrl, newWindowName, 'width=1600,height=900')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao ativar modo viewer'

        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [user?.cpf]
  )

  const isViewerMode = useCallback(() => {
    if (typeof window === 'undefined') return false

    return sessionStorage.getItem('modoViewer') === 'true'
  }, [])

  const getConsultaCpf = useCallback(() => {
    if (typeof window === 'undefined') return null

    return sessionStorage.getItem('cpfConsulta')
  }, [])

  const getAdminCpf = useCallback(() => {
    if (typeof window === 'undefined') return null

    return sessionStorage.getItem('adminCpf')
  }, [])

  const exitViewerMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('modoViewer')
      sessionStorage.removeItem('cpfConsulta')
      sessionStorage.removeItem('adminCpf')

      // Remover cookie quando sai do modo viewer
      document.cookie = 'viewerMode=; path=/; max-age=0'

      if (window.opener) {
        window.opener.location.reload()
      }

      window.close()
    }
  }, [])

  const getOriginalUserRoles = useCallback(async () => {
    if (typeof window === 'undefined') return []

    const adminCpf = sessionStorage.getItem('adminCpf')

    if (!adminCpf) return []

    try {
      const response = await fetch(`/api/users/get-user?cpf=${adminCpf}`)

      if (response.ok) {
        const adminData = await response.json()

        return adminData.roles || []
      }
    } catch (err) {
      console.error('Erro ao buscar roles do admin:', err)
    }

    return []
  }, [])

  return {
    activateViewerMode,
    isViewerMode,
    getConsultaCpf,
    getAdminCpf,
    exitViewerMode,
    getOriginalUserRoles,
    loading,
    error
  }
}
