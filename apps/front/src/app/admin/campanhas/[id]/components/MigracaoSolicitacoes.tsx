import { useEffect, useState } from 'react'

import type { ListProps } from '@mui/material'
import { List, ListItem, styled, Typography, Pagination, Box, Alert, Snackbar } from '@mui/material'

import { BoxDadosCampanha } from './BoxDadosCampanha'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import HoverButton from '@/app/components/iris/HoverButton'
import { useGetMigracaoSolicitacoesCampanha } from '@/hooks/campanhas/useGetMigracaoSolicitacoesCampanha'
import { useMigrarPerfilIndividual } from '@/hooks/perfilInvestimento/useMigrarPerfilIndividual'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'
import { aplicarMascaraCPF } from '@/app/utils/formatters'
import { StatusHistoricoAlteracaoPerfilInvestimentoEnum } from '@/enum/perfilInvestimento/StatusHistoricoAlteracaoPerfilInvestimentoEnum'

export function MigracaoSolicitacoes({ campanha }: { campanha: CampanhaType | null }) {
  const { migracaoSolicitacoes, getMigracaoSolicitacoesCampanha } = useGetMigracaoSolicitacoesCampanha()
  const { migrarPerfilIndividual, isLoading: isMigrating} = useMigrarPerfilIndividual()
  const [listaSolicitacoes, setListaSolicitacoes] = useState<any[]>([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina] = useState(10)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const StyledList = styled(List)<ListProps>(({ theme }) => ({
    '& .MuiListItem-root': {
      border: '2px solid var(--mui-palette-divider)',
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

  // Cálculos de paginação
  const totalPaginas = Math.ceil(listaSolicitacoes.length / itensPorPagina)
  const indiceInicio = (paginaAtual - 1) * itensPorPagina
  const indiceFim = indiceInicio + itensPorPagina
  const solicitacoesPaginadas = listaSolicitacoes.slice(indiceInicio, indiceFim)

  const handleMudancaPagina = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaAtual(value)
  }

  useEffect(() => {
    if (campanha) {
      getMigracaoSolicitacoesCampanha(campanha.idCampanha as number)
    }
  }, [campanha, getMigracaoSolicitacoesCampanha])

  useEffect(() => {
    if (migracaoSolicitacoes) {
      setListaSolicitacoes(migracaoSolicitacoes?.solicitacoesInconsistentes ?? [])
    }
  }, [migracaoSolicitacoes])

  // Reset da página quando a lista muda
  useEffect(() => {
    setPaginaAtual(1)
  }, [listaSolicitacoes])

  // Função para verificar se uma solicitação é inconsistente
  const isSolicitacaoInconsistente = (solicitacao: any) => {
    return solicitacao.status === StatusHistoricoAlteracaoPerfilInvestimentoEnum.ERRO_NO_PROCESSAMENTO ||
           solicitacao.status === 'Erro no Processamento'
  }

  // Função para lidar com a migração do perfil
  const handleMigrarPerfil = async (solicitacao: any) => {
    try {
      const resultado = await migrarPerfilIndividual(solicitacao.id)
      
      setSnackbarMessage(resultado.message || 'Perfil migrado com sucesso!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      
      // Recarrega os dados da campanha para atualizar a lista
      if (campanha) {
        getMigracaoSolicitacoesCampanha(campanha.idCampanha as number)
      }
    } catch (error: any) {
      setSnackbarMessage(error?.response?.data?.message || 'Erro ao migrar perfil')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  // Função para fechar o snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (migracaoSolicitacoes?.solicitacoesProcessadasTotal ?? 0) +
    (migracaoSolicitacoes?.solicitacoesInconsistentesTotal ?? 0) >
    0 ? (
    <div>
      <Typography variant='h4' className='font-semibold mt-4 mb-3'>
        Migração de solicitações
      </Typography>

      <div className='grid md:grid-cols-3 sm:grid-cols-1 gap-4 mb-2'>
        <BoxDadosCampanha
          title='Total de solicitações'
          value={
            (migracaoSolicitacoes?.solicitacoesProcessadasTotal ?? 0) +
            (migracaoSolicitacoes?.solicitacoesInconsistentesTotal ?? 0)
          }
          onClick={() => {
            setListaSolicitacoes(
              migracaoSolicitacoes?.solicitacoesProcessadas?.concat(
                migracaoSolicitacoes?.solicitacoesInconsistentes ?? []
              ) ?? []
            )
          }}
        />
        <BoxDadosCampanha
          title='Solicitações processadas'
          value={migracaoSolicitacoes?.solicitacoesProcessadasTotal ?? 0}
          onClick={() => {
            setListaSolicitacoes(migracaoSolicitacoes?.solicitacoesProcessadas ?? [])
          }}
        />
        <BoxDadosCampanha
          title='Inconsistência'
          value={migracaoSolicitacoes?.solicitacoesInconsistentesTotal ?? 0}
          onClick={() => {
            setListaSolicitacoes(migracaoSolicitacoes?.solicitacoesInconsistentes ?? [])
          }}
        />
      </div>

      {listaSolicitacoes.length > 0 && (
        <Box className='mb-4 p-4 bg-gray-50 rounded-lg border'>
          <Typography variant='body2' className='text-gray-600'>
            Mostrando {indiceInicio + 1} a {Math.min(indiceFim, listaSolicitacoes.length)} de {listaSolicitacoes.length}{' '}
            solicitações
          </Typography>
        </Box>
      )}

      <StyledList>
        {solicitacoesPaginadas.map(solicitacao => (
          <ListItem key={solicitacao.id} className={`flex flex-wrap justify-between items-center p-4 border-gray-300 `}>
            <div className='flex-1 flex flex-wrap justify-start items-center gap-4 '>
              <div>
                <Typography variant='body1'>
                  CPF: <span className='font-semibold'>{aplicarMascaraCPF(solicitacao.cpf)}</span>
                </Typography>
                <Typography variant='body1'>
                  E-mail: <span className='font-semibold'>{solicitacao.email}</span>
                </Typography>
                <Typography variant='body1'>
                  Perfil solicitado: <span className='font-semibold'>{solicitacao.perfilInvestimentoDescricao}</span>
                </Typography>
                <Typography variant='body1'>
                  Nº de protocolo: <span className='font-semibold'>{solicitacao.protocolo}</span>
                </Typography>
              </div>
            </div>

            <div className='flex flex-row gap-2 items-center'>
              {isSolicitacaoInconsistente(solicitacao) && (
                <ButtonCustomized
                  className='rounded-full p-6'
                  color='primary'
                  variant='contained'
                  disabled={isMigrating}
                  onClick={() => handleMigrarPerfil(solicitacao)}
                  startIcon={<i className='fa-regular fa-file-export text-lg'></i>}
                  sx={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    padding: 0,
                    zIndex: 1000,
                    borderRadius: '50%',
                    '.MuiButton-startIcon': {
                      marginRight: 0,
                      marginLeft: 0
                    }
                  }}
                ></ButtonCustomized>
              )}

              <HoverButton url={solicitacao.url}/>
            </div>
          </ListItem>
        ))}
      </StyledList>

      {totalPaginas > 1 && (
        <Box className='flex justify-center mt-6'>
          <Pagination
            count={totalPaginas}
            page={paginaAtual}
            onChange={handleMudancaPagina}
            color='primary'
            size='large'
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  ) : null
}
