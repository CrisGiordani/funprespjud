import { useState } from 'react'

import {
  Box,
  Button,
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
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'

import DialogCancelarSolicitacao from '../modal/DialogCancelarSolicitacao'
import { TooltipInfo } from '../../common/TooltipInfo'

ChartJS.register(ArcElement, Tooltip)

export default function BoxPerfilInvestimento({
  cpf,
  perfil,
  isPerfilAtual,
  isPerfilIndicado,
  isPerfilSolicitado,
  handleClick,
  setPerfilSelecionado,
  handleCancelarSolicitacaoAlteracaoPerfil
}: {
  cpf: string
  perfil: any
  isPerfilAtual: boolean
  isPerfilIndicado: boolean
  isPerfilSolicitado: boolean
  handleClick: () => void
  setPerfilSelecionado: (value: any) => void
  handleCancelarSolicitacaoAlteracaoPerfil: () => void
}) {
  const [swapAlocacao] = useState(false)

  const [
    openDialogCancelarSolicitacaoAlteracaoPerfilInvestimento,
    setOpenDialogCancelarSolicitacaoAlteracaoPerfilInvestimento
  ] = useState(false)

  const allocations = [
    { name: 'Renda fixa', percentage: perfil.dataPorcentagem[0], color: 'rgb(5, 120, 190)' },
    { name: 'Renda variável', percentage: perfil.dataPorcentagem[1], color: 'rgb(247, 168, 51)' },
    { name: 'Investimentos estruturados', percentage: perfil.dataPorcentagem[2], color: 'rgb(42, 132, 109)' },
    { name: 'Investimentos no exterior', percentage: perfil.dataPorcentagem[3], color: 'rgb(253, 136, 169)' },
    { name: 'Imobiliário', percentage: perfil.dataPorcentagem[4], color: 'rgb(137, 101, 179)' },
    { name: 'Empréstimo aos Participantes', percentage: perfil.dataPorcentagem[5], color: 'rgb(243, 146, 0)' }
  ]

  const data = {
    labels: [
      'Renda fixa',
      'Renda variável',
      'Investimentos estruturados',
      'Investimentos no exterior',
      'Imobiliário',
      'Empréstimo aos Participantes'
    ],
    datasets: [
      {
        label: 'Alocação de ativos',
        data: swapAlocacao ? perfil.alocacaoObjetiva : perfil.dataPorcentagem,
        backgroundColor: [
          'rgb(5, 120, 190)',
          'rgb(247, 168, 51)',
          'rgb(42, 132, 109)',
          'rgb(253, 136, 169)',
          'rgb(137, 101, 179)',
          'rgb(243, 146, 0)',
          'rgb(231, 101, 14)'
        ],
        borderWidth: 0,
        hoverBorderWidth: 1
      }
    ]
  }

  const options = {
    aspectRatio: 1.5,
    cutout: '50%', //! Define o tamanho do corte do gráfico
    plugins: {
      legend: {
        display: false //! Esconde a legenda do gráfico
      },

      // tooltip: {
      //     enabled: false // Esconde o tooltip ao passar o mouse
      // },
      datalabels: {
        display: false //! (Se estiver usando o plugin datalabels)
      }
    }
  }

  return (
    <>
      <Card
        className='w-auto shadow-sm relative overflow-visible bg-gray-100'
        sx={{
          '& .MuiCardContent-root': {
            background: isPerfilIndicado ? 'linear-gradient(180deg, #0A1624 0%, #0F2137 100%)' : 'white',
            borderRadius: '10px',
            padding: '0 '
          }
        }}
      >
        <CardContent className='pt-0 h-full' sx={{ transform: isPerfilIndicado ? 'scale(1.02)' : 'scale(1)' }}>
          {isPerfilIndicado && (
            <Box className='flex justify-end '>
              <div className='relative w-64 h-12 bg-transparent rounded-tr-lg overflow-hidden'>
                <div
                  className='absolute inset-y-0 left-0 top-0 right-0  bg-[#f59e0b]
                                rounded-tr-lg flex items-center justify-center text-gray-800 font-semibold text-lg'
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)'
                  }}
                >
                  Indicado
                </div>
              </div>
            </Box>
          )}
          {/* Header */}
          {!isPerfilIndicado && <Box className='h-4'></Box>}
          <Box className='mb-4 px-6 mt-2'>
            <div className='flex justify-between h-8 max-h-8 mt-4'>
              <div className='rounded-full bg-primary-main/10 w-12 h-12 flex items-center justify-center'>
                <i
                  className={`${perfil.icon} text-primary-main text-xl align-middle ${isPerfilIndicado ? 'text-yellow-500' : 'text-primary-main'}`}
                ></i>
              </div>
              {(isPerfilAtual || isPerfilSolicitado) && (
                <Chip
                  label={`${isPerfilAtual ? 'Perfil atual' : 'Perfil solicitado'}`}
                  color={isPerfilAtual ? 'primary' : 'warning'}
                  variant={isPerfilAtual ? 'filled' : 'tonal'}
                  className='text-base'
                />
              )}
            </div>

            <Typography
              variant='h4'
              component='h2'
              className={`font-semibold mt-4 mb-2 text-left ${isPerfilIndicado ? 'text-white' : '--var(--mui-palette-text-primary)'}`}
            >
              {perfil.nomePerfil}
            </Typography>

            <Box className='flex flex-col gap-1'>
              <Typography variant='body1' className={` text-left ${isPerfilIndicado ? 'text-white' : 'text-gray-600'}`}>
                <span className='font-medium'>Benchmark:</span>
                <span className={`font-semibold ${isPerfilIndicado ? 'text-yellow-500' : 'text-primary-main'}`}>
                  {' '}
                  {perfil.benchmark}
                </span>
              </Typography>
              <Typography
                variant='body1'
                className={`text-gray-600 text-left ${isPerfilIndicado ? 'text-white' : 'text-gray-600'}`}
              >
                <span className='font-medium'>Limite de risco (volatilidade) </span>
                <span className={`font-semibold ${isPerfilIndicado ? 'text-yellow-500' : 'text-primary-main'}`}>
                  {perfil.limiteRisco}{' '}
                  <TooltipInfo
                    descriptionTooltip='Volatilidade é a variação dos preços de um ativo (títulos de Renda Fixa, ações, fundos de investimentos). Ela é medida pela variação dos retornos desses ativos, ou das carteiras de ativos, ao longo do tempo. O limite máximo para cada perfil de investimento consta da Política de Investimentos.'
                    className='text-xl ml-1'
                  />
                </span>
              </Typography>

              <Typography
                variant='body1'
                className={`text-gray-600 block  text-left sm:whitespace-pre-wrap ${isPerfilIndicado ? 'text-white' : 'text-gray-600'}`}
              >
                Indicado para aposentadorias:{' '}
                <span className={`font-semibold ${isPerfilIndicado ? 'text-yellow-500' : 'text-gray-600'}`}>
                  {' '}
                  {perfil.dataAposentadoria}
                </span>
              </Typography>
            </Box>

            <Divider
              className='my-4 '
              sx={{
                borderColor: !isPerfilAtual && isPerfilIndicado ? 'white' : 'gray'
              }}
            />
          </Box>

          {/* Asset Allocation Section */}
          <Box className=' px-6 '>
            <Typography
              variant='h5'
              component='h3'
              className={`text-gray-800 text-left mb-2 align-middle ${isPerfilIndicado ? 'text-white' : 'text-gray-600'}`}
            >
              Alocação objetiva{' '}
              <TooltipInfo
                descriptionTooltip='É o planejamento de como os investimentos de um perfil devem ser distribuídos entre diferentes tipos de aplicações e segmentos, como Renda Fixa, Renda Variável, entre outros. Essa divisão é feita pensando no tempo que falta até a aposentadoria e no nível de risco que o perfil pode assumir, conforme definido na Política de Investimentos.'
                className='text-xl ml-1'
              />
            </Typography>

            {/* Donut Chart */}
            <Box className='flex justify-center mb-6 mt-4'>
              <Box className='relative'>
                <Doughnut data={data} options={options} />
              </Box>
            </Box>
            {/* Legend */}
            <List dense className='p-0'>
              {allocations.map((allocation, index) => (
                <ListItem key={index} className='px-0 py-1'>
                  <ListItemIcon className='min-w-0 mr-2'>
                    <Box className='w-3 h-3 rounded-full' sx={{ backgroundColor: allocation.color }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box className='flex justify-between items-center'>
                        <Typography
                          variant='body1'
                          className={`text-gray-700 ${isPerfilIndicado ? 'text-white' : 'text-gray-600'}`}
                        >
                          {allocation.name}
                        </Typography>
                        <Typography
                          variant='body1'
                          className={`font-medium text-gray-800 ${isPerfilIndicado ? 'text-white' : 'text-gray-600'}`}
                          key={swapAlocacao ? 'objetiva' : 'efetiva'}
                        >
                          {!swapAlocacao ? (
                            <span className='animate-fade-in '>{allocation.percentage.toFixed(1)}%</span>
                          ) : (
                            <span className='animate-fade-in '>{perfil.alocacaoObjetiva[index].toFixed(1)}%</span>
                          )}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider
              className='mt-4  '
              sx={{
                borderColor: isPerfilIndicado ? 'white' : 'gray'
              }}
            />
          </Box>

          {/* Footer */}
          <Box className='text-center px-6 my-4'>
            {isPerfilAtual && (
              <Typography
                variant='body1'
                className={`font-medium text-lg text-gray-800 align-middle text-center items-center self-center
                                 ${isPerfilIndicado ? 'text-white' : 'text-gray-600'}`}
              >
                Este é seu perfil atual!
              </Typography>
            )}
            {isPerfilIndicado && !isPerfilAtual && !isPerfilSolicitado && (
              <Button
                variant='contained'
                className='text-black py-3 px-6  hover:bg-yellow-600 hover:text-white bg-yellow-500 w-full md:w-75'
                startIcon={<i className='fa-regular fa-arrow-up-arrow-down' />}
                onClick={() => {
                  setPerfilSelecionado(perfil)
                  handleClick()
                }}
              >
                Mudar para este perfil
              </Button>
            )}
            {!isPerfilAtual && !isPerfilIndicado && !isPerfilSolicitado && (
              <Button
                variant='outlined'
                className='py-3 px-6 hover:bg-blue-100 w-full md:w-75'
                startIcon={<i className='fa-regular fa-arrow-up-arrow-down' />}
                onClick={() => {
                  setPerfilSelecionado(perfil)
                  handleClick()
                }}
              >
                Mudar para este perfil
              </Button>
            )}

            {isPerfilSolicitado && (
              <Button
                variant='outlined'
                color='error'
                className='py-3 px-6 w-full md:w-75'
                startIcon={<i className='fa-regular fa-trash' />}
                onClick={() => setOpenDialogCancelarSolicitacaoAlteracaoPerfilInvestimento(true)}
              >
                Cancelar solicitação
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {openDialogCancelarSolicitacaoAlteracaoPerfilInvestimento && (
        <DialogCancelarSolicitacao
          cpf={cpf}
          open={openDialogCancelarSolicitacaoAlteracaoPerfilInvestimento}
          handleCancelarSolicitacaoAlteracaoPerfil={handleCancelarSolicitacaoAlteracaoPerfil}
          handleClose={() => setOpenDialogCancelarSolicitacaoAlteracaoPerfilInvestimento(false)}
        />
      )}
    </>
  )
}
