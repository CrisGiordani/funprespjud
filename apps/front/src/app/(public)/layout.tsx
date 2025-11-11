import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import ClientLayout from './clientLayout'

// Util Imports

type Props = ChildrenType

const Layout = ({ children }: Props) => {
  // Vars
  const direction = 'ltr'

  return (
    <Providers direction={direction}>
      <div className='flex flex-col flex-auto bg-white' data-skin='default'>
        <ClientLayout>{children}</ClientLayout>
      </div>
    </Providers>
  )
}

export default Layout
