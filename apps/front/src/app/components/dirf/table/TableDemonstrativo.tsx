import { useEffect } from 'react'

import { Alert } from '@mui/material'

import useDemonstrativoAnaliticoImpostoRenda from '@/hooks/impostoDeRenda/useDemonstrativoAnaliticoImpostoRenda'
import type { PatrocinadorDTOType } from '@/types/patrocinador/PatrocinadorDTOType'
import type { UserType } from '@/types/UserType'
import { TableCustomized } from '@/components/ui/TableCustomized'

export default function TableDemonstrativo({
  ano,
  patrocinador,
  user
}: {
  ano: string | number
  patrocinador: PatrocinadorDTOType | null
  user: UserType
}) {
  const { demonstrativoAnaliticoImpostoRenda, error, getDemonstrativoAnaliticoImpostoRenda } =
    useDemonstrativoAnaliticoImpostoRenda()

  useEffect(() => {
    if (patrocinador && ano) {
      getDemonstrativoAnaliticoImpostoRenda(user.cpf, ano, patrocinador?.sigla || '')
    }
  }, [ano, patrocinador])

  if (error && !demonstrativoAnaliticoImpostoRenda) {
    return <Alert severity='error'>Erro ao buscar demonstrativo analítico do Imposto de Renda</Alert>
  }

  return demonstrativoAnaliticoImpostoRenda && demonstrativoAnaliticoImpostoRenda.length > 0 ? (
    <TableCustomized
      headers={['Data de recebimento', 'Competência', 'Participante', 'Patrocinador']}
      rows={demonstrativoAnaliticoImpostoRenda.map((row: any) => [
        row.dtRecebimento,
        row.competenciaFormatada,
        row.participante,
        row.patrocinador || 'R$ 0,00'
      ])}
    />
  ) : (
    <div className='text-center text-gray-600 text-lg font-bold'>Nenhum dado encontrado !!!</div>
  )
}
