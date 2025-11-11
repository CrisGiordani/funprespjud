/* eslint-disable react/no-unescaped-entities */
import { Box, Typography } from '@mui/material'

import { CardCustomized } from '@/components/ui/CardCustomized'

export function ComoDeclarar() {
  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Como declarar as contribuições à Funpresp-Jud no Imposto de Renda' />
      <CardCustomized.Content>
        <div>
          <Typography
            variant='h5'
            sx={{
              fontWeight: '700',
              fontSize: '1.25rem',
              color: 'var(--mui-palette-primary-main)',
              marginBottom: '0.5rem'
            }}
          >
            Passo 1: verifique valores
          </Typography>
          <Typography variant='body1'>
            <span className='font-bold'>Compare</span> o valor das contribuições no{' '}
            <span className='font-bold'>Demonstrativo da Funpresp-Jud</span> e no{' '}
            <span className='font-bold'>Informe de rendimento do órgão público.</span>
          </Typography>

          <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 mb-4 gap-4'>
            <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary)' }}>
              Se houver divergência, entre em contato com a Funpresp-Jud.
            </Typography>
          </Box>
        </div>
        <div>
          <Typography
            variant='h5'
            sx={{
              fontWeight: '700',
              fontSize: '1.25rem',
              color: 'var(--mui-palette-primary-main)',
              marginBottom: '0.5rem'
            }}
          >
            Passo 2: preencha a declaração
          </Typography>
          <Typography variant='body1'>
            Vá até a aba <span className='font-bold'> "Pagamentos efetuados"</span> no menu lateral.
          </Typography>

          <div className='w-full flex justify-center my-2'>
            <i className='fa-regular fa-arrow-down text-primary-main text-xl'></i>
          </div>

          <Typography variant='body1'>
            Use o
            <span className='font-bold'> “Código 37 - Contribuição para entidades de previdência complementar”.</span>
          </Typography>

          <div className='w-full flex justify-center my-2'>
            <i className='fa-regular fa-arrow-down text-primary-main text-xl'></i>
          </div>

          <Typography variant='body1'>Informe os seguintes dados:</Typography>
          <Box className='flex flex-col items-start bg-gray-100 p-4 rounded-xl mt-4 mb-4 gap-4'>
            <ul>
              <li>
                <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary)' }}>
                  CNPJ da Funpresp-Jud: <span className='font-bold'>18.465.825/0001-47</span>
                </Typography>
              </li>
              <li>
                <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary)' }}>
                  Valor pago pelo Participante
                </Typography>
              </li>
              <li>
                <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary)' }}>
                  Contribuições do Órgão Patrocinador
                </Typography>
              </li>
            </ul>
          </Box>
        </div>
        <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 mb-4 gap-4'>
          <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
          <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary)' }}>
            <span className='font-bold'>O demonstrativo não inclui a gratificação natalina (13º salário)</span>, pois
            ela é tributada exclusivamente na fonte e{' '}
            <span className='font-bold'>não deve ser declarada no imposto de renda.</span>
          </Typography>
        </Box>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
