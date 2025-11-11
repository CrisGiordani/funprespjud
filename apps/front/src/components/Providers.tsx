// Type Imports
import { Suspense } from 'react'

import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { SimuladorDefaultProvider } from '@/contexts/SimuladorDefaultContext'
import ProgressCircular from '@/app/components/iris/ProgressCircular'
import { QuestionarioAppProvider } from '@/contexts/QuestionarioAppContext'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const systemMode = getSystemMode()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          <Suspense fallback={<ProgressCircular />}>
            <QuestionarioAppProvider>
              <SimuladorDefaultProvider>
                <ProfileProvider>{children}</ProfileProvider>
              </SimuladorDefaultProvider>
            </QuestionarioAppProvider>
          </Suspense>
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
