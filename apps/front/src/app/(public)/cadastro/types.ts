export type CadastroStep =
  | 'recuperacao-de-senha'
  | 'redefinicao-de-senha'
  | 'verificacao-de-cpf'
  | 'primeiro-acesso'
  | 'sucesso'
  | 'sucesso-email-primeiro-acesso'
  | 'criacao-de-senha'
  | 'token-expirado'

export interface FluxoDeCadastro {
  cpf: string
  email: string
  token: string
  step: CadastroStep
}
export interface NavigationProps {
  navigateTo: (step: CadastroStep, data?: Partial<FluxoDeCadastro>) => void
  goToLogin: () => void
}

export interface VerificaCpfProps extends NavigationProps {
  cpf: string
}
export interface PrimeiroAcessoProps extends NavigationProps {
  cpf: string
  email: string
  token: string
  isCriacaoDeSenha?: boolean
}
export interface RedefinicaoDeSenhaProps extends NavigationProps {
  cpf: string
  email: string
  token: string
}
export interface SucessoProps {
  goToLogin: () => void
}

export interface SucessoEmailPrimeiroAcessoProps {
  goToLogin: () => void
}
