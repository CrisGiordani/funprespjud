import { useState } from 'react'

import Image from 'next/image'

import { Box, Typography } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { CardCustomized } from '@/components/ui/CardCustomized'
import Link from '@/components/Link'
import { formatarDataBRAddMeses } from '@/app/utils/formatters'
import { RenderModais } from '@/app/components/common/RenderModais'

type AppStatus = 'respondido' | 'pendente' | 'nao-respondida' | 'nao-notificado'

export function AnaliseApp({
  showAlert,
  cpf,
  status,
  date,
  getAppStatus,
  handleResponderQuestionario,
  handleHistoricoRespostas,
  className
}: {
  showAlert?: boolean
  cpf: string
  status: AppStatus
  date?: string
  getAppStatus: () => void
  handleResponderQuestionario: () => void
  handleHistoricoRespostas?: () => void
  className?: string
}) {
  const [modalStatusApp, setModalStatusApp] = useState<boolean>(false)
  const [modalTermoAbstencao, setModalTermoAbstencao] = useState<boolean>(false)
  const [modalNaoPreencheuApp, setModalNaoPreencheuApp] = useState<boolean>(false)
  const [modalTermoNotificacao, setModalTermoNotificacao] = useState<boolean>(false)

  const APPStatusMap = new Map<
    AppStatus,
    {
      image: string
      title: string
      description: React.ReactNode
      actions: React.ReactNode
    }
  >([
    [
      'respondido',
      {
        image: '/images/iris/app-preenchido.svg',
        title: 'Análise de perfil do Participante respondida',
        description: (
          <Typography variant='body1'>
            <span className='font-bold'>
              Você preencheu o questionário em {date} e essas respostas ficarão válidas até o dia{' '}
              {formatarDataBRAddMeses(date, 36)} (36 meses) ou {formatarDataBRAddMeses(date, 6)} (6 meses) caso queira
              realizar alteração de perfil.
            </span>{' '}
            É possível respondê-lo novamente quantas vezes desejar ou visualizar suas respostas na aba de histórico de
            respostas.
          </Typography>
        ),
        actions: (
          <div>
            <Typography variant='body1'>Deseja preencher novamente?</Typography>

            <div className='w-full mt-2'>
              <div
                className={`flex sm:flex-row flex-col gap-4 ${showAlert ? 'max-w-[600px]' : 'max-w-[320px]'} m-auto`}
              >
                <ButtonCustomized variant='contained' color='primary' onClick={handleResponderQuestionario}>
                  Preencher APP novamente
                </ButtonCustomized>
                {showAlert && handleHistoricoRespostas && (
                  <ButtonCustomized variant='outlined' color='primary' onClick={handleHistoricoRespostas}>
                    Ver histórico de respostas
                  </ButtonCustomized>
                )}
              </div>
            </div>
          </div>
        )
      }
    ],
    [
      'pendente',
      {
        image: '/images/iris/modal-preencher-app.svg',
        title: 'Análise de perfil do participante pendente',
        description: (
          <Typography variant='body1'>
            <span className='font-bold'>O questionário de análise de perfil é necessário</span> para acessar algumas
            funcionalidades de acordo com a exigência da{' '}
            <Link
              href='https://conteudo.cvm.gov.br/legislacao/resolucoes/resol030.html'
              target='_blank'
              className='text-primary-main underline cursor-pointer'
            >
              {' '}
              Resolução CVM nº30
            </Link>
            . Apesar de ser necessário para realizar algumas ações relacionadas ao perfil de investimento,{' '}
            <span className='font-bold'>as respostas desse questionário não afetam recomendações de perfil.</span>
          </Typography>
        ),
        actions: (
          <div>
            <Typography variant='body1'>Como deseja prosseguir?</Typography>

            <div className='w-full mt-2'>
              <div className='max-w-[600px] flex sm:flex-row flex-col  text-center gap-4 m-auto'>
                <ButtonCustomized variant='contained' color='primary' onClick={handleResponderQuestionario}>
                  Preencher APP
                </ButtonCustomized>
                <ButtonCustomized variant='outlined' color='error' onClick={() => setModalTermoAbstencao(true)}>
                  Não desejo responder
                </ButtonCustomized>
              </div>
            </div>
          </div>
        )
      }
    ],
    [
      'nao-respondida',
      {
        image: '/images/iris/modal-termo-recusa.svg',
        title: 'Análise de perfil do participante não respondida',
        description: (
          <Typography variant='body1'>
            <span className='font-bold'>
              No dia {date} foi emitido um Termo de recusa de preenchimento da análise de perfil do participante.
            </span>{' '}
            A atualização deste questionário é necessária para acessar algumas funcionalidades que estão condicionadas
            ao seu preenchimento de acordo com a exigência da{' '}
            <Link
              href='https://conteudo.cvm.gov.br/legislacao/resolucoes/resol030.html'
              target='_blank'
              className='text-primary-main underline cursor-pointer'
            >
              Resolução CVM nº30
            </Link>
            .
          </Typography>
        ),
        actions: (
          <div className='flex flex-col gap-4'>
            <Typography variant='body1'>
              Por padrão, você é notificado sobre o questionário a cada acesso ao portal até preenchê-lo ou solicitar a
              não notificação. Como prefere de prosseguir?
            </Typography>

            <div className='w-full mt-2'>
              <div className='max-w-[600px] flex text-center gap-4 m-auto'>
                <ButtonCustomized variant='contained' color='primary' onClick={handleResponderQuestionario}>
                  Preencher APP
                </ButtonCustomized>
                <ButtonCustomized
                  variant='outlined'
                  color='error'
                  onClick={() => setModalTermoNotificacao(true)}
                  startIcon={<i className='fa-kit fa-no-notification' />}
                >
                  Não notificar novamente
                </ButtonCustomized>
              </div>
            </div>
          </div>
        )
      }
    ],
    [
      'nao-notificado',
      {
        image: '/images/iris/modal-termo-notificacao.svg',
        title: 'Análise de perfil do participante não respondida e desejo de não ser notificado',
        description: (
          <Typography variant='body1'>
            <span className='font-bold'>
              No dia {date} foi emitido um Termo de recusa de preenchimento da análise de perfil do participante.
            </span>{' '}
            A atualização deste questionário é necessária para acessar algumas funcionalidades que estão condicionadas
            ao seu preenchimento de acordo com a exigência da{' '}
            <Link
              href='https://conteudo.cvm.gov.br/legislacao/resolucoes/resol030.html'
              target='_blank'
              className='text-primary-main underline cursor-pointer'
            >
              Resolução CVM nº30
            </Link>
            .
          </Typography>
        ),

        actions: (
          <div className='flex flex-col gap-4'>
            <Typography variant='body1'>Gostaria de preenchê-lo agora e revogar o Termo de recusa?</Typography>

            <div className='w-full'>
              <div className='max-w-[320px] m-auto'>
                <ButtonCustomized variant='contained' color='primary' onClick={handleResponderQuestionario}>
                  Preencher APP
                </ButtonCustomized>
              </div>
            </div>
          </div>
        )
      }
    ]
  ])

  const { image, title, description, actions } = APPStatusMap.get(status)!

  return (
    <>
      <CardCustomized.Root className={className}>
        <CardCustomized.Content className='flex flex-col gap-4'>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Image src={image} alt={title} width={100} height={100} />
            <Typography variant='h4'>{title}</Typography>
          </Box>
          {description}
          {actions}

          {showAlert && (
            <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 gap-4'>
              <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
              <div>
                <Typography variant='h5' className='text-primary-main font-bold mb-1'>
                  Responder este questionário não afetará as recomendações de perfil de investimento.
                </Typography>
                <Typography variant='body1'>
                  Este questionário não tem como objetivo indicar um perfil de investimento com base na tolerância ao
                  risco do Participante, pois o modelo adotado pela Funpresp-Jud é o Ciclo de Vida. Esse modelo se
                  baseia no conceito de Fundos Data-Alvo, que utiliza a data provável da aposentadoria do Participante,
                  para definir a composição das carteiras de investimentos.
                </Typography>
              </div>
            </Box>
          )}
        </CardCustomized.Content>
      </CardCustomized.Root>

      {RenderModais({
        cpf: cpf as string,
        modalStatus: {
          handleShowTermoNotificacao: () => {
            setModalTermoNotificacao(true)
          },
          onClose: () => {
            if (modalStatusApp) {
              setModalStatusApp(false)
              setModalTermoAbstencao(true)
            } else if (modalTermoAbstencao) {
              getAppStatus()
              setModalTermoAbstencao(false)
            } else if (modalNaoPreencheuApp) {
              setModalNaoPreencheuApp(false)
            } else if (modalTermoNotificacao) {
              getAppStatus()
              setModalTermoNotificacao(false)
            }
          },
          openModal: modalStatusApp
            ? 'preencherApp'
            : modalTermoAbstencao
              ? 'termoRecusa'
              : modalNaoPreencheuApp
                ? 'preencherAppCheckbox'
                : modalTermoNotificacao
                  ? 'termoNotificacao'
                  : null
        }
      })}
    </>
  )
}
