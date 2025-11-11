'use client'

import { useState, useCallback, useMemo } from 'react'

import { Typography, TextField, CircularProgress, Alert } from '@mui/material'
import InputMask from 'react-input-mask'

import { validateEmail, validateCpf } from '@/utils/validations'

import type { NavigationProps } from '../types'
import { useEmailSender } from '@/hooks/useEmailSender'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { SolicitarAjudaStep } from './components/SolicitarAjuda'
import type { ShowAlertType } from '@/types/ui/ShowAlert.type'

const EsquecimentoDeSenhaStep = ({ goToLogin }: NavigationProps) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [cpf, setCpf] = useState('')
  const [cpfError, setCpfError] = useState('')
  const [open, setOpen] = useState(false)

  const [showAlert, setShowAlert] = useState<ShowAlertType | null>(null)

  const { isLoading, error, countdown, sendEmail, formatCountdown } = useEmailSender({
    successMessage: 'E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.',
    errorMessage: 'Erro ao enviar e-mail de recuperação. Tente novamente.'
  })

  const handleEmailChange = useCallback((newEmail: string) => {
    setEmail(newEmail)
    setEmailError('')
  }, [])

  const handleEmailBlur = useCallback(() => {
    if (email.trim()) {
      const emailValidationError = validateEmail(email)

      setEmailError(emailValidationError)
    }
  }, [email])

  const handleCpfChange = useCallback((newCpf: string) => {
    setCpf(newCpf)
    setCpfError('')
  }, [])

  const handleCpfBlur = useCallback(() => {
    if (cpf.trim()) {
      const errorMsg = validateCpf(cpf)

      setCpfError(errorMsg)
    }
  }, [cpf])

  const handleGoToLogin = useCallback(() => {
    goToLogin()
  }, [goToLogin])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!email.trim()) {
        setEmailError('Por favor, insira seu e-mail')

        return
      }

      if (!cpf.trim()) {
        setCpfError('Por favor, insira seu CPF')

        return
      }

      const errorMsg = validateCpf(cpf)

      if (errorMsg) {
        setCpfError(errorMsg)

        return
      }

      const emailValidationError = validateEmail(email)

      if (emailValidationError) {
        setEmailError(emailValidationError)

        return
      }

      await sendEmail(async () => {
        const response = await fetch('/api/auth/recuperacao-senha-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, cpf })
        })

        if (response.status !== 200) {
          const errorData = await response.json()

          setShowAlert({
            message: errorData.message || 'Verifique os dados informados e tente novamente.',
            severity: 'error'
          })

          throw new Error(errorData.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.')
        }

        setShowAlert({
          message: 'E-mail enviado com sucesso!',
          severity: 'success'
        })
      })
    },
    [email, cpf, sendEmail]
  )

  const CountdownButton = useMemo(() => {
    return (
      <ButtonCustomized fullWidth variant='contained' type='submit' disabled={isLoading || countdown > 0}>
        {isLoading ? (
          <CircularProgress size={20} color='inherit' />
        ) : countdown > 0 ? (
          `Reenviar em ${formatCountdown(countdown)}`
        ) : (
          'Enviar e-mail'
        )}
      </ButtonCustomized>
    )
  }, [isLoading, countdown, formatCountdown])

  return (
    <div className='w-full'>
      {showAlert && (
        <div className='w-full mb-4'>
          <Alert variant='filled' severity={showAlert.severity} className='w-full'>
            {showAlert.message}
          </Alert>
        </div>
      )}
      <div className='text-left mb-8'>
        <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
          Recuperar acesso
        </Typography>
        <Typography variant='body1' className='text-gray-600'>
          Informe seu e-mail no campo abaixo, um e-mail de recuperação de senha será enviado caso haja uma conta
          vinculada a ele.
        </Typography>
      </div>
      <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <InputMask
          mask='999.999.999-99'
          disabled={isLoading || countdown > 0}
          maskChar={null}
          value={cpf}
          onChange={e => handleCpfChange(e.target.value)}
          onBlur={handleCpfBlur}
        >
          {(inputProps: any) => (
            <TextField
              variant='filled'
              {...inputProps}
              label='CPF'
              fullWidth
              error={!!cpfError}
              helperText={cpfError}
              disabled={isLoading || countdown > 0}
            />
          )}
        </InputMask>

        <TextField
          variant='filled'
          label='E-mail'
          type='email'
          value={email}
          onChange={e => handleEmailChange(e.target.value)}
          onBlur={handleEmailBlur}
          fullWidth
          error={!!emailError}
          helperText={emailError}
          disabled={isLoading || countdown > 0}
        />

        {error && (
          <Typography variant='body2' className='text-red-500 text-center'>
            {error}
          </Typography>
        )}

        <div className='w-full'>
          <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
            {CountdownButton}

            <ButtonCustomized fullWidth variant='outlined' onClick={handleGoToLogin}>
              Voltar ao Login
            </ButtonCustomized>
          </div>

          <div className='flex flex-col items-center justify-center gap-2 mt-4'>
            <Typography variant='body1' className='text-center'>
              Problemas para receber o e-mail de recuperação?
            </Typography>

            <div className='w-full max-w-[250px]'>
              <ButtonCustomized fullWidth variant='outlined' onClick={() => setOpen(true)}>
                Solicitar ajuda
              </ButtonCustomized>
            </div>
          </div>
        </div>
      </form>

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
    </div>
  )
}

export default EsquecimentoDeSenhaStep
