'use client'

// MUI Imports
import Typography from '@mui/material/Typography'

interface AuthSidePanelProps {
  children?: React.ReactNode
}

const AuthSidePanel = ({ children }: AuthSidePanelProps) => {
  return (
    <div className='w-full lg:w-[40%] flex flex-col justify-center py-8' style={{ backgroundColor: '#0578BE' }}>
      <div className='text-center lg:text-left mb-8 lg:mb-16 px-8 lg:px-16'>
        <Typography
          variant='h2'
          className='font-regular text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl'
          lineHeight={1.5}
          font-kerning={1}
        >
          <span className='hidden lg:block'>
            Nosso presente é<br />
            cuidar do seu futuro!
          </span>
          <span className='block lg:hidden'>Nosso presente é cuidar do seu futuro!</span>
        </Typography>
      </div>
      <div className='w-full overflow-hidden' style={{ marginTop: '20px' }}>
        <img
          src='/images/login/pig.svg'
          alt='Pig illustration'
          className='w-full lg:w-[140%] h-auto object-cover object-left'
          style={{ transform: 'translateX(0)' }}
        />
      </div>
      {children}
    </div>
  )
}

export default AuthSidePanel
