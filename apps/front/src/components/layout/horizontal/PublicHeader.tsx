'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// Component Imports
import Link from '@components/Link'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

const PublicHeader = () => {
  return (
    <div className='flex items-center justify-between gap-4 w-full px-3 py-1 bg-white min-h-[60px]'>
      {/* Logo and Brand */}
      <Link href='/' className='flex items-center gap-2 no-underline'>
        <Box component='img' src='/images/funpresp/logo.png' alt='Funpresp-Jud' className='bs-12 is-auto' />
      </Link>

      {/* Theme Dropdown and Voltar Button */}
      <div className='flex items-center gap-2'>
        <ModeDropdown />
        <Button component={Link} href='https://www.funprespjud.com.br/' variant='contained' color='primary'>
          <i className='ri-arrow-left-line' /> Voltar
        </Button>
      </div>
    </div>
  )
}

export default PublicHeader
