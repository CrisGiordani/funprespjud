'use client'

import { useRouter } from 'next/navigation'

import { Box, Typography } from '@mui/material'

export function BoxTipoCampanha({ title, icon, link }: { title: string; icon: string; link: string }) {
  const router = useRouter()

  return (
    <Box
      className='flex flex-col items-center justify-center bg-gray-200 rounded-4xl p-6 cursor-pointer'
      onClick={() => router.push(link)}
    >
      <div className='bg-primary-main rounded-lg w-10 h-10 flex justify-center items-center text-white mb-5 mt-2'>
        <i className={`${icon} text-xl`} />
      </div>
      <Typography
        variant='body1'
        className='text-center  font-bold text-gray-700'
        sx={{
          fontSize: '1rem'
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}
