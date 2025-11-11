import { z } from 'zod'

// CPF validation schema
export const cpfSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .refine(cpf => {
    const cleanCpf = cpf.replace(/\D/g, '')

    if (cleanCpf.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false

    let sum = 0

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
    }

    let remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0

    if (remainder !== parseInt(cleanCpf.charAt(9))) return false

    sum = 0

    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
    }

    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0

    if (remainder !== parseInt(cleanCpf.charAt(10))) return false

    return true
  }, 'CPF inválido')

// Email validation schema
export const emailSchema = z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido')

// Password validation function
export const validatePassword = (password: string) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)

  if (password.length < minLength) {
    return 'A senha deve ter pelo menos 8 caracteres'
  }

  if (!hasUpperCase) {
    return 'A senha deve conter pelo menos uma letra maiúscula'
  }

  if (!hasLowerCase) {
    return 'A senha deve conter pelo menos uma letra minúscula'
  }

  if (!hasNumbers) {
    return 'A senha deve conter pelo menos um número'
  }

  return ''
}

// Email validation function
export const validateEmail = (emailValue: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailValue.trim()) {
    return 'E-mail é obrigatório'
  }

  if (!emailRegex.test(emailValue)) {
    return 'E-mail inválido'
  }

  return ''
}

export const validateCpf = (cpf: string): string => {
  try {
    cpfSchema.parse(cpf)

    return ''
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message
    }

    return 'CPF inválido'
  }
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)

  
return date instanceof Date && !isNaN(date.getTime())
}
