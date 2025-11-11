'use client'

// React Imports
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { VerticalNavContextProps } from '@menu/contexts/verticalNavContext'

// Component Imports
import FunprespJudLogo from '@core/svg/Logo'
import FunprespJudLogoCompletoAdmin from '@core/svg/LogoCompletoAdmin'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

type LogoProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
  isBreakpointReached?: VerticalNavContextProps['isBreakpointReached']
  color?: CSSProperties['color']
}

type LogoCompletoProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
  isBreakpointReached?: VerticalNavContextProps['isBreakpointReached']
  color?: CSSProperties['color']
}

const FunprespJudLogoSpan = styled.span<LogoProps>`
  line-height: 1.2;
  font-weight: 600;
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? 'opacity: 0; margin-inline-start: 0;'
      : 'opacity: 1; margin-inline-start: 0;'}
`

const FunprespJudLogoCompletoSpan = styled.span<LogoCompletoProps>`
  line-height: 1.2;
  font-weight: 600;
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? 'opacity: 0; margin-inline-start: 0;'
      : 'opacity: 1; margin-inline-start: 0;'}
`

const LogoAdmin = () => {
  // Refs
  const logoCompletoRef = useRef<HTMLSpanElement>(null)
  const logoRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      logoRef.current?.classList.add('hidden')

      return
    }

    if (logoCompletoRef && logoCompletoRef.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoCompletoRef.current?.classList.add('hidden')
        logoRef.current?.classList.remove('hidden')
      } else {
        logoCompletoRef.current.classList.remove('hidden')
        logoRef.current?.classList.add('hidden')
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout, isBreakpointReached])

  return (
    <div className='flex items-center min-bs-[24px]'>
      <FunprespJudLogoSpan
        ref={logoRef}
        isHovered={isHovered}
        isCollapsed={layout !== 'collapsed'}
        transitionDuration={transitionDuration}
        isBreakpointReached={isBreakpointReached}
      >
        <FunprespJudLogo />
      </FunprespJudLogoSpan>
      <FunprespJudLogoCompletoSpan
        ref={logoCompletoRef}
        isHovered={isHovered}
        isCollapsed={layout === 'collapsed'}
        transitionDuration={transitionDuration}
        isBreakpointReached={isBreakpointReached}
      >
        <FunprespJudLogoCompletoAdmin />
      </FunprespJudLogoCompletoSpan>
    </div>
  )
}

export default LogoAdmin
