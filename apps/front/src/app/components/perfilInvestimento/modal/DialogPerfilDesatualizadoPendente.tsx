import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'

export default function DialogPerfilDesatualizadoPendente({
  open,
  handlePreencherAPP,
  handleClose
}: {
  open: boolean
  handlePreencherAPP: () => void
  handleClose: () => void
}) {
  return (
    <Dialog open={open}>
      <div className='flex flex-row justify-center items-center mt-6'>
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

      <DialogTitle className='text-center text-gray-600 text-2xl'>
        Análise de Perfil de Participante pendente
      </DialogTitle>

      <DialogContent className='py-0 px-10   mb-3'>
        <Typography variant='body1' className='text-gray-700 text-left mb-3'>
          Prezado(a) Participante,
        </Typography>

        <Typography variant='body1' className='text-gray-700 text-left mb-3'>
          Para solicitar a mudança do seu perfil de investimento, é
          <span className='font-semibold'>
            {' '}
            obrigatório ter preenchido a Análise de Perfil do Participante (APP) nos últimos 6 meses.
          </span>
        </Typography>

        <Typography variant='body1' className='text-gray-700 text-left mb-3'>
          Como deseja prosseguir?
        </Typography>

        <div className='flex flex-col justify-center items-center my-4 gap-4'>
          <Button
            className='w-2/3 py-3'
            variant='contained'
            color='primary'
            onClick={() => {
              handlePreencherAPP()
              handleClose()
            }}
          >
            Preencher APP
          </Button>
          <Button className='w-2/3 py-3' variant='outlined' color='error' onClick={() => handleClose()}>
            Não desejo responder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
