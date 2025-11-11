import type { AlertColor } from '@mui/material'

import type { ParticipanteType } from '@/hooks/participante/useGetParticipante'

export type PerfilType = {
  nome: string
  email: string
  fotoPerfil: string
}

export type ModalUpdatePerfilProps = {
  participanteId: string
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  participante: ParticipanteType
  onUpdate?: () => void
  showToast: (message: string, severity?: AlertColor) => void
}

export type DadosParticipanteProps = {
  participanteId: string
  participante: ParticipanteType
  onUpdate: () => void
  showToast: (message: string, severity?: AlertColor) => void
}

export type DadosBeneficiariosProps = {
  participanteId: string
  showToast: (message: string, severity?: AlertColor) => void
}
