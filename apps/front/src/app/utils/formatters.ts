/**
 * Formata um número de telefone brasileiro para o padrão +55 (DD) XXXXX XXXX
 * @param numero Número de telefone com ou sem formatação
 * @returns Número formatado ou string vazia se inválido
 */
export const formatarTelefoneBR = (numero: string | null | undefined): string => {
  if (!numero) return ''

  // Remove todos os caracteres não numéricos
  const numeros = numero.replace(/\D/g, '')

  // Se começar com 55, remove para formatar o número real
  const numeroSemDDI = numeros.startsWith('55') ? numeros.slice(2) : numeros

  // Se tiver 10 dígitos (fixo) ou 11 dígitos (celular)
  if (numeroSemDDI.length === 10 || numeroSemDDI.length === 11) {
    const ddd = numeroSemDDI.slice(0, 2)
    const resto = numeroSemDDI.slice(2)

    const restoFormatado =
      resto.length === 9 ? `${resto.slice(0, 5)}-${resto.slice(5)}` : `${resto.slice(0, 4)}-${resto.slice(4)}`

    // Formata sempre como +55 (DD) XXXXX XXXX
    return `+55 (${ddd}) ${restoFormatado}`
  }

  return numero
}

export const normalizarCpf = (cpf: string | null | undefined): string | null => {
  if (!cpf) return null

  // Remove todos os caracteres não numéricos
  return cpf.replace(/\D/g, '')
}

export const normalizarTelefone = (telefone: string | null | undefined): string | null => {
  if (!telefone) return null

  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '')

  // Se começar com 55, remove para validar o número real
  const numeroSemDDI = numeros.startsWith('55') ? numeros.slice(2) : numeros

  // Verifica se tem 10 dígitos (fixo) ou 11 dígitos (celular)
  if (numeroSemDDI.length === 10 || numeroSemDDI.length === 11) {
    return numeroSemDDI
  }

  return null
}

/**
 * Converte uma data do formato brasileiro (DD/MM/AAAA ou DD/MM/AAAA HH:mm:ss) para o formato SQL (AAAA-MM-DD ou AAAA-MM-DD HH:mm:ss)
 * @param data Data no formato DD/MM/AAAA ou DD/MM/AAAA HH:mm:ss
 * @returns Data no formato AAAA-MM-DD ou AAAA-MM-DD HH:mm:ss ou string vazia se inválida
 */
export const formatarDataISO = (data: string | undefined): string => {
  if (!data) return ''

  // Verifica se a data está no formato DD/MM/AAAA HH:mm:ss
  const regexComHora = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
  const matchComHora = data.match(regexComHora)

  if (matchComHora) {
    const [, dia, mes, ano, hora, minuto, segundo] = matchComHora

    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`
  }

  // Verifica se a data está no formato DD/MM/AAAA
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const match = data.match(regex)

  if (match) {
    const [, dia, mes, ano] = match

    return `${ano}-${mes}-${dia}`
  }

  return data
}

/**
 * Converte uma data do formato SQL (AAAA-MM-DD) ou ISO 8601 para o formato brasileiro (DD/MM/AAAA)
 * @param data Data no formato AAAA-MM-DD ou ISO 8601
 * @returns Data no formato DD/MM/AAAA ou string vazia se inválida
 */
export const formatarDataBR = (data: string | undefined): string => {
  if (!data) return ''

  // Remove a parte de tempo se existir (formato ISO 8601 com T)
  let dataSemTempo = data.split('T')[0]

  // Remove a parte de tempo se existir (formato YYYY-MM-DD HH:MM:SS.SSSSSS)
  dataSemTempo = dataSemTempo.split(' ')[0]

  // Verifica se a data está no formato AAAA-MM-DD
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/
  const match = dataSemTempo.match(regex)

  if (match) {
    const [, ano, mes, dia] = match

    return `${parseInt(dia)}/${parseInt(mes)}/${ano}`
  }

  return data
}

/**
 * @param data Data em qualquer formato válido
 * @param meses Quantidade de meses a serem adicionados
 * @returns Data no formato DD/MM/AAAA com os meses adicionados
 */
export const formatarDataBRAddMeses = (data: string | undefined, meses: number): string => {
  if (!data) return ''

  let dataObj: Date
  const regexBR = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const matchBR = data.match(regexBR)

  if (matchBR) {
    const [, dia, mes, ano] = matchBR

    dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
  } else {
    dataObj = new Date(data)
  }

  if (isNaN(dataObj.getTime())) {
    return ''
  }

  dataObj.setMonth(dataObj.getMonth() + meses)

  return dataObj.toLocaleDateString('pt-BR')
}

export const formatarHorasMinutosSegundos = (
  totalSegundos: number,
  padrao: 'HH:mm:ss' | 'HH:mm' | 'mm:ss' = 'HH:mm:ss'
): string => {
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60

  if (padrao === 'HH:mm') {
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
  }

  if (padrao === 'mm:ss') {
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
  }

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
}

/**
 * Remove a máscara de um CNPJ, retornando apenas os números
 * @param cnpj CNPJ com ou sem máscara
 * @returns CNPJ apenas com números
 */
export const removerMascaraCNPJ = (cnpj: string | undefined): string => {
  if (!cnpj) return ''

  return cnpj.replace(/\D/g, '')
}

/**
 * Aplica a máscara padrão de CNPJ (XX.XXX.XXX/0001-XX)
 * @param cnpj CNPJ apenas com números
 * @returns CNPJ formatado
 */
export const aplicarMascaraCNPJ = (cnpj: string | undefined): string => {
  if (!cnpj) return ''
  const numeros = cnpj.replace(/\D/g, '')

  if (numeros.length !== 14) return cnpj

  return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export const aplicarMascaraCPF = (cpf: string | undefined): string => {
  if (!cpf) return ''
  const numeros = cpf.replace(/\D/g, '')

  if (numeros.length !== 11) return cpf

  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const aplicarMascaraDinheiro = (valor: string | number | null | undefined): string => {
  if (!valor) return ''

  if (typeof valor === 'number') {
    valor = valor.toString()
  }

  return `R$ ${aplicarMascaraDecimal(valor)}`
}

export const generateAnos = () => {
  const currentYear = new Date().getFullYear()

  const optionsAno = Array.from({ length: currentYear - 2012 + 1 }, (_, i) => {
    const year = currentYear - i

    return { label: String(year), value: year }
  })

  return optionsAno
}

export const generateMeses = () => {
  const meses = [
    { label: 'Janeiro', value: 1 },
    { label: 'Fevereiro', value: 2 },
    { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Maio', value: 5 },
    { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 },
    { label: 'Novembro', value: 11 },
    { label: 'Dezembro', value: 12 }
  ]

  return meses
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export const leftZero = (value: number): string => {
  return value.toString().padStart(2, '0')
}

/**
 * Mascara um email, mantendo informações suficientes para reconhecimento
 * @param email - Email a ser mascarado
 * @returns Email mascarado
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email

  const [localPart, domain] = email.split('@')

  // Se a parte local tem 2 caracteres ou menos, mostra apenas o primeiro
  if (localPart.length <= 2) {
    return `${localPart.charAt(0)}***@${domain}`
  }

  // Calcula asteriscos proporcionais (entre 3-8 asteriscos baseado no tamanho)
  const asteriskCount = Math.min(8, Math.max(3, Math.floor(localPart.length * 0.6)))
  const asterisks = '*'.repeat(asteriskCount)

  // Mascara a parte local mantendo primeira e última letra
  const maskedLocal = localPart.charAt(0) + asterisks + localPart.charAt(localPart.length - 1)

  // Mascara o domínio mantendo primeira letra e extensão
  const domainParts = domain.split('.')

  if (domainParts.length >= 2) {
    const extension = domainParts[domainParts.length - 1]
    const domainName = domainParts[0]
    const domainAsterisks = '*'.repeat(Math.min(6, Math.max(3, Math.floor(domainName.length * 0.5))))
    const maskedDomain = domainName.charAt(0) + domainAsterisks + '.' + extension

    return `${maskedLocal}@${maskedDomain}`
  }

  // Fallback se não conseguir separar o domínio
  return `${maskedLocal}@***`
}

export function formatPercentage(value: number | null | undefined, casasDecimais: number = 2) {
  if (!value || isNaN(value) || value === 0) return '0,' + '0'.repeat(casasDecimais) + '%'

  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: casasDecimais, maximumFractionDigits: casasDecimais })}%`
}

export const aplicarMascaraDecimal = (valor: string | number | null | undefined, casasDecimais: number = 2): string => {
  if (!valor) return ''

  if (typeof valor === 'number') {
    valor = valor.toString()
  }

  const hasOneDecimalNumber = (valor: string): boolean => {
    const arr = valor.split('.')

    return arr[arr.length - 1].length === 1
  }

  valor = hasOneDecimalNumber(valor) ? valor + '0' : valor

  // Remove tudo que não é número
  const apenasNumeros = valor.replace(/\D/g, '')

  // Se não tem números, retorna vazio
  if (apenasNumeros === '') return ''

  // Converte para frações decimais (mínimo 2 dígitos)
  const fracoes = apenasNumeros.padStart(casasDecimais, '0')

  // Separa inteiros e decimais
  const inteiros = fracoes.slice(0, -casasDecimais) || '0'
  const fracoesPart = fracoes.slice(-casasDecimais)

  // Remove zeros à esquerda dos inteiros
  const inteirosLimpos = inteiros.replace(/^0+/, '') || '0'

  // Adiciona pontos para milhares
  const inteirosFormatados = inteirosLimpos.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${inteirosFormatados},${fracoesPart}`
}

/**
 * Formata um número adicionando pontos para separar as casas das centenas (milhares)
 * @param valor Número a ser formatado
 * @returns Número formatado com pontos para milhares
 */
export const formatarNumeroComPontos = (valor: number | string | null | undefined): string => {
  if (!valor && valor !== 0) return ''

  const numero = typeof valor === 'string' ? parseFloat(valor) : valor

  if (isNaN(numero)) return ''

  return numero.toLocaleString('pt-BR')
}
