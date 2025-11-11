'use client'

import { Grid } from '@mui/material'

import { CardSaldoTotal } from '@/app/components/common/CardSaldoTotal'

// import { CardRentabilidadeAnual } from './componentes/CardRentabilidadeAnual'
import { CardSaldoEmNumeros } from './componentes/CardSaldoEmNumeros'
import { CardEvolucaoSaldo } from '@/app/components/common/CardEvolucaoSaldo'
import { CardProjecao } from './componentes/CardProjecao'

export default function Page() {
  return (
    <Grid container spacing={6} sx={{ width: '100%' }}>
      <Grid item xs={12} md={5}>
        <div className='flex flex-col sticky top-20 gap-6'>
          <CardSaldoTotal />
          {/* <CardPerfilInvestimento isShowPerfilIndicado={false} isShowBenchmark={true} /> */}
          <CardSaldoEmNumeros />
        </div>
      </Grid>
      <Grid item xs={12} md={7}>
        <div className='flex flex-col gap-6'>
          <CardEvolucaoSaldo />
          {/* <CardRentabilidadeAnual /> */}
          <CardProjecao />
        </div>
      </Grid>
    </Grid>
  )
}
