'use client'

import { useState, useEffect } from 'react'

import { Typography, Box, Grid } from '@mui/material'

import ResultadoSimulacao from './ResultadoSimulacao'
import SidebarSimulacao from './SidebarSimulacao'
import type { CardSimularBeneficiosPropsType } from '@/types/simulacao-beneficio/CardSimularBeneficiosPropsTypes'
import useGetParametrosSimulacao from '@/hooks/simulacao-beneficio/simulacaoBeneficio'
import type { ParametrosSimulacaoType } from '@/types/simulacao-beneficio/ParametrosSimulacaoType'
import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { useSalarioUsuario } from '@/hooks/participante/useSalarioUsuario'
import { IdadeAposentadoriaEnum } from '@/enum/participante/IdadeAposentadoriaEnum'
import { useSimuladorDefault } from '@/contexts/SimuladorDefaultContext'
import useGetPlanos from '@/hooks/participante/useGetPlanos'
import { useGetVariacaoPatrimonioRetornoInvestimento } from '@/hooks/patrimonio/useGetVariacaoPatrimonioRetornoInvestimento'
import useGetUrp from '@/hooks/urp/getUrp'
import useGetParticipante from '@/hooks/participante/useGetParticipante'
import { PlanoSituacaoEnum } from '@/enum/simulador/PlanoSituacao'
import { constants } from '@/utils/constants'
import { useGetUltimoHistoricoSalario } from '@/hooks/simulacao-beneficio/useGetUltimoHistoricoSalario'

export default function CardSimularBeneficios({}: CardSimularBeneficiosPropsType) {
  const { user } = useAuth()
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const { simulacao, isLoading, simularBeneficio } = useGetParametrosSimulacao()
  const { salariosSomados, getSalarioUsuario } = useSalarioUsuario()
  const { ultimoHistoricoSalario, getUltimoHistoricoSalario } = useGetUltimoHistoricoSalario()
  const { listPlanos, getPlanos } = useGetPlanos()
  const { urp, getUrp } = useGetUrp()
  const { participante, getParticipante } = useGetParticipante()

  const { variacaoPatrimonioRetornoInvestimento, getVariacaoPatrimonioRetornoInvestimento } =
    useGetVariacaoPatrimonioRetornoInvestimento()

  const { setSimuladorDefault } = useSimuladorDefault()

  useEffect(() => {
    if (user?.cpf) {
      getUrp(user.cpf)
      getParticipante(user.cpf)
      getSalarioUsuario(user.cpf)
      getUltimoHistoricoSalario(user.cpf)
      getPlanos(user.cpf, true)
      getVariacaoPatrimonioRetornoInvestimento(user.cpf)
    }
  }, [
    user?.cpf,
    getSalarioUsuario,
    getPlanos,
    getVariacaoPatrimonioRetornoInvestimento,
    getUrp,
    getParticipante,
    getUltimoHistoricoSalario
  ])

  const isAutopatrocinado = listPlanos.some(
    plano => plano.situacao === PlanoSituacaoEnum.AUTOPATROCINADO && plano.dtFim === null
  )

  const PLANO_SITUACAO = isAutopatrocinado
    ? listPlanos.find(plano => plano.dtFim !== null)?.situacao || ''
    : listPlanos.find(plano => plano.dtFim === null)?.situacao || ''

  const isSalarioMenorTeto = salariosSomados && salariosSomados < constants.TETO_RGPS
  const isVinculado = isSalarioMenorTeto || PLANO_SITUACAO === PlanoSituacaoEnum.VINCULADO
  const isBPD = PLANO_SITUACAO === PlanoSituacaoEnum.BPD_SALDO || PLANO_SITUACAO === PlanoSituacaoEnum.BPD_DEPOSITO

  // Default parameters for initial simulation
  const DEFAULT_PARAMETROS: ParametrosSimulacaoType = {
    cpf: user?.cpf || '',
    idadeAposentadoria:
      participante?.sexo.toUpperCase() === 'MASCULINO'
        ? IdadeAposentadoriaEnum.MASCULINO
        : IdadeAposentadoriaEnum.FEMININO,
    remuneracao: isAutopatrocinado ? (ultimoHistoricoSalario ?? 0) : (salariosSomados ?? 0),
    rentabilidade: variacaoPatrimonioRetornoInvestimento?.aaRi_PB
      ? Number(variacaoPatrimonioRetornoInvestimento.aaRi_PB.replace(',', '.'))
      : 4.5,
    contribuicaoNormal: listPlanos[0]?.percentualContribuicao ?? 8.5,
    contribuicaoFacultativa: simulacao?.dadosSimulacao.percentualContribuicaoFacultativa ?? 0.0,
    aporteExtra: 0,
    saqueReserva: 0,
    prazoBeneficio: 480,
    baseContribuicao:
      isVinculado && !isAutopatrocinado
        ? (urp?.tetoUrp ?? undefined)
        : isAutopatrocinado
          ? (ultimoHistoricoSalario ?? undefined)
          : undefined
  }

  // Function to handle starting simulation
  const handleIniciarSimulacao = async () => {
    await simularBeneficio({
      ...DEFAULT_PARAMETROS,
      contribuicaoFacultativa: undefined
    })
      .then(res => {
        setSimuladorDefault(res)
        setMostrarResultado(true)
      })
      .catch(() => {
        setMostrarResultado(false)
      })
  }

  // Função centralizada para abrir/fechar o sidebar
  const handleToggleSidebar = (open: boolean) => {
    setSidebarOpen(open)
  }

  if (mostrarResultado && urp) {
    return (
      <Grid container spacing={6} wrap='wrap'>
        <Grid item xs={12} lg={4}>
          <div className='flex flex-col sticky top-20 gap-6'>
            <SidebarSimulacao
              open={sidebarOpen}
              onClose={() => handleToggleSidebar(false)}
              simulacao={simulacao ?? undefined}
              simularBeneficio={simularBeneficio}
              isLoading={isLoading}
              simulacaoDefaultValues={DEFAULT_PARAMETROS}
              isVinculado={isVinculado}
              isBPD={isBPD}
              isAutopatrocinado={isAutopatrocinado}
            />
          </div>
        </Grid>
        <Grid item xs={12} lg={8}>
          <div className='flex flex-col sticky top-20 gap-6'>
            <ResultadoSimulacao
              onVoltar={() => setMostrarResultado(false)}
              simulacao={simulacao}
              isVinculado={isVinculado}
              isBPD={isBPD}
              isAutopatrocinado={isAutopatrocinado}
            />
          </div>
        </Grid>
      </Grid>
    )
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title='Bem-vindo(a) ao simulador de benefícios'
        subheader='Nosso simulador tem o intuito de gerar projeções do seu patrimônio e benefícios a serem recebidos na aposentadoria, com base na sua contribuição atual. Ele permite simular mudanças a longo prazo, como a alteração da idade de aposentadoria, percentuais de contribuição ou aportes.'
      />
      <CardCustomized.Content>
        <Box>
          <Typography variant='body1'>Gostaria de começar sua simulação agora?</Typography>
          <ButtonCustomized
            variant='contained'
            color='primary'
            onClick={handleIniciarSimulacao}
            sx={{ mt: '1rem', width: '280px' }}
          >
            Simular meus benefícios
          </ButtonCustomized>
        </Box>
        <Box sx={{ mt: '1.5rem' }}>
          <Typography variant='body1'>
            Quer saber como funciona o cálculo? Veja a metodologia no quadro abaixo:
          </Typography>

          <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 gap-4'>
            <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
            <div>
              <Typography variant='h5' className='text-primary-main font-bold mb-1'>
                Metodologia de cálculo do simulador de benefícios:
              </Typography>
              <Typography component={'ol'} variant='body1'>
                <li style={{ counterIncrement: 'item', marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
                  <div>
                    <span className='font-bold'>I. Saldo Atualizado</span> é calculado{' '}
                    <span className='font-bold'>
                      considerando as informações atualizadas pela última cota disponível.
                    </span>
                  </div>
                </li>
                <li style={{ counterIncrement: 'item', marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
                  <div>
                    <span className='font-bold'>II. Saldo Projetado</span> é calculado{' '}
                    <span className='font-bold'>
                      considerando a expectativa de rentabilidade real até a data de aposentadoria
                    </span>{' '}
                    definida no simulador.
                  </div>
                </li>
                <li style={{ counterIncrement: 'item', marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
                  <div>
                    <span className='font-bold'>III. Total Rentabilizado</span> considera as{' '}
                    <span className='font-bold'>
                      novas contribuições, atualizadas conforme a expectativa de rentabilidade real escolhida, de acordo
                      com a opção no momento da simulação e o Plano de Custeio vigente,
                    </span>{' '}
                    com os devidos descontos da Taxa de Carregamento e os valores que são alocados no Fundo de Cobertura
                    de Benefícios Extraordinários (FCBE).
                  </div>
                </li>
                <li style={{ counterIncrement: 'item', marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
                  <div>
                    <span className='font-bold'>IV. A taxa padrão</span> que constará no simulador de benefícios{' '}
                    <span className='font-bold'>será a benchmark vigente para o Plano de Benefícios JusMP-Prev.</span>
                  </div>
                </li>
                <li style={{ counterIncrement: 'item', marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
                  <div>
                    <span className='font-bold'>V. O Benefício Suplementar</span> é calculado{' '}
                    <span className='font-bold'>
                      considerando o saldo da Reserva Acumulada Suplementar (RAS) na data de aposentadoria, de acordo
                      com o saldo remanescente, caso
                    </span>{' '}
                    realizado o saque de até 25%, pelo prazo de pagamento definido e expectativa de rentabilidade do
                    benchmark vigente.{' '}
                    <span className='font-bold'>
                      Os valores apresentados são brutos e no momento da concessão incidirão a contribuição
                      administrativa e imposto de renda,
                    </span>{' '}
                    nos termos do art. 26 do Regulamento do Plano de Benefícios JusMP-Prev.
                  </div>
                </li>
                <li style={{ counterIncrement: 'item', marginBottom: 8, display: 'flex', alignItems: 'flex-start' }}>
                  <div>
                    <span className='font-bold'>
                      VI. O Benefício de Aposentadoria Normal é calculado considerando o saldo da Reserva Acumulada
                      Normal (RAN), parte pessoal e patronal.
                    </span>{' '}
                    O prazo de pagamento leva em conta a expectativa de sobrevida ao momento da aposentadoria, de acordo
                    com a tábua de mortalidade vigente na época da concessão, e expectativa de rentabilidade do
                    benchmark vigente.{' '}
                    <span className='font-bold'>
                      Os valores apresentados são brutos e no momento da concessão incidirão a contribuição
                      administrativa e imposto de renda,
                    </span>{' '}
                    nos termos do art. 21 do Regulamento do Plano de Benefícios JusMP-Prev.
                  </div>
                </li>
              </Typography>
            </div>
          </Box>
        </Box>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
