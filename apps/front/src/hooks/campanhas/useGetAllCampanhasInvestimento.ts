import { useCallback, useState } from 'react'

import { CampanhaService } from '@/services/CampanhaService'
import type { CampanhaResponseType } from '@/types/perfilInvestimento/CampanhaType'

export const useGetAllCampanhasInvestimento = () => {
  const [listaCampanhas, setListaCampanhas] = useState<CampanhaResponseType>({
    campanhas: [],
    pageIndex: 0,
    pageSize: 4,
    totalPages: 0,
    totalItems: 0
  })

  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize] = useState<number>(4)

  const getAllCampanhasInvestimento = useCallback(async (pageIndex: number = currentPage) => {
    try {
      const response = await CampanhaService.getCampanhas(pageIndex, pageSize)

      setListaCampanhas(response)
      setCurrentPage(pageIndex)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [currentPage, pageSize])

  const changePage = useCallback((newPage: number) => {
    getAllCampanhasInvestimento(newPage)
  }, [getAllCampanhasInvestimento])

  return { 
    listaCampanhas, 
    error, 
    getAllCampanhasInvestimento, 
    changePage,
    currentPage 
  }
}
