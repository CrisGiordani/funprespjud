import type { PropsWithChildren } from 'react'
import React from 'react'

import { Box } from '@mui/material'

import { TooltipInfo } from '../common/TooltipInfo'

type BeneficioInputProps = {
  icon: string
  descriptionTooltip: string
}

export const BeneficioInput = ({ icon, children, descriptionTooltip }: BeneficioInputProps & PropsWithChildren) => (
  <Box display='flex' flexDirection='row' flexWrap='wrap' alignItems='center' gap='1rem'>
    <div className={`w-[65px] h-[65px] flex justify-center items-center bg-primary-main/10 rounded-full`}>
      {icon && <i className={`${icon} text-primary-main text-xl`}></i>}
    </div>

    {children}

    <div className='-ml-3'>{descriptionTooltip && <TooltipInfo descriptionTooltip={descriptionTooltip} />}</div>
  </Box>
)
