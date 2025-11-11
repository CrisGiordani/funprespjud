import { NextResponse } from 'next/server'

import { apiTrust } from '@/lib/apiTrust'
import type { LoginResponseType } from '@/types/apiTrust/LoginResponse.type'

const WEB_API_ADM = '/WebApiAdm/api'
const LOGIN = process.env.API_TRUST_LOGIN || ''
const SENHA = process.env.API_TRUST_SENHA || ''

async function getTrustToken(): Promise<string> {
  const loginResponse = await apiTrust.post<LoginResponseType>(
    `${WEB_API_ADM}/Login/Autenticar`,
    {
      login: LOGIN,
      senha: SENHA
    }
  )

  return loginResponse.data.token
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idPessoa = searchParams.get('idPessoa')
  const idPessoaParticipante = searchParams.get('idPessoaParticipante')
  const idPlano = searchParams.get('idPlano')

  if (!idPessoa || !idPessoaParticipante || !idPlano) {
    return NextResponse.json(
      { message: 'ID Pessoa, ID Pessoa Participante e ID Plano são obrigatórios' },
      { status: 400 }
    )
  }

  try {
    let token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      // Sem token no header -> gera um novo no servidor
      token = await getTrustToken()
    }

    const makeRequest = async (bearer: string) =>
      apiTrust.get<string>(
        `${WEB_API_ADM}/WebUrlSimuladorEmprestimo/GerarCriptografia/${idPessoa}/${idPessoaParticipante}/${idPlano}`,
        {
          headers: {
            Authorization: `Bearer ${bearer}`
          }
        }
      )

    try {
      const responseApiTrust = await makeRequest(token)

      return NextResponse.json(responseApiTrust.data)
    } catch (err: any) {
      // Se o token estiver expirado/401, tenta uma vez obter novo token e refazer
      const status = err?.response?.status
      const wwwAuth: string | undefined = err?.response?.headers?.['www-authenticate']
      const isExpired = status === 401 || (typeof wwwAuth === 'string' && wwwAuth.includes('invalid_token'))

      if (isExpired) {
        try {
          const freshToken = await getTrustToken()
          const retryResponse = await makeRequest(freshToken)

          return NextResponse.json(retryResponse.data)
        } catch (retryErr) {
          // Se ainda 401, retorna não autorizado específico

          return NextResponse.json(
            { message: 'Não autorizado pela API Trust (token inválido ou expirado).' },
            { status: 401 }
          )
        }
      }

      throw err
    }
  } catch (err: any) {
    console.error('Erro ao gerar a chave da API Trust:', err)

    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      console.error('Timeout ao conectar com a API Trust')

      return NextResponse.json(
        { message: 'Timeout ao conectar com a API Trust. Tente novamente mais tarde.' },
        { status: 504 }
      )
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      console.error('Erro de conexão com a API Trust')

      return NextResponse.json(
        { message: 'Erro ao conectar com a API Trust. Verifique a conectividade.' },
        { status: 503 }
      )
    }

    const status = err?.response?.status
    
    if (status && typeof status === 'number') {
      return NextResponse.json({ message: 'Erro na API Trust' }, { status })
    }

    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 })
  }
}
