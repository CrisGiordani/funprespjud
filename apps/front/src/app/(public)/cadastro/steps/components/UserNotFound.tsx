import type { NavigationProps } from '../../types'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

const UserNotFound = ({ goToLogin }: NavigationProps) => {
  return (
    <div className='w-full'>
      <div className='max-w-[250px] flex flex-col text-center gap-2 m-auto'>
        <ButtonCustomized
          fullWidth
          variant='contained'
          onClick={() =>
            (window.location.href = 'https://patrocinador.funprespjud.com.br/patrocinador/adesao/participante')
          }
        >
          Ir para o formulário
        </ButtonCustomized>

        <ButtonCustomized fullWidth variant='outlined' onClick={goToLogin}>
          Voltar
        </ButtonCustomized>
      </div>
    </div>
  )
}

export default UserNotFound
