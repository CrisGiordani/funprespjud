'use client'

import { useMatomo } from '@/hooks/useMatomo'

interface MatomoProviderProps {
  children: React.ReactNode
}

export const MatomoProvider = ({ children }: MatomoProviderProps) => {
  useMatomo()

  return <>{children}</>
}
