import React from 'react'

import Link from 'next/link'

import { Alert } from '@mui/material'

import type { NavigationProps } from '../../types'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

type UserData = {
  nome: string
  email: string
  cpf: string
  hasPassword: boolean
}

type UserHasPasswordProps = NavigationProps & {
  userData: UserData
}

const UserHasPassword = ({ userData, goToLogin }: UserHasPasswordProps) => {
  return (
    <div className='flex flex-col gap-4 mt-2'>
      <Alert
        variant='standard'
        severity='info'
        icon={<i className='fa-regular fa-id-card text-base'></i>}
        sx={{
          '& .MuiAlert-icon': {
            height: '2.5rem',
            width: '2.5rem',
            borderRadius: '50%'
          }
        }}
      >
        <strong>CPF:</strong> {userData.cpf}
      </Alert>

      <div className='w-full'>
        <div className='max-w-[250px] flex flex-col text-center gap-4 m-auto'>
          <Link href='/cadastro/recuperacao-de-senha' passHref legacyBehavior>
            <ButtonCustomized fullWidth variant='contained' type='button'>
              Recuperar Senha
            </ButtonCustomized>
          </Link>

          <ButtonCustomized fullWidth variant='outlined' onClick={goToLogin}>
            Voltar ao Login
          </ButtonCustomized>
        </div>
      </div>
    </div>
  )
}

export default UserHasPassword
