import { useEffect, useState } from 'react'

import Image from 'next/image'

import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'

import { Alert, Card, Grid, Skeleton, Typography } from '@mui/material'

import useGetAllExtrato from '@/hooks/useGetAllExtrato'
import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import PaginationIris from '../iris/PaginationIris'
import type { FilterExtratoType } from '@/types/extrato/FilterExtratoType'
import ExtratoDetalhe from './ExtratoDetalhe'

import { StyledAccordion } from './StyledAccordion'
import { PAGINATION, STYLES, MESES, CONTRIBUICAO_TYPES, CONTRIBUIDOR_TYPES } from './constants/AccordionConstants'
import { formatCurrency } from '@/app/utils/formatters'

// Funções utilitárias simplificadas
export const formatarCompetencia = (competencia: string): string => {
  const [mes, ano] = competencia.split('/')
  const numeroMes = parseInt(mes, 10)

  if (numeroMes === 13) return `13º/${ano}`
  if (numeroMes < 1 || numeroMes > 12) return `Mês inválido/${ano}`

  return `${MESES[numeroMes - 1]}/${ano}`
}

export const limparFiltrosVazios = (filtros: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(filtros).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  )
}

// Função unificada para título, subtítulo e ícone
const getAccordionInfo = (item: any) => {
  const grupo = item.grupoContribuicao?.toUpperCase() || ''
  const contribuidor = item.mantenedorContribuicao?.toUpperCase() || ''
  const contribuicao = item.tipoContribuicao?.toUpperCase() || ''
  const isEstorno = contribuicao.startsWith('ESTORNO')

  // Early returns para casos especiais
  if (isEstorno) {
    return {
      titulo: 'Estorno',
      subtitulo:
        grupo === CONTRIBUICAO_TYPES.NORMAL
          ? contribuidor === CONTRIBUIDOR_TYPES.PARTICIPANTE
            ? 'Contribuição normal do participante'
            : 'Contribuição normal do patrocinador'
          : 'Contribuição',
      icon: 'fa-regular fa-arrow-rotate-left',
      color: 'var(--mui-palette-primary-lightOpacity)',
      borderColor: 'var(--mui-palette-primary-lightOpacity)',
      colorIcon: 'var(--mui-palette-primary-main)'
    }
  }

  if (item.mesCompetencia === '13') {
    return {
      titulo: 'Gratificação Natalina',
      subtitulo: '13º salário',
      icon: 'fa-kit fa-regular-money-bill-circle-arrow-up',
      color: 'var(--mui-palette-success-lightOpacity)',
      borderColor: 'var(--mui-palette-success-lightOpacity)',
      colorIcon: 'var(--mui-palette-success-main)'
    }
  }

  const labelSubtitulo =
    contribuidor === CONTRIBUIDOR_TYPES.PARTICIPANTE
      ? 'Participante'
      : contribuidor === CONTRIBUIDOR_TYPES.AUTOPATROCINADO
        ? 'Autopatrocinado'
        : 'Patrocinador'

  // Mapeamento direto para tipos principais
  const tipoMap: Record<
    string,
    { titulo: string; subtitulo: string; icon: string; color: string; borderColor: string; colorIcon: string }
  > = {
    [CONTRIBUICAO_TYPES.NORMAL]: {
      titulo: 'Contribuição normal',
      subtitulo: labelSubtitulo,
      icon: 'fa-kit fa-regular-money-bill-circle-arrow-up',
      color: 'var(--mui-palette-success-lightOpacity)',
      borderColor: 'var(--mui-palette-success-lightOpacity)',
      colorIcon: 'var(--mui-palette-success-main)'
    },
    [CONTRIBUICAO_TYPES.VINCULADA]: {
      titulo: 'Contribuição vinculada',
      subtitulo: labelSubtitulo,
      icon: 'fa-kit fa-regular-money-bill-circle-arrow-up',
      color: 'var(--mui-palette-success-lightOpacity)',
      borderColor: 'var(--mui-palette-success-lightOpacity)',
      colorIcon: 'var(--mui-palette-success-main)'
    },
    [CONTRIBUICAO_TYPES.FACULTATIVA]: {
      titulo: 'Contribuição facultativa',
      subtitulo: labelSubtitulo,
      icon: 'fa-kit fa-regular-money-bill-circle-arrow-up',
      color: 'var(--mui-palette-success-lightOpacity)',
      borderColor: 'var(--mui-palette-success-lightOpacity)',
      colorIcon: 'var(--mui-palette-success-main)'
    },
    [CONTRIBUICAO_TYPES.BENEFICIO_CONCEDIDO]: {
      titulo: 'Pagamento do benefício',
      subtitulo: 'Benefício concedido',
      icon: 'fa-kit fa-regular-money-bill-wave-circle-dollar',
      color: 'var(--mui-palette-primary-lightOpacity)',
      borderColor: 'var(--mui-palette-primary-lightOpacity)',
      colorIcon: 'var(--mui-palette-primary-main)'
    }
  }

  if (tipoMap[grupo]) return tipoMap[grupo]

  // Casos especiais com verificações simples
  if (grupo.includes('SEGURO')) {
    return {
      titulo: 'CAR',
      subtitulo: 'Contribuição adicional de risco',
      icon: 'fa-solid fa-shield-halved',
      color: 'var(--mui-palette-primary-lightOpacity)',
      borderColor: 'var(--mui-palette-primary-lightOpacity)',
      colorIcon: 'var(--mui-palette-primary-main)'
    }
  }

  if (grupo.startsWith('DEVOL')) {
    return {
      titulo: 'Devolução do benefício',
      subtitulo: '',
      icon: 'fa-regular fa-arrow-rotate-left',
      color: 'var(--mui-palette-primary-lightOpacity)',
      borderColor: 'var(--mui-palette-primary-lightOpacity)',
      colorIcon: 'var(--mui-palette-primary-main)'
    }
  }

  if (grupo.startsWith('PORTABILIDADE')) {
    const isSaida = grupo.includes('SAÍDA') || grupo.includes('SAIDA')

    return {
      titulo: 'Portabilidade',
      subtitulo: isSaida ? 'Saída' : 'Entrada',
      icon: isSaida ? 'fa-kit fa-regular-money-bill-circle-arrow-down' : 'fa-kit fa-regular-money-bill-circle-arrow-up',
      color: isSaida ? 'var(--mui-palette-error-lightOpacity)' : 'var(--mui-palette-success-lightOpacity)',
      borderColor: isSaida ? 'var(--mui-palette-error-lightOpacity)' : 'var(--mui-palette-success-lightOpacity)',
      colorIcon: isSaida ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-success-main)'
    }
  }

  if (grupo.includes('BPD')) {
    return {
      titulo: 'BPD',
      subtitulo: item.isDeposito ? 'Depósito' : item.isDebito ? 'Débito' : 'Saldo',
      icon: 'fa-kit fa-regular-money-bill-circle-arrow-down',
      color: 'var(--mui-palette-error-lightOpacity)',
      borderColor: 'var(--mui-palette-error-lightOpacity)',
      colorIcon: 'var(--mui-palette-error-main)'
    }
  }

  if (grupo.startsWith('MULTA')) {
    return {
      titulo: 'Multa',
      subtitulo: 'Aplicação de multa',
      icon: 'fa-kit fa-regular-coin-circle-arrow-down',
      color: 'var(--mui-palette-error-lightOpacity)',
      borderColor: 'var(--mui-palette-error-lightOpacity)',
      colorIcon: 'var(--mui-palette-error-main)'
    }
  }

  if (grupo.startsWith('CONCESSÃO')) {
    return {
      titulo: 'Pagamento de benefício',
      subtitulo: '',
      icon: 'fa-kit fa-regular-money-bill-wave-circle-dollar',
      color: 'var(--mui-palette-primary-lightOpacity)',
      borderColor: 'var(--mui-palette-primary-lightOpacity)',
      colorIcon: 'var(--mui-palette-primary-main)'
    }
  }

  if ('dataTransferencia' in item) {
    return {
      titulo: 'Transferência de perfil',
      subtitulo: '',
      icon: 'fa-solid fa-arrow-right-arrow-left',
      color: 'var(--mui-palette-primary-lightOpacity)',
      borderColor: 'var(--mui-palette-primary-lightOpacity)',
      colorIcon: 'var(--mui-palette-primary-main)'
    }
  }

  // Fallback

  return {
    titulo: item.tipoContribuicao || 'Tipo não identificado',
    subtitulo: item.contribuidor || 'Contribuidor',
    icon: 'fa-kit fa-regular-money-bill-circle-arrow-up',
    color: 'var(--mui-palette-success-lightOpacity)',
    borderColor: 'var(--mui-palette-success-lightOpacity)',
    colorIcon: 'var(--mui-palette-success-main)'
  }
}

// Componente de item simplificado
const ExtratoItem = ({ item, index }: { item: ExtratoTypes; index: number }) => {
  const { titulo, subtitulo, icon, color, borderColor, colorIcon } = getAccordionInfo(item)

  if ('valorContribuicao' in item) {
    item.valorContribuicao = Math.abs(item.valorContribuicao)
  }

  if ('dataTransferencia' in item) {
    item.grupoContribuicao = 'TRANSFERÊNCIA DE PERFIL'
  }

  return (
    <StyledAccordion key={index} className='w-full'>
      <MuiAccordionSummary
        expandIcon={<i className='fa-regular fa-chevron-down text-primary-main' />}
        aria-controls={`panel-content-${index}`}
        id={`panel-header-${index}`}
        sx={{ minHeight: '135px', borderBottom: '1px solid var(--mui-palette-divider) !important' }}
      >
        <Grid container spacing={2}>
          <Grid item sm={12} md={4} className='flex items-center gap-4'>
            <div
              className='hidden sm:flex w-12 h-12 rounded-full items-center justify-center p-10'
              style={{
                backgroundColor: color,
                borderColor: borderColor
              }}
            >
              <i
                className={`${icon} ${STYLES.ICON_SIZE}`}
                style={{
                  color: colorIcon
                }}
              />
            </div>
            <div>
              <Typography
                variant='h5'
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold !important',
                  color: 'var(--mui-palette-text-primary) !important'
                }}
              >
                {titulo}
              </Typography>
              <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary) !important' }}>
                {subtitulo}
              </Typography>
              <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary) !important' }}>
                {item.patrocinador}
              </Typography>
            </div>
          </Grid>
          <Grid item sm={12} md={4} className='flex items-center justify-center'>
            <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary) !important' }}>
              {formatarCompetencia(item.competencia)}
            </Typography>
          </Grid>
          <Grid item sm={12} md={4} className='flex items-center justify-end'>
            <Typography
              variant='h5'
              sx={{
                fontWeight: 'bold !important',
                color: 'var(--mui-palette-text-primary) !important'
              }}
            >
              {item.valorContribuicao ? formatCurrency(item.valorContribuicao) : '-'}
            </Typography>
          </Grid>
        </Grid>
      </MuiAccordionSummary>
      <MuiAccordionDetails sx={{ backgroundColor: '#F2F2F2', padding: '0 !important' }}>
        <ExtratoDetalhe item={item} modeloDetalhe={item.tipoContribuicao} grupoContribuicao={item.grupoContribuicao} />
      </MuiAccordionDetails>
    </StyledAccordion>
  )
}

// Estado vazio simplificado
const EmptyState = ({ message }: { message: string }) => (
  <div className='h-full flex-1 flex flex-col justify-center items-center gap-4 p-20'>
    <Image src={'/images/iris/nao-encontrado.svg'} alt='sem documentos' width={99} height={94} />
    <Typography variant='body1'>{message}</Typography>
  </div>
)

// Componente principal simplificado
export default function ListExtrato({
  tipo,
  orgao,
  autor,
  mesInicial,
  mesFinal,
  anoInicial,
  anoFinal
}: FilterExtratoType) {
  const { extrato, error, isLoading, getAllExtrato } = useGetAllExtrato()
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)

  useEffect(() => {
    const filtrosLimpos = limparFiltrosVazios({
      pageIndex: PAGINATION.DEFAULT_PAGE,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
      mesInicial,
      mesFinal,
      anoInicial,
      anoFinal,
      tipo,
      orgao,
      autor
    })

    setPage(PAGINATION.DEFAULT_PAGE)
    getAllExtrato(Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {})
  }, [getAllExtrato, tipo, orgao, autor, mesInicial, mesFinal, anoInicial, anoFinal])

  useEffect(() => {
    const filtrosLimpos = limparFiltrosVazios({
      pageIndex: page,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
      mesInicial,
      mesFinal,
      anoInicial,
      anoFinal,
      tipo,
      orgao,
      autor
    })

    getAllExtrato(Object.keys(filtrosLimpos).length > 0 ? filtrosLimpos : {})
  }, [getAllExtrato, page])

  if (error && !isLoading) return <Alert severity='error'>Erro ao buscar extrato</Alert>
  if (!extrato?.dados && !isLoading)
    return <EmptyState message='Não Encontramos extratos com os filtros selecionados.' />

  return (
    <>
      <Card
        variant='outlined'
        sx={{
          width: '100%',
          height: '100%',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          flexWrap: 'wrap',
          backgroundColor: '#F2F2F2'
        }}
      >
        {isLoading ? (
          <Skeleton variant='rectangular' height='640px' sx={{ borderRadius: '5px' }} />
        ) : (
          <>
            {extrato.dados.length > 0 ? (
              extrato.dados.map((item: ExtratoTypes, index: number) => (
                <ExtratoItem key={index} item={item} index={index} />
              ))
            ) : (
              <EmptyState message='Não encontramos movimentações com os filtros selecionados' />
            )}
          </>
        )}
      </Card>

      <div className='w-full flex flex-col items-center justify-center mt-5'>
        <PaginationIris
          totalPaginas={Math.ceil(extrato.total_itens / extrato.itens_por_pagina)}
          page={page + 1}
          handleChange={(_, value) => setPage(value - 1)}
        />
      </div>
    </>
  )
}
