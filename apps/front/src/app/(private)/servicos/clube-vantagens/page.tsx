'use client'

import { useEffect, useState, useRef } from 'react'

import Image from 'next/image'

import { Typography } from '@mui/material'

import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import Link from '@/components/Link'
import { leftZero } from '@/app/utils/formatters'

export default function Page() {
  const [tempoRestante, setTempoRestante] = useState(5)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (tempoRestante <= 0) {
      buttonRef.current?.click()

      return
    }

    const interval = setInterval(() => {
      setTempoRestante(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [tempoRestante])

  return (
    <CardCustomized.Root>
      <CardCustomized.Content className='flex flex-col items-center justify-center gap-4'>
        <Image src='/images/iris/clube-de-vantagens.svg' alt='Clube de Vantagens' width={120} height={98} />
        <Typography variant='h4'>
          Você será redirecionado em <span className='font-bold text-primary-main'> {leftZero(tempoRestante)} </span>
          segundos
        </Typography>

        <Typography variant='body1'>
          Nosso Clube de Vantagens com Cashback funciona em uma página externa ao portal do Participante.
        </Typography>
        <Typography variant='body1'>
          Caso você não seja redirecionado (a) automaticamente ou prefira não esperar, clique no botão abaixo para
          acessar imediatamente.
        </Typography>

        <ButtonCustomized variant='contained' sx={{ width: '280px', padding: '0' }}>
          <Link
            ref={buttonRef}
            href='https://funprespjud.prev4u.com.br/'
            target='_blank'
            rel='noopener noreferrer'
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Acessar agora
          </Link>
        </ButtonCustomized>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
