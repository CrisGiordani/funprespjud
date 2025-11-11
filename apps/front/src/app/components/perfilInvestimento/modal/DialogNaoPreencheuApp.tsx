import { useState } from 'react'

import Image from 'next/image'

import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'

export default function DialogNaoPreencheuApp({
  isOpen,
  handleClose,
  handlePreencherAPP,
  handleShowTermoNotificacao
}: {
  isOpen: boolean
  handleClose: () => void
  handlePreencherAPP: () => void
  handleShowTermoNotificacao?: () => void
}) {
  const [checked, setChecked] = useState(false)

  const handleCloseModal = () => {
    if (checked && handleShowTermoNotificacao) {
      handleClose()
      handleShowTermoNotificacao()
    } else {
      handleClose()
    }
  }

  return (
    <DialogCustomized
      id='dialog-perfil-desatualizado'
      open={isOpen}
      showCloseButton={false}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image
            src='/images/iris/modal-preencher-app.svg'
            alt='Análise de Perfil de Participante ainda não preenchido'
            width={74}
            height={84}
          />
          <Typography variant='h4' className='text-center'>
            Você ainda não preencheu seu APP
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>Prezado(a) Participante,</Typography>

          <Typography variant='body1'>
            O questionário de{' '}
            <span className='font-semibold'>
              Análise de Perfil do Participante (APP) é um documento de preenchimento obrigatório
            </span>{' '}
            para todos os participantes de Entidades Fechadas de Previdência Complementar (EFPC) que oferecem perfis de
            investimentos.
          </Typography>
          <Typography variant='body1'>
            O questionário tem o objetivo de medir seu grau de conhecimento em relação a finanças e investimentos em
            geral. Ele{' '}
            <span className='font-semibold'>contém 8 perguntas com tempo estimado de resposta de apenas 2 minutos</span>{' '}
            e deve ser{' '}
            <span className='font-semibold'>
              atualizado a cada 36 meses, ou a cada 6 meses caso deseje alterar seu perfil de investimento.
            </span>
          </Typography>
          <Typography variant='body1'>
            Por padrão te avisamos do questionário toda a vez que entrar no portal, mesmo que um termo de recusa tenha
            sido gerado. Caso não deseje ser notificado novamente marque a caixa de seleção abaixo e feche o aviso.
          </Typography>

          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
              label='Não mostrar essa mensagem novamente.'
            />
          </FormGroup>

          <div className='w-full mt-2'>
            <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized variant='contained' color='primary' onClick={handlePreencherAPP}>
                Preencher APP
              </ButtonCustomized>
              <ButtonCustomized variant='outlined' color='primary' onClick={handleCloseModal}>
                Fechar aviso
              </ButtonCustomized>
            </div>
          </div>
        </div>
      }
    />
  )
}
