// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

const NotFoundPage = () => {
  // Vars
  const direction = 'ltr'
  const mode = getServerMode()
  const systemMode = getSystemMode()
  const darkImg = '/images/pages/misc-mask-1-dark.png'
  const lightImg = '/images/pages/misc-mask-1-light.png'

  // Choose background image based on server mode
  const miscBackground = mode === 'dark' ? darkImg : lightImg

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
          <div className='flex items-center flex-col text-center gap-10'>
            <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset]'>
              <Typography className='font-medium text-8xl' color='text.primary'></Typography>
              <Typography variant='h4'>Ops, temos um 404 ⚠️</Typography>
              <Typography>A página solicitada não foi encontrada.</Typography>
            </div>
            <Button href='/inicio' component={Link} variant='contained'>
              Voltar ao início
            </Button>
            <img
              alt='error-illustration'
              src='/images/illustrations/characters/3.png'
              className='object-cover bs-[200px] md:bs-[250px] lg:bs-[300px]'
            />
          </div>
          <img src={miscBackground} className='absolute bottom-0 z-[-1] is-full max-md:hidden' />
        </div>
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
