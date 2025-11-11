'use client'

import { useColorScheme } from '@mui/material/styles'

import { IconButton, Tooltip, Box } from '@mui/material'

import { useSettings } from '@core/hooks/useSettings'

const SimpleThemeToggle = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mode } = useColorScheme()
  const { settings, updateSettings } = useSettings()

  const toggleTheme = () => {
    const newMode = settings.mode === 'light' ? 'dark' : 'light'

    updateSettings({ mode: newMode })
  }

  const getIcon = () => {
    if (settings.mode === 'dark') {
      return '🌙'
    } else {
      return '🌞'
    }
  }

  const getTooltip = () => {
    return `Mudar para ${settings.mode === 'light' ? 'Dark' : 'Light'} Mode`
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={getTooltip()}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            fontSize: '20px',
            width: '40px',
            height: '40px',
            border: '2px solid',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }
          }}
        >
          {getIcon()}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default SimpleThemeToggle
