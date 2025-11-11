export type JWTPayload = {
  id: string
  nome: string
  cpf: string
  roles: string[]
  email: string
  sexo?: string
  exp?: number
  iat?: number
}

export type JWTRefreshPayload = {
  jti: string
  exp?: number
  iat?: number
}

export type TableUserWithProfileType = {
  password: string
  nome: string
  cpf: string
  roles: string[]
  email: string
  sexo?: string
}
