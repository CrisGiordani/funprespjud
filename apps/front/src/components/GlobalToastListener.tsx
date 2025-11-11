'use client'

import { useEffect } from 'react'

import { useToast } from '@/@layouts/components/customized/Toast'

export default function GlobalToastListener() {
  const { showToast, Toast } = useToast()

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { message, severity, icon, styles } = event.detail

      showToast(message, severity, icon, styles)
    }

    // Adiciona listener para o evento customizado
    window.addEventListener('showToast', handleShowToast as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('showToast', handleShowToast as EventListener)
    }
  }, [showToast])

  return <Toast />
}
