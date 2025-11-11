import { useCallback, useState } from 'react'

import { PerfilInvestimentoService } from '@/services/PerfilInvestimentoService'
import type { QuestionarioType } from '@/types/perfilInvestimento/QuestionarioType'

export default function useGetQuestionario() {
  const [questionario, setQuestionario] = useState<QuestionarioType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getQuestionario = useCallback(async () => {
    try {
      const result = await PerfilInvestimentoService.getQuestionario()

      setQuestionario(result)
    } catch (error) {
      setError(error as string)
      throw error
    }
  }, [])

  return { questionario, error, getQuestionario }
}
