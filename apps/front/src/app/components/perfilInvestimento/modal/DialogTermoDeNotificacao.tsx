/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Checkbox, FormGroup, Typography, FormControlLabel } from '@mui/material'

import { StatusHistoricoEnum } from '@/enum/perfilInvestimento/StatusHistoricoEnum'
import { usePostGerarTermos } from '@/hooks/perfilInvestimento/usePostGerarTermos'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { useAuth } from '@/contexts/AuthContext'

export default function DialogTermoDeNotificacao({
  isOpen,
  handleClose,
  handleNotificacao,
  handleResponderQuestionario
}: {
  isOpen: boolean
  handleClose: () => void
  handleNotificacao: (notificacao: boolean) => void
  handleResponderQuestionario: (value: string) => void
}) {
  const [checked, setChecked] = useState(false)
  const { user, refetch } = useAuth()

  const { postGerarTermos } = usePostGerarTermos()

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DialogCustomized
      id='dialog-perfil-desatualizado'
      open={isOpen}
      showCloseButton={false}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image src='/images/iris/modal-termo-notificacao.svg' alt='Termo de não notificação' width={74} height={84} />
          <Typography variant='h4' className='text-center'>
            Termo de não notificação
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>
            Ao optar por não receber notificações, mensagens de alerta quanto ao questionário não serão enviadas durante
            a vigência desse termo. Após esse tempo as notificações voltarão a aparecer em tela.
          </Typography>
          <Typography variant='body1'>
            Esse termo terá <span className='font-bold'>validade de 36 meses</span>, entretanto{' '}
            <span className='font-bold'>
              é possível revogá-lo a qualquer momento preenchendo o questionário na aba "Perfil de investimento".
            </span>
          </Typography>
          <Typography variant='body1'>
            Ao entrar novamente no portal você continuará sendo notificado sobre a análise de perfil do participante
            (APP).
          </Typography>

          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
              label='Estou ciente que ao prosseguir confirmo minha escolha de não receber mensagens de alerta e emissão um termo de não notificação.'
            />
          </FormGroup>

          <div className='w-full mt-2'>
            <div className='max-w-[290px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='contained'
                color='primary'
                disabled={!checked}
                onClick={async () => {
                  await postGerarTermos(
                    user?.cpf as string,
                    StatusHistoricoEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR
                  ).then(() => {
                    handleNotificacao(false)
                    handleClose()
                  })
                }}
              >
                Gerar termo de não notificação
              </ButtonCustomized>

              <ButtonCustomized
                variant='outlined'
                color='primary'
                onClick={() => {
                  handleClose()
                  handleNotificacao(true)

                  handleResponderQuestionario('2')
                }}
              >
                Preencher APP
              </ButtonCustomized>
            </div>
          </div>
        </div>
      }
    />
  )
}
