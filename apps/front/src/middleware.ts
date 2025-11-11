// middleware.ts
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { jwtVerify } from 'jose'

import { RoleEnum } from '@/generated/prisma'

const PUBLIC_PATHS = [
  '/login',
  '/cadastro',
  '/api/auth/login',
  '/api/auth/refresh-token',
  '/api/auth/logout',
  '/api/users/cpf-check',
  '/api/users/fetch-users-nonfunpresp',
  '/api/auth/first-access-email',
  '/api/auth/verify-code',
  '/api/auth/recuperacao-senha-email'
]

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(p => pathname.startsWith(p))
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Verifica se está em modo viewer de duas formas:
  // 1. Cookie 'viewerMode' (persiste durante navegação - mais confiável)
  // 2. Query parameter 'viewer' na URL (para primeira carga)
  const viewerCookie = request.cookies.get('viewerMode')?.value
  const viewerCpfQuery = searchParams.get('viewer')
  const viewerCpf = viewerCookie || viewerCpfQuery
  const isViewerMode = !!viewerCpf

  // Permite rotas públicas
  if (isPublic(pathname)) {
    return NextResponse.next()
  }

  const jwtToken = request.cookies.get('jwtToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Se não há JWT mas há refresh token, permite passar (o cliente fará refresh)
  if (!jwtToken && refreshToken) {
    return NextResponse.next()
  }

  // Se não há nenhum token, redireciona para login
  if (!jwtToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se há JWT, verifica se é válido
  if (jwtToken) {
    try {
      const { payload } = await jwtVerify(jwtToken, new TextEncoder().encode(process.env.JWT_SECRET))

      const roles = payload.roles as RoleEnum[]

      // Se é rota de admin, verifica se o usuário tem permissão
      if (
        pathname.startsWith('/admin/') ||
        pathname.startsWith('/api/users/fetch-users') ||
        pathname.startsWith('/api/users/fetch-users-by-cpfs') ||
        pathname.startsWith('/api/users/fetch-users-names-cpfs')
      ) {
        if (!roles || (!roles.includes(RoleEnum.USER_ADMIN) && !roles.includes(RoleEnum.USER_OPERATOR))) {
          return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }
      }

      // Se for apenas OPERATOR/ADMIN sem PARTICIPANT, direciona para a rota de admin
      // MAS: Se estiver em modo viewer, permite acesso às rotas de participante
      // Mas não redireciona rotas de API
      if (
        (roles.includes(RoleEnum.USER_OPERATOR) || roles.includes(RoleEnum.USER_ADMIN)) &&
        !roles.includes(RoleEnum.USER_PARTICIPANT) &&
        !pathname.startsWith('/admin') &&
        !pathname.startsWith('/api') &&
        !isViewerMode // Permite acesso se estiver em modo viewer
      ) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      return NextResponse.next()
    } catch (err) {
      console.error('JWT inválido/expirado:', err)

      // Se há refresh token, permite passar para o cliente tentar refresh
      if (refreshToken) {
        return NextResponse.next()
      }

      // Se não há refresh token, redireciona para login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Se chegou até aqui, permite o acesso
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/inicio',
    '/admin/:path*',
    '/outros/:path*',
    '/patrimonio/:path*',
    '/pessoal/:path*',
    '/servicos/:path*',
    '/api/users/:path*',
    '/api/permissions/:path*',
    '/api/trust/:path*'
  ],
  runtime: 'nodejs'
}
