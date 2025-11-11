'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const PublicFooter = () => {
  return (
    <Box className='w-full flex items-center justify-center py-4' sx={{ backgroundColor: 'primary.main' }}>
      <Typography variant='body2' className='text-white'>
        © {new Date().getFullYear()}, Funpresp-Jud
      </Typography>
    </Box>
  )
}

export default PublicFooter
