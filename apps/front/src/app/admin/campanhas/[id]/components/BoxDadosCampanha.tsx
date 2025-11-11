import { Box, Typography } from '@mui/material'

import { formatarNumeroComPontos } from '@/app/utils/formatters'

interface BoxDadosCampanhaProps {
  title: string
  value: number | string
  descricao?: React.ReactNode
  onClick?: () => void
}

export function BoxDadosCampanha({ title, value, descricao, onClick }: BoxDadosCampanhaProps) {
  return (
    <Box
      className={`flex flex-col items-center  justify-center bg-gray-box rounded-4xl p-6 h-[150px] h-max-[150px] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? onClick : undefined}
    >
      <Typography
        variant='body1'
        className='text-center  font-bold text-gray-700'
        sx={{
          fontSize: '1rem'
        }}
      >
        {title}
      </Typography>

      <Typography variant='h4' className='text-center font-bold text-primary-main '>
        {typeof value === 'number' ? formatarNumeroComPontos(value) : value}
      </Typography>

      {descricao && (
        <Typography variant='body2' className='text-center font-bold text-gray-700'>
          {descricao}
        </Typography>
      )}
    </Box>
  )
}
