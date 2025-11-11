'use client'

import { useEffect } from 'react'

import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    _paq: any[]
  }
}

export const useMatomo = () => {
  const pathname = usePathname()

  useEffect(() => {
    // Inicializar Matomo Tag Manager apenas uma vez
    if (typeof window !== 'undefined' && !window._paq) {
      window._paq = window._paq || []

      // Carregar Matomo Tag Manager
      const script = document.createElement('script')

      script.async = true
      script.src = 'https://matomo.funprespjud.com.br/js/container_AFuZ1bkZ.js'

      const firstScript = document.getElementsByTagName('script')[0]

      firstScript.parentNode?.insertBefore(script, firstScript)

      console.log('Matomo Tag Manager initialized')
    }
  }, [])

  useEffect(() => {
    // Rastrear mudanças de página
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push(['setCustomUrl', pathname])
      window._paq.push(['setDocumentTitle', document.title])
      window._paq.push(['trackPageView'])

      console.log('Matomo tracking page:', pathname)
    }
  }, [pathname])
}
