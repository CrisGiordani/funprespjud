import { useEffect } from 'react'

import { Alert, Button, Card, CardContent, Skeleton, Typography } from '@mui/material'

import { useGetPerfilAtual } from '@/hooks/perfilInvestimento/useGetPerfilAtual'
import { useAuth } from '@/contexts/AuthContext'

import { useGetPerfilIndicado } from '@/hooks/perfilInvestimento/useGetPerfilIndicado'

export default function CardSeuPerfil({
  className,
  handleAlterarPerfil,
  handleInformacoes
}: {
  className?: string
  handleAlterarPerfil: () => void
  handleInformacoes: () => void
}) {
  const { perfilIndicado, getPerfilIndicado } = useGetPerfilIndicado()
  const { perfilAtual, getPerfilAtual, error, semPerfil } = useGetPerfilAtual()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.cpf) {
      getPerfilAtual(user.cpf)
      getPerfilIndicado(user.cpf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className={className}>
      <Card className='flex flex-col hover:shadow-xl transition-shadow duration-300 px-12 py-16 rounded-4xl'>
        {error && <Alert severity='warning'>Não foi possível carregar o perfil de investimento.</Alert>}

        <>
          <div className='flex flex-col md:flex-row items-center'>
            {perfilAtual && (
              <div className='rounded-full bg-blue-100 p-2 flex items-center justify-center w-14 h-14'>
                <i className='fa-regular fa-chart-mixed-up-circle-dollar text-primary-main text-xl'></i>
              </div>
            )}
            {!perfilAtual && !semPerfil && !error && <Skeleton variant='circular' width={75} height={60} />}
            {!perfilAtual && !semPerfil && !error && (
              <div className='w-full ms-3'>
                <Skeleton variant='text' width='80%' height={20} className='w-full' />
                <Skeleton variant='text' width='60%' height={24} className='w-full' />
              </div>
            )}
            <div className='flex flex-col ms-3'>
              {perfilAtual && (
                <div className='w-full'>
                  <Typography variant='h5' className='text-gray-800 mt-2 py-0 '>
                    Seu Perfil de investimento
                  </Typography>
                  <Typography variant='h4' className='text-gray-600 my-0 py-0 font-semibold'>
                    {perfilAtual?.descricao}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-6 gap-4 w-full'>
            <div className='md:col-start-2 col-span-1'>
              {perfilIndicado && (
                <i className='fa-regular fa-arrow-turn-down-right text-primary-main text-4xl ms-2'></i>
              )}
            </div>
            {!perfilAtual && !semPerfil && !error && (
              <div className='w-full  col-start-3 col-span-4'>
                <Skeleton variant='text' width='100%' height={20} className='w-full' />
                <Skeleton variant='text' width='100%' height={24} className='w-full' />
              </div>
            )}
            {perfilIndicado && (
              <div className='col-start-3 col-span-4'>
                <Typography variant='body1' className='py-0 my-0'>
                  Perfil indicado pela Fundação
                </Typography>
                <Typography variant='h5' className='font-semibold py-0 my-0'>
                  {perfilIndicado?.descricao}
                </Typography>
              </div>
            )}
          </div>

          <CardContent className='flex-1 p-0 mt-5'>
            {perfilAtual && (
              <div className='flex flex-col gap-4 '>
                <div className='flex flex-col gap-2'>
                  <Button variant='contained' color='primary' className='p-3 mb-1' onClick={handleAlterarPerfil}>
                    Alterar perfil
                  </Button>
                  <Button variant='outlined' color='primary' className='p-3' onClick={handleInformacoes}>
                    Informações
                  </Button>
                </div>
              </div>
            )}
            {!perfilAtual && semPerfil && !error && (
              <div className='w-full ms-3 flex flex-col gap-2'>
                <Skeleton variant='rectangular' width='100%' height={40} className='w-full' />
                <Skeleton variant='rectangular' width='100%' height={40} className='w-full' />
              </div>
            )}
          </CardContent>
        </>
      </Card>
    </div>
  )
}
