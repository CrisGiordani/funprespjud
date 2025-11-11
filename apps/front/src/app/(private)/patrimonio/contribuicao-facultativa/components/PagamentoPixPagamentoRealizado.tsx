import { Feedback } from '@/components/ui/Feedback'
import { ActionButton } from './ActionButton'

export function PagamentoPixPagamentoRealizado({ onNovaContribuicao }: { onNovaContribuicao: () => void }) {
  return (
    <div className='w-full max-w-[650px] flex flex-col items-center gap-4'>
      <Feedback
        title='Pagamento realizado com sucesso!'
        description='Computamos a sua contribuição e ela será adicionada ao seu saldo durante a próxima atualização de cotas.'
        variant='success'
      />

      <div className='flex flex-col justify-center items-center gap-4'>
        <ActionButton variant='contained' color='primary' onClick={onNovaContribuicao}>
          Nova contribuição
        </ActionButton>
      </div>
    </div>
  )
}
