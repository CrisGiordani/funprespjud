import { useCallback, useEffect, useState } from 'react'

import { Card, Typography, Alert, Button, Grid, Skeleton } from '@mui/material'

import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'
import type { PercentualContribuicaoResponseType } from '@/types/contribuicoes/contribuicoes.type'
import { ContribuicoesService } from '@/services/ContribuicoesService'
import { CardIconTextLabel } from '@/app/components/common/CardIconTextLabel'
import { formatPercentage } from '@/app/utils/formatters'

export function DadosPercentuais() {
  const [percentualContribuicao, setPercentualContribuicao] = useState<PercentualContribuicaoResponseType>({
    percentualNormal: 0,
    percentualFacultativa: 0
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  const handleGetPercentualContribuicao = useCallback(async () => {
    setLoading(true)
    if (!user?.cpf) return

    await ContribuicoesService.getPercentualContribuicao({ participanteId: user.cpf })
      .then(response => {
        setPercentualContribuicao(response)
      })
      .catch(error => {
        console.error('Erro ao buscar Percentual de Contribuição:', error)
        setError(error as string)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user?.cpf])

  useEffect(() => {
    handleGetPercentualContribuicao()
  }, [handleGetPercentualContribuicao])

  if (error) {
    return (
      <Card className='overflow-visible p-4'>
        <div className='flex items-center justify-center p-4'>
          <Typography variant='h4' sx={{ color: 'gray' }}>
            Percentual de Contribuição
          </Typography>
        </div>
        <div className='p-4'>
          <Alert
            severity='error'
            action={
              <Button color='inherit' size='small' onClick={handleGetPercentualContribuicao}>
                Tentar Novamente
              </Button>
            }
          >
            {error}
          </Alert>
        </div>
      </Card>
    )
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Percentual de contribuição atual' />
      <CardCustomized.Content>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item sm={12} md={6}>
            {loading ? (
              <Skeleton variant='rounded' width={'100%'} height={'125px'} />
            ) : (
              <CardIconTextLabel
                titulo={'Contribuição mensal (%)'}
                valor={formatPercentage(percentualContribuicao.percentualNormal, 1)}
                icon={'fa-kit fa-pay-ran'}
                valorNegrito={false}
                iconeComBG
                descricao='Percentual de contribuição mensal, conforme o seu perfil de participante (patrocinado ou vinculado).'
              />
            )}
          </Grid>
          <Grid item sm={12} md={6}>
            {loading ? (
              <Skeleton variant='rounded' width={'100%'} height={'125px'} />
            ) : (
              <CardIconTextLabel
                titulo={'Contribuição facultativa mensal (%)'}
                valor={formatPercentage(percentualContribuicao.percentualFacultativa, 1)}
                icon={'fa-kit fa-pay-ras'}
                valorNegrito={false}
                iconeComBG
              />
            )}
          </Grid>
        </Grid>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
