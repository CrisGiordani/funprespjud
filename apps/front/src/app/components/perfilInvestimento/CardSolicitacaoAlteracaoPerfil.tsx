import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Box, Card, Chip, Skeleton, Typography } from '@mui/material'

import { useAuth } from '@/contexts/AuthContext'
import { useGetUltimaSolicitacao } from '@/hooks/perfilInvestimento/useGetUltimaSolicitacao'
import {
  getStatusHistoricoAlteracaoPerfilInvestimentoColor,
  getStatusHistoricoAlteracaoPerfilInvestimentoLabel,
  showButtonCancelarSolicitacao,
  showButtonToken
} from '@/utils/perfilInvestimentoUtils'
import DialogToken from './modal/DialogToken'
import DialogCancelarSolicitacao from './modal/DialogCancelarSolicitacao'
import { useCancelarSolicitacaoAlteracaoPerfilInvestimento } from '@/hooks/perfilInvestimento/useCancelarSolicitacaoAlteracaoPerfilInvestimento'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { formatarDataBR } from '@/app/utils/formatters'
import type { StatusHistoricoAlteracaoPerfilInvestimentoEnum } from '@/enum/perfilInvestimento/StatusHistoricoAlteracaoPerfilInvestimentoEnum'
import type { StatusIdHistoricoAlteracaoPerfilInvestimentoEnum } from '@/enum/perfilInvestimento/StatusIdHistoricoAlteracaoPerfilInvestimentoEnum'

export default function CardSolicitacaoAlteracaoPerfil({
  handleHistoricoSolicitacoesAlteracaoPerfil
}: {
  handleHistoricoSolicitacoesAlteracaoPerfil: () => void
}) {
  const { ultimaSolicitacao, getUltimaSolicitacao, error } = useGetUltimaSolicitacao()
  const { user } = useAuth()
  const [isOpenDialogToken, setIsOpenDialogToken] = useState<boolean>(false)
  const [isCancelarSolicitacao, setIsCancelarSolicitacao] = useState<boolean>(false)
  const { statusCancelamento, cancelarSolicitacaoAlteracaoPerfil } = useCancelarSolicitacaoAlteracaoPerfilInvestimento()

  useEffect(() => {
    if (user) {
      getUltimaSolicitacao(user.cpf as string)
    }
  }, [user, statusCancelamento])

  return (
    <>
      <CardCustomized.Root>
        <CardCustomized.Header
          title={
            <Box className='flex flex-wrap-reverse gap-4 justify-between items-center mb-2'>
              <Typography variant='h4'>Solicitação de alteração de perfil mais recente</Typography>

              {!ultimaSolicitacao && !error ? (
                <Skeleton variant='rectangular' width={220} height={32} sx={{ borderRadius: '16px' }} />
              ) : error || !ultimaSolicitacao?.status ? null : (
                <Chip
                  variant='tonal'
                  label={getStatusHistoricoAlteracaoPerfilInvestimentoLabel(
                    ultimaSolicitacao?.status as
                      | StatusHistoricoAlteracaoPerfilInvestimentoEnum
                      | StatusIdHistoricoAlteracaoPerfilInvestimentoEnum
                      | string
                  )}
                  color={getStatusHistoricoAlteracaoPerfilInvestimentoColor(
                    ultimaSolicitacao?.status as
                      | StatusHistoricoAlteracaoPerfilInvestimentoEnum
                      | StatusIdHistoricoAlteracaoPerfilInvestimentoEnum
                      | string
                  )}
                />
              )}
            </Box>
          }
        />
        <CardCustomized.Content>
          {!ultimaSolicitacao && !error ? (
            <Skeleton variant='rounded' width={950} height={120} sx={{ borderRadius: '10px' }} />
          ) : ultimaSolicitacao && ultimaSolicitacao.status ? (
            <Card
              variant='outlined'
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem'
              }}
            >
              <Box>
                <Typography variant='body1'>Perfil solicitado:</Typography>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 700,
                    color: 'var(--mui-palette-text-primary)'
                  }}
                >
                  {ultimaSolicitacao?.perfilInvestimentoDescricao}
                </Typography>
                <Typography variant='body1'>
                  Solicitado em{' '}
                  {ultimaSolicitacao?.dt_solicitacao
                    ? formatarDataBR(ultimaSolicitacao.dt_solicitacao) +
                      ' às ' +
                      new Date(ultimaSolicitacao.dt_solicitacao).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : undefined}
                </Typography>
              </Box>

              <div className='flex-1 w-full flex justify-end'>
                <div className='w-full max-w-[650px] flex flex-wrap justify-end gap-4'>
                  {ultimaSolicitacao?.status && showButtonToken(ultimaSolicitacao?.status) && (
                    <ButtonCustomized
                      variant='contained'
                      color='primary'
                      onClick={() => {
                        setIsOpenDialogToken(true)
                      }}
                      startIcon={<i className='fa-kit fa-regular-envelope-key' />}
                      sx={{
                        maxWidth: '270px',
                        padding: '1.5rem 0.5rem'
                      }}
                    >
                      Validar solicitação
                    </ButtonCustomized>
                  )}

                  {ultimaSolicitacao?.status && showButtonCancelarSolicitacao(ultimaSolicitacao?.status) && (
                    <ButtonCustomized
                      variant='outlined'
                      color='error'
                      onClick={() => {
                        setIsCancelarSolicitacao(true)
                      }}
                      startIcon={<i className='fa-regular fa-trash' />}
                      sx={{
                        maxWidth: '270px',
                        padding: '1.5rem 0.5rem'
                      }}
                    >
                      Cancelar Solicitação
                    </ButtonCustomized>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card
              variant='outlined'
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '1.5rem',
                backgroundColor: 'rgb(var(--mui-mainColorChannels-gray))',
                padding: '1rem',
                height: '120.5px'
              }}
            >
              <Image
                src='/images/iris/solicitacao-nao-encontrada.svg'
                alt='Solicitação não encontrada'
                width={83.7}
                height={79}
              />
              <Typography variant='body1'>Nenhuma solicitação encontrada</Typography>
            </Card>
          )}
        </CardCustomized.Content>
        <CardCustomized.Footer>
          <div className='w-full'>
            <div className='max-w-[310px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='outlined'
                type='button'
                fullWidth
                onClick={handleHistoricoSolicitacoesAlteracaoPerfil}
              >
                Ver histórico de solicitações
              </ButtonCustomized>
            </div>
          </div>
        </CardCustomized.Footer>
      </CardCustomized.Root>

      <DialogToken
        cpf={user?.cpf || ''}
        isOpen={isOpenDialogToken}
        handleClose={() => {
          setIsOpenDialogToken(false)
        }}
        handleHistoricoSolicitacoes={() => {
          handleHistoricoSolicitacoesAlteracaoPerfil()
        }}
        email={user?.email || ''}
      />

      <DialogCancelarSolicitacao
        cpf={user?.cpf || ''}
        open={isCancelarSolicitacao}
        handleClose={() => setIsCancelarSolicitacao(false)}
        handleCancelarSolicitacaoAlteracaoPerfil={() => cancelarSolicitacaoAlteracaoPerfil(user?.cpf || '')}
      />
    </>
  )
}
