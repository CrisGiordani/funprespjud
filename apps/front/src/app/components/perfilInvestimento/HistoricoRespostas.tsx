import { Typography, Skeleton, Box } from '@mui/material'

import { formatarDataBR } from '@/app/utils/formatters'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { StatusHistoricoAPPEnum, statusMessageMap } from '@/enum/perfilInvestimento/StatusHistoricoEnum'

function HistoricoRespostaItem({ status, date }: { status: StatusHistoricoAPPEnum; date?: string }) {
  const { message, icon, variant } = statusMessageMap.get(status)!

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgb(var(--mui-mainColorChannels-gray))',
        borderRadius: '7px',
        padding: '1.5rem'
      }}
    >
      <i className={`${icon} text-5xl text-${variant} mb-2`} />

      {date && <Typography variant='body1'>Resposta vigente</Typography>}

      <Typography
        variant='body1'
        sx={{
          fontWeight: date ? 700 : 400,
          color: 'var(--mui-palette-text-primary)'
        }}
      >
        {message}
      </Typography>

      {date && <Typography variant='body1'>Atualizado em {date}</Typography>}
    </Box>
  )
}

export default function HistoricoRespostas({
  handleHistoricoRespostas,
  ultimaResposta,
  error,
  semResposta
}: {
  handleHistoricoRespostas: () => void
  ultimaResposta: any
  error: any
  semResposta: boolean
}) {
  const handleVisualizarArquivo = () => {
    if (ultimaResposta) {
      return window.open(ultimaResposta.urlDocumento, '_blank')
    }
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Histórico de respostas de APP' />

      <CardCustomized.Content className='mt-3'>
        {!ultimaResposta && !error && !semResposta ? (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Skeleton variant='text' width='60%' height={20} />
              <Skeleton variant='text' width='80%' height={24} />
              <Skeleton variant='text' width='40%' height={20} />
              <Skeleton variant='rectangular' width='100%' height={40} className='mt-2' />
              <Skeleton variant='rectangular' width='100%' height={40} />
            </div>
          </div>
        ) : (
          <>
            {!ultimaResposta?.urlDocumento && (error || semResposta) ? (
              <HistoricoRespostaItem status={StatusHistoricoAPPEnum.NUNCA_PREENCHIDO} />
            ) : (
              <HistoricoRespostaItem
                status={ultimaResposta?.status.cdStatus as StatusHistoricoAPPEnum}
                date={
                  ultimaResposta?.dt_evento
                    ? formatarDataBR(ultimaResposta.dt_evento) +
                      ', às ' +
                      new Date(ultimaResposta.dt_evento).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : undefined
                }
              />
            )}

            <div className='w-full mt-8'>
              <div className='max-w-[300px] flex flex-col text-center gap-4 m-auto'>
                <ButtonCustomized
                  title='Visualizar arquivo da resposta'
                  variant='contained'
                  onClick={handleVisualizarArquivo}
                  disabled={!ultimaResposta?.urlDocumento}
                >
                  Visualizar resposta
                </ButtonCustomized>
                <ButtonCustomized variant='outlined' color='primary' onClick={handleHistoricoRespostas}>
                  Histórico de respostas
                </ButtonCustomized>
              </div>
            </div>
          </>
        )}
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
