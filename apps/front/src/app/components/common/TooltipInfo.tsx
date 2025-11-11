import { TooltipCustomized } from '@/components/ui/TooltipCustomized'

export function TooltipInfo({ descriptionTooltip, className }: { descriptionTooltip: string; className?: string }) {
  return (
    <TooltipCustomized title={descriptionTooltip}>
      <i
        className={`fa-duotone fa-regular fa-circle-question text-2xl cursor-pointer ${className}`}
        style={
          {
            // @ts-ignore
            '--fa-primary-color': 'var(--mui-palette-primary-main)',

            // @ts-ignore
            '--fa-secondary-color': 'color-mix(in srgb, var(--mui-palette-primary-main) 25%, transparent)'
          } as React.CSSProperties
        }
      ></i>
    </TooltipCustomized>
  )
}
