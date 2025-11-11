'use client'
import { useEffect } from 'react'

export default function VLibras() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Verifica se já existe o VLibras
    if (document.querySelector('[vw]')) return

    // Cria a estrutura HTML conforme documentação oficial
    const vlibrasDiv = document.createElement('div')

    vlibrasDiv.setAttribute('vw', '')
    vlibrasDiv.className = 'enabled'
    vlibrasDiv.innerHTML = `
            <div vw-access-button class="active"></div>
            <div vw-plugin-wrapper>
                <div class="vw-plugin-top-wrapper"></div>
            </div>
        `

    // Adiciona ao body
    document.body.appendChild(vlibrasDiv)

    // Aguarda o script do VLibras estar carregado
    const waitForVLibras = () => {
      // @ts-ignore
      if (window.VLibras && window.VLibras.Widget) {
        try {
          // @ts-ignore
          new window.VLibras.Widget('https://vlibras.gov.br/app')
        } catch (error) {
          console.error('Erro ao inicializar VLibras:', error)
        }
      } else {
        setTimeout(waitForVLibras, 100)
      }
    }

    // Inicia a verificação
    waitForVLibras()
  }, [])

  return null
}
