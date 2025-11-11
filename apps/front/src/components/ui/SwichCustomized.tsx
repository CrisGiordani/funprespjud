import type { SwitchProps } from '@mui/material'
import { styled, Switch } from '@mui/material'

const SwitchStyled = styled((props: SwitchProps) => <Switch {...props} />)(({ theme }) => ({
  width: 60,
  height: 30,
  padding: 0,
  borderRadius: 30,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    left: 4,
    top: 5
  },
  '& .MuiSwitch-thumb': {
    padding: 0,
    height: 20,
    width: 20,
    backgroundColor: theme.palette.grey[700]
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    left: 16,
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.common.white
    }
  }
}))

export function SwichCustomized({ label, ...props }: SwitchProps & { label: string }) {
  return <SwitchStyled color='primary' inputProps={{ 'aria-label': label }} {...props} />
}
