'use client'

import { useEffect } from 'react'

// import { usePathname } from 'next/navigation'

import { Typography } from '@mui/material'

import { formatarDataBR } from '@/app/utils/formatters'
import { useUltimaCota } from '@/hooks/cotas/useUltimaCota'
import { useAuth } from '@/contexts/AuthContext'

//* Foi solicitado para exibir em todas as páginas, caso mudem de ideia apenas descomentar.
// const menuHiddenInfoCotas = [
//   '/patrimonio/investimento',
//   '/patrimonio/extrato',
//   '/patrimonio/contribuicao-facultativa',
//   '/pessoal/perfil',
//   '/servicos/emprestimo',
//   '/servicos/clube-vantagens',
//   '/outros/documentos'
// ]

export default function CotasHeader() {
  // const pathname = usePathname()
  const { user } = useAuth()
  const { ultimaCota, getUltimaCota } = useUltimaCota()

  useEffect(() => {
    if (user?.cpf) {
      getUltimaCota(user?.cpf)
    }
  }, [user?.cpf, getUltimaCota])

  // if (menuHiddenInfoCotas.find(item => item === pathname)) {
  //   return null
  // }

  return (
    <Typography
      variant='body1'
      sx={{
        color: 'var(--mui-palette-text-secondary)',
        marginBottom: '1rem'
      }}
    >
      Valor das cotas atualizadas para <span className='font-bold'>{ultimaCota?.valor}</span>, em{' '}
      <span className='font-bold'>{formatarDataBR(ultimaCota?.dt_indexador)}</span>
    </Typography>
  )
}
