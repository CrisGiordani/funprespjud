import Image from 'next/image'

import { Card, CardContent, Typography } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export default function CardCampanhaFechada({
  handleHistoricoSolicitacoes,
  handleInformacoes
}: {
  handleHistoricoSolicitacoes: () => void
  handleInformacoes: () => void
}) {
  return (
    <Card>
      <CardContent>
        <div className='flex flex-col gap-2 p-4'>
          <div className='flex flex-col items-center justify-center mb-2'>
            <Image src='/images/iris/campanha-fechada.svg' alt='Campanha Fechada' width={110} height={84} />
            <Typography variant='h3' sx={{ marginTop: '2rem' }}>
              A campanha de alteração de perfil está fechada
            </Typography>
          </div>

          <Typography variant='body1'>
            No momento não é possível solicitar alteração de perfil de investimento pois estamos fora do período de
            campanha.
          </Typography>
          <Typography variant='body1'>
            Durante o intervalo entre campanhas o seu perfil de investimento permanece conforme a última solicitação
            registrada ou de acordo com o perfil indicado caso nenhuma escolha tenha sido feita.
          </Typography>
          <Typography variant='body1'>
            Caso tenha dúvidas ou precise de ajuda considere visitar a aba de informações.
          </Typography>

          <div className='w-full flex justify-center mt-4'>
            <div className='w-full max-w-[650px] flex flex-wrap justify-end gap-4'>
              <ButtonCustomized
                variant='contained'
                color='primary'
                onClick={handleHistoricoSolicitacoes}
                sx={{
                  maxWidth: '310px'
                }}
              >
                Ver histórico de solicitações
              </ButtonCustomized>
              <ButtonCustomized
                variant='outlined'
                color='primary'
                onClick={handleInformacoes}
                sx={{
                  maxWidth: '310px'
                }}
              >
                Visitar aba informações
              </ButtonCustomized>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
