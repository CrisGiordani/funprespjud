'use client'

import { useEffect, useState } from 'react'

import { useColorScheme } from '@mui/material/styles'

import { useSettings } from '@core/hooks/useSettings'
import { clearThemeCookies, checkThemeMode } from '@/utils/clearThemeCookies'

const ThemeDebug = () => {
  const { mode } = useColorScheme()
  const { settings } = useSettings()
  const [cookies, setCookies] = useState<string[]>([])

  useEffect(() => {
    setCookies(checkThemeMode())
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}
    >
      <h4>Debug do Tema</h4>
      <p>
        MUI Mode: <strong>{mode}</strong>
      </p>
      <p>
        Settings Mode: <strong>{settings.mode}</strong>
      </p>
      <p>Cookies: {cookies.length}</p>
      <div style={{ marginTop: '10px', fontSize: '11px' }}>
        <p>✅ Light como padrão</p>
        <p>🔄 Alternância habilitada</p>
        <p>💾 Configurações salvas</p>
      </div>
      <button
        onClick={clearThemeCookies}
        style={{
          background: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          marginTop: '5px'
        }}
      >
        Limpar Cookies
      </button>
    </div>
  )
}

export default ThemeDebug
