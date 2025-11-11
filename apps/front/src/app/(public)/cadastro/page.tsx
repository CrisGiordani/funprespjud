'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

const CadastroPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/cadastro/recuperacao-de-senha')
  }, [router])

  return null
}

export default CadastroPage
