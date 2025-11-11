// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import VLibras from './components/iris/VLibras'
import { AuthProvider } from '@/contexts/AuthContext'
import GlobalToastListener from '@/components/GlobalToastListener'
import { MatomoProvider } from '@/contexts/MatomoProvider'
import EnvironmentBanner from '@/components/EnvironmentBanner'

export const metadata = {
  title: 'FUNPRESP-JUD',
  description: 'Portal Funpresp-Jud',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico'
  }
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='pt-BR' dir={direction}>
      <head>
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Symbols|Material+Symbols+Outlined|Material+Symbols+Filled'
          rel='stylesheet'
        />
        <script src='https://kit.fontawesome.com/a6ccc0feee.js' crossOrigin='anonymous' async></script>
        <script src='https://vlibras.gov.br/app/vlibras-plugin.js' async></script>
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col !p-0'>
        <EnvironmentBanner />
        <div id='app-content-wrapper' className='flex flex-col flex-auto w-full'>
          <AuthProvider>
            <MatomoProvider>
              <GlobalToastListener />
              {children}
            </MatomoProvider>
          </AuthProvider>
        </div>
        <VLibras />
      </body>
    </html>
  )
}

export default RootLayout
