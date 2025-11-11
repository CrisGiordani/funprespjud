import { useEffect } from 'react'

import Image from 'next/image'

import { Box, Typography } from '@mui/material'

import { useGetPerfilAtual } from '@/hooks/perfilInvestimento/useGetPerfilAtual'
import { useGetPerfilSolicitado } from '@/hooks/perfilInvestimento/useGetPerfilSolicitado'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'

export default function DialogCancelarSolicitacao({
  cpf,
  open,
  handleClose,
  handleCancelarSolicitacaoAlteracaoPerfil
}: {
  cpf: string
  open: boolean
  handleClose: () => void
  handleCancelarSolicitacaoAlteracaoPerfil: () => void
}) {
  const { perfilAtual, getPerfilAtual } = useGetPerfilAtual()
  const { perfilSolicitado, getPerfilSolicitado } = useGetPerfilSolicitado()

  useEffect(() => {
    if (cpf) {
      getPerfilAtual(cpf)
      getPerfilSolicitado(cpf)
    }
  }, [cpf, getPerfilAtual, getPerfilSolicitado])

  return (
    <DialogCustomized
      id='cancelar-solicitacao'
      open={open}
      onClose={handleClose}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image src='/images/iris/modal-cancelar-solicitacao.svg' alt='Cancelar solicitação' width={82} height={84} />
          <Typography variant='h4' className='text-center'>
            Cancelar solicitação
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>Prezado(a) Participante,</Typography>

          <Typography variant='body1'>
            Você está prestes a cancelar a solicitação de{' '}
            <span className='font-bold'>
              troca do perfil {perfilAtual?.descricao} para o perfil {perfilSolicitado?.descricao}.
            </span>
          </Typography>

          <Typography variant='body1'>
            Ao cancelar essa solicitação o{' '}
            <span className='font-bold'>seu perfil de investimento permanecerá como seu perfil atual.</span>
          </Typography>

          <Box className='flex items-center border rounded-xl p-4 mt-2 gap-4 border-[#cccccc]'>
            <div className='w-[52px] h-[52px] flex justify-center align-middle items-center bg-primary-main/10 rounded-full'>
              <i className='fa-kit fa-solid-chart-mixed-user text-primary-main text-xl' />
            </div>
            <div>
              <Typography variant='body1' className='mb-1'>
                Perfil após o cancelamento:
              </Typography>
              <Typography variant='body1' className='font-bold text-primary-main'>
                {perfilAtual?.descricao}
              </Typography>
            </div>
          </Box>

          <Typography variant='body1' className='text-center sm:text-left'>
            Criar novas solicitações ainda será possível enquanto a campanha de alteração estiver aberta, ou em
            campanhas posteriores.
          </Typography>
        </div>
      }
      actions={
        <div className='w-full'>
          <div className='max-w-[330px] flex flex-col text-center gap-4 m-auto'>
            <ButtonCustomized
              onClick={() => {
                handleCancelarSolicitacaoAlteracaoPerfil()
                handleClose()
              }}
              variant='contained'
              color='error'
              startIcon={<i className='fa-regular fa-trash' />}
            >
              Prosseguir com cancelamento
            </ButtonCustomized>
            <ButtonCustomized
              onClick={handleClose}
              variant='outlined'
              color='primary'
              sx={{
                marginInlineStart: '0 !important'
              }}
            >
              Manter solicitação
            </ButtonCustomized>
          </div>
        </div>
      }
    />
  )
}
