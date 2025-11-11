import Link from 'next/link'

import Image from 'next/image'

import { Typography } from '@mui/material'

import { ActionButton } from './ActionButton'
import BoxCopy from '@/app/components/ui/BoxCopy'

export function PagamentoBoleto({ codigo, onNovaContribuicao }: { codigo: string; onNovaContribuicao: () => void }) {
  return (
    <div className='w-full max-w-[724px] flex flex-col items-center gap-2'>
      <Typography variant='h5' sx={{ fontSize: '1.125rem', color: 'var(--mui-palette-text-secondary)' }}>
        Pagamento via boleto
      </Typography>

      <Image src='/images/iris/boleto-gerado.svg' alt='Boleto gerado' width={120} height={98} />

      <Typography
        variant='h5'
        sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--mui-palette-text-secondary)' }}
      >
        Boleto gerado com sucesso!
      </Typography>

      <Typography variant='body1'>
        Você pode copiar a linha digitável ou visualizar o documento completo usando os botões abaixo. Uma cópia também
        foi enviada para o seu e-mail.
      </Typography>
      <Typography variant='body1'>
        Após a confirmação do pagamento,{' '}
        <span className='font-bold'>
          o valor aportado será adicionado ao seu saldo durante a próxima atualização de contas.
        </span>
      </Typography>

      <div className='w-full flex flex-col justify-center items-center gap-2'>
        <BoxCopy description={codigo} />
      </div>

      <div className='w-full flex flex-wrap justify-center items-center mt-4 mb-4 gap-4'>
        <Link href={`https://www.funprespjud.com.br`} target='_blank'>
          <ActionButton
            variant='contained'
            color='primary'
            startIcon={<i className='fa-solid fa-arrow-up-right-from-square' />}
            sx={{
              width: '260px',
              maxWidth: '260px',
              padding: '.5rem 2rem'
            }}
          >
            Visualizar boleto
          </ActionButton>
        </Link>

        <ActionButton
          variant='outlined'
          color='primary'
          onClick={onNovaContribuicao}
          sx={{ width: '100%', maxWidth: '260px', padding: '.5rem 2rem' }}
        >
          Nova contribuição
        </ActionButton>
      </div>
    </div>
  )
}
