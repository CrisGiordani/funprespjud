'use client'

// MUI Imports
import type { SyntheticEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { Skeleton } from '@mui/material'

import { useGetCampanhaAtiva } from '@/hooks/perfilInvestimento/useGetCampanhaAtiva'
import useGetAppStatus from '@/hooks/perfilInvestimento/useGetAppStatus'
import { useAuth } from '@/contexts/AuthContext'
import HistoricoRespostas from '@/app/components/perfilInvestimento/HistoricoRespostas'
import CardSolicitacaoAlteracaoPerfil from '@/app/components/perfilInvestimento/CardSolicitacaoAlteracaoPerfil'
import CardQuestionario from '@/app/components/perfilInvestimento/questionario/CardQuestionario'
import CardHistoricoRespostas from '@/app/components/perfilInvestimento/historicoRespostas/CardHistoricoRespostas'
import CardCampanhaFechada from '@/app/components/perfilInvestimento/alterarPerfil/CardCampanhaFechada'
import CardAlterarPerfil from '@/app/components/perfilInvestimento/alterarPerfil/CardAlterarPerfil'
import CardHistoricoSolicitacoes from '@/app/components/perfilInvestimento/historicoSolicitacoes/CardHistoricoSolicitacoes'
import CardInformacoes from '@/app/components/perfilInvestimento/CardInformacoes'
import DialogPerfilDesatualizadoPendente from '@/app/components/perfilInvestimento/modal/DialogPerfilDesatualizadoPendente'
import CardDetalhesAlteracaoPerfil from '@/app/components/perfilInvestimento/alterarPerfil/CardDetalhesAlteracaoPerfil'
import { CardPerfilInvestimento } from '@/app/components/common/CardPerfilInvestimento'
import { AnaliseApp } from './componentes/AnaliseApp'
import { StatusHistoricoAPPEnum } from '@/enum/perfilInvestimento/StatusHistoricoEnum'
import { CardCustomized } from '@/components/ui/CardCustomized'
import useGetHistoricoUltimaResposta from '@/hooks/perfilInvestimento/useGetHistoricoUltimaResposta'
import CustomTabListInvestimento from './componentes/TabListInvestimentoCutomized'

const tabs = [
  {
    label: 'Tela inicial',
    value: '1'
  },
  {
    label: 'Questionário de APP',
    value: '2'
  },
  {
    label: 'Histórico de APP',
    value: '3'
  },
  {
    label: 'Alterar perfil',
    value: '4'
  },
  {
    label: 'Solicitações de perfil',
    value: '5'
  },
  {
    label: 'Informações',
    value: '6'
  }
]

export default function Page() {
  const searchParams = useSearchParams()

  //! Tabs
  //! 1 - Tela Inicial (Atualização do questionário de análise de perfil de participante pendente)
  //! 2 - Questionário de análise de perfil
  //! 3 - Histórico de respostas
  //! 4 - Alterar perfil
  //! 5 - Histórico de solicitações
  //! 6 - Informações
  const [value, setValue] = useState<string>('1')

  const [etapaQuestionario, setEtapaQuestionario] = useState<number>(0)

  //! FALSE - Tela Inicial de comparção entre os perfis
  //! TRUE - Tela de detalhamento do perfil selecionado
  const [isDetalhamentoPerfil, setIsDetalhamentoPerfil] = useState<boolean>(false)
  const [detalhamentoPerfilAtual, setDetalhamentoPerfilAtual] = useState()
  const [detalhamentoPerfilIndicado, setDetalhamentoPerfilIndicado] = useState()
  const [perfilSelecionado, setPerfilSelecionado] = useState<object | null>(null)

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    const startQuestionnaire = searchParams.get('startQuestionnaire')

    if (startQuestionnaire === 'true') {
      if (value === '2' && newValue !== '2') {
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('showToast', {
            detail: {
              message: 'Preencha o questionário do app para continuar navegando no sistema',
              severity: 'warning',
              styles: {
                backgroundColor: '#F7B731',
                color: '#000000',
                '& .MuiAlert-icon': {
                  color: '#000000'
                },
                '& .MuiAlert-message': {
                  color: '#000000'
                }
              }

              // icon: createElement('i', { className: 'fa-kit fa-regular-hand-slash' })
            }
          })

          window.dispatchEvent(event)
        }

        return
      }

      if (newValue !== '2') {
        setValue('2')
        setEtapaQuestionario(1)

        return
      }
    }

    setIsDetalhamentoPerfil(false)
    setValue(newValue)
  }

  const { campanhaAtiva, getCampanhaAtiva } = useGetCampanhaAtiva()
  const { appStatus, getAppStatus } = useGetAppStatus()
  const { user } = useAuth()
  const [openAppDesatualizado, setOpenAppDesatualizado] = useState<boolean>(false)

  const { ultimaResposta, error, getUltimaResposta, semResposta } = useGetHistoricoUltimaResposta()

  const verificacaoAppStatus = () => {
    if (appStatus?.cdStatus == '1' && appStatus?.statusAppPreenchido == '4') {
      return setIsDetalhamentoPerfil(true)
    }

    return setOpenAppDesatualizado(true)
  }

  const fetchAllData = useCallback(async () => {
    if (user?.cpf) {
      await getAppStatus(user.cpf)
      await getCampanhaAtiva()
      await getUltimaResposta(user.cpf)
    }
  }, [user, getAppStatus, getCampanhaAtiva, getUltimaResposta])

  // Verificar parâmetros de URL para navegação direta
  useEffect(() => {
    const startQuestionnaire = searchParams.get('startQuestionnaire')

    if (startQuestionnaire === 'true') {
      setValue('2') // Ir para a tab do questionário
      setEtapaQuestionario(1) // Definir etapa para mostrar o questionário
    }
  }, [searchParams])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return (
    <div>
      <div className='mx-auto'>
        <TabContext value={value}>
          <CustomTabListInvestimento pill='true' onChange={handleChange} aria-label='tabs perfil de investimento'>
            {tabs.map(tab => {
              const startQuestionnaire = searchParams.get('startQuestionnaire')
              const isDisabled = startQuestionnaire === 'true' && tab.value !== '2'

              return (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  disabled={isDisabled}
                  sx={{
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                  }}
                />
              )
            })}
          </CustomTabListInvestimento>
          <TabPanel value='1'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
              <div className='lg:col-span-4 w-full gap-4'>
                <div className='flex flex-col sticky top-20 gap-6'>
                  <CardPerfilInvestimento
                    className='mb-3 flex-1'
                    handleAlterarPerfil={() => handleChange({} as SyntheticEvent, '4')}
                    handleInformacoes={() => handleChange({} as SyntheticEvent, '6')}
                  />
                  <HistoricoRespostas
                    handleHistoricoRespostas={() => handleChange({} as SyntheticEvent, '3')}
                    ultimaResposta={ultimaResposta}
                    error={error}
                    semResposta={semResposta}
                  />
                </div>
              </div>

              <div className='lg:col-span-8 w-full flex flex-col gap-6'>
                <CardSolicitacaoAlteracaoPerfil
                  handleHistoricoSolicitacoesAlteracaoPerfil={() => handleChange({} as SyntheticEvent, '5')}
                />

                {user?.cpf && appStatus && (
                  <AnaliseApp
                    className='flex-1'
                    handleResponderQuestionario={() => handleChange({} as SyntheticEvent, '2')}
                    getAppStatus={() => {
                      getAppStatus(user.cpf as string)
                      getUltimaResposta(user.cpf as string)
                    }}
                    cpf={user?.cpf as string}
                    date={appStatus?.dt_evento}
                    status={
                      appStatus?.cdStatus === StatusHistoricoAPPEnum.NUNCA_PREENCHIDO.toString()
                        ? 'pendente'
                        : appStatus?.cdStatus === StatusHistoricoAPPEnum.PREENCHIDO.toString()
                          ? 'respondido'
                          : appStatus?.cdStatus === StatusHistoricoAPPEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE.toString()
                            ? 'nao-respondida'
                            : appStatus?.cdStatus ===
                                StatusHistoricoAPPEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR.toString()
                              ? 'nao-notificado'
                              : 'pendente'
                    }
                  />
                )}

                {!appStatus && (
                  <CardCustomized.Root className='flex-1'>
                    <CardCustomized.Content className='flex flex-col justify-center items-center gap-4'>
                      <Skeleton variant='rectangular' width={100} height={100} sx={{ borderRadius: '5px' }} />
                      <Skeleton variant='rectangular' width={500} height={40} sx={{ borderRadius: '5px' }} />
                      <Skeleton variant='rectangular' width='100%' height={150} sx={{ borderRadius: '5px' }} />
                    </CardCustomized.Content>
                  </CardCustomized.Root>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel value='2'>
            {user?.cpf && appStatus && (etapaQuestionario === 0 || etapaQuestionario === 2) && (
              <AnaliseApp
                showAlert
                handleHistoricoRespostas={() => handleChange({} as SyntheticEvent, '3')}
                handleResponderQuestionario={() => {
                  setEtapaQuestionario(1)
                  handleChange({} as SyntheticEvent, '2')
                }}
                getAppStatus={fetchAllData}
                cpf={user?.cpf as string}
                date={appStatus?.dt_evento}
                status={
                  appStatus?.cdStatus === StatusHistoricoAPPEnum.NUNCA_PREENCHIDO.toString()
                    ? 'pendente'
                    : appStatus?.cdStatus === StatusHistoricoAPPEnum.PREENCHIDO.toString()
                      ? 'respondido'
                      : appStatus?.cdStatus === StatusHistoricoAPPEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE.toString()
                        ? 'nao-respondida'
                        : appStatus?.cdStatus ===
                            StatusHistoricoAPPEnum.NAO_PREENCHIDO_OPCAO_PARTICIPANTE_SOLICITACAO_NAO_MOSTRAR.toString()
                          ? 'nao-notificado'
                          : 'pendente'
                }
              />
            )}

            {etapaQuestionario === 1 && (
              <CardQuestionario
                handleEtapaQuestionario={(etapaQuestionario: number) => setEtapaQuestionario(etapaQuestionario)}
                onQuestionarioSuccess={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('startQuestionnaire')
                  }

                  const url = new URL(window.location.href)

                  url.searchParams.delete('startQuestionnaire')

                  window.history.replaceState({}, '', url.toString())

                  fetchAllData()
                }}
              />
            )}
          </TabPanel>
          <TabPanel value='3'>
            <CardHistoricoRespostas />
          </TabPanel>
          <TabPanel value='4'>
            {!campanhaAtiva && (
              <CardCampanhaFechada
                handleHistoricoSolicitacoes={() => handleChange({} as SyntheticEvent, '5')}
                handleInformacoes={() => handleChange({} as SyntheticEvent, '6')}
              />
            )}

            {campanhaAtiva && !isDetalhamentoPerfil && user && (
              <CardAlterarPerfil
                user={user}
                handleClick={() => verificacaoAppStatus()}
                setDetalhamentoPerfilAtual={setDetalhamentoPerfilAtual}
                setDetalhamentoPerfilIndicado={setDetalhamentoPerfilIndicado}
                setPerfilSelecionado={setPerfilSelecionado}
              />
            )}

            {campanhaAtiva && isDetalhamentoPerfil && (
              <CardDetalhesAlteracaoPerfil
                handleClick={() => setIsDetalhamentoPerfil(false)}
                detalhamentoPerfilAtual={detalhamentoPerfilAtual}
                detalhamentoPerfilIndicado={detalhamentoPerfilIndicado}
                perfilSelecionado={perfilSelecionado}
                handleHistoricoSolicitacoes={() => handleChange({} as SyntheticEvent, '5')}
              />
            )}
          </TabPanel>
          <TabPanel value='5'>
            <CardHistoricoSolicitacoes />
          </TabPanel>
          <TabPanel value='6'>
            <CardInformacoes />
          </TabPanel>
        </TabContext>
      </div>

      <DialogPerfilDesatualizadoPendente
        open={openAppDesatualizado}
        handlePreencherAPP={() => {
          setEtapaQuestionario(1)
          handleChange({} as SyntheticEvent, '2')
        }}
        handleClose={() => {
          setOpenAppDesatualizado(false)
        }}
      />
    </div>
  )
}
