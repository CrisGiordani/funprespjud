'use client'

import { useEffect, useState, useRef } from 'react'

export default function EnvironmentBanner() {
  const [environment, setEnvironment] = useState<string>('')
  const [spacerHeight, setSpacerHeight] = useState(24)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const response = await fetch('/api/env')
        const data = await response.json()
        const env = data.appEnv || process.env.NEXT_PUBLIC_APP_ENV || 'prd'

        setEnvironment(env)
      } catch (error) {
        const env = process.env.NEXT_PUBLIC_APP_ENV || 'prd'

        setEnvironment(env)
      }
    }

    checkEnvironment()
  }, [])

  // Calcula altura do banner quando renderizar
  useEffect(() => {
    if (bannerRef.current && (environment === 'dev' || environment === 'hml')) {
      const height = bannerRef.current.getBoundingClientRect().height

      setSpacerHeight(height)
    }
  }, [environment])

  // Só exibe em dev ou hml
  if (environment !== 'dev' && environment !== 'hml') {
    return null
  }

  const getBannerColor = () => {
    if (environment === 'dev') {
      return 'bg-yellow-500'
    }

    if (environment === 'hml') {
      return 'bg-orange-500'
    }

    return ''
  }

  const getEnvironmentText = () => {
    if (environment === 'dev') {
      return 'DESENVOLVIMENTO'
    }

    if (environment === 'hml') {
      return 'HOMOLOGAÇÃO'
    }

    return ''
  }

  return (
    <>
      {/* Spacer div que empurra o conteúdo para baixo */}
      <div
        className='environment-banner-spacer'
        style={{
          height: `${spacerHeight}px`,
          width: '100%',
          flexShrink: 0,
          display: 'block'
        }}
      />
      {/* Banner fixo no topo */}
      <div
        ref={bannerRef}
        className={`environment-banner ${getBannerColor()} text-white text-center py-1 px-4 font-bold text-xs fixed top-0 left-0 right-0 w-full shadow-lg`}
        style={{ zIndex: 9999 }}
      >
        <span>AMBIENTE DE {getEnvironmentText()}</span>
      </div>
    </>
  )
}

