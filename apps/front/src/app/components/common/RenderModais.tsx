'use client'

import { useRouter } from 'next/navigation'

import DialogCampanhaAberta from '@/app/components/perfilInvestimento/modal/DialogCampanhaAberta'
import DialogPerfilDesatualizado from '@/app/components/perfilInvestimento/modal/DialogPerfilDesatualizado'
import DialogTermoAbstencao from '@/app/components/perfilInvestimento/modal/DialogTermoAbstencao'
import DialogNaoPreencheuApp from '@/app/components/perfilInvestimento/modal/DialogNaoPreencheuApp'
import DialogTermoDeNotificacao from '@/app/components/perfilInvestimento/modal/DialogTermoDeNotificacao'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

type ModalType =
  | 'finalizarCadastro'
  | 'preencherApp'
  | 'termoRecusa'
  | 'preencherAppCheckbox'
  | 'termoNotificacao'
  | 'campanhaAberta'
  | null
type RenderModaisProps = {
  modalStatus: {
    handleShowTermoNotificacao: () => void
    openModal: ModalType
    onClose: () => void
  }
  cpf: string
}

export function RenderModais({
  modalStatus: { openModal, onClose, handleShowTermoNotificacao },
  cpf
}: RenderModaisProps) {
  const router = useRouter()

  if (openModal === 'finalizarCadastro') {
    return (
      <ButtonCustomized variant='contained' onClick={onClose}>
        Finalizar Cadastro
      </ButtonCustomized>
    )
  }

  // Preencher APP
  if (openModal === 'preencherApp') {
    return (
      <DialogPerfilDesatualizado
        open={openModal === 'preencherApp'}
        handlePreencherAPP={() => {
          router.push('/patrimonio/investimento?startQuestionnaire=true')
        }}
        handleClose={onClose}
      />
    )
  }

  if (openModal === 'termoRecusa') {
    return (
      <DialogTermoAbstencao
        isOpen={openModal === 'termoRecusa'}
        handleClose={onClose}
        handleEtapa={() => {}}
        handleResponderQuestionario={() => {
          router.push('/patrimonio/investimento?startQuestionnaire=true')
        }}
      />
    )
  }

  if (openModal === 'preencherAppCheckbox') {
    return (
      <DialogNaoPreencheuApp
        isOpen={openModal === 'preencherAppCheckbox'}
        handleClose={onClose}
        handlePreencherAPP={() => {
          router.push('/patrimonio/investimento?startQuestionnaire=true')
        }}
        handleShowTermoNotificacao={handleShowTermoNotificacao}
      />
    )
  }

  if (openModal === 'termoNotificacao') {
    return (
      <DialogTermoDeNotificacao
        isOpen={openModal === 'termoNotificacao'}
        handleClose={onClose}
        handleNotificacao={() => {}}
        handleResponderQuestionario={() => {
          router.push('/patrimonio/investimento?startQuestionnaire=true')
        }}
      />
    )
  }

  // FIM - Preencher APP

  if (openModal === 'campanhaAberta') {
    return <DialogCampanhaAberta open={openModal === 'campanhaAberta'} onClose={onClose} cpf={cpf} />
  }

  return null
}
