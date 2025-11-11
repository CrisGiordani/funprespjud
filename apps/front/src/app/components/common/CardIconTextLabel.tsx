import { useRef } from 'react'

import { Card, Typography } from '@mui/material'

import { PercentualChip } from '@/app/(private)/patrimonio/meu-patrimonio/componentes/PercentualChip'
import { TooltipCustomized } from '@/components/ui/TooltipCustomized'
import type { VisaoGeralItemProps } from '@/types/patrimonio/VisaoGeral.type'
import { useParentWidth } from '@/@layouts/hooks/useParentWidth'

export function CardIconTextLabel({
  titulo,
  subtitulo,
  valor,
  icon,
  percentualCrescimento,
  descricao,
  destaque,
  className,
  valorNegrito = true,
  iconeComBG
}: VisaoGeralItemProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const { parentWidth } = useParentWidth({ parentRef })

  return (
    <Card
      ref={parentRef}
      variant='outlined'
      sx={{
        width: '100%',
        height: '100%',
        minHeight: parentWidth > 420 ? '125px' : 'auto',
        maxHeight: parentWidth > 420 ? '125px' : 'auto',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        flexWrap: parentWidth > 420 ? 'nowrap' : 'wrap',
        gap: '1rem',
        padding: '1.6rem'
      }}
      className={`${destaque && 'bg-primary-main/10 border-primary-main'} ${className}`}
    >
      {iconeComBG ? (
        <div
          className={`flex justify-center items-center h-[70px] w-[70px] rounded-full ${destaque ? 'bg-primary-main' : 'bg-primary-main/10'} `}
        >
          {icon && <i className={`${icon} ${destaque ? 'text-white' : 'text-primary-main'} text-2xl`}></i>}
        </div>
      ) : (
        <div className={` flex justify-center items-center `}>
          {icon && <i className={`${icon} ${destaque ? 'text-white' : 'text-primary-main'} text-2xl`}></i>}
        </div>
      )}
      <div className='flex flex-col justify-start items-start'>
        <div className=''>
          <div className='flex justify-start items-center gap-2'>
            <Typography variant='body1'>{titulo}</Typography>
            {descricao && (
              <TooltipCustomized title={descricao}>
                <i
                  className={`fa-duotone fa-regular fa-circle-question text-2xl cursor-pointer`}
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
            )}
          </div>
          {subtitulo && (
            <Typography
              variant='subtitle2'
              sx={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--mui-palette-primary-main) !important'
              }}
            >
              {subtitulo}
            </Typography>
          )}
        </div>
        <div className={`flex items-center flex-wrap gap-4 ${percentualCrescimento ? 'mt-2' : 'mt-0'}`}>
          <Typography
            variant='h4'
            sx={{
              fontSize: '1.3rem',
              fontWeight: valorNegrito ? 700 : 400,
              color: 'var(--mui-palette-text-primary)!important',
              textWrap: 'wrap'
            }}
          >
            {valor}
          </Typography>
          {percentualCrescimento && <PercentualChip percentualCrescimento={percentualCrescimento} />}
        </div>
      </div>
    </Card>
  )
}
