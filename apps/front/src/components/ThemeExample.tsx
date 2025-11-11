'use client'

import { useColorScheme } from '@mui/material/styles'

import { Button, Card, CardContent, Typography, Box } from '@mui/material'

import { useSettings } from '@core/hooks/useSettings'

const ThemeExample = () => {
  const { mode } = useColorScheme()
  const { settings, updateSettings } = useSettings()

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    updateSettings({ mode: newMode })
  }

  return (
    <Card sx={{ maxWidth: 400, m: 2 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Exemplo de Alternância de Tema
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Modo atual: <strong>{mode}</strong>
        </Typography>

        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Configuração: <strong>{settings.mode}</strong>
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant={settings.mode === 'light' ? 'contained' : 'outlined'}
            size='small'
            onClick={() => handleThemeChange('light')}
            startIcon={<span>🌞</span>}
          >
            Light
          </Button>

          <Button
            variant={settings.mode === 'dark' ? 'contained' : 'outlined'}
            size='small'
            onClick={() => handleThemeChange('dark')}
            startIcon={<span>🌙</span>}
          >
            Dark
          </Button>

          <Button
            variant={settings.mode === 'system' ? 'contained' : 'outlined'}
            size='small'
            onClick={() => handleThemeChange('system')}
            startIcon={<span>💻</span>}
          >
            System
          </Button>
        </Box>

        <Typography variant='caption' sx={{ mt: 2, display: 'block' }}>
          💡 Dica: As configurações são salvas automaticamente e persistem entre sessões.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ThemeExample
