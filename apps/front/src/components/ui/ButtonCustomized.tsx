import type { ButtonProps } from '@mui/material'
import { Button } from '@mui/material'

export function ButtonCustomized({ children, ...props }: ButtonProps & React.PropsWithChildren) {
  return (
    <Button
      {...props}
      sx={{
        width: '100%',
        height: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        ...props.sx
      }}
    >
      {children}
    </Button>
  )
}
