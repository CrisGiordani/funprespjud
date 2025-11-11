'use client'

import { createContext, createElement, useEffect } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'


import useGetAppStatus from '@/hooks/perfilInvestimento/useGetAppStatus'
import type { AppStatusType } from '@/types/perfilInvestimento/AppStatusType'
import { useAuth } from './AuthContext'

const setSessionStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, value)
  }
}

const getSessionStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(key)
  }

  return null
}

const removeSessionStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(key)
  }
}

const showGlobalToast = (message: string) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('showToast', {
      detail: {
        message,
        severity: 'warning',
        styles: {
          backgroundColor: '#F7B731',
          color: '#000000',
          '& .MuiAlert-icon': {
            color: '#000000'
          },
          '& .MuiAlert-message': {
            color: '#000000'
          }
        },

        icon: createElement('i', { className: 'fa-kit fa-regular-hand-slash' })
      }
    })

    window.dispatchEvent(event)
  }
}

type QuestionarioAppContextType = {
  appStatus: AppStatusType | null
  getAppStatus: (cpf: string) => Promise<void>
}

export const QuestionarioAppContext = createContext<QuestionarioAppContextType>({
  appStatus: null as unknown as AppStatusType,
  getAppStatus: () => Promise.resolve()
})

export const QuestionarioAppProvider = ({ children }: { children: React.ReactNode }) => {
  const { appStatus, getAppStatus } = useGetAppStatus()

  const router = useRouter()
  const searchParams = useSearchParams()

  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.cpf) {
      getAppStatus(user?.cpf as string)
    }
  }, [user?.cpf, getAppStatus])

  useEffect(() => {
    if (!user) {
      removeSessionStorage('startQuestionnaire')
    }
  }, [user])

  useEffect(() => {
    if (pathname === '/patrimonio/investimento' && searchParams.get('startQuestionnaire') === 'true') {
      setSessionStorage('startQuestionnaire', 'true')

      return
    }

    if (getSessionStorage('startQuestionnaire') === 'true') {
      getAppStatus(user?.cpf as string)

      if (appStatus?.cdStatus == '0' || appStatus?.statusAppPreenchido == '6') {
        showGlobalToast('Preencha o questionário do app para continuar navegando no sistema')
        router.push('/patrimonio/investimento?startQuestionnaire=true')
      } else if (appStatus?.cdStatus && (appStatus.cdStatus !== '0' || appStatus?.statusAppPreenchido !== '6')) {
        removeSessionStorage('startQuestionnaire')
        
        if (typeof window !== 'undefined' && searchParams.get('startQuestionnaire') === 'true') {
          const url = new URL(window.location.href)

          url.searchParams.delete('startQuestionnaire')
          
          window.history.replaceState({}, '', url.toString())
        }
      }
    } else {
      removeSessionStorage('startQuestionnaire')
    }
  }, [pathname, searchParams, user?.cpf, appStatus?.cdStatus, getAppStatus, router])

  return (
    <QuestionarioAppContext.Provider value={{ appStatus, getAppStatus }}>{children}</QuestionarioAppContext.Provider>
  )
}
