'use client'

import { useColorScheme } from '@mui/material/styles'

import { Button, Card, CardContent, Typography, Box, Chip } from '@mui/material'

import { useSettings } from '@core/hooks/useSettings'

const ThemeToggleTest = () => {
  const { mode } = useColorScheme()
  const { settings, updateSettings } = useSettings()

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    updateSettings({ mode: newMode })
  }

  return (
    <Card sx={{ maxWidth: 500, m: 2, position: 'fixed', top: '80px', right: '20px', zIndex: 1000 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          🎨 Teste de Alternância de Tema
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='text.secondary'>
            Modo atual do MUI: <Chip label={mode} color='primary' size='small' />
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Configuração salva: <Chip label={settings.mode} color='secondary' size='small' />
          </Typography>
        </Box>

        <Typography variant='body2' sx={{ mb: 2 }}>
          Clique nos botões abaixo para testar a alternância:
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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

        <Typography variant='caption' sx={{ display: 'block', color: 'text.secondary' }}>
          💡 Dica: Procure pelo ícone do sol/lua no cabeçalho da página
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ThemeToggleTest
