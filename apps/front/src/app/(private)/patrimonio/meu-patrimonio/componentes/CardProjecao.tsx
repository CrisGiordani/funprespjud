'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Typography } from '@mui/material'

import { CardIconTextLabel } from '@/app/components/common/CardIconTextLabel'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { useAuth } from '@/contexts/AuthContext'

import { useSimulacaoBeneficioSimplificadaNormal } from '@/hooks/simulacao-beneficio/simulacaoBeneficioSimplificadaNormal'

import { useGetPerfilAtual } from '@/hooks/perfilInvestimento/useGetPerfilAtual'
import { formatCurrency } from '@/app/utils/formatters'

export function CardProjecao() {
  const router = useRouter()
  const { user } = useAuth()
  const {getPerfilAtual } = useGetPerfilAtual()

  const { simulacao, getSimulacaoSimplificadaNormal } = useSimulacaoBeneficioSimplificadaNormal()

  useEffect(() => {
    if (user?.cpf) {
      getPerfilAtual(user?.cpf)

      getSimulacaoSimplificadaNormal(user?.cpf)
    }
  }, [user?.cpf, getPerfilAtual, getSimulacaoSimplificadaNormal])

  return (
    <CardCustomized.Root className='flex flex-col p-6 pb-16'>
      <CardCustomized.Header
        title='Projeção de benefício'
        subheader='
        Os valores apresentados são projeções baseadas no benchmark do seu perfil de investimento atual e tempo até a aposentadoria. Essas estimativas não representam valores garantidos ou definitivos.
        '
      />
      <CardCustomized.Content>
        <div className='grid  sm:grid-cols-2  md:grid-cols-2 grid-rows-1 gap-4'>
          <CardIconTextLabel
            titulo='Saldo total projetado'
            valor={
              simulacao?.data?.beneficio_aposentadoria_normal?.saldoTotalRan
                ? formatCurrency(simulacao?.data?.beneficio_aposentadoria_normal?.saldoTotalRan)
                : 'R$ 0,00'
            }
            icon='fa-regular fa-sack-dollar'
            className='bg-gray-100 border-none'
          />
          <CardIconTextLabel
            titulo='Benefício mensal projetado '
            valor={
              simulacao?.data?.beneficio_aposentadoria_normal?.valorBeneficioMensalBruto
                ? formatCurrency(simulacao?.data?.beneficio_aposentadoria_normal?.valorBeneficioMensalBruto)
                : 'R$ 0,00'
            }
            icon='fa-kit fa-regular-money-bill-wave-circle-dollar'
            className='bg-gray-100 border-none'
          />
        </div>

        <div className='flex flex-col gap-4  mt-3 items-center'>
          <Typography variant='body1' className='text-center'>
            Descubra outras projeções com o simulador de benefícios!
          </Typography>
          <ButtonCustomized
            variant='outlined'
            type='button'
            className='max-w-[300px]'
            onClick={() => router.push('/servicos/simular-beneficios')}
          >
            Ir para simulador de benefícios
          </ButtonCustomized>
          <Typography variant='body1'>
            *A projeção apresentada é específica para o Benefício de Aposentadoria Normal, calculado considerando o
            saldo da Reserva Acumulada Normal (RAN), e clique em “outras simulações” onde serão fornecidas informações
            mais detalhadas. Os resultados financeiros apresentados de benefícios e rentabilidade futuros são meras
            estimativas e não constituem garantia por parte da Funpresp-Jud.
          </Typography>
        </div>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
