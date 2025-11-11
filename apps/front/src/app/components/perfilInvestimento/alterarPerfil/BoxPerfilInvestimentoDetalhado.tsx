import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'

import type { BoxPerfilInvestimentoDetalhadoType } from '@/types/perfilInvestimento/BoxPerfilInvestimentoDetalhadoType'
import { capitalize } from '@/utils/string'

export default function BoxPerfilInvestimentoDetalhado({
  boxPerfilInvestimentoDetalhado
}: {
  boxPerfilInvestimentoDetalhado: BoxPerfilInvestimentoDetalhadoType
}) {
  const list = [
    {
      icon: 'fa-kit fa-regular fa-wallet',
      label: 'Saldo Normal Total',
      value: boxPerfilInvestimentoDetalhado.saldoNormalTotal
    },
    {
      icon: 'fa-regular fa-money-bill-wave',
      label: 'Benefício Normal Mensal',
      value: boxPerfilInvestimentoDetalhado.beneficioNormalMensal
    },
    {
      icon: 'fa-regular fa-money-check-dollar-pen',
      label: 'Saldo Suplementar Total',
      value: boxPerfilInvestimentoDetalhado.saldoSuplementarTotal
    },
    {
      icon: 'fa-regular fa-money-check-dollar',
      label: 'Benefício Suplementar Mensal',
      value: boxPerfilInvestimentoDetalhado.beneficioSuplementarMensal
    }
  ]

  const listMensalTotal = [
    {
      icon: 'fa-regular fa-sack-dollar',
      label: 'Saldo Total',
      value: boxPerfilInvestimentoDetalhado.saldoMensalTotal
    },
    {
      icon: 'fa-kit fa-regular fa-regular-money-bill-wave-circle-dollar',
      label: 'Benefício Mensal Total',
      value: boxPerfilInvestimentoDetalhado.beneficioMensalTotal
    }
  ]

  return (
    <>
      <Card
        className={`w-auto bg-transparent shadow-none border-solid border rounded-2xl relative overflow-visible
                ${boxPerfilInvestimentoDetalhado.isPerfilAtual ? '' : 'border-primary-main border-2'}`}
      >
        <Chip
          label={`Perfil ${boxPerfilInvestimentoDetalhado.isPerfilAtual ? 'atual' : 'solicitado'}`}
          color='primary'
          size='medium'
          className={`absolute left-1/2 -translate-x-1/2 -top-4 z-10  font-medium text-[16px] py-1 px-2 text-center align-middle
                        ${boxPerfilInvestimentoDetalhado.isPerfilAtual ? 'bg-[#F2F2F2] text-[#333333] ' : 'bg-primary-main text-white '}`}
        />
        <CardContent className='p-6'>
          {/* Header */}
          <Box className='mb-4'>
            <Typography variant='h4' sx={{ fontWeight: '700', marginBottom: '0.5rem' }}>
              {capitalize(boxPerfilInvestimentoDetalhado.nomePerfil)}
            </Typography>

            <Box className='space-y-1'>
              <Typography variant='body1'>
                <span>Benchmark: </span>
                <span className={`font-bold text-primary-main`}>{boxPerfilInvestimentoDetalhado.benchmark}</span>
              </Typography>
              <Typography variant='body1'>
                <span>Limite de Risco(Volatilidade): </span>
                <span className={`font-bold text-primary-main`}>{boxPerfilInvestimentoDetalhado.limiteRisco} </span>
              </Typography>
              <Typography variant='body1'>
                Indicado para aposentadorias:{' '}
                <span className={`font-bold text-primary-main`}>
                  {boxPerfilInvestimentoDetalhado.dataAposentadoria}
                </span>
              </Typography>
            </Box>
          </Box>

          <Divider className='my-4' />

          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {list.map((item, index) => (
              <ListItem key={index} sx={{ padding: 0 }}>
                <ListItemIcon>
                  <i
                    className={`${item.icon} text-primary-main text-2xl`}
                    style={
                      {
                        '--fa-secondary-color': '#e6f2f8',
                        '--fa-primary-opacity': '1',
                        '--fa-secondary-opacity': '1'
                      } as React.CSSProperties
                    }
                  />
                </ListItemIcon>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between w-full'>
                  <ListItemText primary={<Typography variant='body1'>{item.label}</Typography>} />
                  <span className='font-bold mt-1 sm:mt-0 text-lg text-black'>
  
                    {item.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </ListItem>
            ))}

            <Divider className='my-4' />

            {listMensalTotal.map((item, index) => (
              <ListItem key={index} sx={{ padding: 0 }}>
                <ListItemIcon>
                  <i
                    className={`${item.icon} text-primary-main text-2xl`}
                    style={
                      {
                        '--fa-secondary-color': '#e6f2f8',
                        '--fa-primary-opacity': '1',
                        '--fa-secondary-opacity': '1'
                      } as React.CSSProperties
                    }
                  />
                </ListItemIcon>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between w-full'>
                  <ListItemText primary={<Typography variant='body1'>{item.label}</Typography>} />
                  <span className='font-bold mt-1 sm:mt-0 text-lg text-black'>
                    {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
}
