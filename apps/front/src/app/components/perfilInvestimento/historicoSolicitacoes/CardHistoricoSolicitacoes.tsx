import { useCallback, useEffect, useState } from 'react'

import { Box, Chip, ListItem, Skeleton, Typography } from '@mui/material'

import { styled } from '@mui/material/styles'
import List from '@mui/material/List'
import type { ListProps } from '@mui/material/List'

import BoxHistoricoNaoEncontrado from '../historicoNaoEncontrado/BoxHistoricoNaoEncontrado'
import PaginationIris from '../../iris/PaginationIris'

import DialogCancelarSolicitacao from '../modal/DialogCancelarSolicitacao'
import { useGetHistoricoSolicitacoes } from '@/hooks/perfilInvestimento/useGetHistoricoSolicitacoes'

import { formatarDataBR } from '@/app/utils/formatters'
import {
  getStatusHistoricoAlteracaoPerfilInvestimentoColor,
  getStatusHistoricoAlteracaoPerfilInvestimentoLabel
} from '@/utils/perfilInvestimentoUtils'
import { useCancelarSolicitacaoAlteracaoPerfilInvestimento } from '@/hooks/perfilInvestimento/useCancelarSolicitacaoAlteracaoPerfilInvestimento'
import DialogToken from '../modal/DialogToken'
import { StatusHistoricoAlteracaoPerfilInvestimentoEnum } from '@/enum/perfilInvestimento/StatusHistoricoAlteracaoPerfilInvestimentoEnum'
import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'
import TextWithLegend from '@/components/ui/TextWithLegend'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

import { useGetUltimaSolicitacao } from '@/hooks/perfilInvestimento/useGetUltimaSolicitacao'

const StyledList = styled(List)<ListProps>(({ theme }) => ({
  '& .MuiListItem-root': {
    border: '1px solid var(--mui-palette-divider)',
    '&:first-of-type': {
      borderStartStartRadius: 'var(--mui-shape-borderRadius)',
      borderStartEndRadius: 'var(--mui-shape-borderRadius)'
    },
    '&:last-child': {
      borderEndStartRadius: 'var(--mui-shape-borderRadius)',
      borderEndEndRadius: 'var(--mui-shape-borderRadius)'
    },
    '&:not(:last-child)': {
      borderBlockEnd: 0
    },
    '& .MuiListItem-root': {
      paddingInlineEnd: theme.spacing(24)
    },
    '& .MuiListItemText-root': {
      marginBlockStart: 0,
      '& .MuiTypography-root': {
        fontWeight: 500
      }
    }
  }
}))

function CardHistoricoSolicitacoesItem({
  historicoRecente,
  handleValidarSolicitacao,
  handleCancelarSolicitacao
}: {
  historicoRecente: any
  handleValidarSolicitacao: () => void
  handleCancelarSolicitacao: () => void
}) {
  const showValidarSolicitacao =
    historicoRecente?.status === StatusHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE ||
    (typeof historicoRecente?.status === 'string' && historicoRecente.status.includes('Confirmação Pendente'))

  const showCancelarSolicitacao =
    historicoRecente?.status === StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_PROCESSADA ||
    historicoRecente?.status === StatusHistoricoAlteracaoPerfilInvestimentoEnum.SOLICITACAO_RECEBIDA ||
    (typeof historicoRecente?.status === 'string' &&
      (historicoRecente.status.includes('Solicitação Processada') ||
        historicoRecente.status.includes('Solicitação Recebida')))

  return (
    <div className='w-full grid grid-cols-12 gap-4 p-4'>
      <div className='col-span-12 xl:col-span-7 grid grid-cols-11 items-center gap-4'>
        <Chip
          className='col-span-12 xl:col-span-4'
          variant='tonal'
          label={getStatusHistoricoAlteracaoPerfilInvestimentoLabel(
            historicoRecente?.status as StatusHistoricoAlteracaoPerfilInvestimentoEnum | string
          )}
          color={getStatusHistoricoAlteracaoPerfilInvestimentoColor(
            historicoRecente?.status as StatusHistoricoAlteracaoPerfilInvestimentoEnum | string
          )}
          sx={{
            width: '100%',
            maxWidth: '350px'
          }}
        />

        <div className='col-span-12 xl:col-span-7'>
          <TextWithLegend
            legend='Perfil solicitado'
            text={historicoRecente?.perfilInvestimentoDescricao}
            legendPosition='left'
          />
          <TextWithLegend
            legend='Data da solicitação'
            text={formatarDataBR(historicoRecente?.dt_solicitacao)}
            legendPosition='left'
          />
          <TextWithLegend legend='Campanha' text={historicoRecente?.campanhaDescricao} legendPosition='left' />
          <TextWithLegend
            legend='Nº Protocolo'
            text={historicoRecente?.protocolo}
            legendPosition='left'
            className='!items-start break-all'
          />
        </div>
      </div>

      {(showValidarSolicitacao || showCancelarSolicitacao) && (
        <div className='col-span-12 xl:col-span-5 w-full flex flex-wrap justify-end items-center gap-4'>
          {showValidarSolicitacao && (
            <ButtonCustomized
              color='primary'
              variant='contained'
              onClick={handleValidarSolicitacao}
              startIcon={<i className='fa-kit fa-regular-envelope-key'></i>}
              sx={{
                maxWidth: '270px',
                padding: '1.5rem 0.5rem'
              }}
            >
              Validar solicitação
            </ButtonCustomized>
          )}
          <ButtonCustomized
            variant='outlined'
            color='error'
            onClick={handleCancelarSolicitacao}
            startIcon={<i className='fa-regular fa-trash' />}
            sx={{
              maxWidth: '270px',
              padding: '1.5rem 0.5rem'
            }}
          >
            Cancelar Solicitação
          </ButtonCustomized>
        </div>
      )}
    </div>
  )
}

export default function CardHistoricoSolicitacoes() {
  const { historicoSolicitacoes, isLoading, getHistoricoSolicitacoes } = useGetHistoricoSolicitacoes()
  const { ultimaSolicitacao, getUltimaSolicitacao } = useGetUltimaSolicitacao()
  const { user } = useAuth()
  const [page, setPage] = useState(0)
  const [isOpenDialogToken, setIsOpenDialogToken] = useState<boolean>(false)
  const [isCancelarSolicitacao, setIsCancelarSolicitacao] = useState<boolean>(false)
  const { statusCancelamento, cancelarSolicitacaoAlteracaoPerfil } = useCancelarSolicitacaoAlteracaoPerfilInvestimento()

  const fetchHistoricoSolicitacoes = useCallback(async () => {
    if (user?.cpf) {
      await getHistoricoSolicitacoes(user.cpf, page, 5)
    }
  }, [user, page, statusCancelamento])

  const fetchUltimaSolicitacao = useCallback(async () => {
    if (user?.cpf) {
      await getUltimaSolicitacao(user.cpf)
    }
  }, [user])

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  useEffect(() => {
    fetchHistoricoSolicitacoes()
  }, [fetchHistoricoSolicitacoes])

  useEffect(() => {
    fetchUltimaSolicitacao()
  }, [fetchUltimaSolicitacao])

  const hasSolicitacaoPendente =
    ultimaSolicitacao?.status === StatusHistoricoAlteracaoPerfilInvestimentoEnum.CONFIRMACAO_PENDENTE ||
    (typeof ultimaSolicitacao?.status === 'string' && ultimaSolicitacao.status.includes('Confirmação Pendente'))

  if (isLoading) {
    return (
      <CardCustomized.Root>
        <CardCustomized.Header title='Histórico de solicitações' />
        <CardCustomized.Content>
          <Typography variant='h5' sx={{ marginBottom: '0.5rem', marginTop: '0.7rem' }}>
            Histórico de solicitações
          </Typography>

          <Skeleton variant='rectangular' width='100%' height='500px' sx={{ borderRadius: '9px' }} />
        </CardCustomized.Content>
      </CardCustomized.Root>
    )
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Histórico de solicitações' />
      <CardCustomized.Content>
        {hasSolicitacaoPendente && (
          <Box className='flex items-start bg-[var(--mui-palette-warning-lightOpacity)] p-4 rounded-xl mt-4 mb-4 gap-4'>
            <div className='bg-[#C47808] rounded-full p-2 flex items-center justify-center'>
              <i className='fa-regular fa-clock text-white text-sm'></i>
            </div>
            <div>
              <Typography variant='h5' sx={{ color: '#8A570A', fontWeight: 'bold' }}>
                Solicitação está aguardando confirmação
              </Typography>
              <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary)' }}>
                Sua última solicitação está aguardando confirmação. Caso não haja validação até o fim da campanha de
                troca de perfil, a última solicitação validada será contabilizada e definirá o seu novo perfil.
              </Typography>
            </div>
          </Box>
        )}

        <div>
          <Typography variant='h5' sx={{ marginBottom: '0.5rem', marginTop: '0.7rem' }}>
            Solicitações
          </Typography>

          <StyledList>
            {historicoSolicitacoes && historicoSolicitacoes?.perfilInvestimentoHistorico?.length > 0 ? (
              historicoSolicitacoes?.perfilInvestimentoHistorico.map((historicoAlteracaoPerfil, index) => (
                <ListItem key={index}>
                  <CardHistoricoSolicitacoesItem
                    historicoRecente={historicoAlteracaoPerfil}
                    handleCancelarSolicitacao={() => setIsCancelarSolicitacao(true)}
                    handleValidarSolicitacao={() => setIsOpenDialogToken(true)}
                  />
                </ListItem>
              ))
            ) : (
              <BoxHistoricoNaoEncontrado mensagem='Nenhuma solicitação encontrada' />
            )}
          </StyledList>
          <div className='w-full flex flex-col items-center justify-center my-5 '>
            <div className='w-full flex flex-col items-center justify-end '>
              <PaginationIris
                totalPaginas={historicoSolicitacoes?.totalPages || 1}
                page={page + 1}
                handleChange={(_, value) => handleChange(_, value - 1)}
              />
            </div>
          </div>
        </div>
      </CardCustomized.Content>

      <DialogCancelarSolicitacao
        cpf={user?.cpf || ''}
        open={isCancelarSolicitacao}
        handleClose={() => setIsCancelarSolicitacao(false)}
        handleCancelarSolicitacaoAlteracaoPerfil={async () =>
          await cancelarSolicitacaoAlteracaoPerfil(user?.cpf || '').then(async () => {
            await fetchUltimaSolicitacao()
          })
        }
      />

      <DialogToken
        cpf={user?.cpf || ''}
        isOpen={isOpenDialogToken}
        handleClose={() => {
          setIsOpenDialogToken(false)
        }}
        handleHistoricoSolicitacoes={async () => {
          await getHistoricoSolicitacoes(user?.cpf || '', page, 5)
        }}
        email={user?.email || ''}
      />
    </CardCustomized.Root>
  )
}
