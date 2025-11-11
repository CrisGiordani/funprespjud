'use client'

import { useState, useEffect } from 'react'

import { Typography, CircularProgress, Alert } from '@mui/material'

import type { VerificaCpfProps } from '../types'
import UserNotFound from './components/UserNotFound'
import UserFound from './components/UserFound'
import UserHasPassword from './components/UserHasPassword'
import VerificaCpfInput from './components/VerificaCpfInput'
import { maskEmail } from '@/app/utils/formatters'
import type { ShowAlertType } from '@/types/ui/ShowAlert.type'

const VerificaCpfStep = ({ cpf, navigateTo, goToLogin }: VerificaCpfProps) => {
  const [currentCpf, setCurrentCpf] = useState(cpf)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [result, setResult] = useState<string | null>(null)
  const [hasChecked, setHasChecked] = useState(false)

  const [showAlert, setShowAlert] = useState<ShowAlertType | null>(null)

  useEffect(() => {
    if (currentCpf && !hasChecked) {
      setHasChecked(true)
      checkUserRegistration()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCpf, hasChecked])

  const checkUserRegistration = async () => {
    setIsLoading(true)

    try {
      const requestBody = { cpf: currentCpf }

      const result = await fetch('/api/users/cpf-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await result.json()

      const userDataWithOriginalCpf = {
        ...data.data,
        cpf: currentCpf
      }

      setUserData(userDataWithOriginalCpf)

      if (result.status === 200) {
        setResult('primeiro-acesso')
      }

      if (result.status === 404) {
        setResult('nao-encontrado')
      }

      if (result.status === 409) {
        setResult('senha-cadastrada')
      }
    } catch (err) {
      setResult('nao-encontrado')
      setUserData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCpfSubmit = (newCpf: string) => {
    setCurrentCpf(newCpf)
    setHasChecked(false)
  }

  if (!currentCpf) {
    return (
      <div className='w-full'>
        <div className='text-left mb-8'>
          <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
            Bem-vindo(a) ao Portal do Participante da Funpresp-Jud
          </Typography>
          <Typography variant='body1' className='text-gray-600'>
            Para começar, precisamos do seu CPF.
          </Typography>
        </div>
        <VerificaCpfInput onNext={handleCpfSubmit} onBack={goToLogin} />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='w-full'>
        <div className='text-left mb-8'>
          <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
            Verificando cadastro
          </Typography>
          <Typography variant='body1' className='text-gray-600'>
            Estamos verificando se você possui cadastro no sistema...
          </Typography>
        </div>
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      </div>
    )
  }

  // CPF não encontrado
  if (result === 'nao-encontrado') {
    return (
      <div className='w-full'>
        <div className='text-left mb-8'>
          <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
            Nenhum cadastro encontrado
          </Typography>
          <Typography variant='body1' className='text-gray-600'>
            Não te encontramos em nosso banco, caso queira solicitar acesso preencha o formulário abaixo ou procure o
            seu órgão.
          </Typography>
        </div>
        <UserNotFound navigateTo={navigateTo} goToLogin={goToLogin} />
      </div>
    )
  }

  // Usuário com pré-cadastro (não tem senha)
  if (result === 'primeiro-acesso') {
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
            Confirmação de e-mail
          </Typography>
          <Typography variant='body1' className='text-gray-600'>
            Para finalizar seu cadastro no Portal do Participante, precisamos te enviar um e-mail, com o link de criação
            de senha, no endereço cadastrado pelo órgão. Por favor confirme o e-mail{' '}
            <strong>{maskEmail(userData.email.toLowerCase())}</strong>, no campo abaixo, para prosseguir.
          </Typography>
        </div>
        <UserFound userData={userData} navigateTo={navigateTo} goToLogin={goToLogin} setShowAlert={setShowAlert} />
      </div>
    )
  }

  // Usuário com cadastro ativo (tem senha)
  if (result === 'senha-cadastrada') {
    return (
      <div className='w-full'>
        <div className='text-left mb-8'>
          <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
            Cadastro ativo encontrado
          </Typography>
          <Typography variant='body1' className='text-gray-600'>
            Já existem credenciais ativas para este CPF. Caso tenha esquecido a senha, solicite a recuperação.
          </Typography>
        </div>
        <UserHasPassword userData={userData} navigateTo={navigateTo} goToLogin={goToLogin} />
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='text-left mb-8'>
        <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
          Verificando cadastro
        </Typography>
        <Typography variant='body1' className='text-gray-600'>
          Estamos verificando se você possui cadastro no sistema...
        </Typography>
      </div>
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    </div>
  )
}

export default VerificaCpfStep
