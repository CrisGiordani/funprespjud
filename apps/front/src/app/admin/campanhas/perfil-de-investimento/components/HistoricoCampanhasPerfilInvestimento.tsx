'use client'

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'

import { useRouter } from 'next/navigation'

import type { ChipProps, ListProps } from '@mui/material'
import { Chip, List, ListItem, styled, Typography } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'
import { statusCampanha } from '@/types/perfilInvestimento/CampanhaType'
import { useGetAllCampanhasInvestimento } from '@/hooks/campanhas/useGetAllCampanhasInvestimento'
import { formatarDataBR } from '@/app/utils/formatters'
import PaginationIris from '@/app/components/iris/PaginationIris'
import { DialogCampanha } from './DialogCampanha'
import { StatusCampanhaPerfilInvestimentoEnum } from '@/enum/campanha/StatusCampanhaPerfilInvestimentoEnum'
import { useAuth } from '@/contexts/AuthContext'
import type { UserType } from '@/types/UserType'
import DialogConfirmeSenha from '@/app/components/perfilInvestimento/questionario/DialogConfirmeSenha'
import { useDeleteCampanhaPerfilInvestimento } from '@/hooks/campanhas/useDeleteCampanhaPerfilInvestimento'
import CustomIconButton from '@/@core/components/mui/IconButton'

export interface HistoricoCampanhasPerfilInvestimentoRef {
  recarregarLista: () => void
}

export const HistoricoCampanhasPerfilInvestimento = forwardRef<HistoricoCampanhasPerfilInvestimentoRef>(
  (props, ref) => {
    const { user } = useAuth()
    const [openEditar, setOpenEditar] = useState<boolean>(false)
    const [campanha, setCampanha] = useState<CampanhaType | null>(null)
    const router = useRouter()
    const [openConfirmeSenha, setOpenConfirmeSenha] = useState<boolean>(false)
    const { listaCampanhas, getAllCampanhasInvestimento, changePage, currentPage } = useGetAllCampanhasInvestimento()
    const { deleteCampanhaPerfilInvestimento } = useDeleteCampanhaPerfilInvestimento()

    // const [pageIndex, setPageIndex] = useState<number>(0)

    useEffect(() => {
      getAllCampanhasInvestimento()
    }, [getAllCampanhasInvestimento])

    // Expõe a função de recarregamento para o componente pai
    useImperativeHandle(ref, () => ({
      recarregarLista: () => {
        getAllCampanhasInvestimento()
      }
    }))

    const handleChangePaginacao = (_: React.ChangeEvent<unknown>, value: number) => {
      changePage(value - 1) // PaginationIris usa base 1, mas nossa API usa base 0
    }

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

    const selectedCampanha = (campanha: CampanhaType) => {
      // Só permite clique para campanhas em andamento ou finalizadas
      if (campanha.status === StatusCampanhaPerfilInvestimentoEnum.ANDAMENTO || 
          campanha.status === StatusCampanhaPerfilInvestimentoEnum.FINALIZADA) {
        // Via sessionStorage (recomendada para objetos complexos)
        sessionStorage.setItem('selectedCampanha', JSON.stringify(campanha))
        router.push(`/admin/campanhas/${campanha.idCampanha}`)
      }
    }

    return (
      <div className='w-full h-full flex flex-col'>
        <div className='flex-grow'>
          <StyledList className='w-full p-0 rounded-2xl h-[430px] max-h-[430px] overflow-y-auto'>
            {listaCampanhas.campanhas.map(campanha => {
              const isClickable = campanha.status === StatusCampanhaPerfilInvestimentoEnum.ANDAMENTO || 
                                 campanha.status === StatusCampanhaPerfilInvestimentoEnum.FINALIZADA
              
              return (
                <ListItem
                  key={`${campanha.idCampanha}-${campanha.descricao}`}
                  className={`flex flex-wrap justify-between items-center p-4 border-gray-300 ${
                    isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div
                    className={`flex-1 flex flex-wrap justify-start items-center gap-4 ${
                      isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                    onClick={() => selectedCampanha(campanha)}
                  >
                  <Chip
                    variant='tonal'
                    label={statusCampanha[campanha?.status ?? 'null'].label}
                    color={statusCampanha[campanha?.status ?? 'null'].color as ChipProps['color']}
                    className={`rounded-full w-[235px]`}
                  />

                  <div>
                    <Typography variant='body1'>
                      <span className='font-bold'>{campanha.descricao}</span>
                    </Typography>
                    <Typography variant='body1'>Inicio: {formatarDataBR(campanha.dt_inicio)}</Typography>
                    <Typography variant='body1'>Fim: {formatarDataBR(campanha.dt_fim)}</Typography>
                  </div>
                </div>

                {/* <div className='flex-1 flex justify-between items-center pl-16 gap-2'>
                  <i>Criada por: #CPF/CNPJ: 1234567890</i>
                </div> */}

                <div className='flex flex-row gap-2 items-center'>
                  {campanha?.status !== StatusCampanhaPerfilInvestimentoEnum.FINALIZADA && (
                    <ButtonCustomized
                      className='rounded-full p-6'
                      color='primary'
                      variant='outlined'
                      onClick={() => {
                        setOpenEditar(true), setCampanha(campanha)
                      }}
                      startIcon={<i className='fa-regular fa-pencil text-lg'></i>}
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

                  {campanha?.status === StatusCampanhaPerfilInvestimentoEnum.AGENDADA && (
                    <ButtonCustomized
                      className='rounded-full p-6'
                      color='error'
                      variant='outlined'
                      onClick={() => {
                        setOpenConfirmeSenha(true)
                        setCampanha(campanha)
                      }}
                      startIcon={<i className='fa-regular fa-trash text-lg'></i>}
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

                  {campanha?.status !== StatusCampanhaPerfilInvestimentoEnum.AGENDADA && (
                    <CustomIconButton
                      aria-label='capture screenshot'
                      color='primary'
                      onClick={() => selectedCampanha(campanha)}
                      size='small'
                      disableRipple
                      sx={{
                        '&:hover': {
                          backgroundColor: 'transparent !important'
                        }
                      }}
                    >
                      <i className='fa-regular fa-chevron-right text-gray-600'></i>
                    </CustomIconButton>
                  )}
                </div>
              </ListItem>
              )
            })}
          </StyledList>
          <div className='w-full flex flex-col items-center justify-center mt-4 pt-4 pb-4  '>
            <PaginationIris
              totalPaginas={listaCampanhas.totalPages || 1}
              page={currentPage + 1} // PaginationIris usa base 1
              handleChange={handleChangePaginacao}
            />
          </div>
        </div>

        <DialogCampanha
          user={user as UserType}
          open={openEditar}
          onCampanhaCreated={() => getAllCampanhasInvestimento()}
          handleClose={() => setOpenEditar(false)}
          campanha={campanha || null}
        />

        <DialogConfirmeSenha
          cpf={user?.cpf || ''}
          open={openConfirmeSenha}
          handleClose={() => setOpenConfirmeSenha(false)}
          onSuccess={() => {
            setOpenConfirmeSenha(false)
            deleteCampanhaPerfilInvestimento(campanha as CampanhaType)
            getAllCampanhasInvestimento()
          }}
          descricao='Para excluir a campanha, precisamos confirmar sua identidade. Por favor, insira sua senha no campo abaixo.'
        />
      </div>
    )
  }
)
