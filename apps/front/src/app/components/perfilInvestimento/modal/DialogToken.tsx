import { useEffect, useState } from 'react'

import Image from 'next/image'

import { TextField, Typography } from '@mui/material'

import { usePostValidacaoToken } from '@/hooks/perfilInvestimento/usePostValidacaoToken'
import { usePostReenvioToken } from '@/hooks/perfilInvestimento/usePostReenvioToken'
import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export default function DialogToken({
  isOpen,
  handleClose,
  email,
  cpf,
  handleHistoricoSolicitacoes
}: {
  isOpen: boolean
  handleClose: () => void
  email: string
  cpf: string
  handleHistoricoSolicitacoes: () => void
}) {
  const [checked, setChecked] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')
  const [isShaking, setIsShaking] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(59)
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState<boolean>(false)
  const [previousTokenVerificado, setPreviousTokenVerificado] = useState<boolean | null>(null)

  const { postValidacaoToken, tokenVerificado } = usePostValidacaoToken()
  const { postReenvioToken } = usePostReenvioToken()

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [countdown])

  useEffect(() => {
    // Só ativa o shake quando tokenVerificado muda de null para false
    if (hasAttemptedValidation && previousTokenVerificado === null && tokenVerificado === false && token.length > 5) {
      setIsShaking(true)

      const timer = setTimeout(() => {
        setIsShaking(false)
      }, 500)

      return () => clearTimeout(timer)
    }

    // Atualiza o valor anterior apenas se não for null (para evitar reset desnecessário)
    if (tokenVerificado !== null) {
      setPreviousTokenVerificado(tokenVerificado)
    }
  }, [tokenVerificado, hasAttemptedValidation, previousTokenVerificado, token])

  useEffect(() => {
    if (tokenVerificado === true) {
      handleClose(), handleHistoricoSolicitacoes()
    }
  }, [tokenVerificado, handleClose, handleHistoricoSolicitacoes])

  useEffect(() => {
    if (isOpen) postReenvioToken(cpf)
  }, [isOpen, cpf])

  const handleTokenValidation = async () => {
    setHasAttemptedValidation(true)

    // Só reseta se ainda não tentou validar ou se a última tentativa foi bem-sucedida
    if (previousTokenVerificado === null || previousTokenVerificado === true) {
      setPreviousTokenVerificado(null)
    }

    await postValidacaoToken(cpf, token)
      .then(response => {
        if (response) {
          handleClose()
          handleHistoricoSolicitacoes()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <DialogCustomized
      id='token'
      open={isOpen}
      onClose={handleClose}
      showCloseButton={false}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image src='/images/iris/modal-email-token.svg' alt='Atenção' width={125} height={84} />
          <Typography variant='h4' className='text-center'>
            Cheque seu e-mail
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>
            Um token de validação foi enviado para o e-mail <span className='font-bold'>{email}</span>. Insira-o no
            campo abaixo para validar a sua solicitação de alteração de perfil de investimento.
          </Typography>

          <TextField
            fullWidth
            error={
              hasAttemptedValidation &&
              previousTokenVerificado === null &&
              tokenVerificado === false &&
              token.length > 5
            }
            id='filled-basic'
            label='Insira o token recebido'
            variant='filled'
            helperText={
              hasAttemptedValidation &&
              previousTokenVerificado === null &&
              tokenVerificado === false &&
              token.length > 5
                ? 'Token inválido'
                : ''
            }
            className={`mt-4 ${isShaking ? 'animate-shake' : ''}`}
            value={token}
            onChange={e => {
              setToken(e.target.value)
              setChecked(e.target.value.length > 5)
            }}
          />

          <div className='w-full mt-2'>
            <div className='max-w-[310px] flex flex-col gap-4 m-auto'>
              <ButtonCustomized variant='contained' color='primary' disabled={!checked} onClick={handleTokenValidation}>
                Prosseguir
              </ButtonCustomized>

              <ButtonCustomized
                color='primary'
                onClick={() => {
                  handleClose()
                  handleHistoricoSolicitacoes()
                }}
              >
                Confirmar mais tarde
              </ButtonCustomized>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
              <Typography variant='body1' sx={{ width: '100%' }}>
                É possível acompanhar, cancelar e confirmar alterações sempre que quiser na aba de histórico de
                solicitações.
              </Typography>

              <Typography variant='body1' className='text-center align-center'>
                Não recebeu o e-mail? solicite o reenvio usando o botão abaixo.
              </Typography>
            </div>
            <div className='max-w-[310px] flex flex-col gap-4 mt-4 m-auto'>
              <ButtonCustomized
                fullWidth
                color='primary'
                variant='contained'
                onClick={() => {
                  postReenvioToken(cpf)
                  setCountdown(59)
                }}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Reenviar em ${countdown}` : 'Reenviar e-mail'}
              </ButtonCustomized>
            </div>
          </div>
        </div>
      }
    />
  )
}
