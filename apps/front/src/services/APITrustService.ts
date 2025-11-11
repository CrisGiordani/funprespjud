import { apiNode } from '@/lib/api'
import type { LoginResponseType } from '@/types/apiTrust/LoginResponse.type'

export const APITrustService = {
  login: async () => {
    const response = await apiNode.get<LoginResponseType>(`/trust/login`)

    return response.data
  },
  getKey: async ({
    idPessoa,
    idPessoaParticipante,
    idPlano
  }: {
    idPessoa: string
    idPessoaParticipante: string
    idPlano: string
  }) => {
    let token = ''

    await APITrustService.login().then((response: LoginResponseType) => {
      token = response.token
    })

    const response = await apiNode.get<string>(
      `/trust/get-key?idPessoa=${idPessoa}&idPessoaParticipante=${idPessoaParticipante}&idPlano=${idPlano}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data
  }
}
