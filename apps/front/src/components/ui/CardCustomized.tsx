import type { PropsWithChildren } from 'react'

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  type CardMediaProps,
  type CardProps
} from '@mui/material'

function Header({
  title,
  subheader,
  action
}: {
  title?: React.ReactNode
  subheader?: React.ReactNode
  action?: React.ReactNode
} & PropsWithChildren) {
  return (
    <CardHeader
      title={title}
      titleTypographyProps={{ variant: 'h4' }}
      subheaderTypographyProps={{ variant: 'body1' }}
      subheader={subheader}
      sx={{
        paddingBottom: '0.5rem'
      }}
      action={action}
    ></CardHeader>
  )
}

export function Media(props: CardMediaProps) {
  return <CardMedia {...props} />
}

function Content({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <CardContent className={`flex flex-col ${className}`}>{children}</CardContent>
}

function Footer({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <CardActions className={`${className}`}>{children}</CardActions>
}

// const sizeClasses = {
//   small: 'w-full max-w-sm p-4 md:p-6',
//   medium: 'w-full max-w-md p-6 md:p-12',
//   large: 'w-full max-w-lg p-8 md:p-16'
// }
function Root({ children, ...props }: PropsWithChildren<CardProps>) {
  return (
    <Card className='flex flex-col p-1 sm:p-4' {...props}>
      {children}
    </Card>
  )
}

export const CardCustomized = {
  Root,
  Header,
  Media,
  Content,
  Footer
}
