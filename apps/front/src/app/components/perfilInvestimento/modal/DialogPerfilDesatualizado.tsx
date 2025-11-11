import Image from 'next/image'

import { Typography } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'

export default function DialogPerfilDesatualizado({
  open,
  handleClose,
  handlePreencherAPP
}: {
  open: boolean
  handleClose: () => void
  handlePreencherAPP: () => void
}) {
  return (
    <DialogCustomized
      id='dialog-perfil-desatualizado'
      open={open}
      showCloseButton={false}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image
            src='/images/iris/modal-preencher-app.svg'
            alt='Análise de Perfil de Participante pendente'
            width={74}
            height={84}
          />
          <Typography variant='h4' className='text-center'>
            Análise de Perfil de Participante pendente
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>Prezado(a) Participante,</Typography>

          <Typography variant='body1'>
            Não encontramos nenhum questionário de Análise do participante (APP) válido preenchido.
          </Typography>

          <Typography variant='body1'>
            Lembre-se que
            <span className='font-semibold'> este documento é de preenchimento obrigatório </span>
            para todos os participantes de Entidades Fechadas de Previdência Complementar (EFPC) que oferecem perfis de
            investimento.
          </Typography>

          <Typography variant='body1'>
            O questionário tem o objetivo de medir seu grau de conhecimento em relação a finanças e investimentos em
            geral.
            <span className='font-semibold'> Ele contém 8 perguntas </span>
            com
            <span className='font-semibold'> tempo estimado de resposta de apenas 2 minutos </span>e deve ser
            <span className='font-semibold'>
              {' '}
              atualizado a cada 36 meses, ou a cada 6 meses caso deseje alterar seu perfil de investimento.
            </span>
          </Typography>

          <Typography variant='body1'>Como deseja prosseguir?</Typography>

          <div className='w-full mt-2'>
            <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='contained'
                color='primary'
                onClick={() => {
                  handlePreencherAPP()
                }}
              >
                Preencher APP
              </ButtonCustomized>
              <ButtonCustomized variant='outlined' color='error' onClick={handleClose}>
                Não desejo responder
              </ButtonCustomized>
            </div>
          </div>
        </div>
      }
    />
  )
}
