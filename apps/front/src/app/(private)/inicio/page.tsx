'use client'

import { useEffect, useState } from 'react'

import { Grid } from '@mui/material'

import { CardContribuicoesMes } from './components/CardContribuicoesMes'
import { CardCarousel } from './components/CardCarousel'
import { CardMinhasCoberturas } from './components/CardMinhasCoberturas'
import { CardProjecaoBeneficio } from './components/CardProjecaoBeneficio'
import { useGetCampanhaAtiva } from '@/hooks/perfilInvestimento/useGetCampanhaAtiva'
import { CardSaldoTotal } from '@/app/components/common/CardSaldoTotal'
import { CardEvolucaoSaldo } from '@/app/components/common/CardEvolucaoSaldo'
import useGetAppStatus from '@/hooks/perfilInvestimento/useGetAppStatus'
import { getSessionStorageItem, setSessionStorageItem } from '@/app/utils/sessionStorage'
import { useAuth } from '@/contexts/AuthContext'
import { CardPerfilInvestimento } from '@/app/components/common/CardPerfilInvestimento'
import { RenderModais } from '@/app/components/common/RenderModais'
import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'

export default function Page() {
  const [openCampanhaAberta, setOpenCampanhaAberta] = useState(false)
  const [modalStatusApp, setModalStatusApp] = useState<boolean>(false)
  const [modalTermoAbstencao, setModalTermoAbstencao] = useState<boolean>(false)
  const [modalNaoPreencheuApp, setModalNaoPreencheuApp] = useState<boolean>(false)
  const [modalTermoNotificacao, setModalTermoNotificacao] = useState<boolean>(false)

  const { user, refetch } = useAuth()
  const { campanhaAtiva, getCampanhaAtiva } = useGetCampanhaAtiva()
  const { appStatus, getAppStatus } = useGetAppStatus()

  // Estado local para controlar se a modal já foi mostrada nesta sessão
  const [modalCampanhaJaMostrada, setModalCampanhaJaMostrada] = useState<boolean>(false)

  const handleCienteCampanhaAberta = async () => {
    const cienteCampanhaAberta = await PerfilInvestimentoService.getCienteCampanhaAberta(user?.cpf as string)

    if (!cienteCampanhaAberta.ciente) {
      setOpenCampanhaAberta(true)
      setModalCampanhaJaMostrada(true)
      setSessionStorageItem('campanhaModalShown', 'true')
    }
  }

  useEffect(() => {
    const sessionValue = getSessionStorageItem('campanhaModalShown')

    if (sessionValue === 'true') {
      setModalCampanhaJaMostrada(true)
    }
  }, [])

  useEffect(() => {
    refetch()
    getCampanhaAtiva()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const modalJaMostrada = getSessionStorageItem('campanhaModalShown') || modalCampanhaJaMostrada

    // Verifica se há campanha ativa e se está realmente ativa
    if (user && campanhaAtiva && campanhaAtiva.status === 'andamento' && !modalJaMostrada) {
      handleCienteCampanhaAberta()
    }
  }, [user, campanhaAtiva, modalCampanhaJaMostrada])

  useEffect(() => {
    if (user?.cpf) {
      getAppStatus(user?.cpf)
    }
  }, [user?.cpf, getAppStatus])

  useEffect(() => {
    if (appStatus?.cdStatus == '0' && !getSessionStorageItem('appStatusModalShown')) {
      setModalStatusApp(true)
      setSessionStorageItem('appStatusModalShown', 'true')
      setSessionStorageItem('appNaoPreencheuAppModalShown', 'true')
    }

    if (appStatus?.cdStatus == '2' && !getSessionStorageItem('appNaoPreencheuAppModalShown')) {
      setModalNaoPreencheuApp(true)
      setSessionStorageItem('appNaoPreencheuAppModalShown', 'true')
    }
  }, [appStatus])

  return (
    <Grid container spacing={6} sx={{ width: '100%' }}>
      <Grid item md={12} lg={4} sx={{ width: '100%' }}>
        <div className='flex flex-col sticky top-20 gap-6'>
          <CardSaldoTotal />
          <CardPerfilInvestimento />
          <CardContribuicoesMes />
          <CardCarousel />
        </div>
      </Grid>

      <Grid item md={12} lg={8} sx={{ width: '100%' }}>
        <div className='flex flex-col sticky top-20 gap-6'>
          <CardEvolucaoSaldo showVerDetalhesDoPatrimonio />
          <CardMinhasCoberturas />
          <CardProjecaoBeneficio />
        </div>
      </Grid>

      {RenderModais({
        cpf: user?.cpf as string,
        modalStatus: {
          handleShowTermoNotificacao: () => {
            setModalTermoNotificacao(true)
          },
          onClose: () => {
            if (modalStatusApp) {
              setModalStatusApp(false)
              setModalTermoAbstencao(true)
            } else if (modalTermoAbstencao) {
              setModalTermoAbstencao(false)
            } else if (modalNaoPreencheuApp) {
              setModalNaoPreencheuApp(false)
            } else if (modalTermoNotificacao) {
              setModalTermoNotificacao(false)
            } else if (openCampanhaAberta) {
              setOpenCampanhaAberta(false)
            }
          },
          openModal: modalStatusApp
            ? 'preencherApp'
            : modalTermoAbstencao
              ? 'termoRecusa'
              : modalNaoPreencheuApp
                ? 'preencherAppCheckbox'
                : modalTermoNotificacao
                  ? 'termoNotificacao'
                  : openCampanhaAberta
                    ? 'campanhaAberta'
                    : null
        }
      })}
    </Grid>
  )
}
