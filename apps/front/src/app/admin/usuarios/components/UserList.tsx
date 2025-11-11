'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Typography,
  Button,
  Pagination,
  TextField
} from '@mui/material'

import { aplicarMascaraCPF } from '@/app/utils/formatters'
import { useUsersList } from '@/hooks/admin/useUsersList'
import { useUsersCache, searchUsersLocal } from '@/hooks/admin/useUsersCache'

import RoleIcons from './RoleIcons'

const roleIconMap: Record<string, string> = {
  USER_PARTICIPANT: 'fa-user',
  USER_OPERATOR: 'fa-headset',
  USER_ADMIN: 'fa-crown',
  USER_SPONSOR: 'fa-landmark',
  USER_REPRESENTATIVE: 'fa-person-chalkboard'
}

const roleDisplayNames: Record<string, string> = {
  USER_PARTICIPANT: 'Participante',
  USER_OPERATOR: 'Operador',
  USER_ADMIN: 'Administrador',
  USER_SPONSOR: 'Patrocinador',
  USER_REPRESENTATIVE: 'Representante'
}

const LegendItem = ({ role }: { role: string }) => {
  const iconClass = roleIconMap[role]
  const displayName = roleDisplayNames[role]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <i
        className={`fas ${iconClass}`}
        style={{
          fontSize: '16px',
          color: '#1976d2'
        }}
      />
      <Typography variant='body2' sx={{ fontWeight: 500, color: '#333' }}>
        {displayName}
      </Typography>
    </Box>
  )
}

export default function UserList() {
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [instantSearchResults, setInstantSearchResults] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const urlPage = searchParams.get('page')
      const urlSearch = searchParams.get('search')

      if (urlPage) {
        setCurrentPage(parseInt(urlPage))
      }

      if (urlSearch) {
        setSearchTerm(urlSearch)

        // Se há busca na URL, executar a busca
        if (urlSearch.trim().length >= 3) {
          handleSearchFromUrl(urlSearch, urlPage ? parseInt(urlPage) : 1)
        }
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const pageSize = 20

  const { data: paginatedData, loading, error, refetch, isCached } = useUsersList(currentPage, pageSize, '')
  const { users: cachedUsers, loading: cacheLoading, cacheTimestamp, refetch: refreshCache } = useUsersCache()

  // Função para calcular tamanho total do cache
  const getTotalCacheSize = () => {
    if (typeof window === 'undefined') return 0

    try {
      const stored = localStorage.getItem('app-cache')

      return stored ? stored.length : 0
    } catch {
      return 0
    }
  }

  const displayData = searchResults || instantSearchResults || paginatedData
  const users = displayData?.users || []
  const totalPages = displayData?.totalPages || 0
  const totalUsers = displayData?.totalUsers || 0

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)

    // Se estamos em uma busca, atualizar a URL da busca e recarregar dados
    if (searchResults || instantSearchResults) {
      const searchParams = new URLSearchParams()

      if (page > 1) searchParams.set('page', page.toString())
      searchParams.set('search', searchTerm.trim())
      const newUrl = `/admin/usuarios?${searchParams.toString()}`

      router.push(newUrl, { scroll: false })

      // Recarregar dados da busca para a nova página
      if (searchTerm.trim().length >= 3) {
        handleSearchForPage(searchTerm, page)
      }
    } else {
      const newUrl = page === 1 ? '/admin/usuarios' : `/admin/usuarios?page=${page}`

      router.push(newUrl, { scroll: false })
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
    setInstantSearchResults(null)
    setSearchTerm('')
    setCurrentPage(1)
    router.push('/admin/usuarios', { scroll: false })
  }

  // Função para executar busca a partir da URL usando apenas cache
  const handleSearchFromUrl = (term: string, page: number = 1) => {
    if (!term || term.trim().length < 3) {
      return
    }

    // Se temos cache disponível, usar busca local
    if (cachedUsers && cachedUsers.length > 0) {
      const localResults = searchUsersLocal(cachedUsers, term.trim())

      if (localResults.length > 0) {
        // Usar apenas dados do cache para paginação
        const totalUsers = localResults.length
        const totalPages = Math.ceil(totalUsers / pageSize)
        const adjustedPage = Math.min(page, totalPages || 1)
        const startIndex = (adjustedPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedResults = localResults.slice(startIndex, endIndex)

        // Mapear dados do cache para o formato esperado
        const mappedResults = paginatedResults.map(user => ({
          cpf: user.cpf,
          cpfEncrypted: user.cpf, // Usar CPF como fallback
          name: user.name,
          role: user.role,
          funpresp: false // Placeholder, será atualizado quando necessário
        }))

        const searchData = {
          users: mappedResults,
          totalPages,
          currentPage: adjustedPage,
          totalUsers
        }

        setSearchResults(searchData)
      } else {
        setSearchResults({
          users: [],
          totalPages: 0,
          currentPage: 1,
          totalUsers: 0
        })
      }
    }
  }

  // Função para executar busca para uma página específica usando apenas cache
  const handleSearchForPage = (term: string, page: number) => {
    if (!term || term.trim().length < 3) {
      return
    }

    // Se temos cache disponível, usar busca local
    if (cachedUsers && cachedUsers.length > 0) {
      const localResults = searchUsersLocal(cachedUsers, term.trim())

      if (localResults.length > 0) {
        // Usar apenas dados do cache para paginação
        const totalUsers = localResults.length
        const totalPages = Math.ceil(totalUsers / pageSize)
        const adjustedPage = Math.min(page, totalPages || 1)
        const startIndex = (adjustedPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedResults = localResults.slice(startIndex, endIndex)

        // Mapear dados do cache para o formato esperado
        const mappedResults = paginatedResults.map(user => ({
          cpf: user.cpf,
          cpfEncrypted: user.cpf, // Usar CPF como fallback
          name: user.name,
          role: user.role,
          funpresp: false // Placeholder, será atualizado quando necessário
        }))

        const searchData = {
          users: mappedResults,
          totalPages,
          currentPage: adjustedPage,
          totalUsers
        }

        setSearchResults(searchData)
      } else {
        setSearchResults({
          users: [],
          totalPages: 0,
          currentPage: 1,
          totalUsers: 0
        })
      }
    }
  }

  // Busca instantânea conforme o usuário digita
  const handleInstantSearch = (term: string) => {
    if (!term || term.trim().length < 3) {
      setInstantSearchResults(null)

      return
    }

    // Se temos cache disponível, usar busca local instantânea
    if (cachedUsers && cachedUsers.length > 0) {
      const localResults = searchUsersLocal(cachedUsers, term.trim())

      if (localResults.length > 0) {
        // Buscar dados completos via API para obter cpfEncrypted
        const cpfsToSearch = localResults.map(user => user.cpf)

        // Buscar dados completos via API usando os CPFs encontrados
        fetch('/api/users/fetch-users-by-cpfs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ cpfs: cpfsToSearch })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Erro na busca')
            }

            return response.json()
          })
          .then(fullResults => {
            if (fullResults.length > 0) {
              const totalUsers = fullResults.length
              const totalPages = Math.ceil(totalUsers / pageSize)
              const adjustedPage = Math.min(currentPage, totalPages || 1)
              const startIndex = (adjustedPage - 1) * pageSize
              const endIndex = startIndex + pageSize
              const paginatedResults = fullResults.slice(startIndex, endIndex)

              setInstantSearchResults({
                users: paginatedResults,
                totalPages,
                currentPage: adjustedPage,
                totalUsers
              })
            } else {
              setInstantSearchResults({
                users: [],
                totalPages: 0,
                currentPage: 1,
                totalUsers: 0
              })
            }
          })
          .catch(error => {
            console.error('Erro ao buscar dados completos na busca instantânea:', error)

            // Em caso de erro, usar dados do cache como fallback (mas sem cpfEncrypted)
            const instantResults = localResults.map(user => ({
              cpf: user.cpf,
              cpfEncrypted: user.cpf, // Usar CPF como fallback
              name: user.name,
              role: user.role,
              funpresp: false
            }))

            const totalUsers = instantResults.length
            const totalPages = Math.ceil(totalUsers / pageSize)
            const adjustedPage = Math.min(currentPage, totalPages || 1)
            const startIndex = (adjustedPage - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedResults = instantResults.slice(startIndex, endIndex)

            setInstantSearchResults({
              users: paginatedResults,
              totalPages,
              currentPage: adjustedPage,
              totalUsers
            })
          })
      } else {
        setInstantSearchResults({
          users: [],
          totalPages: 0,
          currentPage: 1,
          totalUsers: 0
        })
      }
    }
  }

  const handleSearchButton = async () => {
    if (!searchTerm.trim() || searchTerm.trim().length < 3) {
      return
    }

    // Se temos cache disponível, usar busca local instantânea
    if (cachedUsers && cachedUsers.length > 0) {
      const localResults = searchUsersLocal(cachedUsers, searchTerm.trim())

      if (localResults.length > 0) {
        // Buscar dados completos apenas dos usuários encontrados no cache
        try {
          // Criar uma lista de CPFs para buscar dados completos
          const cpfsToSearch = localResults.map(user => user.cpf)

          // Buscar dados completos via API usando os CPFs encontrados
          const response = await fetch('/api/users/fetch-users-by-cpfs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpfs: cpfsToSearch })
          })

          if (!response.ok) {
            throw new Error('Erro na busca')
          }

          const searchResults = await response.json()

          if (searchResults.length > 0) {
            const totalUsers = searchResults.length
            const totalPages = Math.ceil(totalUsers / pageSize)
            const adjustedPage = Math.min(currentPage, totalPages || 1)
            const startIndex = (adjustedPage - 1) * pageSize
            const endIndex = startIndex + pageSize
            const paginatedResults = searchResults.slice(startIndex, endIndex)

            const searchData = {
              users: paginatedResults,
              totalPages,
              currentPage: adjustedPage,
              totalUsers
            }

            setCurrentPage(adjustedPage)

            const searchParams = new URLSearchParams()

            if (adjustedPage > 1) searchParams.set('page', adjustedPage.toString())
            searchParams.set('search', searchTerm.trim())

            const newUrl = `/admin/usuarios?${searchParams.toString()}`

            router.push(newUrl, { scroll: false })

            setSearchResults(searchData)
          } else {
            setSearchResults({
              users: [],
              totalPages: 0,
              currentPage: 1,
              totalUsers: 0
            })
          }
        } catch (error) {
          console.error('Erro ao buscar dados completos:', error)
          setSearchResults({
            users: [],
            totalPages: 0,
            currentPage: 1,
            totalUsers: 0
          })
        }
      } else {
        // Nenhum resultado encontrado no cache local
        setSearchResults({
          users: [],
          totalPages: 0,
          currentPage: 1,
          totalUsers: 0
        })
      }
    } else {
      // Fallback para busca via API se cache não estiver disponível
      try {
        const response = await fetch(`/api/users/search-users?q=${encodeURIComponent(searchTerm.trim())}`)

        if (!response.ok) {
          throw new Error('Erro na busca')
        }

        const searchResults = await response.json()

        if (searchResults.length > 0) {
          const totalUsers = searchResults.length
          const totalPages = Math.ceil(totalUsers / pageSize)
          const adjustedPage = Math.min(currentPage, totalPages || 1)
          const startIndex = (adjustedPage - 1) * pageSize
          const endIndex = startIndex + pageSize
          const paginatedResults = searchResults.slice(startIndex, endIndex)

          const searchData = {
            users: paginatedResults,
            totalPages,
            currentPage: adjustedPage,
            totalUsers
          }

          setCurrentPage(adjustedPage)

          const searchParams = new URLSearchParams()

          if (adjustedPage > 1) searchParams.set('page', adjustedPage.toString())
          searchParams.set('search', searchTerm.trim())

          const newUrl = `/admin/usuarios?${searchParams.toString()}`

          router.push(newUrl, { scroll: false })

          setSearchResults(searchData)
        } else {
          setSearchResults({
            users: [],
            totalPages: 0,
            currentPage: 1,
            totalUsers: 0
          })
        }
      } catch (error) {
        setSearchResults({
          users: [],
          totalPages: 0,
          currentPage: 1,
          totalUsers: 0
        })
      }
    }
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color='error' sx={{ mb: 2 }}>
          Erro ao carregar usuários: {error.message}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {isCached ? 'Dados em cache podem estar desatualizados.' : 'Tente novamente mais tarde.'}
        </Typography>
        <Button variant='outlined' onClick={refetch}>
          Tentar novamente
        </Button>
      </Box>
    )
  }

  return (
    <>
      {loading || cacheLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ mb: 4, width: '50%' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                placeholder='Buscar usuário (nome ou CPF) - mínimo 3 caracteres'
                variant='outlined'
                size='small'
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                  handleInstantSearch(e.target.value)
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSearchButton()
                  }
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#eeeeee'
                    }
                  }
                }}
              />
              <Button
                variant='contained'
                onClick={handleSearchButton}
                sx={{
                  minWidth: '48px',
                  height: '40px',
                  backgroundColor: '#2196f3',
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }}
              >
                <i className='fas fa-search' style={{ color: 'white' }} />
              </Button>
            </Box>
          </Box>

          {/* Indicador de busca ativa */}
          {(searchResults || instantSearchResults) && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body2' sx={{ color: '#1976d2', fontWeight: 500 }}>
                  Buscando por: &quot;{searchTerm}&quot; • {totalUsers} resultado{totalUsers !== 1 ? 's' : ''}{' '}
                  encontrado{totalUsers !== 1 ? 's' : ''}
                  {instantSearchResults && !searchResults && ' (busca instantânea)'}
                </Typography>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={clearSearch}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Limpar busca
                </Button>
              </Box>
            </Box>
          )}

          {/* Legenda de acessos */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 600,
                color: '#495057',
                mb: 2
              }}
            >
              Legenda de acessos:
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <LegendItem role='USER_SPONSOR' />
              <LegendItem role='USER_PARTICIPANT' />
              <LegendItem role='USER_OPERATOR' />
              <LegendItem role='USER_ADMIN' />
              <LegendItem role='USER_REPRESENTATIVE' />
            </Box>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CPF</TableCell>
                <TableCell sx={{ width: '60%' }}>NOME</TableCell>
                <TableCell>ACESSOS</TableCell>
                <TableCell sx={{ width: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <TableRow
                    onClick={() => {
                      router.push(`/admin/usuarios/${user.cpfEncrypted}?page=${currentPage}`)
                    }}
                    key={user.cpf}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                      '&:hover': {
                        backgroundColor: '#e3f2fd'
                      }
                    }}
                  >
                    <TableCell>{aplicarMascaraCPF(user.cpf)}</TableCell>
                    <TableCell>
                      {user.name}
                      {user.funpresp ? (
                        <img
                          src='/images/funpresp/logo.png'
                          alt='Funpresp-Jud'
                          style={{
                            height: '20px',
                            marginLeft: '8px',
                            verticalAlign: 'middle'
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell>
                      <RoleIcons roles={user.role} />
                    </TableCell>
                    <TableCell>
                      <i className='fas fa-chevron-right' />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color='primary'
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Página {currentPage} de {totalPages} • {totalUsers} usuários no total
            </Typography>
          </Box>
          <Box sx={{ mt: 8, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography
              variant='caption'
              sx={{
                color: 'primary.main',
                fontSize: '0.75rem'
              }}
            >
              Informações do Cache: Armazenados {cachedUsers?.length || 0} usuários (
              {(getTotalCacheSize() / (1024 * 1024)).toFixed(2)} MB) em{' '}
              {cacheTimestamp ? new Date(cacheTimestamp).toLocaleString('pt-BR') : 'carregando...'}
            </Typography>
            <Button
              size='small'
              variant='text'
              onClick={refreshCache}
              disabled={cacheLoading}
              sx={{
                minWidth: 'auto',
                padding: '2px 4px',
                color: 'primary.main',
                fontSize: '0.75rem',
                height: 'auto',
                minHeight: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                },
                '&:disabled': {
                  color: 'text.disabled'
                }
              }}
              title='Atualizar cache'
            >
              <i className='fas fa-sync-alt' style={{ fontSize: '0.75rem' }} />
            </Button>
          </Box>
        </>
      )}
    </>
  )
}
