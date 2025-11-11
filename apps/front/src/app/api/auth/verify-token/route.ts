import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import { jwtVerify } from 'jose'

import type { JWTPayload } from '@/types/jwtPayloadTypes'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' do início

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    // Verifica o token JWT
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))

    // Converte o payload para o tipo correto
    const userPayload = payload as JWTPayload

    // Retorna os dados do usuário do payload
    return NextResponse.json({
      id: userPayload.id,
      nome: userPayload.nome,
      cpf: userPayload.cpf,
      email: userPayload.email,
      roles: userPayload.roles || [],
      sexo: userPayload.sexo
    })
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    
return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
  }
}
