import classNames from 'classnames'

import { Typography } from '@mui/material'

import { formatCurrency } from '@/app/utils/formatters'

/**
 * Formata um valor em reais como símbolo pequeno e valor maior
 * @param valor Valor númerico
 * @returns Valor formatado com o símbolo pequeno e valor maior
 */
export function FormatacaoDinheiroComSifraoPequeno({ valor, className }: { valor: number; className?: string }) {
  return (
    <Typography
      variant='h5'
      className={classNames('font-bold', className)}
      sx={{
        fontSize: '1.25rem',
        color: 'var(--mui-palette-text-secondary)'
      }}
    >
      <span className='font-normal text-[1rem]'>R$</span>
      {formatCurrency(valor).replace('R$', '')}
    </Typography>
  )
}
