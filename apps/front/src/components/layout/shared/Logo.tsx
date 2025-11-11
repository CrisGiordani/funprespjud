'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Component Imports
import FunprespJudLogoCompleto from '@core/svg/LogoCompleto'

const FunprespJudLogoCompletoSpan = styled.span`
  line-height: 1.2;
  font-weight: 600;
  opacity: 1;
  margin-inline-start: 0;
`

const Logo = () => {
  // Refs
  const logoCompletoRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Menu sempre aberto - sempre mostrar logo completo
    logoCompletoRef.current?.classList.remove('hidden')
  }, [])

  return (
    <div className='flex items-center min-bs-[24px]'>
      <FunprespJudLogoCompletoSpan ref={logoCompletoRef}>
        <FunprespJudLogoCompleto />
      </FunprespJudLogoCompletoSpan>
    </div>
  )
}

export default Logo
