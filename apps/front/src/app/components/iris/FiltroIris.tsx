import React, { useState, useEffect } from 'react'

import { Popover, Typography, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material'

import type FiltroIrisProps from '@/interfaces/FiltroIrisProps'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export default function FiltroIris({
  className,
  filtrosConfig,
  filtros: filtrosProp,
  setFiltros: setFiltrosProp
}: FiltroIrisProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Estado interno para os selects
  const [internalFiltros, setInternalFiltros] = useState<Record<string, string>>(
    filtrosConfig.reduce((acc, filtro) => ({ ...acc, [filtro.key]: '' }), {} as Record<string, string>)
  )

  // Sincroniza o estado interno com o externo quando o popover é aberto
  useEffect(() => {
    if (filtrosProp && open) {
      setInternalFiltros(filtrosProp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosProp, anchorEl])

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const aplicarFiltros = () => {
    if (setFiltrosProp) setFiltrosProp({ ...internalFiltros })
    handleClose()
  }

  const limparFiltros = () => {
    setInternalFiltros(
      filtrosConfig.reduce((acc, filtro) => ({ ...acc, [filtro.key]: '' }), {} as Record<string, string>)
    )
    handleClose()
  }

  // Handler para mudança de filtro individual
  const handleFiltroChange = (key: string, value: string) => {
    setInternalFiltros((prev: any) => ({ ...prev, [key]: value }))
  }

  return (
    <div className={className}>
      <ButtonCustomized
        variant='outlined'
        onClick={handleClick}
        startIcon={
          <i
            className='fa-regular fa-filter '
            style={{ color: 'text-primary', '--fa-secondary-opacity': 0.1 } as any}
          />
        }
        className='w-auto px-6'
        aria-label='Abrir filtros'
      >
        Filtros
      </ButtonCustomized>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={{
          '& .MuiPaper-root': {
            width: 510,
            padding: 6,
            marginTop: 2
          },
          '& .MuiBackdrop-root': {
            background: 'rgba(0,0,0,0.75)'
          }
        }}
      >
        <Typography variant='h4'>Opções de filtro</Typography>
        <Typography variant='body1'>
          Selecione <span className='font-bold'>uma ou mais</span> opções de filtro.
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* Renderizar apenas os filtros que não são de data agrupada */}
          {filtrosConfig
            .filter(filtro => !['mesInicial', 'anoInicial', 'mesFinal', 'anoFinal'].includes(filtro.key))
            .map(filtro => (
              <div key={filtro.key} className='flex flex-row items-center gap-2'>
                <FormControl variant='filled' fullWidth className='mt-2'>
                  <InputLabel id={`label-${filtro.key}`}>{filtro.label}</InputLabel>
                  <Select
                    labelId={`label-${filtro.key}`}
                    id={`select-${filtro.key}`}
                    value={internalFiltros[filtro.key]}
                    onChange={e => handleFiltroChange(filtro.key, e.target.value)}
                    aria-label={`Selecionar ${filtro.label}`}
                  >
                    {filtro.options.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ))}

          {/* Seção "De:" com Mês e Ano */}
          {filtrosConfig.filter(filtro => filtro.group === 'de').length > 0 && (
            <div className='flex flex-row items-center gap-2'>
              <Typography variant='body2' sx={{ minWidth: 30, fontWeight: 500 }}>
                De:
              </Typography>
              <div className='flex flex-row gap-2 flex-1'>
                {filtrosConfig
                  .filter(filtro => filtro.group === 'de')
                  .map(filtro => (
                    <div key={filtro.key} className='flex-1 min-w-0'>
                      <FormControl variant='filled' fullWidth className='mt-2'>
                        <InputLabel id={`label-${filtro.key}`}>{filtro.label}</InputLabel>
                        <Select
                          labelId={`label-${filtro.key}`}
                          id={`select-${filtro.key}`}
                          value={internalFiltros[filtro.key]}
                          onChange={e => handleFiltroChange(filtro.key, e.target.value)}
                          aria-label={`Selecionar ${filtro.label}`}
                        >
                          {filtro.options.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Seção "Até:" com Mês e Ano */}
          {filtrosConfig.filter(filtro => filtro.group === 'ate').length > 0 && (
            <div className='flex flex-row items-center gap-2'>
              <Typography variant='body2' sx={{ minWidth: 30, fontWeight: 500 }}>
                Até:
              </Typography>
              <div className='flex flex-row gap-2 flex-1'>
                {filtrosConfig
                  .filter(filtro => filtro.group === 'ate')
                  .map(filtro => (
                    <div key={filtro.key} className='flex-1 min-w-0'>
                      <FormControl variant='filled' fullWidth className='mt-2'>
                        <InputLabel id={`label-${filtro.key}`}>{filtro.label}</InputLabel>
                        <Select
                          labelId={`label-${filtro.key}`}
                          id={`select-${filtro.key}`}
                          value={internalFiltros[filtro.key]}
                          onChange={e => handleFiltroChange(filtro.key, e.target.value)}
                          aria-label={`Selecionar ${filtro.label}`}
                        >
                          {filtro.options.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className='flex flex-wrap sm:flex-row flex-col justify-between gap-2 mt-4'>
            <ButtonCustomized
              variant='contained'
              onClick={aplicarFiltros}
              startIcon={<i className='fa-regular fa-filter' />}
              aria-label='Filtrar'
              sx={{
                flex: 1
              }}
            >
              Filtrar
            </ButtonCustomized>

            <ButtonCustomized
              variant='outlined'
              color='error'
              onClick={limparFiltros}
              startIcon={<i className='fa-regular fa-xmark' />}
              aria-label='Cancelar filtros'
              sx={{
                flex: 1
              }}
            >
              Cancelar
            </ButtonCustomized>
          </div>
        </Stack>
      </Popover>
    </div>
  )
}
