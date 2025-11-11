import { useRef } from 'react'

import { Box, Button, Typography } from '@mui/material'

import { useToast } from '@/@layouts/components/customized/Toast'
import type { BoxCopyType } from '@/types/ui/BoxCopyType'
import { TooltipCustomized } from '@/components/ui/TooltipCustomized'

export default function BoxCopy({ title, description, icon, type, onClick }: BoxCopyType, className?: string) {
  const { Toast, showToast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  const handleAction = () => {
    if (onClick) {
      onClick()

      return
    }

    switch (type) {
      case 'email':
        window.open(`mailto:${description}`, '_blank')
        showToast('Abrindo cliente de email', 'success')
        break
      case 'phone':
        window.open(`tel:${description}`, '_blank')
        showToast('Abrindo aplicativo de telefone', 'success')
        break
      case 'url':
        window.open(description, '_blank')
        showToast('Abrindo link', 'success')
        break

      case 'whatsapp':
        const whatsappUrl = `https://wa.me/${description.replace(/\D/g, '')}`

        window.open(whatsappUrl, '_blank')
        showToast('Abrindo WhatsApp', 'success')
        break

      default:
        // Comportamento padrão de copiar
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(description || '')
            .then(() => showToast('Copiado para a área de transferência', 'success'))
            .catch(() => showToast('Erro ao copiar texto', 'error'))
        }
    }
  }

  return (
    <div className={`w-full flex flex-row items-stretch ${className}`}>
      <Box
        component='section'
        sx={{
          flex: 1,
          px: 5,
          py: 2,
          border: '1px  solid #0578c0',
          borderRadius: 'var(--mui-shape-customBorderRadius-lg) 0 0 var(--mui-shape-customBorderRadius-lg)',
          transition: 'all 0.3s ease'
        }}
        className='flex flex-row items-center justify-between border-e-0 hover:bg-blue-50 no-wrap'
      >
        <div className='flex flex-row gap-2 items-center justify-start w-full'>
          {icon && <i className={`${icon} text-xl text-primary-main`}></i>}
          {title && (
            <Typography variant='h6' className='whitespace-nowrap'>
              {title}
            </Typography>
          )}

          {contentRef.current && contentRef.current.scrollWidth >= 275 ? (
            <TooltipCustomized title={description} placement='top'>
              <Typography
                ref={contentRef}
                variant='body1'
                sx={{
                  fontWeight: 600,
                  textAlign: 'left',
                  width: '100%',
                  maxWidth: '275px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'var(--mui-palette-text-primary)'
                }}
              >
                {description}
              </Typography>
            </TooltipCustomized>
          ) : (
            <Typography
              ref={contentRef}
              variant='body1'
              sx={{
                fontWeight: 600,
                textAlign: 'left',
                width: '100%',
                maxWidth: '275px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {description}
            </Typography>
          )}
        </div>
      </Box>
      <Button
        variant='contained'
        color='primary'
        className='py-2 '
        onClick={handleAction}
        sx={{
          borderRadius: '0 10px 10px 0',
          height: '46px !important',
          maxHeight: '50px !important'
        }}
      >
        <i className={type ? 'fa-regular fa-arrow-up-right-from-square' : 'fa-regular fa-copy'}></i>
      </Button>
      <Toast />
    </div>
  )
}
