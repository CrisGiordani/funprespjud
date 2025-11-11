import { useCallback, useState } from 'react'

import { ExtratoService } from '@/services/ExtratoService'
import type { ExtratoTypes } from '@/types/extrato/ExtratoTypes'
import type { FilterExtratoType } from '@/types/extrato/FilterExtratoType'
import { useAuth } from '@/contexts/AuthContext'

interface ExtratoApiResponse {
  pagina: number
  total_paginas: number
  total_itens: number
  itens_por_pagina: number
  dados: ExtratoTypes[]
}

const extratoInitial: ExtratoApiResponse = {
  pagina: 1,
  total_paginas: 1,
  total_itens: 0,
  itens_por_pagina: 10,
  dados: []
}

export default function useGetAllExtrato() {
  const [extrato, setExtrato] = useState<ExtratoApiResponse>(extratoInitial)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user } = useAuth()

  const getAllExtrato = useCallback(
    async (filtros?: FilterExtratoType) => {
      if (!user) {
        setIsLoading(false)

        return
      }

      setIsLoading(true)

      await ExtratoService.getAllExtrato(
        filtros || {
          pageIndex: 1,
          pageSize: 10,
          mesInicial: '',
          mesFinal: '',
          anoInicial: '',
          anoFinal: '',
          tipo: '',
          orgao: '',
          autor: ''
        },
        user.cpf
      )
        .then(response => {
          setExtrato(response)
        })
        .catch(err => {
          setError(err.message || 'Erro ao buscar extrato')
          setExtrato(extratoInitial)
          throw err
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [user?.cpf]
  )

  const getExtratoRelatorio = useCallback(
    async (filters: FilterExtratoType) => {
      try {
        if (!user?.cpf) {
          throw new Error('CPF do usuário não encontrado')
        }

        const pdfBlob = await ExtratoService.getExtratoRelatorio(filters, user.cpf)

        // Criar URL e abrir PDF
        const url = URL.createObjectURL(pdfBlob as unknown as Blob)

        window.open(url, '_blank')

        return pdfBlob
      } catch (error) {
        setError(error as string)
        throw error
      }
    },
    [user?.cpf]
  )

  return { extrato, error, getAllExtrato, getExtratoRelatorio, isLoading }
}
