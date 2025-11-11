'use client'

import { useEffect, useState, useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

// Componentes de steps
import {
  RecuperacaoDeSenhaStep,
  RedefinicaoDeSenhaStep,
  VerificaCpfStep,
  SucessoStep
} from '@/app/(public)/cadastro/steps'

// Tipos
import type { CadastroStep, FluxoDeCadastro } from '@/app/(public)/cadastro/types'
import TokenExpiradoStep from '../steps/TokenExpirado'
import AuthLayout from '@/components/layout/AuthLayout'

interface PageProps {
  params: {
    step: string
  }
}

const CadastroPage = ({ params }: PageProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<CadastroStep>('recuperacao-de-senha')

  const [fluxoDeCadastro, setFluxoDeCadastro] = useState<FluxoDeCadastro>({
    cpf: '',
    email: '',
    token: '',
    step: 'recuperacao-de-senha'
  })

  const urlParams = useMemo(
    () => ({
      cpf: searchParams.get('cpf'),
      email: searchParams.get('email'),
      token: searchParams.get('token')
    }),
    [searchParams]
  )

  const validSteps: Array<CadastroStep> = [
    'recuperacao-de-senha',
    'redefinicao-de-senha',
    'verificacao-de-cpf',
    'primeiro-acesso',
    'sucesso',
    'sucesso-email-primeiro-acesso',
    'criacao-de-senha',
    'token-expirado'
  ]

  useEffect(() => {
    const step = validSteps.find(step => step === params.step) || 'recuperacao-de-senha'

    setCurrentStep(step)

    if (step !== 'recuperacao-de-senha' && step !== 'sucesso-email-primeiro-acesso') {
      const urlCpf = urlParams.cpf
      const urlEmail = urlParams.email
      const urlToken = urlParams.token

      const cpfDecoded = urlCpf ? decodeURIComponent(urlCpf) : ''

      setFluxoDeCadastro({
        cpf: cpfDecoded,
        email: urlEmail || '',
        token: urlToken || '',
        step
      })
    } else {
      setFluxoDeCadastro(prev => {
        return {
          ...prev,
          step
        }
      })
    }
  }, [params.step, urlParams])

  useEffect(() => {
    if (!validSteps.includes(currentStep)) {
      router.push('/login')
    }
  }, [currentStep, router])

  const navigateTo = useMemo(
    () => (step: CadastroStep, data?: Partial<FluxoDeCadastro>) => {
      if (data) {
        const updatedData = { ...fluxoDeCadastro, ...data, step }

        setFluxoDeCadastro(updatedData)

        const params = new URLSearchParams()

        if (updatedData.cpf) params.set('cpf', updatedData.cpf)
        if (updatedData.email) params.set('email', updatedData.email)
        if (updatedData.token) params.set('token', updatedData.token)

        const queryString = params.toString()
        const newUrl = `/cadastro/${step}${queryString ? `?${queryString}` : ''}`

        router.push(newUrl)
      } else {
        const newUrl = `/cadastro/${step}`

        router.push(newUrl)
      }
    },
    [fluxoDeCadastro, router]
  )

  const goToLogin = useMemo(
    () => () => {
      router.push('/login')
    },
    [router]
  )

  const renderStepMapping = new Map<CadastroStep, React.ReactNode>([
    [
      'verificacao-de-cpf',
      <VerificaCpfStep
        key='verificacao-de-cpf'
        cpf={fluxoDeCadastro.cpf}
        navigateTo={navigateTo}
        goToLogin={goToLogin}
      />
    ],
    [
      'recuperacao-de-senha',
      <RecuperacaoDeSenhaStep key='recuperacao-de-senha' navigateTo={navigateTo} goToLogin={goToLogin} />
    ],
    [
      'redefinicao-de-senha',
      <RedefinicaoDeSenhaStep
        key='redefinicao-de-senha'
        cpf={fluxoDeCadastro.cpf}
        email={fluxoDeCadastro.email}
        token={fluxoDeCadastro.token}
        navigateTo={navigateTo}
        goToLogin={goToLogin}
      />
    ],
    [
      'criacao-de-senha',
      <RedefinicaoDeSenhaStep
        key='criacao-de-senha'
        isCriacaoDeSenha
        cpf={fluxoDeCadastro.cpf}
        email={fluxoDeCadastro.email}
        token={fluxoDeCadastro.token}
        navigateTo={navigateTo}
        goToLogin={goToLogin}
      />
    ],
    ['sucesso', <SucessoStep key='sucesso' goToLogin={goToLogin} />],
    ['token-expirado', <TokenExpiradoStep key='token-expirado' navigateTo={navigateTo} goToLogin={goToLogin} />]
  ])

  return (
    <AuthLayout>
      <div className='w-[500px] max-w-full'>{renderStepMapping.get(currentStep)}</div>
    </AuthLayout>
  )
}

export default CadastroPage
