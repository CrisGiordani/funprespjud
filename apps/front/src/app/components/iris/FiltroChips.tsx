import { Chip } from '@mui/material'

import type FiltroChipsProps from '@/interfaces/FiltroChipsProps'

export default function FiltroChips({ filtros, filtrosConfig, restaurarFiltro }: FiltroChipsProps) {
  // Função para agrupar filtros de mês e ano
  const agruparFiltrosData = () => {
    const chips = []
    const filtrosProcessados = new Set()

    // Processar filtros individuais (não agrupados)
    Object.entries(filtros).forEach(([key, value]) => {
      if (!value || filtrosProcessados.has(key)) return

      // Pular filtros de mês e ano que serão agrupados
      if (['mesInicial', 'anoInicial', 'mesFinal', 'anoFinal'].includes(key)) return

      const config = filtrosConfig.find(f => f.key === key)
      let valueLabel = value

      if (config && config.options) {
        const opt = config.options.find(o => String(o.value) === String(value))

        if (opt) valueLabel = opt.label
      }

      chips.push({
        key,
        label: valueLabel,
        onDelete: () => restaurarFiltro(key)
      })

      filtrosProcessados.add(key)
    })

    // Agrupar filtros "De:" (mesInicial + anoInicial)
    if (filtros.mesInicial && filtros.anoInicial) {
      const configMes = filtrosConfig.find(f => f.key === 'mesInicial')

      let mesLabel = filtros.mesInicial
      const anoLabel = filtros.anoInicial

      if (configMes && configMes.options) {
        const opt = configMes.options.find(o => String(o.value) === String(filtros.mesInicial))

        if (opt) mesLabel = opt.label
      }

      chips.push({
        key: 'de-group',
        label: `De: ${mesLabel}/${anoLabel}`,
        onDelete: () => {
          restaurarFiltro('mesInicial')
          restaurarFiltro('anoInicial')
        }
      })

      filtrosProcessados.add('mesInicial')
      filtrosProcessados.add('anoInicial')
    }

    // Agrupar filtros "Até:" (mesFinal + anoFinal)
    if (filtros.mesFinal && filtros.anoFinal) {
      const configMes = filtrosConfig.find(f => f.key === 'mesFinal')

      let mesLabel = filtros.mesFinal
      const anoLabel = filtros.anoFinal

      if (configMes && configMes.options) {
        const opt = configMes.options.find(o => String(o.value) === String(filtros.mesFinal))

        if (opt) mesLabel = opt.label
      }

      chips.push({
        key: 'ate-group',
        label: `Até: ${mesLabel}/${anoLabel}`,
        onDelete: () => {
          restaurarFiltro('mesFinal')
          restaurarFiltro('anoFinal')
        }
      })

      filtrosProcessados.add('mesFinal')
      filtrosProcessados.add('anoFinal')
    }

    // Adicionar filtros individuais de mês/ano que não foram agrupados
    Object.entries(filtros).forEach(([key, value]) => {
      if (!value || filtrosProcessados.has(key)) return

      if (['mesInicial', 'anoInicial', 'mesFinal', 'anoFinal'].includes(key)) {
        const config = filtrosConfig.find(f => f.key === key)
        let valueLabel = value

        if (config && config.options) {
          const opt = config.options.find(o => String(o.value) === String(value))

          if (opt) valueLabel = opt.label
        }

        chips.push({
          key,
          label: valueLabel,
          onDelete: () => restaurarFiltro(key)
        })
      }
    })

    return chips
  }

  const chips = agruparFiltrosData()

  return (
    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {chips.map(chip => (
        <Chip key={chip.key} label={chip.label} color='primary' variant='tonal' onDelete={chip.onDelete} />
      ))}
    </div>
  )
}
