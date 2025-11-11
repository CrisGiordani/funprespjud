import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const secretKey = Buffer.from(process.env.CRYPTO_KEY!, 'hex')
const iv = Buffer.from(process.env.CRYPTO_IV!, 'hex')

/**
 * Criptografa um texto usando AES-256-CBC
 * @param text - Texto a ser criptografado
 * @returns Texto criptografado em formato hexadecimal
 */
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')

  encrypted += cipher.final('hex')

  return encrypted
}

/**
 * Descriptografa um texto criptografado usando AES-256-CBC
 * @param encryptedText - Texto criptografado em formato hexadecimal
 * @returns Texto descriptografado
 */
export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')

  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Criptografa um CPF para armazenamento no banco de dados
 * @param cpf - CPF no formato 000.000.000-00 ou 00000000000
 * @returns CPF criptografado
 */
export function encryptCpf(cpf: string): string {
  const cpfLimpo = cpf.replace(/[^\d]/g, '')

  return encrypt(cpfLimpo)
}

/**
 * Descriptografa um CPF armazenado no banco de dados
 * @param encryptedCpf - CPF criptografado
 * @returns CPF no formato 00000000000
 */
export function decryptCpf(encryptedCpf: string): string {
  return decrypt(encryptedCpf)
}
