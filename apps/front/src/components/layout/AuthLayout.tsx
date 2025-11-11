'use client'

import Link from '@components/Link'
import AuthSidePanel from './AuthSidePanel'

interface AuthLayoutProps {
  children: React.ReactNode
  showBackLink?: boolean
  backLinkHref?: string
}

const AuthLayout = ({
  children,
  showBackLink = true,
  backLinkHref = 'https://www.funprespjud.com.br/'
}: AuthLayoutProps) => {
  return (
    <div className='fixed inset-0 flex flex-col lg:flex-row bg-white' style={{ fontFamily: 'Open Sans, sans-serif' }}>
      {/* Link Voltar */}
      {showBackLink && (
        <div className='absolute top-6 left-6 z-10'>
          <Link href={backLinkHref} className='flex items-center gap-2 transition-colors' style={{ color: '#0578BE' }}>
            <i className='fa-solid fa-arrow-left'></i>
            <span>Voltar</span>
          </Link>
        </div>
      )}

      {/* Div com conteúdo principal - 60% da largura */}
      <div
        className='flex-1 lg:w-[60%] flex items-center justify-center p-8'
        style={{ minHeight: 'calc(100vh - 250px)' }}
      >
        {children}
      </div>

      {/* Painel lateral azul - 40% da largura */}
      <AuthSidePanel />
    </div>
  )
}

export default AuthLayout
