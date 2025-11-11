import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'

import { Controller, useForm } from 'react-hook-form'

import type { Resolver } from 'react-hook-form'

import InputMask from 'react-input-mask'

import { DialogCustomized } from '@/components/ui/DialogCustomized'
import type { CampanhaType } from '@/types/perfilInvestimento/CampanhaType'

import { campanhaSchema } from '../schema/CampanhaSchema'

import EditableTextField from '@/@layouts/components/customized/EditableTextField'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { usePostCampanhaPerfilInvestimento } from '@/hooks/campanhas/usePostCampanhaPerfilInvestimento'

import { formatarDataBR, formatarDataISO } from '@/app/utils/formatters'
import { StatusCampanhaPerfilInvestimentoEnum } from '@/enum/campanha/StatusCampanhaPerfilInvestimentoEnum'
import { usePutCampanhaPerfilInvestimento } from '@/hooks/campanhas/usePutCampanhaPerfilInvestimento'
import type { UserType } from '@/types/UserType'
import DialogConfirmeSenha from '@/app/components/perfilInvestimento/questionario/DialogConfirmeSenha'

export function DialogCampanha({
  user,
  campanha,
  open,
  handleClose,
  onCampanhaCreated
}: {
  user: UserType
  campanha?: CampanhaType | null
  open: boolean
  handleClose: () => void
  onCampanhaCreated?: () => void
}) {
  const { postCampanhaPerfilInvestimento, error } = usePostCampanhaPerfilInvestimento()
  const { putCampanhaPerfilInvestimento, error: putError } = usePutCampanhaPerfilInvestimento()
  const [openConfirmeSenha, setOpenConfirmeSenha] = useState<boolean>(false)

  const {
    formState: { errors },

    // formState: { errors, isDirty, dirtyFields, isValid },
    reset,
    watch,
    control,
    trigger

    // setError,
    // clearErrors,
    // setValue
  } = useForm<typeof campanhaSchema | CampanhaType>({
    resolver: zodResolver(campanhaSchema) as unknown as Resolver<typeof campanhaSchema | CampanhaType>,
    mode: 'onChange',
    defaultValues: {
      descricao: '',
      dt_inicio: '',
      dt_fim: ''
    }
  })

  // Atualiza o formulário quando a campanha mudar (para edição)
  useEffect(() => {
    if (campanha) {
      reset({
        descricao: campanha.descricao || '',
        dt_inicio: formatarDataBR(campanha.dt_inicio) || '',
        dt_fim: formatarDataBR(campanha.dt_fim) || ''
      })
    } else {
      reset({
        descricao: '',
        dt_inicio: '',
        dt_fim: ''
      })
    }
  }, [campanha, reset])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = await trigger()

    if (isValid) {
      const formData = watch() as CampanhaType

      const data = {
        idCampanha: campanha?.idCampanha || null,
        descricao: formData?.descricao,
        dt_inicio: formatarDataISO(formData?.dt_inicio as string),
        dt_fim: formatarDataISO(formData?.dt_fim as string),
        usuario_criador: user?.id
      }

      campanha
        ? await putCampanhaPerfilInvestimento(data as CampanhaType)
        : await postCampanhaPerfilInvestimento(data as CampanhaType)

      resetForm()
      handleClose()

      // Recarrega a listagem após criar a campanha
      onCampanhaCreated?.()
    }
  }

  const handleEditCampanha = async () => {
    setOpenConfirmeSenha(true)
    handleClose()
  }

  const handleConfirmarSenha = async () => {
    try {
      const formData = watch() as CampanhaType

      const data = {
        idCampanha: campanha?.idCampanha || null,
        descricao: formData?.descricao,
        dt_inicio: formatarDataISO(formData?.dt_inicio as string),
        dt_fim: formatarDataISO(formData?.dt_fim as string),
        usuario_criador: user?.id
      }

      console.log('Dados sendo enviados para edição:', data)
      
      const response = await putCampanhaPerfilInvestimento(data as CampanhaType)
      
      console.log('Resposta da API:', response)
      
      setOpenConfirmeSenha(false)
      handleClose()
      onCampanhaCreated?.()
    } catch (error) {
      console.error('Erro ao editar campanha:', error)
    }
  }

  const resetForm = () => {
    if (campanha) {
      // Se está editando, volta aos valores originais da campanha
      reset({
        descricao: campanha.descricao || '',
        dt_inicio: formatarDataBR(campanha.dt_inicio) || '',
        dt_fim: formatarDataBR(campanha.dt_fim) || ''
      })
    } else {
      // Se está criando, limpa o formulário
      reset({
        descricao: '',
        dt_inicio: '',
        dt_fim: ''
      })
    }

    // handleClose()
  }

  return (
    <>
    <DialogCustomized
      id='dialog-campanha'
      open={open}
      onClose={() => {
        handleClose()
        resetForm()
      }}
      title={campanha ? 'Edição de Campanha' : 'Criação de Campanha'}
      textAlign='center'
      content={
        <div>
          <form onSubmit={handleSubmit}>
            <div className=''>
              {(!campanha || campanha?.status === StatusCampanhaPerfilInvestimentoEnum.AGENDADA) && (
                <Controller
                  control={control}
                  name='descricao'
                  render={({ field }) => (
                    <EditableTextField
                      className='mb-3'
                      {...field}
                      label='Nome da campanha'
                      error={!!(errors as any).descricao}
                      helperText={(errors as any).descricao?.message}

                      // isDirty={dirtyFields['descricao']}
                    />
                  )}
                />
              )}

              {(!campanha || campanha?.status === StatusCampanhaPerfilInvestimentoEnum.AGENDADA) && (
                <Controller
                  control={control}
                  name='dt_inicio'
                  render={({ field }) => (
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
                          className='mb-3'
                          label='Início da campanha'
                          error={!!(errors as any).dt_inicio}
                          helperText={(errors as any).dt_inicio?.message}

                          // isDirty={dirtyFields['dt_inicio']}
                        />
                      )}
                    </InputMask>
                  )}
                />
              )}

              <Controller
                control={control}
                name='dt_fim'
                render={({ field }) => (
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
                        label='Fim da campanha'
                        error={!!(errors as any).dt_fim}
                        helperText={(errors as any).dt_fim?.message}

                        // isDirty={dirtyFields['dt_fim']}
                      />
                    )}
                  </InputMask>
                )}
              />
            </div>
            {error && <p className='text-red-500 mt-2'>*{error}</p>}
            {putError && <p className='text-red-500 mt-2'>*{putError}</p>}
          </form>
        </div>
      }
      actions={
        <div className='flex flex-col justify-center gap-2'>
          <ButtonCustomized
            variant='contained'
            color='primary'
            className='ms-0 w-full px-20 py-4'
            onClick={campanha ? handleEditCampanha : (e => handleSubmit(e as any))}
          >
            {campanha ? 'Salvar mudanças' : 'Criar campanha'}
          </ButtonCustomized>
          <ButtonCustomized variant='outlined' color='primary' className='ms-0 w-full px-20 py-4' onClick={handleClose}>
            Voltar
          </ButtonCustomized>
        </div>
      }
    />

    <DialogConfirmeSenha
      cpf={user?.cpf || ''}
      open={openConfirmeSenha}
      handleClose={() => setOpenConfirmeSenha(false)}
      handleEtapa={() => {}}
      onSuccess={handleConfirmarSenha}
      descricao='Para editar a campanha, precisamos confirmar sua identidade. Por favor, insira sua senha no campo abaixo.'
    />
  </>
  )
}
