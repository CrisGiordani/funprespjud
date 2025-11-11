'use client'

import { useState, useEffect } from 'react'

import { Card, Button, Typography } from '@mui/material'

import useGetBeneficiarios from '@/hooks/beneficiarios/useGetBeneficiarios'
import useCreateBeneficiario from '@/hooks/beneficiarios/useCreateBeneficiario'
import useUpdateBeneficiario from '@/hooks/beneficiarios/useUpdateBeneficiaro'
import useDeleteBeneficiario from '@/hooks/beneficiarios/useDeleteBeneficiario'

import {
  type BeneficiarioFormData,
  type BeneficiarioUpdateData,
  type BeneficiarioCreateData
} from '@/app/(private)/pessoal/perfil/schemas/BeneficiarioSchema'

import { formatarTelefoneBR, formatarDataBR } from '@/app/utils/formatters'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { ModalFormBeneficiario } from './ModalFormBeneficiario'
import { CardShowInternalInfo } from './CardShowInternalInfo'
import type { DadosBeneficiariosProps } from '@/types/perfil/perfil'
import { useConfirmDialog } from '@/@layouts/components/iris/ConfirmDialog'

export function DadosBeneficiarios({ participanteId, showToast }: DadosBeneficiariosProps) {
  const { beneficiarios, getBeneficiarios } = useGetBeneficiarios(participanteId)
  const { createBeneficiario } = useCreateBeneficiario()
  const { updateBeneficiario } = useUpdateBeneficiario()
  const { deleteBeneficiario } = useDeleteBeneficiario()

  const [openModal, setOpenModal] = useState(false)
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<BeneficiarioFormData | null>(null)

  const { confirm, ConfirmDialog } = useConfirmDialog()

  const fetchBeneficiarios = async () => {
    await getBeneficiarios().catch(error => {
      showToast(error.message, 'error')
    })
  }

  const handleOpenModal = (beneficiario: BeneficiarioFormData) => {
    setSelectedBeneficiario(beneficiario)
    setOpenModal(true)
  }

  const handleCreateModal = () => {
    setSelectedBeneficiario(null)
    setOpenModal(true)
  }

  const handleDelete = async (beneficiario: BeneficiarioFormData) => {
    const confirmed = await confirm(`Tem certeza que deseja excluir o beneficiário ${beneficiario.nome}?`, {
      title: 'Excluir beneficiário',
      confirmColor: 'error',
      confirmLabel: 'Excluir beneficiário',
      confirmIcon: 'fa-regular fa-trash',
      cancelLabel: 'Manter beneficiário'
    })

    if (confirmed && beneficiario) {
      await deleteBeneficiario(participanteId, beneficiario.id)
        .then(async () => {
          await getBeneficiarios()
          showToast('Beneficiário excluído com sucesso!', 'success')
        })
        .catch(error => {
          showToast(error.message, 'error')
        })
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedBeneficiario(null)
  }

  const handleCloseEditModal = async (formData: BeneficiarioUpdateData) => {
    await updateBeneficiario(participanteId, selectedBeneficiario?.id || '', formData)
      .then(async response => {
        if (response?.success) {
          await getBeneficiarios()
          showToast('Beneficiário atualizado com sucesso!', 'success')
          handleCloseModal()
        } else {
          // Exibir todos os erros de validação
          if (response?.errors && Object.keys(response.errors).length > 0) {
            Object.values(response.errors).forEach(mensagem => {
              showToast(mensagem, 'error')
            })
          } else {
            showToast(response?.message || 'Erro ao atualizar beneficiário', 'error')
          }
        }
      })
      .catch(error => {
        showToast(error.message || 'Erro ao atualizar beneficiário', 'error')
      })
  }

  const handleCloseCreateModal = async (formData: BeneficiarioCreateData) => {
    await createBeneficiario(participanteId, formData)
      .then(async response => {
        if (response.success) {
          await getBeneficiarios()
          showToast('Beneficiário criado com sucesso!', 'success')
          handleCloseModal()
        } else {
          // Exibir todos os erros de validação
          if (response.errors && Object.keys(response.errors).length > 0) {
            Object.values(response.errors).forEach(mensagem => {
              showToast(mensagem, 'error')
            })
          } else {
            showToast(response.message || 'Erro ao criar beneficiário', 'error')
          }
        }
      })
      .catch(error => {
        showToast(error.message || 'Erro ao criar beneficiário', 'error')
      })
  }

  useEffect(() => {
    fetchBeneficiarios()
  }, [getBeneficiarios])

  return (
    <>
      <CardCustomized.Root>
        <CardCustomized.Header title='Beneficiários' />
        <CardCustomized.Content className='flex flex-col gap-4'>
          {Array.isArray(beneficiarios) && beneficiarios.length > 0 ? (
            beneficiarios.map(beneficiario => (
              <CardShowInternalInfo
                key={beneficiario.id}
                title={beneficiario.nome}
                subtitle={beneficiario.grauParentesco.toLocaleLowerCase()}
                internalInfos={[
                  { legend: 'Data de nascimento', text: formatarDataBR(beneficiario.dtNascimento) },
                  { legend: 'Sexo', text: beneficiario.sexo === 'M' ? 'Masculino' : 'Feminino' },
                  { legend: 'Inválido', text: beneficiario.invalido === 'S' ? 'Sim' : 'Não' },
                  { legend: 'Data de recadastramento', text: formatarDataBR(beneficiario?.dtRecadastramento || '-') },
                  { legend: 'Telefone', text: formatarTelefoneBR(beneficiario.celular) || 'Não informado' },
                  { legend: 'E-mail', text: beneficiario.email || 'Não informado' }
                ]}
                actions={
                  <>
                    <ButtonCustomized
                      fullWidth
                      variant='outlined'
                      type='button'
                      onClick={() => handleOpenModal(beneficiario)}
                      startIcon={<i className='fa-regular fa-pencil' />}
                    >
                      Editar beneficiário
                    </ButtonCustomized>
                    <ButtonCustomized
                      fullWidth
                      variant='outlined'
                      type='button'
                      color='error'
                      onClick={() => handleDelete(beneficiario)}
                      startIcon={<i className='fa-regular fa-trash' />}
                    >
                      Excluir beneficiário
                    </ButtonCustomized>
                  </>
                }
              />
            ))
          ) : (
            <Card variant='outlined' className='p-6 my-2'>
              <Typography variant='body1' className='tcenter text-gray-500'>
                Nenhum beneficiário cadastrado
              </Typography>
            </Card>
          )}
          <Button
            variant='outlined'
            onClick={handleCreateModal}
            sx={{
              border: 'dashed 2px #CCC',
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                border: 'dashed 2px #CCC'
              }
            }}
            className='flex flex-col justify-center items-center gap-2 p-8 font-semibold'
          >
            <i className='fa-regular fa-plus text-2xl w-12 h-12  bg-primary-main/10 rounded-full flex items-center justify-center' />
            Adicionar beneficiário
          </Button>
        </CardCustomized.Content>
      </CardCustomized.Root>

      <ModalFormBeneficiario
        openModal={openModal}
        handleCloseModal={formData => {
          if (formData) {
            if (selectedBeneficiario) {
              handleCloseEditModal(formData as BeneficiarioUpdateData)
            } else {
              handleCloseCreateModal(formData as BeneficiarioCreateData)
            }
          } else {
            handleCloseModal()
          }
        }}
        selectedBeneficiario={selectedBeneficiario}
      />

      {ConfirmDialog()}
    </>
  )
}
