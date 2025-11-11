import Link from 'next/link'

import { Box, Button, Divider, Typography } from '@mui/material'

import { CardCustomized } from '@/components/ui/CardCustomized'
import BoxCopy from '../ui/BoxCopy'

export default function CardInformacoes() {
  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title='Informações'
        subheader={
          <>
            <Typography variant='body1'>Prezado(a) participante,</Typography>
            <Typography variant='body1'>
              Organizamos nesta página um conjunto de links úteis e nossos contatos para melhor auxiliá-lo na escolha de
              seu perfil de investimento.
            </Typography>
          </>
        }
      />
      <CardCustomized.Content>
        <Divider className='my-4' />

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant='h5'
            sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--mui-palette-text-secondary)' }}
          >
            PDFs informativos
          </Typography>

          <div className='flex flex-col items-center justify-center mt-4 gap-2'>
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary)' }}>
              Para mais informações acesse:
            </Typography>

            <Button
              className='align-center'
              variant='outlined'
              startIcon={<i className='fa-regular fa-eye'></i>}
              sx={{
                padding: '0.8rem',
                width: '24rem'
              }}
            >
              <Link
                href='https://www.funprespjud.com.br/wp-content/uploads/2024/10/Guia-Perfil-Investimento-FunprespJud.pdf'
                target='_blank'
              >
                Guia de perfil de investimento
              </Link>
            </Button>
          </div>

          <div className='flex flex-col items-center justify-center mt-6 gap-2'>
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary)' }}>
              Para consultar os segmentos de aplicação autorizados para cada perfil, além dos limites e restrições,
              acesse:
            </Typography>

            <Button
              className='align-center'
              variant='outlined'
              startIcon={<i className='fa-regular fa-eye'></i>}
              sx={{
                padding: '0.8rem',
                width: '24rem'
              }}
            >
              <Link
                href='https://www.funprespjud.com.br/wp-content/uploads/2024/12/Politica-de-Investimentos-2025-2029.pdf'
                target='_blank'
              >
                Política de investimentos 2025 - 2029
              </Link>
            </Button>
            <Button
              className='align-center'
              variant='outlined'
              startIcon={<i className='fa-regular fa-eye'></i>}
              sx={{
                padding: '0.8rem',
                width: '24rem'
              }}
            >
              <Link href='https://www.funprespjud.com.br/wp-content/uploads/2025/01/pgi-2025.pdf' target='_blank'>
                Plano gerencial de Investimentos
              </Link>
            </Button>
          </div>
        </Box>

        <Divider className='mb-4 mt-6' />

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant='h5'
            sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--mui-palette-text-secondary)' }}
          >
            Links úteis
          </Typography>
          <div className='flex flex-col items-center justify-center mt-4 gap-2'>
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary)' }}>
              Para mais informações acesse:
            </Typography>
            <div className='flex justify-center flex-col gap-4 w-1/3 mx-auto align-middle items-center'>
              <Button
                className='align-center'
                variant='outlined'
                startIcon={<i className='fa-regular fa-arrow-up-right-from-square'></i>}
                sx={{
                  padding: '0.8rem',
                  width: '24rem'
                }}
              >
                <Link href='https://www.funprespjud.com.br/perfis-de-investimentos/' target='_blank'>
                  Página sobre perfis de investimento
                </Link>
              </Button>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center mt-6 gap-2'>
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary)' }}>
              Para outras dúvidas, nossa FAQ, na seção &apos;Tópicos Frequentes&apos;, dentro da categoria
              &apos;Investimento&apos;, pode te ajudar:
            </Typography>

            <div className='flex justify-center flex-col gap-4 w-1/3 mx-auto align-middle items-center'>
              <Button
                className='align-center'
                variant='outlined'
                startIcon={<i className='fa-regular fa-arrow-up-right-from-square'></i>}
                sx={{
                  padding: '0.8rem',
                  width: '24rem'
                }}
              >
                <Link href='https://www.funprespjud.com.br/atendimento/' target='_blank'>
                  Acessar FAQ
                </Link>
              </Button>
            </div>
          </div>
        </Box>

        <Divider className='mb-4 mt-6' />

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant='h5'
            sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--mui-palette-text-secondary)' }}
          >
            Contatos
          </Typography>
          <div className='flex flex-col items-center justify-center mt-4 gap-2'>
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary)' }}>
              A nossa equipe de Relacionamento está à disposição para esclarecer dúvidas:
            </Typography>

            <div className='flex flex-col gap-4 mt-2'>
              <BoxCopy
                title='E-mail:'
                description='sap@funprespjud.com.br'
                icon='fa-regular fa-envelope'
                type='email'
              />
              <BoxCopy title='Telefone:' description='(61) 3029-5070' icon='fa-regular fa-phone' type='phone' />
              <BoxCopy title='WhatsApp:' description='(61) 4042-5515' icon='fa-brands fa-whatsapp' type='whatsapp' />
            </div>
          </div>
        </Box>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
