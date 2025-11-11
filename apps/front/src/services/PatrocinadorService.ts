import { api } from '@/lib/api'
import type { CargosDTOType } from '@/types/patrocinador/CargosDTOType'
import type { PatrocinadoresDTOType } from '@/types/patrocinador/PatrocinadoresDTOType'

export const PatrocinadorService = {
  getPatrocinador: async (cpf: string) => {
    try {
      return await api.get<PatrocinadoresDTOType>(`/participantes/${cpf}/imposto-renda/patrocinadores`)
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  getPatrocinadorSalario: async (cpf: string) => {
    try {
      const response = await api.get<PatrocinadoresDTOType>(`/participantes/${cpf}/patrocinador`)
      
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }, 

  getCargos: async (cpf: string) => {
    try {
      const response = await api.get<CargosDTOType[]>(`/patrocinador/listar-cargos/${cpf}`)

      
return response.data
    } catch (error) {
      throw error
    }
  }
}
