import React from 'react'

import { AccordionSimulacao } from './AccordionSimulacao'
import { PerformanceLineChart } from './PerformanceLineChart'
import { BoxAvisoImportante } from './BoxAvisoImportante'
import { DownloadCsvButton } from './DownloadCsvButton'

import type { AccordionPropsType } from '@/types/simulacao-beneficio/AccordionPropsTypes'

export function AccordionComparacaoPerformance({ simulacao, expanded, onChange, subtitle }: AccordionPropsType) {
  return (
    <div className='mb-6'>
      <AccordionSimulacao
        simulacao={simulacao}
        title='3. Sua projeção atual X Cenário simulado'
        subtitle={subtitle}
        expanded={expanded}
        onChange={onChange}
      >
        <PerformanceLineChart simulacao={simulacao} />
        <DownloadCsvButton simulacao={simulacao} />
        <BoxAvisoImportante />
      </AccordionSimulacao>
    </div>
  )
}
