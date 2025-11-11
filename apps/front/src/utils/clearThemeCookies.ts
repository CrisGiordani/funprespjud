// Utilitário para limpar cookies relacionados ao tema
export const clearThemeCookies = () => {
  if (typeof window !== 'undefined') {
    // Remove o cookie de configurações do tema
    document.cookie = 'materialize=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // Remove o cookie de preferência de cor
    document.cookie = 'colorPref=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // Remove o cookie de modo do MUI
    document.cookie = 'funpresp-jud-mui-template-mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // Força o reload da página para aplicar as mudanças
    window.location.reload()
  }
}

// Função para verificar se o modo está sendo forçado como light
export const checkThemeMode = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';')

    const themeCookies = cookies.filter(
      cookie =>
        cookie.includes('materialize') ||
        cookie.includes('colorPref') ||
        cookie.includes('funpresp-jud-mui-template-mode')
    )

    return themeCookies
  }

  return []
}
