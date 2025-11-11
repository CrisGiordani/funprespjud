'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

import ProgressCircular from '@/app/components/iris/ProgressCircular'

interface LoadingContextType {
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleLoading = (event: CustomEvent<boolean>) => {
      setLoading(event.detail)
    }

    window.addEventListener('loading', handleLoading as EventListener)

    return () => {
      window.removeEventListener('loading', handleLoading as EventListener)
    }
  }, [])

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      {loading && <ProgressCircular />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)

  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }

  return context
}
