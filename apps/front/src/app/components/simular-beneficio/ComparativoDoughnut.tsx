import { useState, useEffect, useCallback } from 'react'

import { Box, Typography } from '@mui/material'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'

import type { ComparativoDoughnutPropsType } from '@/types/simulacao-beneficio/ComparativoDoughnutPropsTypes'

import { formatCurrency, aplicarMascaraDinheiro } from '@/app/utils/formatters'
import { TooltipInfo } from '../common/TooltipInfo'
import EditableTextField from '@/@layouts/components/customized/EditableTextField'

// Validation constants
const VALID_INPUT_CHARS = /^[\d.,]*$/
const CURRENCY_SYMBOL_REGEX = /R\$|\s/g

// Animation constants
const ANIMATION_DURATION = 1500
const ANIMATION_STEPS = 60

// Chart colors
const CHART_COLORS = {
  primary: 'rgba(20, 113, 96, 1)',
  secondary: 'rgba(20, 113, 96, 0.1)'
} as const

ChartJS.register(ArcElement, Tooltip)

// Utility functions - usando as funções do projeto

const parseMonetaryInput = (value: string): number => {
  return Number(value.replace('R$', '').replace('.', '').replace(',', '.'))
}

const isValidMonetaryInput = (value: string): boolean => {
  // Permitir string vazia
  if (value === '') return true

  // Verificar se contém apenas caracteres válidos
  if (!VALID_INPUT_CHARS.test(value)) return false

  // Verificar se não excede um limite razoável (15 dígitos)
  const numbers = value.replace(/[^\d]/g, '')

  if (numbers.length > 15) return false

  return true
}

// Chart configuration
const createChartData = (animatedPercentual: number) => ({
  datasets: [
    {
      data: [Math.min(animatedPercentual, 100), Math.max(0, 100 - Math.min(animatedPercentual, 100))],
      backgroundColor: [CHART_COLORS.primary, CHART_COLORS.secondary],
      borderWidth: 0,
      cutout: '80%'
    }
  ]
})

const createChartOptions = () => ({
  cutout: '80%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  maintainAspectRatio: false,
  animation: {
    duration: ANIMATION_DURATION,
    easing: 'easeOutQuart' as const
  },
  responsive: true
})

// Custom hooks
const useAnimatedPercentage = (percentual: number) => {
  const [animatedPercentual, setAnimatedPercentual] = useState(0)

  const animatePercentage = useCallback(() => {
    const increment = percentual / ANIMATION_STEPS
    const stepDuration = ANIMATION_DURATION / ANIMATION_STEPS

    let currentValue = 0

    const timer = setInterval(() => {
      currentValue += increment

      if (currentValue >= percentual) {
        setAnimatedPercentual(percentual)
        clearInterval(timer)
      } else {
        setAnimatedPercentual(currentValue)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [percentual])

  useEffect(() => {
    return animatePercentage()
  }, [animatePercentage])

  return animatedPercentual
}

const useInputValue = (initialValue: string, onValueChange?: (value: string) => void) => {
  const [inputValue, setInputValue] = useState(() => formatCurrency(parseMonetaryInput(initialValue)))

  const handleInputChange = useCallback(
    (value: string) => {
      const cleanValue = value.replace(CURRENCY_SYMBOL_REGEX, '')

      if (isValidMonetaryInput(cleanValue)) {
        const formattedValue = aplicarMascaraDinheiro(cleanValue)

        setInputValue(formattedValue)
        onValueChange?.(formattedValue)
      }
    },
    [onValueChange]
  )

  useEffect(() => {
    const valorNumerico = parseMonetaryInput(initialValue)

    setInputValue(formatCurrency(valorNumerico))
  }, [initialValue])

  return { inputValue, handleInputChange }
}

// Component styles
const styles = {
  container: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    bgcolor: '#fff',
    boxShadow: 0,
    width: '100%',
    minHeight: '160px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      textAlign: 'center',
      gap: 2
    }
  },
  chartContainer: {
    position: 'relative' as const,
    width: '180px',
    height: '180px',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      width: '120px',
      height: '120px'
    }
  },
  chartCenter: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    pointerEvents: 'none' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      alignItems: 'center'
    }
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      justifyContent: 'center'
    }
  },
  inputField: {
    width: '250px',
    '& .MuiFilledInput-root': {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#333',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(0, 0, 0, 0.12)'
      }
    }
  }
} as const

// Sub-components
const ChartCenterContent = ({ animatedPercentual, isVisible }: { animatedPercentual: number; isVisible: boolean }) => (
  <Box sx={styles.chartCenter}>
    <Typography
      variant='body2'
      sx={{
        fontSize: '0.75rem',
        color: '#666',
        fontWeight: 400,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s'
      }}
    >
      Comparativo
    </Typography>
    <Typography
      variant='h6'
      sx={{
        fontWeight: 600,
        color: CHART_COLORS.primary,
        fontSize: '1.25rem',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 1s ease-out 0.7s, transform 1s ease-out 0.7s'
      }}
    >
      {animatedPercentual.toFixed(2).replace('.', ',')}%
    </Typography>
  </Box>
)

const ValueDisplay = ({ valor, label }: { valor: string; label?: string }) => (
  <Typography
    variant='h6'
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      justifyContent: 'start',
      color: 'var(--mui-palette-text-primary) !important',
      fontSize: '1.25rem',
      '@media (max-width: 768px)': {
        textAlign: 'center'
      }
    }}
  >
    <span className='text-sm'>{label}</span>
    {valor}
  </Typography>
)

export function ComparativoDoughnut({
  label,
  valor,
  percentual,
  isInput = false,
  onValueChange,
  descriptionTooltip,
  label2,
  valor2,
  descriptionTooltip2
}: ComparativoDoughnutPropsType) {
  const [isVisible, setIsVisible] = useState(false)
  const animatedPercentual = useAnimatedPercentage(percentual)
  const { inputValue, handleInputChange } = useInputValue(valor, onValueChange)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const data = createChartData(animatedPercentual)
  const options = createChartOptions()

  return (
    <Box
      sx={{
        ...styles.container,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
      }}
    >
      {/* Chart */}
      <Box sx={styles.chartContainer}>
        <Doughnut data={data} options={options} />
        <ChartCenterContent animatedPercentual={animatedPercentual} isVisible={isVisible} />
      </Box>
      {/* Information */}
      <Box
        sx={{
          ...styles.infoContainer,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
          transition: 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s',
          '@media (max-width: 768px)': {
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
          }
        }}
      >
        {isInput ? (
          <div>
            {valor2 && label2 && (
              <div className='flex items-start gap-2'>
                <ValueDisplay valor={valor2} label={label2} />
                {descriptionTooltip2 && (
                  <TooltipInfo descriptionTooltip={descriptionTooltip2} className='text-xl -mt-1' />
                )}
              </div>
            )}
            <div className='flex items-center gap-2 mt-2'>
              <EditableTextField
                label={label}
                variant='filled'
                onChange={e => handleInputChange(e.target.value)}
                value={inputValue}
                sx={{ width: '260px' }}
              />
              {descriptionTooltip && <TooltipInfo descriptionTooltip={descriptionTooltip} className='text-xl ml-2' />}
            </div>
          </div>
        ) : (
          <div>
            <div className='flex items-start gap-2'>
              <ValueDisplay valor={valor} label={label} />
              {descriptionTooltip && <TooltipInfo descriptionTooltip={descriptionTooltip} className='text-xl -mt-1' />}
            </div>
            {label2 && valor2 && (
              <div className='flex items-start gap-2 mt-2'>
                <ValueDisplay valor={valor2} label={label2} />
                {descriptionTooltip2 && (
                  <TooltipInfo descriptionTooltip={descriptionTooltip2} className='text-xl -mt-1' />
                )}
              </div>
            )}
          </div>
        )}
      </Box>
    </Box>
  )
}
