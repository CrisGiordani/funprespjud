import { useCallback, useEffect, useState } from 'react'

import { Box, Typography } from '@mui/material'

import { CoberturasService } from '@/services/CoberturasService'
import type { CoberturaResponseType } from '@/types/coberturas/Coberturas.type'
import { formatCurrency } from '@/app/utils/formatters'
import { useAuth } from '@/contexts/AuthContext'
import Link from '@/components/Link'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

function ShowValorCoberuras({
  titulo,
  valorSeguro,
  mensalidade,
  icon
}: {
  titulo: string
  valorSeguro?: number
  mensalidade?: number
  icon: string
}) {
  return (
    <Box className='min-w-[250px] flex-1 flex flex-col items-start border rounded-xl p-4 gap-4'>
      <div className='flex flex-row items-center gap-2'>
        <i className={`${icon} text-primary-main text-2xl`}></i>
        <Typography variant='h5' className='font-bold'>
          {titulo}
        </Typography>
      </div>

      <Box
        sx={{
          width: '100%',
          minHeight: '145px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: valorSeguro && mensalidade ? 'flex-start' : 'center',
          flexDirection: 'column',
          backgroundColor: 'rgb(var(--mui-mainColorChannels-gray))',
          borderRadius: '7px',
          padding: '1rem'
        }}
      >
        {valorSeguro && mensalidade ? (
          <div className='flex flex-col gap-3 px-4'>
            <div>
              <Typography variant='body1'>Valor segurado</Typography>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 'bold',
                  color: 'var(--mui-palette-text-primary)'
                }}
              >
                {formatCurrency(valorSeguro)}
              </Typography>
            </div>

            <div>
              <Typography variant='body1'>Mensalidade</Typography>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 'bold',
                  color: 'var(--mui-palette-text-primary)'
                }}
              >
                {formatCurrency(mensalidade)}
              </Typography>
            </div>
          </div>
        ) : (
          <Typography variant='body1' className='w-full text-center'>
            Cobertura não contratada
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export function CardMinhasCoberturas() {
  const { user } = useAuth()
  const [coberturas, setCoberturas] = useState<CoberturaResponseType | null>(null)

  const fetchCoberturas = useCallback(async () => {
    if (user?.cpf) {
      const coberturas = await CoberturasService.getCoberturas(user?.cpf)

      setCoberturas(coberturas)
    }
  }, [user?.cpf])

  useEffect(() => {
    fetchCoberturas()
  }, [fetchCoberturas])

  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Minhas Coberturas' />

      <CardCustomized.Content>
        <Box className='flex flex-row gap-4 justify-between w-full flex-wrap'>
          <ShowValorCoberuras
            titulo='Cobertura morte'
            valorSeguro={coberturas?.morte?.valorSeguro}
            mensalidade={coberturas?.morte?.mensalidade}
            icon='fa-regular fa-shield-heart'
          />
          <ShowValorCoberuras
            titulo='Cobertura invalidez'
            valorSeguro={coberturas?.invalidez?.valorSeguro}
            mensalidade={coberturas?.invalidez?.mensalidade}
            icon='fa-regular fa-shield-plus'
          />
        </Box>
      </CardCustomized.Content>

      <CardCustomized.Footer>
        <div className='w-full'>
          <Typography variant='body1' className='mb-4 text-center'>
            {coberturas?.morte?.valorSeguro &&
            coberturas?.morte?.mensalidade &&
            coberturas?.invalidez?.valorSeguro &&
            coberturas?.invalidez?.mensalidade
              ? 'Quer saber mais sobre a nossa Cobertura Adicional de Risco (CAR)?'
              : 'Quer saber mais ou contratar nossa Cobertura Adicional de Risco (CAR)?'}
          </Typography>
          <div className='max-w-[300px] flex flex-col text-center gap-4 m-auto'>
            <Link href='https://www.funprespjud.com.br/car/' target='_blank'>
              <ButtonCustomized variant='outlined' type='button'>
                <i className='fa-regular fa-arrow-up-right-from-square mr-2'></i>
                Visitar página da CAR
              </ButtonCustomized>
            </Link>
          </div>
        </div>
      </CardCustomized.Footer>
    </CardCustomized.Root>
  )
}
