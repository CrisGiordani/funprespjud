import { useEffect } from 'react'

import Image from 'next/image'

import { useRouter } from 'next/navigation'

import { Box, Typography } from '@mui/material'

import { useGetPerfilIndicado } from '@/hooks/perfilInvestimento/useGetPerfilIndicado'
import { useGetCampanhaAtiva } from '@/hooks/perfilInvestimento/useGetCampanhaAtiva'
import { formatarDataBR } from '@/app/utils/formatters'
import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import BoxCopy from '../../ui/BoxCopy'
import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import { useViewerMode } from '@/hooks/useViewerMode'

export default function DialogCampanhaAberta({
  open,
  onClose,
  cpf
}: {
  open: boolean
  onClose?: () => void
  cpf: string
}) {
  const router = useRouter()
  const { perfilIndicado, getPerfilIndicado } = useGetPerfilIndicado()
  const { campanhaAtiva, getCampanhaAtiva } = useGetCampanhaAtiva()

  const { isViewerMode } = useViewerMode()

  const handleClose = async () => {
    if (onClose) {
      if (!isViewerMode()) {
        await PerfilInvestimentoService.postCienteCampanhaAberta(cpf as string)
      }

      onClose()
    }
  }

  useEffect(() => {
    if (open) {
      getPerfilIndicado(cpf as string)
      getCampanhaAtiva()
    }
  }, [open, getPerfilIndicado, getCampanhaAtiva, cpf])

  return (
    <DialogCustomized
      id='campanha-aberta'
      open={open}
      onClose={handleClose || (() => {})}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image src='/images/iris/modal-campanha-aberta.svg' alt='Campanha aberta' width={110} height={84} />
          <Typography variant='h4' className='text-center'>
            Campanha aberta
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>Prezado(a) Participante,</Typography>

          <Typography variant='body1'>
            Informamos que o período de alteração de perfis de investimento já começou. Durante esse período, você
            poderá revisar as informações sobre os perfis disponíveis e, caso necessário, atualizar sua escolha.
          </Typography>

          <Box className='flex items-center border rounded-xl p-4 mt-2 gap-4 border-[#cccccc]'>
            <div className='w-[52px] h-[52px] flex justify-center align-middle items-center bg-primary-main/10 rounded-full'>
              <i className='fa-regular fa-calendar-clock text-primary-main text-xl mr-[-3px]'></i>
            </div>
            <div>
              <Typography variant='body1' className='mb-1'>
                Período da campanha
              </Typography>
              <Typography variant='body1' className='font-bold text-primary-main'>
                {formatarDataBR(campanhaAtiva?.dt_inicio)} a {formatarDataBR(campanhaAtiva?.dt_fim)}
              </Typography>
            </div>
          </Box>

          <Typography variant='body1'>
            Ao final da campanha, sua alocação será ajustada automaticamente para o perfil indicado.
          </Typography>

          <Box className='flex items-center border rounded-xl p-4 mt-2 gap-4 border-[#cccccc]'>
            <div className='w-[52px] h-[52px] flex justify-center align-middle items-center bg-primary-main/10 rounded-full'>
              <i className='fa-kit fa-solid-chart-mixed-user text-primary-main text-xl' />
            </div>
            <div>
              <Typography variant='body1' className='mb-1'>
                Perfil indicado com base no tempo estimado até aposentadoria
              </Typography>
              <Typography variant='body1' className='font-bold text-primary-main'>
                {perfilIndicado?.descricao}
              </Typography>
            </div>
          </Box>

          <Typography className='text-left mt-2 align-middle'>
            Para mais informações, acesse a aba de perfil de investimento ou entre em contato com o nosso suporte:
          </Typography>

          <div className='w-full flex flex-col gap-4 px-4'>
            <BoxCopy title='E-mail:' description='sap@funprespjud.com.br' icon='fa-regular fa-envelope' type='email' />
            <BoxCopy title='Telefone:' description='(61) 3029-5070' icon='fa-regular fa-phone' type='phone' />
            <BoxCopy title='WhatsApp:' description='(61) 4042-5515' icon='fa-brands fa-whatsapp' type='whatsapp' />
          </div>

          <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 gap-4'>
            <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
            <div>
              <Typography variant='h5' className='text-primary-main font-bold mb-1'>
                Importante
              </Typography>
              <Typography variant='body1'>
                Caso você não tenha intenção de alterar o seu perfil, nenhuma ação será necessária.
              </Typography>
            </div>
          </Box>

          <div className='w-full mt-2'>
            <div className='max-w-[310px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='contained'
                color='primary'
                onClick={() => router.push('/patrimonio/investimento')}
              >
                Ir para perfil de investimento
              </ButtonCustomized>
              <ButtonCustomized variant='outlined' color='primary' onClick={handleClose}>
                Fechar aviso
              </ButtonCustomized>
            </div>
          </div>
        </div>
      }
    />
  )
}
