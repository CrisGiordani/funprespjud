import type { StringifyOptions } from 'node:querystring'

import { useCallback } from 'react'

import { useCache } from '@/hooks/useCache'

interface OptimizedUser {
  cpf: string
  cpfEncrypted: StringifyOptions
  name: string
  role: string[]
  funpresp: boolean
}

interface PaginatedUsers {
  users: OptimizedUser[]
  totalPages: number
  currentPage: number
  totalUsers: number
}

export function useUsersList(page: number = 1, pageSize: number = 3, searchTerm: string = '') {
  const fetchUsers = useCallback(async (): Promise<PaginatedUsers> => {
    const response = await fetch('/api/users/fetch-users')
    const data = await response.json()

    if (Array.isArray(data)) {
      const optimizedUsers = data.map(user => ({
        cpf: user.cpf,
        cpfEncrypted: user.cpfEncrypted || user.cpf,
        name: user.name,
        role: user.role,
        funpresp: user.funpresp
      }))

      let filteredUsers = optimizedUsers

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()

        filteredUsers = optimizedUsers.filter(user => user.name.toLowerCase().includes(term) || user.cpf.includes(term))
      }

      const totalUsers = filteredUsers.length
      const totalPages = Math.ceil(totalUsers / pageSize)

      const adjustedPage = Math.min(page, totalPages || 1)

      const startIndex = (adjustedPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      const users = filteredUsers.slice(startIndex, endIndex)

      return {
        users,
        totalPages,
        currentPage: adjustedPage,
        totalUsers
      }
    } else {
      console.error('API returned non-array data:', data)

      return {
        users: [],
        totalPages: 0,
        currentPage: page,
        totalUsers: 0
      }
    }
  }, [page, pageSize, searchTerm])

  return useCache<PaginatedUsers>(fetchUsers, [page, pageSize, searchTerm], {
    key: `users-list-page-${page}-size-${pageSize}-search-${searchTerm}`,
    ttl: 15 * 60 * 1000, // 15 minutos
    enabled: true
  })
}
