import { useCallback, useEffect } from 'react'

import { FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material'

import useGetPatrocinador from '@/hooks/participante/useGetPatrocinador'
import type { PatrocinadorDTOType } from '@/types/patrocinador/PatrocinadorDTOType'
import { generateAnos } from '@/app/utils/formatters'
import { CardCustomized } from '@/components/ui/CardCustomized'
import type { UserType } from '@/types/UserType'

export default function CardDadosDemonstrativos({
  patrocinador,
  setPatrocinador,
  ano,
  setAno,
  user
}: {
  patrocinador: PatrocinadorDTOType | null
  setPatrocinador: (patrocinador: PatrocinadorDTOType | null) => void
  ano: string | null
  setAno: (ano: string | null) => void
  user: UserType | null
}) {
  const optionsAno = generateAnos()
  const { listPatrocinadores, error, getPatrocinadores, isLoading } = useGetPatrocinador()

  const fetchPatrocinadores = useCallback(async () => {
    if (user?.cpf) {
      await getPatrocinadores(user.cpf)
    }
  }, [getPatrocinadores, user])

  useEffect(() => {
    fetchPatrocinadores()
  }, [fetchPatrocinadores])

  // Efeito para definir o ano anterior e o primeiro patrocinador quando os dados forem carregados
  useEffect(() => {
    const patrocinadores = listPatrocinadores?.patrocinadores

    if (patrocinadores && patrocinadores.length > 0 && !patrocinador) {
      setPatrocinador(patrocinadores[0])
    }

    if (!ano) {
      const anoAnterior = (new Date().getFullYear() - 1).toString()

      setAno(anoAnterior)
    }
  }, [listPatrocinadores, patrocinador, ano])

  if (error) {
    return <div className='text-red-900 text-center'>Erro ao buscar dados do demonstrativo</div>
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title='Dados do demonstrativo'
        subheader='Por favor, selecione um Órgão e um ano para gerarmos o demonstrativo de imposto de renda.'
      />

      <CardCustomized.Content>
        <div className='flex flex-col gap-4 my-4'>
          {isLoading ? (
            <>
              <Skeleton variant='rectangular' width='100%' height={58.6} sx={{ borderRadius: '5px' }} />
              <Skeleton variant='rectangular' width='100%' height={58.6} sx={{ borderRadius: '5px' }} />
            </>
          ) : (
            <>
              <FormControl variant='filled' fullWidth>
                <InputLabel id='orgao'>Selecione um Órgão</InputLabel>
                <Select
                  labelId='orgao'
                  id='orgao'
                  value={patrocinador?.id || ''}
                  onChange={e =>
                    setPatrocinador(
                      listPatrocinadores?.patrocinadores?.find(
                        (patrocinador: PatrocinadorDTOType) => patrocinador.id === e.target.value
                      ) as PatrocinadorDTOType | null
                    )
                  }
                >
                  {listPatrocinadores?.patrocinadores?.map((patrocinador: PatrocinadorDTOType) => (
                    <MenuItem key={patrocinador.id} value={patrocinador.id}>
                      {patrocinador?.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant='filled' fullWidth>
                <InputLabel id='ano'>Selecione um Ano-base</InputLabel>
                <Select
                  labelId='ano'
                  id='ano'
                  value={ano || ''}
                  onChange={e => setAno(e.target.value)}
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  {optionsAno
                    .filter(ano => ano.value < new Date().getFullYear())
                    .map(ano => (
                      <MenuItem key={ano.value} value={ano.value}>
                        {ano.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}
        </div>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
