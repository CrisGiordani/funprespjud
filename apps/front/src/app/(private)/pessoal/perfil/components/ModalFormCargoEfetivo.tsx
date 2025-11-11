'use client'

import { useEffect } from 'react'

import { MenuItem, Typography, FormControl, InputLabel, Select, Grid } from '@mui/material'

import type { Resolver } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import type {
  BeneficiarioCreateData,
  BeneficiarioUpdateData
} from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'

import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import type { CargoEfetivoData } from '../schemas/CargoEfetivoSchema'
import { cargoEfetivoSchema } from '../schemas/CargoEfetivoSchema'
import useGetCargos from '@/hooks/patrocinador/useGetCargos'
import { useUpdateCargoEfetivo } from '@/hooks/participante/useUpdateCargoEfetivo'

type ModalFormBeneficiarioProps = {
  cpf: string
  listPatrocinadores: any[]
  openModal: boolean
  handleCloseModal: (formData?: BeneficiarioUpdateData | BeneficiarioCreateData) => void
}

export function ModalFormCargoEfetivo({
  cpf,
  listPatrocinadores,
  openModal,
  handleCloseModal
}: ModalFormBeneficiarioProps) {
  const {
    formState: { errors, isDirty, isValid },
    reset,
    control,
    handleSubmit
  } = useForm<CargoEfetivoData>({
    resolver: zodResolver(cargoEfetivoSchema) as Resolver<CargoEfetivoData>,
    mode: 'onChange',
    defaultValues: {
      cargos:
        listPatrocinadores?.reduce(
          (acc, patrocinador) => {
            const idPessoa = patrocinador.idPessoa || patrocinador.id

            if (idPessoa && patrocinador.idCargo) {
              acc[idPessoa] = patrocinador.idCargo
            }

            return acc
          },
          {} as Record<string, string>
        ) || {}
    }
  })

  const { cargos, getCargos } = useGetCargos()
  const { updateCargoEfetivo } = useUpdateCargoEfetivo()

  useEffect(() => {
    getCargos(cpf)
  }, [getCargos, cpf])

  useEffect(() => {
    if (openModal) {
      const defaultValues = {
        cargos:
          listPatrocinadores?.reduce(
            (acc, patrocinador) => {
              const idPessoa = patrocinador.idPessoa || patrocinador.id

              if (idPessoa && patrocinador.idCargo) {
                acc[idPessoa] = patrocinador.idCargo
              }

              return acc
            },
            {} as Record<string, string>
          ) || {}
      }

      reset(defaultValues)
    }
  }, [openModal, listPatrocinadores, reset])

  const onSubmit = async (data: CargoEfetivoData) => {
    const response = await updateCargoEfetivo(cpf, data.cargos)

    if (response.success) {
      handleCloseModal()
    }
  }

  return (
    <DialogCustomized
      id='modal-form-cargo-efetivo'
      open={openModal}
      maxWidth='sm'
      fullWidth
      onClose={() => {
        reset()
        handleCloseModal()
      }}
      title='Cargo efetivo'
      content={
        <form>
          <div className='grid grid-cols-12 gap-2'>
            <Typography variant='body1' className='col-span-12'>
              Selecione seu cargo efetivo em cada um de seus órgãos
            </Typography>
            <div className='col-span-12 space-y-4'>
              {listPatrocinadores?.map((patrocinador, index) => (
                <div key={patrocinador.idPessoa || patrocinador.id || index} className='form-field-wrapper'>
                  <Typography variant='subtitle1' className='mb-2 font-medium'>
                    {patrocinador.nome || patrocinador.nmPatrocinador}
                  </Typography>
                  <Controller
                    name={`cargos.${patrocinador.idPessoa || patrocinador.id}`}
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        variant='filled'
                        fullWidth
                        error={!!errors.cargos?.[patrocinador.idPessoa || patrocinador.id]}
                      >
                        <InputLabel>Cargo Efetivo</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ''}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left'
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left'
                            },
                            PaperProps: {
                              style: {
                                maxHeight: 300
                              }
                            }
                          }}
                        >
                          {cargos.map(cargo => (
                            <MenuItem key={cargo.idCargo} value={cargo.idCargo}>
                              {cargo.nmCargo}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.cargos?.[patrocinador.id] && (
                          <div className='text-red-500 text-sm mt-1'>{errors.cargos[patrocinador.id]?.message}</div>
                        )}
                      </FormControl>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      }
      actions={
        <div className='w-full'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ButtonCustomized
                className='flex-1'
                variant='contained'
                type='submit'
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || !isDirty}
              >
                <i className='fa-regular fa-floppy-disk mr-2' />
                Salvar mudanças
              </ButtonCustomized>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonCustomized
                className='flex-1'
                variant='outlined'
                type='button'
                color='error'
                onClick={() => {
                  reset()
                  handleCloseModal()
                }}
              >
                <i className='fa-regular fa-xmark mr-2' />
                Cancelar
              </ButtonCustomized>
            </Grid>
          </Grid>
        </div>
      }
    />
  )
}
