import { useState } from 'react'

import { TextField, Typography } from '@mui/material'

import { useSalvarRespostasQuestionário } from '@/hooks/perfilInvestimento/useSalvarRespostasQuestionário'
import { useCheckSenha } from '@/hooks/useCheckSenha'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'

export default function DialogConfirmeSenha({
  cpf,
  respostas,
  open,
  handleClose,
  handleEtapa,
  onSuccess,
  descricao
}: {
  cpf: string
  respostas?: any[]
  open: boolean
  handleClose: () => void
  handleEtapa?: () => void
  onSuccess?: () => void
  descricao: string
}) {
  const { salvarRespostas } = useSalvarRespostasQuestionário()
  const { checkSenha, error } = useCheckSenha()
  const [senha, setSenha] = useState('')
  const [isCorrectPassword, setIsCorrectPassword] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSalvarRespostas = async (cpf: string, respostas: any[]) => {
    // Previne chamadas duplicadas
    if (isSubmitting) {
      return
    }

    if (!senha.trim()) {
      setIsCorrectPassword(false)

      return
    }

    setIsSubmitting(true)

    try {
      const response = await checkSenha(cpf, senha)

      if (response.success) {
        setIsCorrectPassword(true)
        await salvarRespostas(cpf, respostas)

        // Chama o callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess()
        }

        handleEtapa?.()
        handleClose()
        setSenha('')
      } else {
        setIsCorrectPassword(false)
        setSenha('')
      }
    } catch (error) {
      setSenha('')
      setIsCorrectPassword(false)
    } finally {
      setSenha('')
    }
  }

  const VerifySenha = async () => {
    try {
      const response = await checkSenha(cpf, senha)

      if (response.success) {
        setIsCorrectPassword(true)

        // Chama o callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess()
        }

        handleClose()
        setSenha('')
      } else {
        setIsCorrectPassword(false)
       
      }
    } catch (error) {
      setIsCorrectPassword(false)
      
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    
    try {
      if (respostas?.length) {
        await handleSalvarRespostas(cpf, respostas)
      } else {
        await VerifySenha()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DialogCustomized
      id='dialog-confirme-senha'
      aria-labelledby='dialog-confirme-senha'
      open={open}
      onClose={handleClose}
      title='Confirme sua identidade'
      textAlign='center'
      content={
        <div>
          <Typography variant='body1'>{descricao}</Typography>
          <TextField
            fullWidth
            id='filled-basic'
            label='Senha'
            variant='filled'
            type='password'
            value={senha}
            onChange={e => setSenha(e.target.value)}
            helperText={isCorrectPassword === false ? error || 'Senha incorreta' : null}
            error={isCorrectPassword === false}
            disabled={isSubmitting}
          />
        </div>
      }
      actions={
        <div className='w-full mt-2'>
          <div className='max-w-[600px] flex text-center gap-4 m-auto'>
            <ButtonCustomized onClick={handleClose} variant='outlined' color='primary'>
              Voltar
            </ButtonCustomized>
            <ButtonCustomized onClick={handleSubmit} variant='contained' disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Confirmar'}
            </ButtonCustomized>
          </div>
        </div>
      }
    />
  )
}
