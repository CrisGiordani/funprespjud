import { Button, type ButtonProps } from '@mui/material'

export function ActionButton({ children, ...props }: ButtonProps & React.PropsWithChildren) {
  return (
    <Button
      {...props}
      sx={{
        width: '100%',
        maxWidth: '300px',
        height: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '.5rem 4rem',
        ...props.sx
      }}
    >
      {children}
    </Button>
  )
}
