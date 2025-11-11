/**
 * Utilitários para gerenciar sessionStorage com verificação de ambiente
 */

/**
 * Verifica se estamos no lado do cliente (browser)
 */
export const isClientSide = (): boolean => {
  return typeof window !== 'undefined'
}

/**
 * Limpa todos os itens relacionados aos modais do sessionStorage
 * Só funciona no lado do cliente
 */
export const clearModalSessionStorage = (): void => {
  if (!isClientSide()) {
    return
  }

  try {
    sessionStorage.removeItem('campanhaModalShown')
    sessionStorage.removeItem('appStatusModalShown')
    sessionStorage.removeItem('appNaoPreencheuAppModalShown')
    sessionStorage.removeItem('appTermoNotificacaoModalShown')
  } catch (error) {
    console.warn('Erro ao limpar sessionStorage:', error)
  }
}

/**
 * Define um item no sessionStorage com verificação de ambiente
 */
export const setSessionStorageItem = (key: string, value: string): void => {
  if (!isClientSide()) {
    return
  }

  try {
    sessionStorage.setItem(key, value)
  } catch (error) {
    console.warn(`Erro ao definir ${key} no sessionStorage:`, error)
  }
}

/**
 * Obtém um item do sessionStorage com verificação de ambiente
 */
export const getSessionStorageItem = (key: string): string | null => {
  if (!isClientSide()) {
    return null
  }

  try {
    return sessionStorage.getItem(key)
  } catch (error) {
    console.warn(`Erro ao obter ${key} do sessionStorage:`, error)

    return null
  }
}

/**
 * Remove um item do sessionStorage com verificação de ambiente
 */
export const removeSessionStorageItem = (key: string): void => {
  if (!isClientSide()) {
    return
  }

  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.warn(`Erro ao remover ${key} do sessionStorage:`, error)
  }
}
