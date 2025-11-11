import { useEffect, useState } from 'react'

import { Typography, Alert, Button, Grid } from '@mui/material'

import { aplicarMascaraDinheiro, formatarDataBR } from '@/app/utils/formatters'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { CardShowInternalInfo } from './CardShowInternalInfo'
import { useAuth } from '@/contexts/AuthContext'
import { ModalFormCargoEfetivo } from './ModalFormCargoEfetivo'
import { useGetPatrocinadoresSalario } from '@/hooks/participante/useGetPatrocinadoresSalario'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export function DadosOrgao() {
  const [openModal, setOpenModal] = useState(false)

  const { listPatrocinadoresSalario, error, getPatrocinadoresSalario } = useGetPatrocinadoresSalario()
  const { user } = useAuth()

  const handleRetry = async () => {
    try {
      await getPatrocinadoresSalario(user?.cpf || '')
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
    }
  }

  useEffect(() => {
    if (user?.cpf) {
      getPatrocinadoresSalario(user.cpf)
    }
  }, [getPatrocinadoresSalario, user])

  if (error) {
    return (
      <CardCustomized.Root>
        <CardCustomized.Header title='Dados no órgão' />
        <CardCustomized.Content>
          <div className='p-4'>
            <Alert
              severity='error'
              action={
                <Button color='inherit' size='small' onClick={handleRetry}>
                  Tentar Novamente
                </Button>
              }
            >
              {error || 'Erro ao recarregar dados'}
            </Alert>
          </div>
        </CardCustomized.Content>
      </CardCustomized.Root>
    )
  }

  return (
    <>
      <CardCustomized.Root>
        <CardCustomized.Header
          title={
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='h4' className='flex-1'>
                  Dados no órgão
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className='flex justify-end'>
                <ButtonCustomized
                  variant='outlined'
                  size='small'
                  className='w-[250px]'
                  startIcon={<i className='fa-regular fa-pencil' />}
                  onClick={() => {
                    setOpenModal(true)
                  }}
                >
                  Editar cargo efetivo
                </ButtonCustomized>
              </Grid>
            </Grid>
          }
        />
        <CardCustomized.Content>
          <Grid container spacing={{ xs: 2, md: 4 }} columns={12}>
            {listPatrocinadoresSalario?.patrocinadores && listPatrocinadoresSalario?.patrocinadores.length > 0 ? (
              listPatrocinadoresSalario?.patrocinadores.map(patrocinador => (
                <Grid item xs={12} md={6} key={patrocinador.id}>
                  <CardShowInternalInfo
                    title={patrocinador.sigla}
                    subtitle={patrocinador.nmCargo.toLocaleLowerCase()}
                    internalInfos={[
                      {
                        legend: 'Início de exercício',
                        text: formatarDataBR(patrocinador.dtExercicio) || patrocinador.dtExercicio
                      },
                      {
                        legend: 'Data da inscrição',
                        text: formatarDataBR(patrocinador.dtInscricaoPlano) || patrocinador.dtInscricaoPlano
                      },
                      {
                        legend: 'Remuneração no órgão',
                        text: `${aplicarMascaraDinheiro(patrocinador.salario)}`
                      }
                    ]}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <div className='p-8 text-center'>
                  <Alert
                    severity='warning'
                    sx={{
                      '&.MuiPaper-root .MuiAlert-icon': {
                        color: '#FFF'
                      }
                    }}
                  >
                    Nenhum patrocinador encontrado
                  </Alert>
                </div>
              </Grid>
            )}
          </Grid>
        </CardCustomized.Content>
      </CardCustomized.Root>

      <ModalFormCargoEfetivo
        cpf={user?.cpf || ''}
        listPatrocinadores={listPatrocinadoresSalario?.patrocinadores || []}
        openModal={openModal}
        handleCloseModal={() => {
          getPatrocinadoresSalario(user?.cpf || '')
          setOpenModal(false)
        }}
      />
    </>
  )
}
