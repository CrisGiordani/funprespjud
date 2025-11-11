'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Image from 'next/image'

import InputMask from 'react-input-mask'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Component Imports
import { CircularProgress } from '@mui/material'

import Link from '@components/Link'

// Validation Imports

import { validateCpf } from '@/utils/validations'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/@layouts/components/customized/Toast'
import { SwichCustomized } from '@/components/ui/SwichCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import AuthLayout from '@/components/layout/AuthLayout'
import { DialogCustomized } from '@/components/ui/DialogCustomized'

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) return parts.pop()?.split(';').shift() || null

  return null
}

const setCookie = (name: string, value: string, options: { maxAge?: number } = {}) => {
  if (typeof document === 'undefined') return
  let cookie = `${name}=${value}`

  if (options.maxAge) {
    cookie += `; max-age=${options.maxAge}`
  }

  cookie += '; path=/'
  document.cookie = cookie
}

const getMeCpf = (): string | null => {
  const meCookie = getCookie('me')

  if (!meCookie) return null

  try {
    const meObj = JSON.parse(decodeURIComponent(meCookie))

    return meObj.cpf || null
  } catch {
    return null
  }
}

const setMeCpf = (cpf: string | null, options: { maxAge?: number } = {}) => {
  if (cpf) {
    const meObj = { cpf }

    setCookie('me', encodeURIComponent(JSON.stringify(meObj)), options)
  } else {
    setCookie('me', '', { maxAge: 0 })
  }
}

const hasSeenFirstAccessModal = (): boolean => {
  if (typeof window === 'undefined') return false

  return localStorage.getItem('hasSeenFirstAccessModal') === 'true'
}

const markFirstAccessModalAsSeen = () => {
  if (typeof window === 'undefined') return

  localStorage.setItem('hasSeenFirstAccessModal', 'true')
}

interface UserOption {
  id: string
  name: string
  cpf: string
  cpfEncrypted: string
}

const LoginPage = () => {
  const { Toast, showToast } = useToast()
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [cpfError, setCpfError] = useState('')
  const [senhaError, setSenhaError] = useState('')
  const [savedCpf, setSavedCpf] = useState<string | null>(null)
  const [showCpfInput, setShowCpfInput] = useState(false)
  const [rememberCpf, setRememberCpf] = useState(false)

  const [showModalPrimeiroAcesso, setShowModalPrimeiroAcesso] = useState(false)

  // Estados para select de usuários em dev/hml
  const [appEnv, setAppEnv] = useState<string>('prd')
  const [users, setUsers] = useState<UserOption[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const { refetch } = useAuth()

  const router = useRouter()

  useEffect(() => {
    const savedCpfFromMe = getMeCpf()

    if (savedCpfFromMe) {
      setSavedCpf(savedCpfFromMe)
      setCpf(savedCpfFromMe)
      setRememberCpf(true)
    } else {
      setShowCpfInput(true)
    }

    // Verificar se é o primeiro acesso
    if (!hasSeenFirstAccessModal()) {
      setShowModalPrimeiroAcesso(true)
    }

    // Verificar ambiente e carregar usuários se necessário
    const checkEnvironment = async () => {
      try {
        const envResponse = await fetch('/api/env')
        const envData = await envResponse.json()
        const environment = envData.appEnv || process.env.NEXT_PUBLIC_APP_ENV || 'prd'

        setAppEnv(environment)

        if (environment === 'dev' || environment === 'hml') {
          setLoadingUsers(true)

          try {
            const response = await fetch('/api/users/fetch-users-nonfunpresp', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            })

            if (response.ok) {
              const contentType = response.headers.get('content-type')

              if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json()

                const usersData = responseData.users || responseData

                const usersArray = Array.isArray(usersData) ? usersData : []

                setUsers(usersArray)
              }
            }
          } catch (err) {
            // Erro ao carregar usuários para autopreenchimento
          } finally {
            setLoadingUsers(false)
          }
        }
      } catch (err) {
        const fallbackEnv = process.env.NEXT_PUBLIC_APP_ENV || 'prd'

        setAppEnv(fallbackEnv)

        if (fallbackEnv === 'dev' || fallbackEnv === 'hml') {
          setLoadingUsers(true)

          try {
            const response = await fetch('/api/users/fetch-users-nonfunpresp', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            })

            if (response.ok) {
              const contentType = response.headers.get('content-type')

              if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json()

                const usersData = responseData.users || responseData

                const usersArray = Array.isArray(usersData) ? usersData : []

                setUsers(usersArray)
              }
            }
          } catch (err2) {
            // Erro ao carregar usuários para autopreenchimento (fallback)
          } finally {
            setLoadingUsers(false)
          }
        }
      }
    }

    checkEnvironment()
  }, [])

  const handleCpfChange = (newCpf: string) => {
    setCpf(newCpf)
    setCpfError('')
  }

  const handleSenhaChange = (newSenha: string) => {
    setSenha(newSenha)
    setSenhaError('')
  }

  const handleCpfBlur = () => {
    if (cpf.trim()) {
      const errorMsg = validateCpf(cpf)

      setCpfError(errorMsg)
    }
  }

  const handleUseDifferentCpf = () => {
    setShowCpfInput(true)
    setSavedCpf(null)
    setCpf('')
    setRememberCpf(false)
    setMeCpf(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!senha.trim()) {
      setSenhaError('Por favor, insira sua senha')

      return
    }

    const errorMsg = validateCpf(cpf)

    if (errorMsg) {
      setCpfError(errorMsg)

      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')
    setCpfError('')
    setSenhaError('')

    try {
      setMessage('Enviando dados...')
      await new Promise(resolve => setTimeout(resolve, 800))

      setMessage('Verificando...')

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cpf, senha })
      })

      const data = await response.json()

      if (response.ok) {
        if (rememberCpf) {
          setMeCpf(cpf, { maxAge: 30 * 24 * 60 * 60 }) // 30 days
        } else {
          setMeCpf(null)
        }

        setCpf('')
        setMessage('Redirecionando...')

        await refetch().then(() => {
          router.push('/inicio')
        })
      } else {
        setIsLoading(false)
        setMessage('')
        showToast(data.message, 'error')
        setError('')
      }
    } catch (err) {
      setIsLoading(false)
      setMessage('')
      setError('Erro ao conectar ao servidor')
    }
  }

  return (
    <AuthLayout>
      <Toast />
      <DialogCustomized
        id='dialog-primeiro-acesso'
        open={showModalPrimeiroAcesso}
        showCloseButton={false}
        title={
          <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
            <Image src='/images/iris/modal-primeiro-acesso.svg' alt='Primeiro acesso' width={142} height={100} />
            <Typography variant='h4' className='text-center'>
              Boas-vindas ao novo Portal do Participante!
            </Typography>
          </div>
        }
        content={
          <div className='flex flex-col gap-2'>
            <Typography variant='body1'>Prezado(a) Participante,</Typography>
            <Typography variant='body1'>
              O Portal do Participante está totalmente repaginado, pensado para oferecer mais conforto, segurança e
              autonomia, na sua jornada de previdência.
            </Typography>
            <Typography variant='body1'>
              Para começar a explorar o novo sistema, é necessário cadastrar uma nova senha. Para isso, clique em
              &quot;Primeiro acesso&quot; e siga as orientações apresentadas.
            </Typography>

            <div className='w-full mt-2'>
              <div className='max-w-[290px] flex flex-col text-center gap-4 m-auto'>
                <ButtonCustomized
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    markFirstAccessModalAsSeen()
                    setShowModalPrimeiroAcesso(false)
                    router.push('/cadastro/verificacao-de-cpf')
                  }}
                >
                  Primeiro acesso
                </ButtonCustomized>

                <ButtonCustomized
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    markFirstAccessModalAsSeen()
                    setShowModalPrimeiroAcesso(false)
                  }}
                >
                  Já tenho uma nova senha
                </ButtonCustomized>
              </div>
            </div>
          </div>
        }
      />
      <div className='w-[500px] max-w-full'>
        <div className='text-left mb-8'>
          <Typography variant='h4' className='mb-2 font-semibold' style={{ color: '#0578BE' }}>
            Boas-vindas ao Portal do Participante da Funpresp-Jud
          </Typography>
          <Typography variant='body1' className='text-gray-600'>
            Insira seus dados nos campos abaixo para acessar.
          </Typography>
        </div>
        <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {savedCpf && !showCpfInput ? (
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200'>
                <i className='fa-regular fa-id-card text-xl'></i>
              </div>
              <div className='flex flex-col flex-1'>
                <span className='text-xs text-gray-500 font-medium'>CPF</span>
                <div className='flex items-center gap-1'>
                  <span className='text-base font-medium text-gray-800'>{savedCpf}</span>
                  <Button
                    onClick={handleUseDifferentCpf}
                    startIcon={<i className='fa-regular fa-pencil'></i>}
                    className='!text-primary !py-1 !px-2 !min-w-0 !ml-2'
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <InputMask
                mask='999.999.999-99'
                maskChar={null}
                value={cpf}
                onChange={e => handleCpfChange(e.target.value)}
                onBlur={handleCpfBlur}
                disabled={isLoading}
              >
                {(inputProps: any) => (
                  <TextField
                    variant='filled'
                    {...inputProps}
                    label='CPF'
                    fullWidth
                    error={!!cpfError}
                    helperText={cpfError}
                    disabled={isLoading}
                  />
                )}
              </InputMask>
              {(appEnv === 'dev' || appEnv === 'hml') && users.length > 0 && (
                <div className='w-full'>
                  <Typography variant='body2' className='mb-2 text-gray-600'>
                    Ou selecione um usuário para teste: {appEnv}
                  </Typography>
                  <div className='max-h-40 overflow-y-auto border border-gray-200 rounded-md'>
                    {loadingUsers ? (
                      <div className='flex justify-center items-center p-4'>
                        <CircularProgress size={20} />
                      </div>
                    ) : Array.isArray(users) && users.length > 0 ? (
                      users.map((user: UserOption) => (
                        <button
                          key={user.id}
                          type='button'
                          onClick={() => {
                            handleCpfChange(user.cpf)
                            setCpfError('')
                          }}
                          disabled={isLoading}
                          className='w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                        >
                          <div className='font-medium text-gray-800'>{user.name}</div>
                        </button>
                      ))
                    ) : (
                      <div className='px-4 py-2 text-sm text-gray-500'>Nenhum usuário disponível</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <TextField
            fullWidth
            variant='filled'
            label='Senha'
            type={'password'}
            value={senha}
            onChange={e => handleSenhaChange(e.target.value)}
            error={!!senhaError}
            helperText={senhaError}
            disabled={isLoading}
          />

          <Typography
            variant='body2'
            sx={{
              display: 'block',
              textAlign: 'left',
              color: 'primary.main',
              fontWeight: 700,
              my: '-8px',
              cursor: 'pointer'
            }}
            component={Link}
            href='/cadastro/recuperacao-de-senha'
          >
            Esqueceu a senha?
          </Typography>

          <div className='flex items-center justify-between py-0'>
            <Typography variant='body1' className='text-neutral-700'>
              Lembrar CPF nesse dispositivo
            </Typography>
            <SwichCustomized
              label='Lembrar CPF nesse dispositivo'
              checked={rememberCpf}
              onChange={e => setRememberCpf(e.target.checked)}
              disabled={isLoading}
            />
          </div>

          {(message || error) && (
            <Typography variant='body2' className={`text-center ${error ? 'text-red-500' : 'text-green-600'}`}>
              {error || message}
            </Typography>
          )}

          <div className='w-full'>
            <div className='max-w-[250px] flex flex-col text-center gap-2 m-auto'>
              <ButtonCustomized fullWidth variant='contained' type='submit' disabled={isLoading}>
                {isLoading ? <CircularProgress size={20} color='inherit' /> : 'Acessar'}
              </ButtonCustomized>
              <Typography variant='body1' className='mt-2'>
                Não tem acesso ao sistema?
              </Typography>
              <ButtonCustomized
                fullWidth
                variant='outlined'
                type='button'
                onClick={() => router.push('/cadastro/verificacao-de-cpf')}
              >
                Primeiro acesso
              </ButtonCustomized>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
