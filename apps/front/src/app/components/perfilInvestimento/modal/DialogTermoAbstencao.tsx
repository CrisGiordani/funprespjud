import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'

import { StatusHistoricoEnum } from '@/enum/perfilInvestimento/StatusHistoricoEnum'
import { usePostGerarTermos } from '@/hooks/perfilInvestimento/usePostGerarTermos'
import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { useAuth } from '@/contexts/AuthContext'

export default function DialogTermoAbstencao({
  isOpen,
  handleClose,
  handleEtapa,
  handleResponderQuestionario
}: {
  isOpen: boolean
  handleClose: () => void
  handleEtapa: () => void
  handleResponderQuestionario: (value: string) => void
}) {
  const [checked, setChecked] = useState(false)

  const { user, refetch } = useAuth()

  const { postGerarTermos } = usePostGerarTermos()

  useEffect(() => {
    refetch()
  }, [])

  return (
    <DialogCustomized
      id='dialog-termo-de-recusa'
      open={isOpen}
      showCloseButton={false}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image src='/images/iris/modal-termo-recusa.svg' alt='Termo de recusa' width={74} height={84} />
          <Typography variant='h4' className='text-center'>
            Termo de recusa
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>Prezado(a) Participante,</Typography>

          <Typography variant='body1'>
            Ressaltamos o caráter <span className='font-semibold'>obrigatório</span> do preenchimento da Análise de
            Perfil de Participante (APP) e que ao{' '}
            <span className='font-semibold'>
              optar por não responder ao questionário, ações condicionadas ao cumprimento desta obrigação não poderão
              ser realizadas
            </span>{' '}
            até a revogação deste termo.
          </Typography>
          <Typography variant='body1'>
            <span className='font-semibold'>A opção de não preenchimento do APP gerará um termo de recusa</span> que
            ficará registrado em seu histórico.{' '}
            <span className='font-semibold'>Esse termo poderá ser revogado a qualquer momento</span> preenchendo o{' '}
            <span className='font-semibold'>questionário na aba “Perfil de investimento”.</span>
          </Typography>
          <Typography variant='body1'>
            Ao entrar novamente no portal você continuará sendo notificado sobre a análise de perfil do participante
            (APP).
          </Typography>

          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
              label='Estou ciente de que ao prosseguir confirmo minha escolha de não responder o questionário e emitirei um Termo de recusa.'
              sx={{
                alignItems: 'flex-start',
                '& .MuiButtonBase-root': {
                  paddingTop: 0
                }
              }}
            />
          </FormGroup>

          <div className='w-full mt-2'>
            <div className='max-w-[270px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='contained'
                color='primary'
                disabled={!checked}
                onClick={async () => {
                  await postGerarTermos(
                    user?.cpf as string,
                    StatusHistoricoEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE
                  ).then(() => {
                    handleClose()
                    handleEtapa()
                  })
                }}
              >
                Gerar termo de recusa
              </ButtonCustomized>

              <ButtonCustomized
                variant='outlined'
                color='primary'
                onClick={() => {
                  handleClose()
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
