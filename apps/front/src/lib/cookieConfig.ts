import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// Configuração de cookies - detecta automaticamente se tem HTTPS
const hasHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https://') || false

// Configuração base para todos os cookies
const baseCookieConfig: Partial<ResponseCookie> = {
  path: '/',
  sameSite: 'lax' as const // Melhor compatibilidade com integrações externas
}

// Configuração para JWT Token (access token)
export const jwtTokenConfig: Partial<ResponseCookie> = {
  ...baseCookieConfig,
  httpOnly: false, // Permite acesso via JavaScript para requisições autenticadas
  maxAge: 8 * 60 * 60, // 8 horas
  secure: hasHttps // true apenas se tiver HTTPS
}

// Configuração para Refresh Token
export const refreshTokenConfig: Partial<ResponseCookie> = {
  ...baseCookieConfig,
  httpOnly: hasHttps, // Protege contra XSS - não acessível via JavaScript
  maxAge: 30 * 24 * 60 * 60, // 30 dias
  secure: hasHttps // true apenas se tiver HTTPS
}
