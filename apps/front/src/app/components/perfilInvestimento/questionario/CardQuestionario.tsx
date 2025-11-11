import { useEffect, useState, useRef } from 'react'

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'

import DialogConfirmeSenha from './DialogConfirmeSenha'
import useGetQuestionario from '@/hooks/perfilInvestimento/useGetQuestionario'
import { getUserFromToken } from '@/lib/auth'
import type { UserType } from '@/types/UserType'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export default function CardQuestionario({
  handleEtapaQuestionario,
  onQuestionarioSuccess
}: {
  handleEtapaQuestionario: (etapaQuestionario: number) => void
  onQuestionarioSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({})
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [todasRespostas, setTodasRespostas] = useState<any[]>([])
  const [user, setUser] = useState<UserType | null>(null)
  const questionarioRef = useRef<HTMLDivElement>(null)

  const handleRadioChange = (questionId: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const { questionario, error, getQuestionario } = useGetQuestionario()

  useEffect(() => {
    const loadQuestionario = async () => {
      await getQuestionario()
    }

    const fetchUser = async () => {
      const userData = await getUserFromToken()

      if (userData) {
        setUser(userData as UserType)
      }
    }

    loadQuestionario()
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToTop = () => {
    // Tenta diferentes métodos de scroll
    try {
      // Método 1: Scroll para o elemento do questionário
      if (questionarioRef.current) {
        questionarioRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      } else {
        // Método 2: window.scrollTo
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      try {
        // Método 3: document.documentElement.scrollTop
        document.documentElement.scrollTop = 0
      } catch (error2) {
        try {
          // Método 4: document.body.scrollTop
          document.body.scrollTop = 0
        } catch (error3) {
          // Método 5: scroll instantâneo
          window.scrollTo(0, 0)
        }
      }
    }
  }

  const handleNextBlock = () => {
    if (currentBlockIndex < (questionario?.blocos.length || 0) - 1) {
      setCurrentBlockIndex(prev => prev + 1)

      // Usa setTimeout para garantir que o estado foi atualizado
      setTimeout(() => {
        scrollToTop()
      }, 100)
    }
  }

  const handlePreviousBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(prev => prev - 1)

      // Usa setTimeout para garantir que o estado foi atualizado
      setTimeout(() => {
        scrollToTop()
      }, 100)
    }
  }

  const isCurrentBlockComplete = () => {
    if (!questionario) return false
    const currentBlock = questionario.blocos[currentBlockIndex]

    return currentBlock.perguntas.every(pergunta => selectedValues[pergunta.id])
  }

  const calculateProgress = () => {
    if (!questionario) return 0
    const totalQuestions = questionario.blocos.reduce((acc, bloco) => acc + bloco.perguntas.length, 0)
    const answeredQuestions = Object.keys(selectedValues).length

    return (answeredQuestions / totalQuestions) * 100
  }

  const salvarRespostas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (questionario?.blocos && currentBlockIndex === questionario.blocos.length - 1) {
      // Monta o array de respostas no padrão solicitado
      const respostasFormatadas = questionario.blocos.flatMap(bloco =>
        bloco.perguntas.map(pergunta => ({
          id_app_questionario: questionario.id,
          id_app_pergunta: pergunta.id,
          id_app_alternativa: selectedValues[pergunta.id] ? Number(selectedValues[pergunta.id]) : null
        }))
      )

      setTodasRespostas(respostasFormatadas)
      setOpen(true)
    }
  }

  if (error) {
    return <div className='text-error-main'>Erro ao buscar questionário: {error}</div>
  }

  if (!questionario) {
    return <div>Carregando questionário...</div>
  }

  const currentBlock = questionario.blocos[currentBlockIndex]

  return (
    <div ref={questionarioRef}>
      <Card className='flex flex-col hover:shadow-xl transition-shadow duration-300 h-full sm:py-10 sm:px-7 py-4 px-2 '>
        <LinearProgress variant='determinate' value={calculateProgress()} className='mx-5' sx={{ padding: '0.5rem' }} />
        <CardHeader
          title={`Parte ${currentBlockIndex + 1} de ${questionario.blocos.length} - ${currentBlock.descricao}`}
          titleTypographyProps={{ variant: 'h4' }}
        />
        <CardContent>
          <form onSubmit={salvarRespostas}>
            {currentBlock.perguntas.map((pergunta, index) => (
              <Box
                key={pergunta.id}
                className={`sm:p-8 p-4 rounded-3xl border-2 border-gray-300 mb-6
                                ${selectedValues[pergunta.id] ? 'bg-blue-50' : ''}`}
              >
                <FormControl>
                  <FormLabel
                    id={pergunta.id}
                    className='text-gray-600
                                        text-left
                                        align-left
                                        text-[22px]'
                  >
                    <Typography variant='h5' sx={{ fontSize: '1.25rem' }}>
                      {index + 1}. {pergunta.descricao}
                    </Typography>
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby={pergunta.id}
                    name={`pergunta-${pergunta.id}`}
                    value={selectedValues[pergunta.id] || ''}
                    onChange={e => handleRadioChange(pergunta.id, e.target.value)}
                    sx={{
                      marginTop: '1rem',
                      gap: '1rem'
                    }}
                  >
                    {pergunta.alternativas.map(alternativa => (
                      <FormControlLabel
                        value={alternativa.id}
                        control={<Radio sx={{ paddingTop: 0 }} />}
                        label={<Typography variant='body1'>{alternativa.descricao}</Typography>}
                        key={alternativa.id}
                        sx={{
                          alignItems: 'flex-start',
                          paddingBottom: 0,
                          paddingTop: 0
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}

            <div className='w-full mt-2'>
              <div className='max-w-[600px] flex text-center gap-4 m-auto'>
                <ButtonCustomized
                  variant='outlined'
                  onClick={handlePreviousBlock}
                  disabled={currentBlockIndex === 0}
                  startIcon={<i className='fa-solid fa-arrow-left'></i>}
                >
                  Voltar
                </ButtonCustomized>
                {currentBlockIndex !== questionario.blocos.length - 1 ? (
                  <ButtonCustomized
                    variant='contained'
                    onClick={handleNextBlock}
                    disabled={!isCurrentBlockComplete()}
                    endIcon={<i className='fa-solid fa-arrow-right'></i>}
                  >
                    Prosseguir
                  </ButtonCustomized>
                ) : (
                  <ButtonCustomized
                    variant='contained'
                    type='submit'
                    disabled={!isCurrentBlockComplete()}
                    endIcon={<i className='fa-solid fa-check'></i>}
                  >
                    Concluir
                  </ButtonCustomized>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <DialogConfirmeSenha
        cpf={user?.cpf || ''}
        respostas={todasRespostas}
        open={open}
        handleClose={() => setOpen(false)}
        handleEtapa={() => handleEtapaQuestionario(2)}
        onSuccess={onQuestionarioSuccess}
        descricao=' Para finalizar o envio de suas respostas precisamos confirmas sua identidade, para isso, por favor insira
            sua senha no campo abaixo.'
      />
    </div>
  )
}
