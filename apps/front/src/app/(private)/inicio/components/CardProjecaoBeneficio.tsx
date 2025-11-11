import { useCallback, useEffect, useState } from 'react'

import { Typography } from '@mui/material'

import ProgressLinearCustom from '@/app/components/dashboard/ProgressLinearCustom'
import { SimularBeneficiosService } from '@/services/SimularBeneficiosService'
import { formatPercentage } from '@/app/utils/formatters'
import Link from '@/components/Link'
import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export function CardProjecaoBeneficio() {
  const { user } = useAuth()
  const [projecao, setProjecao] = useState<number | null>(null)

  const fetchprojecao = useCallback(async () => {
    if (user?.cpf) {
      const projecao = await SimularBeneficiosService.getProjecaoBeneficio(user.cpf)

      setProjecao(projecao.projecaoAtual)
    }
  }, [user?.cpf])

  useEffect(() => {
    fetchprojecao()
  }, [fetchprojecao])

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title='Projeção de benefícios'
        subheader={
          <Typography variant='body1'>
            Com as contribuições que você realiza atualmente para a Funpresp-Jud, sua projeção indica que sua
            aposentadoria corresponderá a <span className='font-bold'>{formatPercentage(projecao)}</span> da sua atual
            Base de Contribuição.
          </Typography>
        }
      />

      <CardCustomized.Content>
        <ProgressLinearCustom variant='determinate' value={(projecao && projecao > 100 ? 100 : projecao) || 0} />
      </CardCustomized.Content>

      <CardCustomized.Footer>
        <div className='w-full'>
          <Typography variant='body1'>
            Veja detalhes da sua projeção, teste possibilidades e descubra como atingir o benefício desejado, acessando
            nosso simulador de benefícios.
          </Typography>
          <div className='max-w-[300px] flex flex-col text-center m-auto mt-4'>
            <Link href='/servicos/simular-beneficios'>
              <ButtonCustomized variant='outlined' type='button'>
                Ir para simulador de benefícios
              </ButtonCustomized>
            </Link>
          </div>
        </div>
      </CardCustomized.Footer>
    </CardCustomized.Root>
  )
}
