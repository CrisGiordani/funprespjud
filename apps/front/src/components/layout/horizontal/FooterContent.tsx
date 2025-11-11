'use client'

import classnames from 'classnames'

import useHorizontalNav from '@menu/hooks/useHorizontalNav'
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Funpresp-Jud `}</span>
      </p>
      {!isBreakpointReached && <div className='flex items-center gap-4'></div>}
    </div>
  )
}

export default FooterContent
