import Image from 'next/image'

import { Typography } from '@mui/material'

import { FORMAS_PAGAMENTO_ENUM } from '../schemas/contribuicao-facultativa.schema'
import { ActionButton } from './ActionButton'

const textsMap = new Map<
  FORMAS_PAGAMENTO_ENUM,
  {
    title: string
    description: string
    image: string
  }
>([
  [
    FORMAS_PAGAMENTO_ENUM.pix,
    {
      title: 'Não foi possível gerar o pagamento PIX',
      description:
        'Ocorreu um problema e não conseguimos gerar o pagamento PIX, tente novamente ou entre em contato com o suporte para mais informações.',
      image: '/images/iris/error-pix.svg'
    }
  ],
  [
    FORMAS_PAGAMENTO_ENUM.boleto,
    {
      title: 'Não foi possível gerar o boleto',
      description:
        'Ocorreu um problema e o boleto não pode ser emitido, tente novamente mais tarde ou entre em contato com o suporte para mais informações.',
      image: '/images/iris/error-boleto.svg'
    }
  ]
])

export function ErroGerarPixBoleto({
  type,
  onTentarNovamente,
  onVoltar
}: {
  type: FORMAS_PAGAMENTO_ENUM
  onTentarNovamente: () => void
  onVoltar: () => void
}) {
  return (
    <div className='w-full max-w-[724px] flex flex-col items-center justify-evenly text-center p-4 gap-2'>
      <Image src={`${textsMap.get(type)?.image}`} alt={`Erro ao gerar ${type}`} width={120} height={98} />
      <div>
        <Typography variant='h5' sx={{ fontSize: '1.125rem' }}>
          {textsMap.get(type)?.title}
        </Typography>
        <Typography variant='body1'>{textsMap.get(type)?.description}</Typography>
      </div>
      <div className='w-full flex flex-wrap justify-center items-center mt-4 gap-4'>
        <ActionButton
          variant='contained'
          color='primary'
          onClick={onTentarNovamente}
          sx={{ maxWidth: '230px', width: '100%', padding: '0.5rem 2rem' }}
        >
          Tentar novamente
        </ActionButton>
        <ActionButton
          variant='outlined'
          color='primary'
          onClick={onVoltar}
          sx={{ maxWidth: '230px', width: '100%', padding: '0.5rem 2rem' }}
        >
          Voltar
        </ActionButton>
      </div>
    </div>
  )
}
