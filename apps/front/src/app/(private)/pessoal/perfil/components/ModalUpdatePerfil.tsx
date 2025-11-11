import { useState, useEffect, useRef } from 'react'

import { Button, CircularProgress, MenuItem, Typography, Grid } from '@mui/material'

import type { Resolver } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import InputMask from 'react-input-mask'

import { zodResolver } from '@hookform/resolvers/zod'

import EditableTextField from '@/@layouts/components/customized/EditableTextField'
import type {
  EstadoCivil,
  Nacionalidade,
  ParticipanteFormData,
  UF
} from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'
import {
  ESTADO_CIVIL_NOME,
  NACIONALIDADE_NOME,
  participanteSchema,
  UFS_BRASIL
} from '@/app/(private)/pessoal/perfil/schemas/ParticipanteSchema'

import { formatarTelefoneBR } from '@/app/utils/formatters'
import { useConfirmDialog } from '@/@layouts/components/iris/ConfirmDialog'
import useUpdateParticipante from '@/hooks/participante/useUpdateParticipante'
import { fileToUrl } from '@/utils/file'
import { AvatarCustomized } from '@/components/ui/AvatarCustomized'
import type { ModalUpdatePerfilProps } from '@/types/perfil/perfil'
import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import type { ParticipanteType } from '@/hooks/participante/useGetParticipante'

export default function ModalUpdatePerfil({
  participanteId,
  openModal,
  setOpenModal,
  participante,
  onUpdate,
  showToast
}: ModalUpdatePerfilProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { error: errorUpdate, updateParticipante } = useUpdateParticipante()

  const {
    formState: { errors, isDirty, dirtyFields, defaultValues },
    reset,
    watch,
    control,
    trigger
  } = useForm<ParticipanteType>({
    resolver: zodResolver(participanteSchema) as Resolver<ParticipanteType>,
    defaultValues: {
      ...participante,
      estadoCivil: participante.estadoCivil as EstadoCivil,
      ufRg: participante.ufRg as UF,
      ufNaturalidade: participante.ufNaturalidade as UF,
      uf: participante.uf as UF,
      nacionalidade: participante.nacionalidade as Nacionalidade,
      fotoPerfil: participante.fotoPerfil
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const onSubmit = async (data: ParticipanteFormData) => {
    try {
      setIsSubmitting(true)

      const updatedData: ParticipanteFormData = {
        ...participante, // manter dados não editados
        ...data, // sobrescrever com dados editados
        dataNascimento: data.dataNascimento || participante.dataNascimento,
        dataExpedicao: data.dataExpedicao || participante.dataExpedicao,
        telefoneResidencial: formatarTelefoneBR(data.telefoneResidencial || participante.telefoneResidencial),
        telefoneCelular: formatarTelefoneBR(data.telefoneCelular || participante.telefoneCelular),
        cep: data.cep || participante.cep,
        fotoPerfil: data.fotoPerfil || participante.fotoPerfil
      }

      const response = await updateParticipante(participanteId, updatedData)

      if (response?.success) {
        showToast('Dados atualizados com sucesso!', 'success')
        handleClose({ resetForm: true })
      }

      if (onUpdate) {
        onUpdate()
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados. Por favor, tente novamente.'

      showToast(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = async ({ resetForm }: { resetForm: boolean }) => {
    if (isDirty && !resetForm) {
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
        reset(participante)
        setOpenModal(false)
      }
    } else {
      reset(participante)
      setOpenModal(false)
    }
  }

  const handleSave = async () => {
    const formData = watch()

    try {
      const isValid = await trigger()

      if (!isValid) {
        return
      }

      await onSubmit(formData)
    } catch (error) {
      console.error('Error in handleSave:', error)
    }
  }

  const renderTextField = (name: keyof ParticipanteFormData, label: string, field: any, error?: any) => (
    <div className='form-field-wrapper'>
      <EditableTextField
        {...field}
        label={label}
        error={!!error}
        helperText={error?.message}
        isDirty={dirtyFields[name]}
      />
    </div>
  )

  const fotoPerfilWatch = watch('fotoPerfil')

  useEffect(() => {
    if (openModal) {
      reset({
        ...participante,
        estadoCivil: participante.estadoCivil as EstadoCivil,
        ufRg: participante.ufRg as UF,
        ufNaturalidade: participante.ufNaturalidade as UF,
        uf: participante.uf as UF,
        nacionalidade: participante.nacionalidade as Nacionalidade
      })
    }
  }, [openModal, reset, participante])

  useEffect(() => {
    if (errorUpdate) {
      showToast(errorUpdate, 'error')
    }
  }, [errorUpdate, showToast])

  return (
    <>
      <DialogCustomized
        id='modal-update-perfil'
        open={openModal}
        onClose={() => handleClose({ resetForm: false })}
        title={'Edição de informações'}
        textAlign='left'
        fullWidth
        maxWidth='lg'
        content={
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSave()
            }}
            noValidate
          >
            <div className='flex flex-col gap-4'>
              <div className='flex md:flex-row flex-col justify-start items-start gap-4'>
                <div className='w-[180px] flex flex-col items-center justify-center relative gap-3'>
                  <Controller
                    name='fotoPerfil'
                    control={control}
                    defaultValue={participante.fotoPerfil}
                    render={({ field: { onChange, onBlur, name, value } }) => (
                      <>
                        <input
                          ref={fileInputRef}
                          type='file'
                          accept='image/png, image/jpeg, image/jpg'
                          name={name}
                          style={{ display: 'none' }}
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              onChange(e.target.files[0])
                            } else {
                              onChange(null)
                            }
                          }}
                          onBlur={onBlur}
                        />
                        <div className={`w-[180px] h-[180px]`}>
                          <AvatarCustomized
                            alt={participante.nome}
                            src={value && typeof value !== 'string' ? fileToUrl(value) : value || ''}
                          />
                        </div>

                        {errors.fotoPerfil && (
                          <Typography variant='body2' color='error'>
                            {errors.fotoPerfil.message}
                          </Typography>
                        )}
                        <div>
                          <Button
                            fullWidth
                            variant='outlined'
                            type='button'
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <>
                              <i className='fa-regular fa-camera mr-2'></i>
                              {participante.fotoPerfil ? 'Trocar foto' : 'Enviar foto'}
                            </>
                          </Button>
                          <div className='text-xs text-primary-main mt-2'>
                            Tipos de arquivos permitidos: PNG, JPEG ou JPG até 3MG
                          </div>
                        </div>
                      </>
                    )}
                  />
                </div>
                <div>
                  <div className='mb-3'>
                    <Typography variant='h5'>DADOS PESSOAIS</Typography>
                  </div>

                  <Grid container spacing={{ xs: 2, md: 3 }} columns={12}>
                    <Grid item xs={12}>
                      <Controller
                        name='nome'
                        control={control}
                        defaultValue={participante.nome}
                        render={({ field }) => renderTextField('nome', 'Nome do Participante', field, errors.nome)}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='dataNascimento'
                        control={control}
                        defaultValue={participante.dataNascimento}
                        render={({ field }) =>
                          renderTextField('dataNascimento', 'Data de nascimento', field, errors.nome)
                        }
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='sexo'
                        control={control}
                        render={({ field }) => (
                          <EditableTextField
                            {...field}
                            select
                            label='Sexo'
                            defaultValue={participante.sexo}
                            disabled={true}
                          >
                            <MenuItem value='Masculino'>Masculino</MenuItem>
                            <MenuItem value='Feminino'>Feminino</MenuItem>
                            <MenuItem value='Não informado'>Não informado</MenuItem>
                          </EditableTextField>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='rg'
                        control={control}
                        defaultValue={participante.rg}
                        render={({ field }) => renderTextField('rg', 'RG', field, errors.rg)}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='emissorRg'
                        control={control}
                        defaultValue={participante.emissorRg || ''}
                        disabled={true}
                        render={({ field, fieldState: { error } }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              label='Órgão Expedidor'
                              error={!!error}
                              helperText={error?.message}
                              isDirty={dirtyFields['emissorRg']}
                            />
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='ufRg'
                        disabled={true}
                        control={control}
                        render={({ field }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              select
                              label='UF do Expedidor'
                              error={!!errors.ufRg}
                              helperText={errors.ufRg?.message}
                              isDirty={dirtyFields['ufRg']}
                            >
                              {UFS_BRASIL.map(uf => (
                                <MenuItem key={uf} value={uf}>
                                  {uf}
                                </MenuItem>
                              ))}
                            </EditableTextField>
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='dataExpedicao'
                        disabled={true}
                        control={control}
                        render={({ field }) => (
                          <InputMask
                            mask='99/99/9999'
                            disabled={true}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          >
                            {(inputProps: any) => (
                              <EditableTextField
                                {...inputProps}
                                label='Data da Expedição'
                                disabled={true}
                                error={!!errors.dataExpedicao}
                                helperText={errors.dataExpedicao?.message}
                                isDirty={dirtyFields['dataExpedicao']}
                              />
                            )}
                          </InputMask>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='estadoCivil'
                        control={control}
                        render={({ field }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              select
                              label='Estado civil'
                              error={!!errors.estadoCivil}
                              helperText={errors.estadoCivil?.message}
                              isDirty={dirtyFields['estadoCivil']}
                            >
                              {Object.entries(ESTADO_CIVIL_NOME).map(([code, name]) => (
                                <MenuItem key={code} value={code}>
                                  {name}
                                </MenuItem>
                              ))}
                            </EditableTextField>
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='nacionalidade'
                        control={control}
                        render={({ field }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              select
                              label='Nacionalidade'
                              error={!!errors.nacionalidade}
                              helperText={errors.nacionalidade?.message}
                              isDirty={dirtyFields['nacionalidade']}
                            >
                              {Object.entries(NACIONALIDADE_NOME).map(([code, name]) => (
                                <MenuItem key={code} value={code}>
                                  {name}
                                </MenuItem>
                              ))}
                            </EditableTextField>
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='naturalidade'
                        control={control}
                        defaultValue={participante.naturalidade?.split('/')[0] || ''}
                        render={({ field, fieldState: { error } }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              label='Naturalidade'
                              error={!!error}
                              helperText={error?.message}
                              isDirty={dirtyFields['naturalidade']}
                            />
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='ufNaturalidade'
                        control={control}
                        render={({ field }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              select
                              label='UF da Naturalidade'
                              error={!!errors.ufNaturalidade}
                              helperText={errors.ufNaturalidade?.message}
                              isDirty={dirtyFields['ufNaturalidade']}
                            >
                              {UFS_BRASIL.map(uf => (
                                <MenuItem key={uf} value={uf}>
                                  {uf}
                                </MenuItem>
                              ))}
                            </EditableTextField>
                          </div>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name='nomeMae'
                        control={control}
                        defaultValue={participante.nomeMae}
                        render={({ field }) => renderTextField('nomeMae', 'Nome da mãe', field, errors.nomeMae)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name='nomePai'
                        control={control}
                        defaultValue={participante.nomePai}
                        render={({ field }) => renderTextField('nomePai', 'Nome do pai', field, errors.nomePai)}
                      />
                    </Grid>
                  </Grid>

                  <div className='mb-3 mt-4'>
                    <Typography variant='h5'>ENDEREÇO</Typography>
                  </div>

                  <Grid container spacing={{ xs: 2, md: 3 }} columns={12}>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='cep'
                        control={control}
                        defaultValue={participante.cep}
                        render={({ field, fieldState: { error } }) => (
                          <div className='form-field-wrapper'>
                            <InputMask
                              mask='99999-999'
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            >
                              {(inputProps: any) => (
                                <EditableTextField
                                  {...inputProps}
                                  label='CEP'
                                  error={!!error}
                                  helperText={error?.message}
                                  isDirty={dirtyFields['cep']}
                                />
                              )}
                            </InputMask>
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='uf'
                        control={control}
                        render={({ field }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              select
                              label='UF'
                              error={!!errors.uf}
                              helperText={errors.uf?.message}
                              isDirty={dirtyFields['uf']}
                            >
                              {UFS_BRASIL.map(uf => (
                                <MenuItem key={uf} value={uf}>
                                  {uf}
                                </MenuItem>
                              ))}
                            </EditableTextField>
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='cidade'
                        control={control}
                        defaultValue={participante.cidade}
                        render={({ field }) => renderTextField('cidade', 'Cidade', field, errors.cidade)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='bairro'
                        control={control}
                        defaultValue={participante.bairro}
                        render={({ field }) => renderTextField('bairro', 'Bairro', field, errors.bairro)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={9}>
                      <Controller
                        name='logradouro'
                        control={control}
                        defaultValue={participante.logradouro}
                        render={({ field }) => renderTextField('logradouro', 'Logradouro', field, errors.logradouro)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='numero'
                        control={control}
                        defaultValue={participante.numero}
                        render={({ field }) => renderTextField('numero', 'Número', field, errors.numero)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={9}>
                      <Controller
                        name='complemento'
                        control={control}
                        defaultValue={participante.complemento}
                        render={({ field }) => renderTextField('complemento', 'Complemento', field, errors.complemento)}
                      />
                    </Grid>
                  </Grid>

                  <div className='mb-3 mt-4'>
                    <Typography variant='h5'>CONTATO</Typography>
                  </div>

                  <Grid container spacing={{ xs: 2, md: 3 }} columns={12}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name='emailPrincipal'
                        control={control}
                        defaultValue={participante.emailPrincipal}
                        render={({ field }) =>
                          renderTextField('emailPrincipal', 'E-mail principal', field, errors.emailPrincipal)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name='emailAlternativo1'
                        control={control}
                        defaultValue={participante.emailAlternativo1}
                        render={({ field }) =>
                          renderTextField('emailAlternativo1', 'E-mail alternativo', field, errors.emailAlternativo1)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name='emailAlternativo2'
                        control={control}
                        defaultValue={participante.emailAlternativo2}
                        render={({ field }) =>
                          renderTextField('emailAlternativo2', 'E-mail alternativo', field, errors.emailAlternativo2)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='telefoneResidencial'
                        control={control}
                        render={({ field }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              label='Telefone residencial'
                              error={!!errors.telefoneResidencial}
                              helperText={errors.telefoneResidencial?.message}
                              value={formatarTelefoneBR(field.value)}
                              onChange={e => {
                                const value = e.target.value

                                field.onChange(value)
                              }}
                              isDirty={dirtyFields['telefoneResidencial']}
                            />
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name='telefoneCelular'
                        control={control}
                        render={({ field }) => (
                          <div className='form-field-wrapper'>
                            <EditableTextField
                              {...field}
                              label='Telefone celular'
                              error={!!errors.telefoneCelular}
                              helperText={errors.telefoneCelular?.message}
                              value={formatarTelefoneBR(field.value)}
                              onChange={e => {
                                const value = e.target.value

                                field.onChange(value)
                              }}
                              isDirty={dirtyFields['telefoneCelular']}
                            />
                          </div>
                        )}
                      />
                    </Grid>
                  </Grid>

                  <div className='flex sm:flex-row flex-col sm:items-start items-center sm:justify-start justify-center mt-4 gap-3'>
                    <ButtonCustomized
                      fullWidth
                      variant='contained'
                      type='submit'
                      className='max-w-[220px]'
                      disabled={isSubmitting || (!isDirty && defaultValues?.fotoPerfil === fotoPerfilWatch)}
                      startIcon={<i className='fa-regular fa-floppy-disk' />}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress size={20} color='inherit' className='mr-2' />
                          Salvando...
                        </>
                      ) : (
                        <>Salvar mudanças</>
                      )}
                    </ButtonCustomized>
                    <ButtonCustomized
                      fullWidth
                      variant='outlined'
                      type='button'
                      color='error'
                      className='max-w-[220px]'
                      onClick={() => handleClose({ resetForm: false })}
                      disabled={isSubmitting}
                      startIcon={<i className='fa-regular fa-xmark' />}
                    >
                      Cancelar
                    </ButtonCustomized>
                  </div>
                </div>
              </div>
            </div>
          </form>
        }
      />
      {ConfirmDialog()}
    </>
  )
}
