import { useEffect, useState } from 'react'

import type { ListProps } from '@mui/material'
import { List, styled, Typography } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

import PaginationIris from '../../iris/PaginationIris'
import HoverButton from '../../iris/HoverButton'
import { statusMessageMap, type StatusHistoricoAPPEnum } from '@/enum/perfilInvestimento/StatusHistoricoEnum'
import useGetHistorico from '@/hooks/perfilInvestimento/useGetHistorico'

import { formatarDataBR } from '@/app/utils/formatters'

import BoxHistoricoNaoEncontrado from '../historicoNaoEncontrado/BoxHistoricoNaoEncontrado'
import useGetAppStatus from '@/hooks/perfilInvestimento/useGetAppStatus'
import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'

export default function CardHistoricoRespostas() {
  const StyledList = styled(List)<ListProps>(({ theme }) => ({
    '& .MuiListItem-root': {
      border: '1px solid var(--mui-palette-divider)',
      padding: '26px',
      '&:first-of-type': {
        borderStartStartRadius: 'var(--mui-shape-borderRadius)',
        borderStartEndRadius: 'var(--mui-shape-borderRadius)'
      },
      '&:last-child': {
        borderEndStartRadius: 'var(--mui-shape-borderRadius)',
        borderEndEndRadius: 'var(--mui-shape-borderRadius)'
      },
      '&:not(:last-child)': {
        borderBlockEnd: 0
      },
      '& .MuiListItem-root': {
        paddingInlineEnd: theme.spacing(24)
      },
      '& .MuiListItemText-root': {
        marginBlockStart: 0,
        '& .MuiTypography-root': {
          fontWeight: 500
        }
      }
    }
  }))

  const { user } = useAuth()
  const { listHistorico, error, getHistorico } = useGetHistorico()
  const [page, setPage] = useState(0)
  const { appStatus, getAppStatus } = useGetAppStatus()

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  useEffect(() => {
    const fetchHistorico = async () => {
      if (user?.cpf) {
        await getHistorico(user.cpf, page, 5)
        await getAppStatus(user.cpf)
      }
    }

    fetchHistorico()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user])

  if (error) {
    return <div className='text-error text-center'>Erro ao buscar histórico</div>
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Histórico de respostas ao questionário de Análise de Perfil do Participante (APP)' />
      <CardCustomized.Content>
        {/* Ultima resposta */}

        {appStatus && listHistorico.historico.length > 0 && (
          <div>
            <Typography
              variant='h5'
              sx={{ color: 'var(--mui-palette-text-secondary)', marginTop: '1rem', fontSize: '1.25rem' }}
            >
              Resposta vigente
            </Typography>
            <StyledList>
              <ListItem key='ultimo-item-valido'>
                <ListItemAvatar className='flex gap-5 items-center is-full'>
                  <i
                    className={`${
                      statusMessageMap.get(Number(appStatus?.cdStatus) as unknown as StatusHistoricoAPPEnum)?.icon
                    }
                      text-5xl text-${statusMessageMap.get(Number(appStatus?.cdStatus) as unknown as StatusHistoricoAPPEnum)?.variant} mb-2`}
                  />

                  <div className='is-full'>
                    <ListItemText
                      primary={
                        statusMessageMap.get(Number(appStatus?.cdStatus) as unknown as StatusHistoricoAPPEnum)?.message
                      }
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '16px',
                          fontWeight: 800
                        }
                      }}
                    ></ListItemText>{' '}
                    {appStatus?.dt_evento && (
                      <ListItemText secondary={`Atualizado em ${formatarDataBR(appStatus.dt_evento)}`}></ListItemText>
                    )}
                  </div>

                  {appStatus.urlDocumento && <HoverButton url={appStatus.urlDocumento} />}
                </ListItemAvatar>
              </ListItem>
            </StyledList>
          </div>
        )}

        {listHistorico.historico.length > 0 ? (
          <>
            <Typography
              variant='h5'
              sx={{ color: 'var(--mui-palette-text-secondary)', marginTop: '1rem', fontSize: '1.25rem' }}
            >
              Histórico de respostas
            </Typography>
            <StyledList>
              {listHistorico.historico.map((course, index) => {
                const statusMap = statusMessageMap.get(
                  Number(course?.status?.cdStatus) as unknown as StatusHistoricoAPPEnum
                )

                return (
                  <ListItem key={index}>
                    <ListItemAvatar className='flex gap-5 items-center is-full'>
                      <i className={`${statusMap?.icon} text-5xl text-${statusMap?.variant} mb-2`} />

                      <div className='is-full'>
                        <ListItemText
                          primary={statusMap?.message}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '16px',
                              fontWeight: 800
                            }
                          }}
                        ></ListItemText>
                        <ListItemText
                          secondary={`Atualizado em ${
                            course?.dt_evento
                              ? formatarDataBR(course.dt_evento) +
                                ', às ' +
                                new Date(course.dt_evento).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : undefined
                          }`}
                        ></ListItemText>
                      </div>
                      <HoverButton url={course.urlDocumento} />
                    </ListItemAvatar>
                  </ListItem>
                )
              })}
            </StyledList>
          </>
        ) : (
          <BoxHistoricoNaoEncontrado mensagem='Nenhuma resposta ao questionário de Análise de perfil do participante (APP) encontrada...' />
        )}
      </CardCustomized.Content>
      {
        <div className='w-full   flex flex-col items-center justify-center my-5 '>
          <div className='w-full  flex flex-col items-center justify-end '>
            <PaginationIris
              totalPaginas={listHistorico.totalPages || 1}
              page={page + 1}
              handleChange={(_, value) => handleChange(_, value - 1)}
            />
          </div>
        </div>
      }
    </CardCustomized.Root>
  )
}
