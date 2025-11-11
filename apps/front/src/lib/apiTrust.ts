import axios from 'axios'

//* Configuração global do Axios
export const apiTrust = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_TRUST_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 60000 // 60 segundos - aumentado para evitar timeout em produção
})
