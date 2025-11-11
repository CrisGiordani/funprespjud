import { useEffect } from 'react'

import {
  Card,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Alert,
  Button
} from '@mui/material'

import useGetPlanos from '@/hooks/participante/useGetPlanos'
import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { TooltipInfo } from '@/app/components/common/TooltipInfo'
import { formatarDataBR } from '@/app/utils/formatters'

export function DadosPlanos() {
  const { listPlanos, error, getPlanos } = useGetPlanos()
  const { user } = useAuth()

  const handleRetry = async () => {
    try {
      await getPlanos(user?.cpf || '')
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
    }
  }

  useEffect(() => {
    if (user?.cpf) {
      getPlanos(user.cpf)
    }
  }, [getPlanos, user])

  if (error) {
    return (
      <Card className='overflow-visible p-4'>
        <div className='flex items-center justify-center p-4'>
          <Typography variant='h4' sx={{ color: 'gray' }}>
            Planos
          </Typography>
        </div>
        <div className='p-4'>
          <Alert
            severity='error'
            action={
              <Button color='inherit' size='small' onClick={handleRetry}>
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

  const getChitColorMap = new Map<string, 'success' | 'default'>([
    ['ATIVO', 'success'],
    ['INATIVO', 'default']
  ])

  const getSituacaoLabel = (situacao: string) => {
    switch (situacao.toUpperCase()) {
      case 'PATROCINADO':
        return 'Patrocinado'
      case 'VINCULADO':
        return 'Vinculado'
      default:
        return situacao
    }
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title='Situações do plano'
        subheader={
          listPlanos && listPlanos.length > 0 ? (
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
              CNPB: {listPlanos[0].cnpb}
              <TooltipInfo
                descriptionTooltip='O número do CNPB é o código de identificação do plano de previdência complementar, atribuído pela Superintendência Nacional de Previdência Complementar (PREVIC).'
                className='ml-1 text-xl'
              />
            </Typography>
          ) : null
        }
      />
      <CardCustomized.Content>
        {listPlanos && listPlanos.length > 0 ? (
          <TableContainer sx={{ borderRadius: 1, border: '1px solid #EEE' }}>
            <Table
              size='small'
              sx={{
                '& .MuiTableCell-root': {
                  textAlign: 'center',
                  padding: '16px',
                  fontSize: '16px'
                }
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main', color: 'common.white' }}>
                  <TableCell sx={{ color: 'common.white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'common.white' }}>Órgão</TableCell>
                  <TableCell sx={{ color: 'common.white' }}>Inscrição</TableCell>
                  <TableCell sx={{ color: 'common.white' }}>Tipo</TableCell>
                </TableRow>
              </TableHead>

              <TableBody className='table-border-bottom-0'>
                {listPlanos.map((plano, index) => (
                  <TableRow key={index} sx={{ border: '1px solid #EEE' }}>
                    <TableCell>
                      <span className='fw-medium'>
                        <Chip
                          variant='tonal'
                          color={getChitColorMap.get(plano.categoria)}
                          label={plano.categoria.toLocaleLowerCase()}
                          sx={{
                            width: '100%',
                            justifyContent: 'center',
                            textTransform: 'capitalize'
                          }}
                        />
                      </span>
                    </TableCell>
                    <TableCell>{plano.orgao}</TableCell>
                    <TableCell>{formatarDataBR(plano.dtInscricao)}</TableCell>
                    <TableCell>{getSituacaoLabel(plano.situacao)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className='p-8 text-center'>
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
              Nenhum plano encontrado
            </Typography>
            <Button variant='outlined' onClick={handleRetry} sx={{ mt: 2 }}>
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
