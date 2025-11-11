import { useState } from 'react'

import { Typography, TextField, CircularProgress } from '@mui/material'

import type { NavigationProps } from '../../types'
import { useEmailSender } from '@/hooks/useEmailSender'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { SolicitarAjudaStep } from './SolicitarAjuda'
import type { ShowAlertType } from '@/types/ui/ShowAlert.type'

interface UserData {
  nome: string
  email: string
  cpf: string
  hasPassword: boolean
}

interface UserFoundProps extends NavigationProps {
  userData: UserData
  setShowAlert: (alert: ShowAlertType) => void
}

const UserFound = ({ userData, goToLogin, setShowAlert }: UserFoundProps) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [open, setOpen] = useState(false)

  const { isLoading, error, countdown, sendEmail, formatCountdown } = useEmailSender({
    successMessage: 'E-mail de criação de senha enviado com sucesso! Verifique sua caixa de entrada.',
    errorMessage: 'Erro ao enviar e-mail de criação de senha. Tente novamente.',
    onSuccess: () => {
      setShowAlert({
        message: 'E-mail enviado com sucesso!',
        severity: 'success'
      })
    },
    onError: errorMsg => {
      setShowAlert({
        message: errorMsg,
        severity: 'error'
      })
    }
  })

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
    setEmailError('')
  }

  const handleRedefinicaoSenha = async () => {
    if (!email.trim()) {
      setEmailError('Por favor, insira o e-mail para receber o link de criação de senha')

      return
    }

    if (email !== userData.email) {
      setEmailError('E-mail não confere com o cadastro')

      return
    }

    await sendEmail(async () => {
      const response = await fetch('/api/auth/first-access-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: userData.cpf, email: userData.email })
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.message || 'Erro ao enviar e-mail de criação de senha')
      }

      await response.json()
    })
  }

  return (
    <>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-5'>
          <TextField
            variant='filled'
            label='Confirme o seu e-mail'
            type='email'
            value={email}
            onChange={e => handleEmailChange(e.target.value)}
            fullWidth
            error={!!emailError}
            helperText={emailError}
            disabled={isLoading || countdown > 0}
          />

          {error && (
            <Typography variant='body2' className='text-error text-center'>
              {error}
            </Typography>
          )}

          <div className='w-full'>
            <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                fullWidth
                variant='contained'
                onClick={handleRedefinicaoSenha}
                disabled={isLoading || countdown > 0}
              >
                {isLoading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : countdown > 0 ? (
                  `Reenviar em ${formatCountdown(countdown)}`
                ) : (
                  'Enviar e-mail'
                )}
              </ButtonCustomized>

              <ButtonCustomized fullWidth variant='outlined' onClick={goToLogin}>
                Voltar ao login
              </ButtonCustomized>
            </div>

            <div className='flex flex-col items-center justify-center gap-2 mt-4'>
              <Typography variant='body1' className='text-center text-gray-800'>
                Problemas para receber o e-mail de recuperação?
              </Typography>

              <div className='w-full max-w-[250px]'>
                <ButtonCustomized fullWidth variant='outlined' onClick={() => setOpen(true)}>
                  Solicitar ajuda
                </ButtonCustomized>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogCustomized
        id='solicitar-ajuda'
        open={open}
        onClose={() => setOpen(false)}
        actions={
          <div className='w-full'>
            <div className='max-w-[250px] flex flex-col text-center gap-2 m-auto'>
              <ButtonCustomized variant='outlined' onClick={() => setOpen(false)}>
                Fechar
              </ButtonCustomized>
            </div>
          </div>
        }
        content={<SolicitarAjudaStep />}
      />
    </>
  )
}

export default UserFound
