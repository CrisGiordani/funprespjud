import { useEffect, useState } from 'react'

import { Skeleton } from '@mui/material'

import ListAtasDeReuniao from './ListAtasDeReuniao'
import FiltroIris from '../iris/FiltroIris'
import FiltroChips from '../iris/FiltroChips'
import useGetAllTiposDocumento from '../../../hooks/documentos/useGetAllTiposDocumento'
import { generateAnos } from '../../utils/formatters'
import { CardCustomized } from '@/components/ui/CardCustomized'

export default function CardAtasDeReuniao() {
  const { tiposDocumento, getAllTiposDocumento } = useGetAllTiposDocumento()

  const optionsAno = generateAnos()

  // filtrosConfig precisa ser declarado antes do useState que o utiliza
  const filtrosConfig = [
    {
      key: 'tipo',
      label: 'Reunião',
      type: 'select',
      options: tiposDocumento.map(tipo => ({
        label: tipo.nome,
        value: tipo.value
      })),
      placeholder: 'Reunião'
    },
    {
      key: 'ano',
      label: 'Ano',
      type: 'select',
      options: optionsAno,
      placeholder: 'Ano'
    }
  ]

  const [filtros, setFiltros] = useState<Record<string, string>>(
    filtrosConfig.reduce((acc, filtro) => ({ ...acc, [filtro.key]: '' }), {} as Record<string, string>)
  )

  const restaurarFiltro = (key: string) => {
    setFiltros(prev => ({ ...prev, [key]: '' }))
  }

  useEffect(() => {
    getAllTiposDocumento()
  }, [getAllTiposDocumento])

  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Atas de reunião' />
      <CardCustomized.Content>
        {tiposDocumento ? (
          <div className='mb-4'>
            <FiltroIris filtrosConfig={filtrosConfig} filtros={filtros} setFiltros={setFiltros} />
            <FiltroChips filtros={filtros} filtrosConfig={filtrosConfig} restaurarFiltro={restaurarFiltro} />
          </div>
        ) : (
          <Skeleton variant='rectangular' width='212px' height='40px' sx={{ borderRadius: '5px' }} />
        )}

        <ListAtasDeReuniao tipo={filtros.tipo} ano={filtros.ano} />
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
