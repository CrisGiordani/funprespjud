import { NextResponse } from 'next/server'

import { apiTrust } from '@/lib/apiTrust'
import type { LoginResponseType } from '@/types/apiTrust/LoginResponse.type'

const WEB_API_ADM = '/WebApiAdm/api'
const LOGIN = process.env.API_TRUST_LOGIN || ''
const SENHA = process.env.API_TRUST_SENHA || ''

export async function GET() {
  try {
    const responseApiTrust = await apiTrust.post<LoginResponseType>(`${WEB_API_ADM}/Login/Autenticar`, {
      login: LOGIN,
      senha: SENHA
    })

    const response = NextResponse.json(responseApiTrust.data)

    return response
  } catch (err: any) {
    console.error('Erro no login da API Trust:', err)

    // Verifica se é erro de timeout
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      console.error('Timeout ao conectar com a API Trust')

      return NextResponse.json(
        { message: 'Timeout ao conectar com a API Trust. Tente novamente mais tarde.' },
        { status: 504 }
      )
    }

    // Verifica se é erro de conexão
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      console.error('Erro de conexão com a API Trust')

      return NextResponse.json(
        { message: 'Erro ao conectar com a API Trust. Verifique a conectividade.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 })
  }
}
