import type { TooltipProps } from '@mui/material'
import { styled, Tooltip, tooltipClasses } from '@mui/material'

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  paddingBottom: 7,
  [`& .${tooltipClasses.arrow}`]: {
    color: '#000000b8'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '15px 15px',
    backgroundColor: '#000000b8',
    backdropFilter: 'blur(3px)',
    fontWeight: 400
  }
}))

export function TooltipCustomized({ children, placement = 'top', arrow = true, ...props }: TooltipProps) {
  return (
    <BootstrapTooltip placement={placement} arrow={arrow} {...props}>
      {children}
    </BootstrapTooltip>
  )
}
