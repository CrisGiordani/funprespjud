'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Link from 'next/link'

import { Alert, Skeleton } from '@mui/material'

import { CardCustomized } from '@/components/ui/CardCustomized'
import useGetKey from '@/hooks/trust/getKey'

export default function Page() {
  // Volta a usar a URL configurada via ambiente (será proxied pelo Nginx)
  const emprestimoUrlBase = process.env.NEXT_PUBLIC_EMPRESTIMO_URL + '/contratacao-simulacao-emprestimo'
  const { key, isLoading: isLoading } = useGetKey()

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const targetUrl = useMemo(() => (key ? `${emprestimoUrlBase}?key=${key}` : null), [key, emprestimoUrlBase])
  const [openedInNewTab, setOpenedInNewTab] = useState<boolean | null>(null)

  const openInNewTab = useCallback(
    (targetUrl: string) => {
      if (openedInNewTab === null) {
        setOpenedInNewTab(true)
        window.open(targetUrl, '_blank', 'toolbar=0,menubar=0,location=0,status=0,scrollbars=yes,resizable=yes')
      }
    },
    [targetUrl, openedInNewTab]
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) return

      if (!targetUrl) return

      const iframe = iframeRef.current

      if (!iframe) return

      // Se for bloqueado por X-Frame-Options/CSP, o navegador mantém about:blank
      const href = iframe.contentWindow?.location?.href

      if (!href || href === 'about:blank') {
        openInNewTab(targetUrl)

        return
      } else {
        setOpenedInNewTab(false)
      }
    }, 3000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isLoading, openedInNewTab, targetUrl, openInNewTab, iframeRef.current])

  return (
    <CardCustomized.Root className='h-full p-0'>
      <CardCustomized.Content className='h-full p-0'>
        {!isLoading && openedInNewTab === true && targetUrl && (
          <div className='p-6'>
            <Alert severity='info'>
              <span className='font-semibold'>
                Por algum motivo, não foi possível carregar a plataforma de empréstimos.
              </span>
              <br />
              Uma nova aba será aberta para você.
              <br />
              Caso a aba não abra,{' '}
              <Link href={targetUrl} target='_blank' className='font-semibold text-[#0578BE] underline'>
                você pode clicar aqui.
              </Link>
            </Alert>
          </div>
        )}

        {isLoading ? (
          <Skeleton variant='rectangular' width='100%' height='100%' sx={{ borderRadius: '5px' }} />
        ) : key && targetUrl ? (
          <iframe
            ref={iframeRef}
            title='Plataforma de Empréstimos'
            src={targetUrl}
            className='w-full h-full'
            sandbox='allow-scripts allow-same-origin allow-popups allow-forms'
            onLoad={() => {
              console.log('iframe carregado')
            }}
            onError={() => {
              console.log('iframe carregado com erro')
            }}
          ></iframe>
        ) : (
          <div className='p-6'>
            <Alert severity='error'>Não foi possível carregar a plataforma de empréstimos.</Alert>
          </div>
        )}
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
