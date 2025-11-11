export type ServiceResponse<T> = {
  success: boolean
  data?: T
  message?: string
  unauthorized?: boolean
  errors?: Record<string, string>
}
