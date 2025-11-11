import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material'

export default function CardQuestionarioAnalisePerfil({
  className,
  handleEtapaQuestionario,
  handleCancelar
}: {
  className?: string
  handleEtapaQuestionario: (etapa: number) => void
  handleCancelar: (value: string) => void
}) {
  return (
    <div className={className}>
      <Card className='flex flex-col hover:shadow-xl transition-shadow duration-300 h-full py-10 px-7'>
        <div className='flex flex-row justify-center items-center '>
          <i
            className='fa-kit-duotone fa-duotone-regular-file-user-clock  text-8xl'
            style={
              {
                '--fa-primary-color': 'orange',
                '--fa-secondary-color': '#9bc9e5',
                '--fa-primary-opacity': '1',
                '--fa-secondary-opacity': '1'
              } as React.CSSProperties
            }
          ></i>
        </div>
        <CardHeader
          title='Questionário de análise de perfil'
          titleTypographyProps={{
            className: 'text-gray-700 text-[32px] text-center align-center '
          }}
        />
        <CardContent>
          <div className='flex flex-col gap-4 '>
            <Typography variant='body1' className='text-gray-800  text-left align-left text-[16px]'>
              <span className='font-semibold'>
                O questionário de análise de perfil é necessário para acessar algumas funcionalidades
              </span>
              de acordo com a exigência da
              <span className='text-primary-main underline'> Resolução CVM nº30. </span>
              Apesar de ser necessário para realizar algumas ações relacionadas ao perfil de investimento,
              <span className='font-semibold'>as respostas desse questionário não afetam recomendações de perfil.</span>
            </Typography>
            <Typography variant='body1' className='text-gray-800  text-left align-left text-[16px]'>
              Deseja começar a preencher o questionário?
            </Typography>
            <div className='items-center justify-center flex flex-col gap-4'>
              <Button variant='contained' color='primary' className='w-1/3' onClick={() => handleEtapaQuestionario(1)}>
                <Typography variant='body1' className='text-white font-semibold'>
                  Começar agora
                </Typography>
              </Button>
              <Button variant='outlined' color='primary' className='w-1/3' onClick={() => handleCancelar('0')}>
                <Typography variant='body1' className='text-primary-main'>
                  Cancelar
                </Typography>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
