// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

type StyledMainProps = {
  isContentCompact: boolean
}

const StyledMain = styled.main<StyledMainProps>`
  inline-size: 100%;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 2.5rem;

  > * {
    inline-size: 100%;
  }

  ${({ isContentCompact }) =>
    isContentCompact &&
    `
      padding-left: 2.5rem;
      padding-right: 2.5rem;
      padding-top: 1rem;
    `}

  &:has(.${commonLayoutClasses.contentHeightFixed}) {
    display: flex;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    padding-inline: 0.3rem;
    padding-block-start: 1rem;
  }
`

export default StyledMain
