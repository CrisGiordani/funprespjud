import { useCallback, useEffect, useState } from 'react'

import { Skeleton, Typography } from '@mui/material'

import { useGetPerfilAtual } from '@/hooks/perfilInvestimento/useGetPerfilAtual'
import { useGetPerfilIndicado } from '@/hooks/perfilInvestimento/useGetPerfilIndicado'
import { useAuth } from '@/contexts/AuthContext'
import Link from '@/components/Link'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { getPerfilBasicDataById } from '@/utils/perfilInvestimentoUtils'

export function CardPerfilInvestimento({
  className,
  isShowPerfilIndicado = true,
  isShowBenchmark = false,
  handleAlterarPerfil,
  handleInformacoes
}: {
  className?: string
  isShowPerfilIndicado?: boolean
  isShowBenchmark?: boolean
  handleAlterarPerfil?: () => void
  handleInformacoes?: () => void
}) {
  const { perfilIndicado, getPerfilIndicado, error } = useGetPerfilIndicado()
  const { perfilAtual, getPerfilAtual } = useGetPerfilAtual()
  const { user } = useAuth()

  const [dadosBasicosPerfilAtual, setDadosBasicosPerfilAtual] = useState<{
    benchmark: string
    limiteRisco: string
    dataAposentadoria: string
  } | null>(null)

  const fetchPerfil = useCallback(() => {
    if (user?.cpf) {
      getPerfilAtual(user.cpf)
      getPerfilIndicado(user.cpf)
      setDadosBasicosPerfilAtual(getPerfilBasicDataById(perfilAtual?.idPerfil || ''))
    }

    // setDadosBasicosPerfilAtual(getPerfilBasicDataById(perfilAtual?.idPerfil))
  }, [user?.cpf, getPerfilAtual, getPerfilIndicado, perfilAtual?.idPerfil])

  useEffect(() => {
    fetchPerfil()
  }, [fetchPerfil])

  return (
    <CardCustomized.Root>
      <CardCustomized.Content>
        <div className={className}>
          <div className='flex flex-row gap-4'>
            <div className='rounded-full bg-primary-main/10 p-2 flex items-center align-middle justify-center w-14 h-14'>
              <i className='fa-kit fa-solid-chart-mixed-user text-primary-main text-xl'></i>
            </div>
            <div className='flex flex-col'>
              <Typography variant='body1' className='py-0 my-0'>
                Seu perfil de investimento
              </Typography>

              {perfilAtual?.descricao ? (
                <Typography variant='h5' className='font-bold py-0 my-0'>
                  {perfilAtual?.descricao}
                </Typography>
              ) : (
                <Skeleton variant='text' height={28} width={250} sx={{ borderRadius: '5px' }} />
              )}

              {isShowBenchmark && dadosBasicosPerfilAtual?.benchmark && (
                <>
                  <Typography variant='body1' className='py-0 my-0'>
                    Benchmark: <span className='font-bold text-primary-main'>{dadosBasicosPerfilAtual?.benchmark}</span>
                  </Typography>

                  <Link href='/patrimonio/investimento' className='mt-4' onClick={handleAlterarPerfil}>
                    <ButtonCustomized variant='outlined' type='button' fullWidth className='px-4'>
                      Ver perfil de investimento
                    </ButtonCustomized>
                  </Link>
                </>
              )}

              {perfilIndicado && !error && isShowPerfilIndicado && (
                <div className='flex flex-row'>
                  <div className='p-2 flex items-center justify-center w-14 h-14'>
                    <i className='fa-regular fa-arrow-turn-down-right text-primary-main text-4xl'></i>
                  </div>
                  <div className='flex flex-col'>
                    <Typography variant='body1' className='py-0 mt-1'>
                      Perfil indicado pela Fundação
                    </Typography>
                    {perfilIndicado?.descricao ? (
                      <Typography variant='h5' className='font-bold py-0 my-0'>
                        {perfilIndicado?.descricao}
                      </Typography>
                    ) : (
                      <Skeleton variant='text' height={28} width={250} sx={{ borderRadius: '5px' }} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='w-full flex justify-start items-start '>
            <div className='w-full max-w-[310px] flex flex-col flex-start text-start gap-4 m-auto'>
              {handleAlterarPerfil && handleInformacoes ? (
                <div className='mt-4'>
                  <ButtonCustomized
                    variant='contained'
                    type='button'
                    className='mt-4'
                    fullWidth
                    onClick={handleAlterarPerfil}
                  >
                    Alterar Perfil
                  </ButtonCustomized>
                  <ButtonCustomized
                    variant='outlined'
                    type='button'
                    className='mt-4'
                    fullWidth
                    onClick={handleInformacoes}
                  >
                    Informações
                  </ButtonCustomized>
                </div>
              ) : (
                <Link href='/patrimonio/investimento' className='mt-4' onClick={handleAlterarPerfil}>
                  <ButtonCustomized variant='outlined' type='button' fullWidth className='px-4'>
                    Ver perfil de investimento
                  </ButtonCustomized>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
