// MUI Imports
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import type { LinearProgressProps } from '@mui/material/LinearProgress'

const getProgressColor = (value: number) => {
  if (value <= 40) {
    return 'rgba(232, 94, 94, 1)' // Vermelho
  } else if (value <= 70) {
    return 'rgba(247, 168, 51, 1)' // Amarelo/Laranja
  } else {
    return 'rgba(35, 123, 107, 1)' // Verde
  }
}

const getBackgroundColor = (value: number) => {
  if (value <= 40) {
    return 'rgba(232, 94, 94, 0.2)' // Vermelho claro
  } else if (value <= 70) {
    return 'rgba(247, 168, 51, 0.3)' // Amarelo claro
  } else {
    return 'rgba(35, 123, 107, 0.2)' // Verde claro
  }
}

const BorderLinearProgress = styled(LinearProgress)<{ value?: number }>(({ theme, value = 0 }) => ({
  blockSize: 16,
  borderRadius: 8,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: getBackgroundColor(value)
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 8,
    backgroundColor: getProgressColor(value),
    ...theme.applyStyles('dark', {
      backgroundColor: getProgressColor(value)
    })
  }
}))

interface ProgressLinearCustomProps extends LinearProgressProps {}

const ProgressLinearCustom = (props: ProgressLinearCustomProps) => {
  return <BorderLinearProgress {...props} value={props.value} />
}

export default ProgressLinearCustom
