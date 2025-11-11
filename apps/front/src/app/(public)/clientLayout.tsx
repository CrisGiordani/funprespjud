'use client'

import { usePathname } from 'next/navigation'

import HorizontalLayout from '@layouts/HorizontalLayout'
import PublicHeader from '@components/layout/horizontal/PublicHeader'
import PublicFooter from '@components/layout/horizontal/PublicFooter'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isCadastroPage = pathname.startsWith('/cadastro')

  return (
    <HorizontalLayout
      header={isLoginPage || isCadastroPage ? null : <PublicHeader />}
      footer={isLoginPage || isCadastroPage ? null : <PublicFooter />}
    >
      {children}
    </HorizontalLayout>
  )
}
