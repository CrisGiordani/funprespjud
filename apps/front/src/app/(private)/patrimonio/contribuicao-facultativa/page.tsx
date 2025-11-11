import { Card, Divider, Typography } from '@mui/material'

import { FormValorContribuicao } from './components/FormValorContribuicao'
import { HistoricoContribuicoes } from './components/HistoricoContribuicoes'

export default function Page() {
  return (
    <Card className='overflow-visible p-4'>
      <div>
        <Typography variant='h4'>Nova contribuição facultativa</Typography>

        <div className='flex justify-center border border-gray-300 rounded-lg p-4 mt-4'>
          <FormValorContribuicao />
        </div>
      </div>

      <Divider className='my-4 flex items-center justify-center'>
        <i className={`fa-solid fa-down text-[#CCCCCC] text-5xl mx-4`}></i>
      </Divider>

      <div>
        <Typography variant='h4'>Histórico de contribuições</Typography>

        <div className='flex justify-center border border-gray-300 rounded-lg mt-4'>
          <HistoricoContribuicoes />
        </div>
      </div>
    </Card>
  )
}
