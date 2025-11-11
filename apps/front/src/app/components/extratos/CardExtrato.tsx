import { useState, useEffect } from 'react'

import ListExtrato from './ListExtrato'
import FiltroIris from '../iris/FiltroIris'
import FiltroChips from '../iris/FiltroChips'

import useGetPatrocinador from '@/hooks/participante/useGetPatrocinador'
import useGetExtratoRelatorio from '@/hooks/useGetAllExtrato'
import type { FilterExtratoType } from '@/types/extrato/FilterExtratoType'
import { generateAnos, generateMeses } from '@/app/utils/formatters'
import { useAuth } from '@/contexts/AuthContext'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export default function CardExtrato() {
  const { getExtratoRelatorio } = useGetExtratoRelatorio()

  const { listPatrocinadores, getPatrocinadores } = useGetPatrocinador()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.cpf) {
      getPatrocinadores(user.cpf)
    }
  }, [user, getPatrocinadores])

  const filtrosConfig = [
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        { label: 'Tipo', value: '' },
        { label: 'Contribuição Normal', value: 'NORMAL' },
        { label: 'Contribuição Facultativa', value: 'FACULTATIVA' },
        { label: 'Contribuição Vinculada', value: 'VINCULADA' },
        { label: 'Gratificação Natalina', value: 'NAT' },
        { label: 'Estorno', value: 'ESTORNO' },
        { label: 'BPD', value: 'BPD' },
        { label: 'Portabiliade', value: 'PORTABILIDADE' },
        { label: 'Multa', value: 'MULTA' },
        { label: 'Pagamento de benefico', value: 'PAGTO' },
        { label: 'Devolução de beneficio', value: 'DEVOL' },
        { label: 'CAR', value: 'CAR' },
        { label: 'Transferencia de Perfil', value: 'TRANSFERENCIA' }
      ],
      placeholder: 'Tipo'
    },
    {
      key: 'orgao',
      label: 'Órgão',
      type: 'select',
      options: [
        { label: 'Órgão', value: '' },
        ...(listPatrocinadores?.patrocinadores?.map(patrocinador => ({
          label: patrocinador.sigla,
          value: patrocinador.sigla
        })) || [])
      ],
      placeholder: 'Órgão'
    },
    {
      key: 'mesInicial',
      label: 'Mês',
      type: 'select',
      options: [{ label: 'Selecione um mês', value: '' }, ...generateMeses()],
      placeholder: 'Mês',
      fullWidth: false,
      group: 'de'
    },
    {
      key: 'anoInicial',
      label: 'Ano',
      type: 'select',
      options: [{ label: 'Selecione um ano', value: '' }, ...generateAnos()],
      placeholder: 'Ano',
      fullWidth: false,
      group: 'de'
    },
    {
      key: 'mesFinal',
      label: 'Mês',
      type: 'select',
      options: [{ label: 'Selecione um mês', value: '' }, ...generateMeses()],
      placeholder: 'Mês',
      fullWidth: false,
      group: 'ate'
    },
    {
      key: 'anoFinal',
      label: 'Ano',
      type: 'select',
      options: [{ label: 'Selecione um ano', value: '' }, ...generateAnos()],
      placeholder: 'Ano',
      fullWidth: false,
      group: 'ate'
    }
  ]

  const [filtros, setFiltros] = useState<Record<string, string>>(
    filtrosConfig.reduce((acc, filtro) => ({ ...acc, [filtro.key]: '' }), {} as Record<string, string>)
  )

  const restaurarFiltro = (key: string) => {
    setFiltros(prev => ({ ...prev, [key]: '' }))
  }

  const hasActiveFilters = Object.values(filtros).some(value => value !== '')

  return (
    <CardCustomized.Root className='hover:shadow-xl transition-shadow duration-300 h-full sm:py-2 sm:px-7 p-0'>
      <CardCustomized.Header
        title='Extrato de movimentações financeiras'
        subheader='Utilize os botões abaixo para filtrar a visualização das informações, ou, se preferir, baixar o extrato com os filtros selecionados em um documento pdf.'
      />

      <CardCustomized.Content>
        <div className='flex flex-col gap-1 mb-6 mt-4'>
          {/* Primeira linha: FiltroIris e botão de download */}
          <div className='flex flex-row items-baseline gap-1'>
            <FiltroIris filtrosConfig={filtrosConfig} filtros={filtros} setFiltros={setFiltros} />

            <ButtonCustomized
              variant='contained'
              className='w-auto px-6 ml-4'
              color='primary'
              startIcon={<i className='fa-regular fa-down-to-bracket'></i>}
              onClick={async () => {
                try {
                  // Criar objeto de filtros apenas com valores válidos
                  const filtrosValidos: FilterExtratoType = {
                    pageIndex: 1,
                    pageSize: 10,
                    mesInicial: filtros.mesInicial || '',
                    anoInicial: filtros.anoInicial || '',
                    mesFinal: filtros.mesFinal || '',
                    anoFinal: filtros.anoFinal || '',
                    tipo: filtros.tipo || '',
                    orgao: filtros.orgao || '',
                    autor: filtros.autor || ''
                  }

                  await getExtratoRelatorio(filtrosValidos)
                } catch (error) {
                  console.error('Erro ao gerar relatório:', error)
                }
              }}
            >
              Baixar Tabela
            </ButtonCustomized>
          </div>

          {hasActiveFilters && (
            <div className='flex flex-row items-baseline'>
              <FiltroChips filtros={filtros} filtrosConfig={filtrosConfig} restaurarFiltro={restaurarFiltro} />
            </div>
          )}
        </div>

        <ListExtrato
          tipo={filtros.tipo}
          orgao={filtros.orgao}
          autor={filtros.autor}
          mesInicial={filtros.mesInicial}
          anoInicial={filtros.anoInicial}
          mesFinal={filtros.mesFinal}
          anoFinal={filtros.anoFinal}
        />
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
