'use client'

import { useState, useEffect } from 'react'

import { Typography, TextField, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material'

import type { PrimeiroAcessoProps } from '../types'
import { validatePassword } from '@/utils/validations'

const PrimeiroAcessoStep = ({ cpf, email, token, navigateTo, goToLogin }: PrimeiroAcessoProps) => {
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState('')
  const [senhaError, setSenhaError] = useState('')
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('')

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

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

    const validateFirstAccessToken = async () => {
      if (!cpf || !email || !token) {
        if (isMounted) goToLogin()

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
          goToLogin()

          return
        }

        setIsValidating(false)
      } catch (error) {
        console.error('Erro ao validar token de primeiro acesso:', error)
        if (isMounted) goToLogin()
      }
    }

    validateFirstAccessToken()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpf, email, token])

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
      const response = await fetch('/api/auth/first-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf,
          email,
          token,
          senha
        })
      })

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(errorData.message || 'Erro ao cadastrar senha')
      }

      await response.json()
      navigateTo('sucesso')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar senha. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className='flex flex-col gap-5 items-center'>
        <CircularProgress size={40} />
        <Typography variant='body1'>Validando acesso...</Typography>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography variant='h4'>Esse é seu primeiro acesso ao portal!</Typography>
        <Typography variant='body1'>Crie sua senha para acessar o portal:</Typography>
      </div>

      <div className='bg-blue-50 p-4 rounded-lg'>
        <Typography variant='body2' className='text-blue-800'>
          <strong>Email:</strong> {email}
        </Typography>
      </div>

      <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <TextField
          fullWidth
          variant='filled'
          label='Nova senha'
          type={isPasswordShown ? 'text' : 'password'}
          value={senha}
          onChange={e => handleSenhaChange(e.target.value)}
          error={!!senhaError}
          helperText={senhaError || 'Mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  edge='end'
                  onClick={handleClickShowPassword}
                  onMouseDown={e => e.preventDefault()}
                >
                  <i className={isPasswordShown ? 'ri-eye-line' : 'ri-eye-off-line'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          variant='filled'
          label='Confirmar senha'
          type={isConfirmPasswordShown ? 'text' : 'password'}
          value={confirmarSenha}
          onChange={e => handleConfirmarSenhaChange(e.target.value)}
          error={!!confirmarSenhaError}
          helperText={confirmarSenhaError}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  edge='end'
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={e => e.preventDefault()}
                >
                  <i className={isConfirmPasswordShown ? 'ri-eye-line' : 'ri-eye-off-line'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {error && (
          <Typography variant='body2' className='text-red-500 text-center'>
            {error}
          </Typography>
        )}

        <div className='flex flex-col gap-3'>
          <Button
            fullWidth
            variant='contained'
            type='submit'
            disabled={isLoading}
            className='max-w-[180px] min-w-[180px] mx-auto'
          >
            {isLoading ? <CircularProgress size={20} color='inherit' /> : 'Criar senha'}
          </Button>

          <Button fullWidth variant='outlined' onClick={goToLogin} className='max-w-[180px] min-w-[180px] mx-auto'>
            Voltar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PrimeiroAcessoStep
