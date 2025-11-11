import { Avatar, Typography } from '@mui/material'

export function AvatarCustomized({
  alt,
  src,
  small,
  onClick
}: {
  alt: string
  src: string
  small?: boolean
  onClick?: () => void
}) {
  return (
    <Avatar
      alt={alt}
      src={src}
      className={`
        w-full h-full
        ${small ? 'rounded-full' : 'rounded-2xl'}
        ${small ? 'bg-primary-main' : 'bg-primary-main/10'}
      `}
      onClick={onClick}
    >
      <Typography variant={small ? 'body1' : 'h1'} className={`font-bold ${small ? ' text-white' : 'text-[#0E509A]'}`}>
        {alt.split(' ')[0].charAt(0).toUpperCase()}
        {alt.split(' ')[alt.split(' ').length - 1].charAt(0).toUpperCase()}
      </Typography>
    </Avatar>
  )
}
