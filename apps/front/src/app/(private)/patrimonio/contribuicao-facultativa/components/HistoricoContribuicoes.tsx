'use client'

import { useCallback, useEffect, useState } from 'react'

import type { ChipProps } from '@mui/material'
import { Chip, List, ListItem, Typography } from '@mui/material'

import HoverButton from '@/app/components/iris/HoverButton'
import { FormatacaoDinheiroComSifraoPequeno } from './FormatacaoDinheiroComSifraoPequeno'
import type { ContribuicaoFacultativaHistoricoResponseType } from '@/types/contribuicao-facultativa/contribuicao-facultativa.type'
import { statusContribuicao } from '@/types/contribuicao-facultativa/contribuicao-facultativa.type'
import { ContribuicaoFacultativaService } from '@/services/ContribuicaoFacultativaService'
import { useAuth } from '@/contexts/AuthContext'
import PaginationIris from '@/app/components/iris/PaginationIris'
import type { PaginationIrisType } from '@/types/paginacao/pagination-iris.type'

export function HistoricoContribuicoes() {
  const [historicoContribuicoes, setHistoricoContribuicoes] = useState<ContribuicaoFacultativaHistoricoResponseType[]>(
    []
  )

  const [paginacao, setPaginacao] = useState<PaginationIrisType>({
    totalPaginas: 0,
    page: 0,
    handleChange: () => {}
  })

  const { user } = useAuth()

  const fetchHistoricoContribuicoes = useCallback(async () => {
    if (user?.cpf) {
      const { contribuicoes, paginacao } = await ContribuicaoFacultativaService.getHistoricoContribuicoes(user.cpf)

      setHistoricoContribuicoes(contribuicoes)
      setPaginacao(paginacao)
    }
  }, [user])

  useEffect(() => {
    fetchHistoricoContribuicoes()
  }, [fetchHistoricoContribuicoes])

  return (
    <div className='w-full flex flex-col gap-4'>
      <List className='w-full p-0'>
        {historicoContribuicoes.map(contribuicao => (
          <ListItem
            key={contribuicao.id}
            className={`flex flex-wrap justify-between items-center p-4 border-gray-300 border-b`}
          >
            <div className='flex-1 flex flex-wrap justify-start items-center gap-4'>
              <Chip
                variant='tonal'
                label={statusContribuicao[contribuicao.status].label}
                color={statusContribuicao[contribuicao.status].color as ChipProps['color']}
                className={`rounded-full w-[235px]`}
              />
              <div>
                <FormatacaoDinheiroComSifraoPequeno valor={contribuicao.valor} />
                <Typography variant='body1'>
                  Emissão: <span className='font-bold'>{contribuicao.data}</span>
                </Typography>
                <Typography variant='body1'>
                  Vencimento: <span className='font-bold'>{contribuicao.vencimento}</span>
                </Typography>
              </div>
            </div>
            <div className='flex-1 flex justify-between items-center pl-16 gap-2'>
              <i>Pagamento via {contribuicao.meio}</i>
              {contribuicao.meio !== 'PIX' &&
                ['Cancelado', 'Vencido', 'Aguardando pagamento'].includes(
                  statusContribuicao[contribuicao.status].label
                ) && <HoverButton url={'course.urlDocumento'} />}
            </div>
          </ListItem>
        ))}
      </List>
      <div className='w-full flex flex-col items-center justify-end my-4'>
        <PaginationIris
          totalPaginas={paginacao.totalPaginas}
          page={paginacao.page}
          handleChange={paginacao.handleChange}
        />
      </div>
    </div>
  )
}
