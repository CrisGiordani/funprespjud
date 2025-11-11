import { useState } from 'react'

import { TextField, Alert } from '@mui/material'
import InputMask from 'react-input-mask'

import { validateCpf } from '@/utils/validations'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

interface VerificaCpfInputProps {
  onNext: (cpf: string) => void
  onBack: () => void
}

const VerificaCpfInput = ({ onNext, onBack }: VerificaCpfInputProps) => {
  const [cpf, setCpf] = useState('')
  const [cpfError, setCpfError] = useState('')

  const handleCpfChange = (newCpf: string) => {
    setCpf(newCpf)
    setCpfError('')
  }

  const handleCpfBlur = () => {
    if (cpf.trim()) {
      const errorMsg = validateCpf(cpf)

      setCpfError(errorMsg)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!cpf.trim()) {
      setCpfError('Por favor, insira seu CPF')

      return
    }

    const errorMsg = validateCpf(cpf)

    if (errorMsg) {
      setCpfError(errorMsg)

      return
    }

    onNext(cpf)
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <InputMask
        mask='999.999.999-99'
        maskChar={null}
        value={cpf}
        onChange={e => handleCpfChange(e.target.value)}
        onBlur={handleCpfBlur}
      >
        {(inputProps: any) => (
          <TextField variant='filled' {...inputProps} label='CPF' fullWidth error={!!cpfError} helperText={cpfError} />
        )}
      </InputMask>

      {cpfError && <Alert severity='error'>{cpfError}</Alert>}

      <div className='w-full'>
        <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
          <ButtonCustomized fullWidth variant='contained' type='submit'>
            Continuar
          </ButtonCustomized>

          <ButtonCustomized fullWidth variant='outlined' onClick={onBack}>
            Voltar
          </ButtonCustomized>
        </div>
      </div>
    </form>
  )
}

export default VerificaCpfInput
