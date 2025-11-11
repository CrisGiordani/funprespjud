// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

import { VerticalMenuContent } from './VerticalMenuContent'

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <VerticalMenuContent />
    </ScrollWrapper>
  )
}

export default VerticalMenu
