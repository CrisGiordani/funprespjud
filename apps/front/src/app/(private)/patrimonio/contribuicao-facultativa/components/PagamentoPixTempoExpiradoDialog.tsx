import { Feedback } from '@/components/ui/Feedback'
import { ActionButton } from './ActionButton'
import { DialogCustomized } from '@/components/ui/DialogCustomized'

export function PagamentoPixTempoExpiradoDialog({
  open,
  onClose,
  onTentarNovamente
}: {
  open: boolean
  onClose: () => void
  onTentarNovamente: () => void
}) {
  return (
    <DialogCustomized
      id='pagamento-pix-tempo-expirado-dialog'
      open={open}
      onClose={onClose}
      title={
        <Feedback
          title='O tempo para finalizar essa transação expirou'
          description='Você não finalizou o pagamento do pix dentro do tempo disponível. Como deseja prosseguir?'
          variant='error'
        />
      }
      content={
        <div className='w-full flex justify-center items-center gap-2'>
          <ActionButton
            variant='contained'
            color='primary'
            onClick={onTentarNovamente}
            sx={{ maxWidth: '250px', width: '100%', padding: '0.5rem 2rem' }}
          >
            Tentar novamente
          </ActionButton>

          <ActionButton
            variant='outlined'
            color='error'
            onClick={onClose}
            sx={{ maxWidth: '250px', width: '100%', padding: '0.5rem 2rem' }}
          >
            Cancelar contribuição
          </ActionButton>
        </div>
      }
    />
  )
}
