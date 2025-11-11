import { useState, useEffect, useCallback } from 'react'

import { useToast } from '@/@layouts/components/customized/Toast'

interface UseEmailSenderProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  countdownDuration?: number
  successMessage?: string
  errorMessage?: string
}

export const useEmailSender = ({
  onSuccess,
  onError,
  countdownDuration = 60,
  successMessage = 'E-mail enviado com sucesso! Verifique sua caixa de entrada.',
  errorMessage = 'Erro ao enviar e-mail. Tente novamente.'
}: UseEmailSenderProps = {}) => {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return

    const interval = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown])

  const sendEmail = useCallback(
    async (emailSender: () => Promise<void>) => {
      setIsLoading(true)
      setError('')

      try {
        await emailSender()

        setError('')
        setTimeout(() => {
          showToast(successMessage, 'success')
        }, 0)
        setCountdown(countdownDuration)

        if (onSuccess) {
          onSuccess()
        }
      } catch (err) {
        console.error('Erro no sendEmail:', err)
        const errorMsg = errorMessage

        setError(errorMsg)

        if (onError) {
          onError(errorMsg)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [successMessage, errorMessage, countdownDuration, onSuccess, onError, showToast]
  )

  const formatCountdown = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  return {
    isLoading,
    error,
    countdown,
    sendEmail,
    formatCountdown,
    setError
  }
}
