import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { isValidDate } from '@/utils/validations'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dtFimParam = searchParams.get('dtFim')

    if (!dtFimParam) {
      return NextResponse.json({ error: 'Parâmetro dtFim é obrigatório' }, { status: 400 })
    }

    if (typeof dtFimParam !== 'string') {
      return NextResponse.json({ error: 'Parâmetro dtFim deve ser uma string' }, { status: 400 })
    }

    if (!isValidDate(dtFimParam)) {
      return NextResponse.json({ error: 'Data inválida' }, { status: 400 })
    }

    const dtFim = new Date(dtFimParam)
    const now = new Date()
    const minDate = new Date('1900-01-01')
    const maxDate = new Date(now.getFullYear() + 10, 11, 31) //* 10 anos

    if (dtFim < minDate || dtFim > maxDate) {
      return NextResponse.json({ error: 'Data fora do intervalo permitido' }, { status: 400 })
    }

    const totalParticipantes = await prisma.user.count({
      where: {
        createdAt: {
          lte: dtFim
        },
        role: {
          has: 'USER_PARTICIPANT'
        }
      }
    })

    return NextResponse.json({
      totalParticipantes: totalParticipantes
    })
  } catch (error) {
    console.error('Erro na consulta:', error)

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
