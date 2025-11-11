import { Typography } from '@mui/material'

// TODO alterar ícones para o correto, indisponivel no momento
const variantClasses: {
  [key in 'error' | 'warning' | 'success' | 'info']: string
} = {
  error: 'fa-regular fa-xmark text-error bg-errorLight',
  warning: 'fa-regular fa-triangle-exclamation text-warning bg-warningLight',
  success: 'fa-regular fa-check text-success bg-successLight',
  info: 'fa-solid fa-info text-info bg-infoLight'
}

export function Feedback({
  title,
  description,
  variant
}: {
  title: string
  description: React.ReactNode
  variant: 'error' | 'warning' | 'success' | 'info'
}) {
  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <div className='flex flex-row justify-center items-center mt-5'>
        <i
          className={`w-[75px] h-[75px] flex items-center justify-center ${variantClasses[variant]} rounded-full text-4xl`}
        />
      </div>

      <Typography variant='h4' className='text-center'>
        {title}
      </Typography>

      <Typography variant='body1'>{description}</Typography>
    </div>
  )
}
