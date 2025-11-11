export type BoxCopyType = {
  title?: string
  description: string
  icon?: string
  type?: 'text' | 'email' | 'phone' | 'url' | 'whatsapp'
  onClick?: () => void
}
