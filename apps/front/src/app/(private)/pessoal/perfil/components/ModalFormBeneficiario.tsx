'use client'

import { useEffect } from 'react'

import { MenuItem, Grid } from '@mui/material'

import type { Resolver } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import InputMask from 'react-input-mask'

import { zodResolver } from '@hookform/resolvers/zod'

import type {
  BeneficiarioCreateData,
  BeneficiarioUpdateData,
  BeneficiarioFormData
} from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'
import {
  beneficiarioUpdateSchema,
  beneficiarioCreateSchema,
  getGrauParentescoId,
  grauParentescoMap
} from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'

import EditableTextField from '@/@layouts/components/customized/EditableTextField'

import {
  formatarDataBR,
  formatarDataISO,
  formatarTelefoneBR,
  normalizarTelefone,
  normalizarCpf
} from '@/app/utils/formatters'

import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { validateCpf } from '@/utils/validations'
import { useConfirmDialog } from '@/@layouts/components/iris/ConfirmDialog'

type ModalFormBeneficiarioProps = {
  openModal: boolean
  handleCloseModal: (formData?: BeneficiarioUpdateData | BeneficiarioCreateData) => void
  selectedBeneficiario: BeneficiarioFormData | null
}

export function ModalFormBeneficiario({
  openModal,
  handleCloseModal,
  selectedBeneficiario
}: ModalFormBeneficiarioProps) {
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const {
    formState: { errors, isDirty, dirtyFields },
    reset,
    watch,
    control,
    setError,
    clearErrors
  } = useForm<BeneficiarioUpdateData | BeneficiarioCreateData>({
    resolver: zodResolver(
      selectedBeneficiario ? beneficiarioUpdateSchema : beneficiarioCreateSchema
    ) as unknown as Resolver<BeneficiarioUpdateData | BeneficiarioCreateData>,
    mode: 'onChange'
  })

  const handleCreate = async () => {
    const formValues = watch() as BeneficiarioCreateData
    const { nome, sexo, dtNascimento, invalido, email, celular, grauParentesco, cpf } = formValues
    const dataNascimentoBR = dtNascimento?.split(' ')[0] || dtNascimento

    if (!cpf?.trim()) {
      setError('cpf' as any, { message: 'CPF é obrigatório' })

      return
    }

    const cpfError = validateCpf(cpf)

    if (cpfError) {
      setError('cpf' as any, { message: cpfError })

      return
    } else {
      clearErrors('cpf' as any)
    }

    const formData = {
      nome,
      sexo,
      dtNascimento: formatarDataISO(dataNascimentoBR),
      invalido,
      email,
      celular: celular ? normalizarTelefone(celular) : null,
      grauParentesco: grauParentesco,
      cpf: normalizarCpf(cpf)
    }

    handleCloseModal(formData)
  }

  const handleUpdate = async () => {
    const { nome, sexo, dtNascimento, invalido, email, celular, grauParentesco } = watch()
    const dataNascimentoBR = dtNascimento?.split(' ')[0] || dtNascimento

    const formData = {
      nome,
      sexo,
      dtNascimento: formatarDataISO(dataNascimentoBR),
      invalido,
      email,
      celular: celular ? normalizarTelefone(celular) : null,
      grauParentesco: grauParentesco
    }

    handleCloseModal(formData)
  }

  const handleCpfBlur = () => {
    const formValues = watch() as BeneficiarioCreateData
    const { cpf } = formValues

    if (cpf?.trim()) {
      const errorMsg = validateCpf(cpf)

      if (errorMsg) {
        setError('cpf' as any, { message: errorMsg })
      } else {
        // Limpa o erro se o CPF for válido
        clearErrors('cpf' as any)
      }
    }
  }

  const handleCpfChange = (value: string) => {
    // Se o CPF estiver completo (11 dígitos), valida imediatamente
    const cleanCpf = value.replace(/\D/g, '')

    if (cleanCpf.length === 11) {
      const errorMsg = validateCpf(value)

      if (errorMsg) {
        setError('cpf' as any, { message: errorMsg })
      } else {
        clearErrors('cpf' as any)
      }
    } else if (cleanCpf.length < 11) {
      // Se o CPF não estiver completo, limpa o erro
      clearErrors('cpf' as any)
    }
  }

  const handleClose = async () => {
    if (isDirty) {
      const confirmed = await confirm(
        'Existem mudanças não salvas no formulário. Deseja realmente cancelar a edição e descartar as alterações feitas?',
        {
          title: 'Cancelar edição',
          confirmColor: 'error',
          confirmLabel: 'Descartar alterações',
          confirmIcon: 'fa-regular fa-xmark',
          cancelLabel: 'Voltar ao formulário'
        }
      )

      if (confirmed) {
        reset()
        handleCloseModal()
      }
    } else {
      reset()
      handleCloseModal()
    }
  }

  useEffect(() => {
    if (openModal && selectedBeneficiario) {
      const { nome, dtNascimento, sexo, grauParentesco, invalido, email, celular } = selectedBeneficiario

      reset({
        nome,
        dtNascimento: formatarDataBR(dtNascimento),
        sexo,
        grauParentesco: getGrauParentescoId(grauParentesco),
        invalido,
        email: email || undefined,
        celular: celular || undefined
      })
      clearErrors()
    } else if (openModal) {
      reset({
        nome: '',
        dtNascimento: '',
        sexo: undefined,
        grauParentesco: '',
        invalido: 'N',
        email: undefined,
        celular: undefined,
        cpf: ''
      })
      clearErrors()
    }
  }, [openModal, reset, selectedBeneficiario, clearErrors])

  return (
    <>
      <DialogCustomized
        id='modal-form-beneficiario'
        open={openModal}
        maxWidth='sm'
        fullWidth
        onClose={handleClose}
        title={selectedBeneficiario ? 'Edição de beneficiário' : 'Adição de Beneficiário'}
        actions={
          <div className='w-full'>
            <div className='w-full flex flex-col sm:flex-row items-start justify-start mt-4 gap-3'>
              <ButtonCustomized
                variant='contained'
                type='submit'
                className='flex-1'
                onClick={() => (selectedBeneficiario ? handleUpdate() : handleCreate())}
                disabled={!isDirty}
                startIcon={
                  selectedBeneficiario ? (
                    <i className='fa-regular fa-floppy-disk' />
                  ) : (
                    <i className='fa-regular fa-plus' />
                  )
                }
              >
                {selectedBeneficiario ? <>Salvar mudanças</> : <>Adicionar beneficiário</>}
              </ButtonCustomized>
              <ButtonCustomized
                variant='outlined'
                type='button'
                color='error'
                className='flex-1 m-auto sm:m-0'
                onClick={handleClose}
                startIcon={<i className='fa-regular fa-xmark' />}
              >
                Cancelar
              </ButtonCustomized>
            </div>
          </div>
        }
        content={
          <form>
            <Grid container spacing={{ xs: 2 }} columns={12}>
              <Grid item xs={12}>
                <Controller
                  name='nome'
                  control={control}
                  render={({ field }) => (
                    <EditableTextField
                      {...field}
                      label='Nome*'
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                      isDirty={dirtyFields['nome']}
                    />
                  )}
                />
              </Grid>
              {!selectedBeneficiario && (
                <Grid item xs={12}>
                  <Controller
                    name='cpf'
                    control={control}
                    render={({ field }) => (
                      <div className='form-field-wrapper'>
                        <InputMask
                          mask='999.999.999-99'
                          maskChar={null}
                          value={field.value || ''}
                          onChange={e => {
                            const value = e.target.value

                            field.onChange(value)

                            handleCpfChange(value)
                          }}
                          onBlur={handleCpfBlur}
                        >
                          {(inputProps: any) => (
                            <EditableTextField
                              {...inputProps}
                              label='CPF*'
                              error={!!(errors as any)?.cpf}
                              helperText={(errors as any)?.cpf?.message}
                              isDirty={(dirtyFields as any)?.cpf}
                            />
                          )}
                        </InputMask>
                      </div>
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Controller
                  name='grauParentesco'
                  control={control}
                  render={({ field }) => (
                    <EditableTextField
                      {...field}
                      select
                      label='Grau de parentesco*'
                      error={!!errors.grauParentesco}
                      helperText={errors.grauParentesco?.message}
                      isDirty={dirtyFields['grauParentesco']}
                    >
                      {Object.entries(grauParentescoMap).map(([id, texto]) => (
                        <MenuItem key={id} value={id}>
                          {texto}
                        </MenuItem>
                      ))}
                    </EditableTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='dtNascimento'
                  control={control}
                  render={({ field }) => (
                    <div className='form-field-wrapper'>
                      <InputMask
                        mask='99/99/9999'
                        maskChar={null}
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value

                          // Garante que a data está no formato DD/MM/AAAA
                          if (value.length === 10) {
                            const [day, month] = value.split('/')

                            if (parseInt(day) > 31 || parseInt(month) > 12) {
                              return
                            }
                          }

                          field.onChange(value)
                        }}
                        onBlur={field.onBlur}
                      >
                        {(inputProps: any) => (
                          <EditableTextField
                            {...inputProps}
                            label='Data de nascimento*'
                            error={!!errors.dtNascimento}
                            helperText={errors.dtNascimento?.message}
                            isDirty={dirtyFields['dtNascimento']}
                          />
                        )}
                      </InputMask>
                    </div>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='sexo'
                  control={control}
                  render={({ field }) => (
                    <EditableTextField
                      {...field}
                      select
                      label='Sexo*'
                      error={!!errors.sexo}
                      helperText={errors.sexo?.message}
                      isDirty={dirtyFields['sexo']}
                    >
                      <MenuItem value='M'>Masculino</MenuItem>
                      <MenuItem value='F'>Feminino</MenuItem>
                    </EditableTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='invalido'
                  control={control}
                  render={({ field }) => (
                    <EditableTextField
                      {...field}
                      select
                      label='Inválido'
                      error={!!errors.invalido}
                      helperText={errors.invalido?.message}
                      isDirty={dirtyFields['invalido']}
                    >
                      <MenuItem value='N'>Não</MenuItem>
                      <MenuItem value='S'>Sim</MenuItem>
                    </EditableTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <EditableTextField
                      {...field}
                      label='E-mail*'
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      isDirty={dirtyFields['email']}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='celular'
                  control={control}
                  render={({ field }) => (
                    <div className='form-field-wrapper'>
                      <EditableTextField
                        {...field}
                        label='Telefone*'
                        error={!!errors.celular}
                        helperText={errors.celular?.message}
                        value={formatarTelefoneBR(field?.value || '')}
                        onChange={e => {
                          const value = e.target.value

                          field.onChange(value)
                        }}
                        isDirty={dirtyFields['celular']}
                      />
                    </div>
                  )}
                />
              </Grid>
            </Grid>
          </form>
        }
      />

      {ConfirmDialog()}
    </>
  )
}
