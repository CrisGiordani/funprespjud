// Next Imports
import { Open_Sans } from 'next/font/google'

// MUI Imports
import type { Theme } from '@mui/material/styles'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { Skin, SystemMode } from '@core/types'

// Theme Options Imports
import overrides from './overrides'
import colorSchemes from './colorSchemes'
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import typography from './typography'

const opensans = Open_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] })

const theme = (settings: Settings, mode: SystemMode, direction: Theme['direction']): Theme => {
  return {
    direction,
    components: overrides(settings.skin as Skin),
    colorSchemes: colorSchemes(settings.skin as Skin),
    ...spacing,
    shape: {
      borderRadius: 10,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),
    typography: typography(opensans.style.fontFamily),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '51 51 51',
      dark: '255 255 255',
      lightShadow: '38 43 67',
      darkShadow: '16 17 33',
      gray: '242 242 242'
    }
  } as Theme
}

export default theme
