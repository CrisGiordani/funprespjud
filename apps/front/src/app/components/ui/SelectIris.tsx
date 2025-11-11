import React from 'react'

import { FormControl, Select, MenuItem } from '@mui/material'

import type SelectIrisProps from '@/types/ui/SelectIrisProps'

export default function SelectIris({
  options,
  value,
  onChange,
  placeholder = 'Selecione',
  className = ''
}: SelectIrisProps) {
  return (
    <div className={`flex flex-row items-center gap-6 `}>
      <FormControl
        sx={{
          borderRadius: '9999px',
          border: '1.5px solid #0578BE',
          minWidth: 160,
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '&:hover': {
            background: '#eaf4fb'
          }
        }}
      >
        <div className={`${className}`}>
          <Select
            value={value}
            onChange={e => onChange(e.target.value)}
            displayEmpty
            fullWidth
            sx={{
              borderRadius: '9999px',
              fontWeight: 600,
              color: '#1976d2',
              '& .MuiSelect-icon': {
                color: '#0578BE',
                right: 0,
                position: 'absolute',
                pointerEvents: 'none'
              },
              height: 45
            }}
            inputProps={{}}
          >
            <MenuItem value=''>
              <span>{placeholder}</span>
            </MenuItem>
            {options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </FormControl>
    </div>
  )
}
