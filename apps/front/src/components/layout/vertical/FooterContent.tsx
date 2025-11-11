'use client'

import classnames from 'classnames'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-center flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Funpresp-Jud `}</span>
      </p>
      {!isBreakpointReached && <div className='flex items-center gap-4'></div>}
    </div>
  )
}

export default FooterContent
