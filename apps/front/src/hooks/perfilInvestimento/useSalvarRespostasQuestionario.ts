import { PerfilInvestimentoService } from '../../services/PerfilInvestimentoService' 

export const useSalvarRespostasQuestionário = () => {
  const salvarRespostas = async (cpf: string, respostas: any[]) => {
    try {
      await PerfilInvestimentoService.salvarRespostas(cpf, respostas)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    salvarRespostas
  }
}
