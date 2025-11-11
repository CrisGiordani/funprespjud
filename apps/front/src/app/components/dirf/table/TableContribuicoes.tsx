import { useEffect } from 'react'

import { Typography } from '@mui/material'

import useGetContribuicoesComplementares from '@/hooks/impostoDeRenda/useGetContribuicoesComplementares'
import type { PatrocinadorDTOType } from '@/types/patrocinador/PatrocinadorDTOType'
import type { UserType } from '@/types/UserType'
import { TableCustomized } from '@/components/ui/TableCustomized'

export default function TableContribuicoes({
  patrocinador,
  ano,
  user
}: {
  patrocinador: PatrocinadorDTOType
  ano: string | null | number
  user: UserType
}) {
  const { contribuicoesComplementares, getContribuicoesComplementares } = useGetContribuicoesComplementares()

  useEffect(() => {
    const fetchData = async () => {
      await getContribuicoesComplementares(user.cpf, ano || new Date().getFullYear(), patrocinador?.sigla)
    }

    fetchData()
  }, [patrocinador, ano])

  return (
    <TableCustomized
      headers={['Origem', 'Participante', 'Patrocinador']}
      rows={[
        [
          <Typography variant='body1' key='origem' align='left'>
            Contribuições repassadas pelo Órgão (inclusive a CAR)
          </Typography>,
          contribuicoesComplementares?.contribuicoesRepassadasOrgaoParticipante,
          contribuicoesComplementares?.contribuicoesRepassadasOrgaoPatrocinador
        ],
        [
          <Typography variant='body1' key='origem' align='left'>
            Contribuições recolhidas diretamente na Funpresp-Jud (inclusive a CAR)
          </Typography>,
          contribuicoesComplementares?.contribuicoesRecolhidasFunprespjudParticipante,
          contribuicoesComplementares?.contribuicoesRecolhidasFunprespjudPatrocinador
        ],
        [
          <Typography variant='body1' key='origem' align='left'>
            Total
          </Typography>,
          contribuicoesComplementares?.totalParticipante,
          contribuicoesComplementares?.totalPatrocinador
        ]
      ]}
    />
  )
}
