// MUI Imports
import { CardCustomized } from '@/components/ui/CardCustomized'
import { BoxTipoCampanha } from './components/BoxTipoCampanha'

const CampanhasPage = () => {
  return (
    <CardCustomized.Root className='h-full p-0'>
      <CardCustomized.Header title='Campanhas' subheader='Selecione qual campanha deseja gerenciar' />
      <CardCustomized.Content className='h-full '>
        <div className='grid grid-cols-4 gap-4'>
          <BoxTipoCampanha
            title='Troca de perfil de investimento'
            icon='fa-regular fa-chart-mixed-up-circle-dollar'
            link='/admin/campanhas/perfil-de-investimento'
          />
        </div>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}

export default CampanhasPage
