import { useEffect, useState, useMemo } from 'react'

import { Box, Divider, Typography } from '@mui/material'

import BoxPerfilInvestimentoDetalhado from './BoxPerfilInvestimentoDetalhado'
import type { BoxPerfilInvestimentoDetalhadoType } from '@/types/perfilInvestimento/BoxPerfilInvestimentoDetalhadoType'
import AccordionGraficoComparacaoEvolucaoPatrimonial from './AccordionGraficoComparacaoEvolucaoPatrimonial'
import DialogAtencao from '../modal/DialogAtencao'
import DialogDeclaracaoAlteracaoPerfil from '../modal/DialogDeclaracaoAlteracaoPerfil'
import DialogToken from '../modal/DialogToken'

import { usePostSolicitarAlteracaoPerfil } from '@/hooks/perfilInvestimento/usePostSolicitarAlteracaoPerfil'
import { useGetSimulacaoSimplificadaPerfilDeInvestimento } from '@/hooks/perfilInvestimento/useGetSimulacaoSimplificadaPerfilDeInvestimento'
import { useAuth } from '@/contexts/AuthContext'
import { useGetCampanhaAtiva } from '@/hooks/perfilInvestimento/useGetCampanhaAtiva'
import { getPerfilBasicDataById } from '@/utils/perfilInvestimentoUtils'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { capitalize } from '@/utils/string'

export default function CardDetalhesAlteracaoPerfil({
  handleClick,
  detalhamentoPerfilAtual,
  detalhamentoPerfilIndicado,
  perfilSelecionado,
  handleHistoricoSolicitacoes
}: {
  handleClick: () => void
  detalhamentoPerfilAtual: any
  detalhamentoPerfilIndicado: any
  perfilSelecionado: any
  handleHistoricoSolicitacoes: () => void
}) {
  const [isOpenDialogAtencao, setIsOpenDialogAtencao] = useState(false)
  const [isOpenDialogDeclaracaoAlteracaoPerfil, setIsOpenDialogDeclaracaoAlteracaoPerfil] = useState(false)
  const [isOpenDialogToken, setIsOpenDialogToken] = useState(false)
  const { campanhaAtiva, getCampanhaAtiva } = useGetCampanhaAtiva()
  const { user } = useAuth()
  const [perfilData, setPerfilData] = useState<any>(null)

  const { postSolicitarAlteracaoPerfil } = usePostSolicitarAlteracaoPerfil()

  const {
    dadosSimulacao: dadosSimulacaoPerfilAtual,
    getSimulacaoSimplificadaPerfilDeInvestimento: getSimulacaoSimplificadaPerfilDeInvestimentoPerfilAtual
  } = useGetSimulacaoSimplificadaPerfilDeInvestimento()

  const {
    dadosSimulacao: dadosSimulacaoPerfilSelecionado,
    getSimulacaoSimplificadaPerfilDeInvestimento: getSimulacaoSimplificadaPerfilDeInvestimentoPerfilSelecionado
  } = useGetSimulacaoSimplificadaPerfilDeInvestimento()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (detalhamentoPerfilAtual && user?.cpf) {
      getSimulacaoSimplificadaPerfilDeInvestimentoPerfilAtual(user.cpf, detalhamentoPerfilAtual.idPerfil)
    }

    if (perfilSelecionado && user?.cpf) {
      getSimulacaoSimplificadaPerfilDeInvestimentoPerfilSelecionado(user.cpf, perfilSelecionado.idPerfil)
    }

    if (user?.cpf) {
      getCampanhaAtiva()
    }
  }, [
    detalhamentoPerfilAtual,
    detalhamentoPerfilIndicado,
    perfilSelecionado,
    user?.cpf,
    getSimulacaoSimplificadaPerfilDeInvestimentoPerfilAtual,
    getSimulacaoSimplificadaPerfilDeInvestimentoPerfilSelecionado,
    getCampanhaAtiva
  ])

  // useEffect separado para atualizar perfilData
  useEffect(() => {
    if (detalhamentoPerfilAtual?.idPerfil) {
      const data = getPerfilBasicDataById(detalhamentoPerfilAtual.idPerfil)

      setPerfilData(data)
    }
  }, [detalhamentoPerfilAtual?.idPerfil])

  const boxPerfilInvestimentoDetalhadoAtual: BoxPerfilInvestimentoDetalhadoType = useMemo(
    () => ({
      nomePerfil: detalhamentoPerfilAtual?.descricao || '',
      benchmark: perfilData?.benchmark || '',
      limiteRisco: perfilData?.limiteRisco || '',
      dataAposentadoria: perfilData?.dataAposentadoria || '',
      isPerfilAtual: true,
      isPerfilSolicitado: false,
      saldoNormalTotal: dadosSimulacaoPerfilAtual?.data?.saldosEBeneficios?.saldo_normal_total || 0,
      beneficioNormalMensal: dadosSimulacaoPerfilAtual?.data?.saldosEBeneficios?.beneficio_normal_mensal || 0,
      saldoSuplementarTotal: dadosSimulacaoPerfilAtual?.data?.saldosEBeneficios?.saldo_suplementar_total || 0,
      beneficioSuplementarMensal: dadosSimulacaoPerfilAtual?.data?.saldosEBeneficios?.beneficio_suplementar_mensal || 0,
      saldoMensalTotal: dadosSimulacaoPerfilAtual?.data?.saldosEBeneficios?.saldo_total || 0,
      beneficioMensalTotal: dadosSimulacaoPerfilAtual?.data?.saldosEBeneficios?.beneficio_mensal_total || 0
    }),
    [dadosSimulacaoPerfilAtual, perfilData, detalhamentoPerfilAtual]
  )

  const boxPerfilInvestimentoDetalhadoSolicitado: BoxPerfilInvestimentoDetalhadoType = useMemo(
    () => ({
      nomePerfil: perfilSelecionado?.nomePerfil || '',
      benchmark: perfilSelecionado?.benchmark || '',
      limiteRisco: perfilSelecionado?.limiteRisco || '',
      dataAposentadoria: perfilSelecionado?.dataAposentadoria || '',
      isPerfilAtual: false,
      isPerfilSolicitado: true,
      saldoNormalTotal: dadosSimulacaoPerfilSelecionado?.data?.saldosEBeneficios?.saldo_normal_total || 0,
      beneficioNormalMensal: dadosSimulacaoPerfilSelecionado?.data?.saldosEBeneficios?.beneficio_normal_mensal || 0,
      saldoSuplementarTotal: dadosSimulacaoPerfilSelecionado?.data?.saldosEBeneficios?.saldo_suplementar_total || 0,
      beneficioSuplementarMensal:
        dadosSimulacaoPerfilSelecionado?.data?.saldosEBeneficios?.beneficio_suplementar_mensal || 0,
      saldoMensalTotal: dadosSimulacaoPerfilSelecionado?.data?.saldosEBeneficios?.saldo_total || 0,
      beneficioMensalTotal: dadosSimulacaoPerfilSelecionado?.data?.saldosEBeneficios?.beneficio_mensal_total || 0
    }),
    [perfilSelecionado, dadosSimulacaoPerfilSelecionado]
  )

  return (
    <>
      <CardCustomized.Root>
        <CardCustomized.Header title='Alterar perfil' />

        <CardCustomized.Content>
          <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 gap-4'>
            <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
            <div>
              <Typography variant='h5' className='text-primary-main font-bold mb-1'>
                Importante
              </Typography>
              <Typography variant='body1'>
                Alterações de perfis podem impactar a rentabilidade do investimento, o nível de risco assumido e a
                formação de patrimônio pelo participante. O tempo é uma das variáveis que mais impactam no valor que
                será recebido na aposentadoria, por isso, a alteração para um perfil com horizonte temporal maior ou
                menor do que o tempo que falta para a sua aposentadoria poderá impactar significativamente a formação do
                seu patrimônio.
              </Typography>
            </div>
          </Box>

          <Typography
            variant='h5'
            sx={{ width: '100%', textAlign: 'center', color: 'var(--mui-palette-text-secondary)', marginTop: '1rem' }}
          >
            Você está tentando realizar a alteração do perfil
            <span className='font-bold'> {capitalize(boxPerfilInvestimentoDetalhadoAtual.nomePerfil)}</span> para o
            perfil <span className='font-bold'>{capitalize(boxPerfilInvestimentoDetalhadoSolicitado.nomePerfil)}.</span>
          </Typography>

          <div className='grid grid-rows-1 grid-cols-1 md:grid-cols-11 md:grid-rows-1 gap-2 py-8 rounded-4xl mt-2'>
            <div className='col-span-5'>
              <BoxPerfilInvestimentoDetalhado boxPerfilInvestimentoDetalhado={boxPerfilInvestimentoDetalhadoAtual} />
            </div>
            <div className='col-span-1 flex justify-center items-center'>
              <i className='fa-regular fa-arrow-right hidden md:block text-primary-main text-5xl content-center text-center'></i>
              <i className='fa-regular fa-arrow-down block md:hidden mb-2 text-primary-main text-5xl content-center text-center'></i>
            </div>
            <div className='col-span-5'>
              <BoxPerfilInvestimentoDetalhado
                boxPerfilInvestimentoDetalhado={boxPerfilInvestimentoDetalhadoSolicitado}
              />
            </div>
          </div>

          <Typography variant='body1'>
            *Os saldos e benefícios acima são apenas projeções com base no benchmark e não devem ser tidos como valores
            concretos.
          </Typography>

          <Box className='flex flex-col sm:flex-row items-start gap-4 bg-error p-8 rounded-2xl mt-4'>
            <div className='flex-shrink-0 flex justify-center items-center'>
              <i className='fa-regular fa-triangle-exclamation text-white text-2xl'></i>
            </div>
            <div>
              <Typography variant='h5' className='text-white font-semibold text-left text-[20px] sm:mt-0'>
                Atenção:
              </Typography>
              <Typography variant='body1' className='text-white text-left text-[16px] mt-2'>
                Horizontes mais longos, apesar de projetar valores mais altos dado que os níveis de risco assumidos
                serão mais elevados, só são indicado para pessoas que terão maior prazo de investimentos e
                consequentemente mais tempo para lidar com variações de mercado.
              </Typography>
            </div>
          </Box>

          <Divider className='my-6 border-[1.5px]' />

          <AccordionGraficoComparacaoEvolucaoPatrimonial
            anos={dadosSimulacaoPerfilAtual?.data?.performance?.anos}
            nomePerfilAtual={detalhamentoPerfilAtual?.descricao || ''}
            nomePerfilSolicitado={perfilSelecionado?.nomePerfil || ''}
            performanceAtual={dadosSimulacaoPerfilAtual?.data?.performance?.performance_atual}
            performanceSimulada={dadosSimulacaoPerfilSelecionado?.data?.performance?.performance_simulada}
          />

          <Divider className='my-6 border-[1.5px]' />

          <Typography variant='body1' sx={{ textAlign: 'center' }}>
            O perfil selecionado é diferente do indicado pela fundação. Deseja prosseguir com a alteração do perfil
            <span className='font-bold'> {capitalize(detalhamentoPerfilAtual?.descricao)} </span> para o perfil
            <span className='font-bold'> {capitalize(perfilSelecionado?.nomePerfil)} </span>?
          </Typography>

          <div className='w-full mt-2'>
            <div className='max-w-[630px] flex flex-col sm:flex-row text-center gap-4 m-auto'>
              <ButtonCustomized variant='contained' color='primary' onClick={() => setIsOpenDialogAtencao(true)}>
                Sim, desejo prosseguir
              </ButtonCustomized>
              <ButtonCustomized variant='outlined' color='error' onClick={() => handleClick()}>
                Não, desejo manter meu perfil
              </ButtonCustomized>
            </div>
          </div>
        </CardCustomized.Content>
      </CardCustomized.Root>

      {isOpenDialogAtencao && (
        <DialogAtencao
          idPerfilAtual={Number(detalhamentoPerfilAtual?.idPerfil)}
          idPerfilSolicitado={Number(perfilSelecionado?.idPerfil)}
          isOpen={isOpenDialogAtencao}
          handleClose={() => {
            setIsOpenDialogAtencao(false)
          }}
          handleDeclaracaoAlteracaoPerfil={() => {
            setIsOpenDialogDeclaracaoAlteracaoPerfil(true)
          }}
        />
      )}
      {isOpenDialogDeclaracaoAlteracaoPerfil && (
        <DialogDeclaracaoAlteracaoPerfil
          isOpen={isOpenDialogDeclaracaoAlteracaoPerfil}
          handleClose={() => {
            setIsOpenDialogDeclaracaoAlteracaoPerfil(false)
          }}
          handleBack={() => {
            setIsOpenDialogAtencao(true)
          }}
          handleToken={() => {
            setIsOpenDialogToken(true)
          }}
          handlePostSolicitarAlteracaoPerfil={() => {
            postSolicitarAlteracaoPerfil(
              user?.cpf || '',
              campanhaAtiva?.idCampanha || '',
              perfilSelecionado.idPerfil,
              JSON.stringify(dadosSimulacaoPerfilSelecionado)
            )
          }}
        />
      )}
      {isOpenDialogToken && (
        <DialogToken
          cpf={user?.cpf || ''}
          isOpen={isOpenDialogToken}
          handleClose={() => {
            setIsOpenDialogToken(false)
            handleClick()
          }}
          handleHistoricoSolicitacoes={() => {
            handleHistoricoSolicitacoes()
            handleClick()
          }}
          email={user?.email || ''}
        />
      )}
    </>
  )
}
