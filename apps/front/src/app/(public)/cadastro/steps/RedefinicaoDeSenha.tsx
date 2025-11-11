'use client'

import { useState, useEffect } from 'react'

import { Typography, TextField, CircularProgress } from '@mui/material'

import type { PrimeiroAcessoProps } from '../types'
import { validatePassword } from '@/utils/validations'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

const RedefinicaoDeSenhaStep = ({ cpf, token, navigateTo, goToLogin, isCriacaoDeSenha }: PrimeiroAcessoProps) => {
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState('')
  const [senhaError, setSenhaError] = useState('')
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('')

  const handleSenhaChange = (newSenha: string) => {
    setSenha(newSenha)
    setSenhaError('')
    setError('')
  }

  const handleConfirmarSenhaChange = (newConfirmarSenha: string) => {
    setConfirmarSenha(newConfirmarSenha)
    setConfirmarSenhaError('')
    setError('')
  }

  useEffect(() => {
    let isMounted = true

    const validateVerificationCode = async () => {
      if ((!cpf || !token) && isMounted) {
        navigateTo('token-expirado')

        return
      }

      try {
        const response = await fetch('/api/auth/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cpf: cpf,
            verificationCode: token
          })
        })

        if (!isMounted) return

        if (!response.ok) {
          navigateTo('token-expirado')

          return
        }

        setIsValidating(false)
      } catch (error) {
        if (isMounted) goToLogin()
      }
    }

    validateVerificationCode()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpf, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!senha.trim()) {
      setSenhaError('Por favor, insira uma senha')

      return
    }

    const senhaValidation = validatePassword(senha)

    if (senhaValidation) {
      setSenhaError(senhaValidation)

      return
    }

    if (!confirmarSenha.trim()) {
      setConfirmarSenhaError('Por favor, confirme sua senha')

      return
    }

    if (senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não coincidem')

      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf,
          senha
        })
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.message || 'Erro ao atualizar senha')
      }

      navigateTo('sucesso')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar senha. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Critérios de senha conforme validatePassword
  const minLength = senha.length >= 8
  const hasUpperCase = /[A-Z]/.test(senha)
  const hasLowerCase = /[a-z]/.test(senha)
  const hasNumber = /\d/.test(senha)

  const requisitos = [
    {
      label: 'Pelo menos 8 caracteres',
      valid: minLength
    },
    {
      label: 'Pelo menos uma letra maiúscula',
      valid: hasUpperCase
    },
    {
      label: 'Pelo menos uma letra minúscula',
      valid: hasLowerCase
    },
    {
      label: 'Pelo menos um número',
      valid: hasNumber
    }
  ]

  // Mostrar loading enquanto valida
  if (isValidating) {
    return (
      <div className='w-full'>
        <div className='text-left mb-8'>
          <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
            Validando código de verificação...
          </Typography>
        </div>
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='text-left mb-8'>
        <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
          {isCriacaoDeSenha ? 'Criação de senha' : 'Redefinição de senha'}
        </Typography>
        <Typography variant='body1' className='text-gray-600'>
          {isCriacaoDeSenha ? 'Insira a senha desejada nos campos abaixo:' : 'Insira sua nova senha nos campos abaixo:'}
        </Typography>
      </div>
      <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <TextField
          fullWidth
          variant='filled'
          label={isCriacaoDeSenha ? 'Senha' : 'Nova senha'}
          type='password'
          value={senha}
          onChange={e => handleSenhaChange(e.target.value)}
          error={!!senhaError}
          helperText={senhaError}
          disabled={isLoading}
        />

        {/* Lista de requisitos da senha */}
        <div>
          <Typography variant='body1'>Sua nova senha deve atender aos seguintes requisitos:</Typography>
          <ul className='list-none flex flex-col justify-center gap-2 p-0 m-0 mt-2'>
            {requisitos.map((req, idx) => (
              <li key={idx} className='flex items-center gap-2'>
                {req.valid ? (
                  <i className='fa-solid fa-circle-check text-success text-2xl' />
                ) : (
                  <i className='fa-thin fa-circle-xmark text-error text-2xl'></i>
                )}
                <Typography variant='body1'>{req.label}</Typography>
              </li>
            ))}
          </ul>
        </div>

        <TextField
          fullWidth
          variant='filled'
          label={isCriacaoDeSenha ? 'Confirmar senha' : 'Confirmar nova senha'}
          type='password'
          value={confirmarSenha}
          onChange={e => handleConfirmarSenhaChange(e.target.value)}
          error={!!confirmarSenhaError}
          helperText={confirmarSenhaError}
          disabled={isLoading}
        />

        {error && (
          <Typography variant='body2' className='text-error text-center'>
            {error}
          </Typography>
        )}

        <div className='w-full'>
          <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
            <ButtonCustomized fullWidth variant='contained' type='submit' disabled={isLoading}>
              {isLoading ? (
                <CircularProgress size={20} color='inherit' />
              ) : isCriacaoDeSenha ? (
                'Criar senha'
              ) : (
                'Definir nova senha'
              )}
            </ButtonCustomized>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RedefinicaoDeSenhaStep
