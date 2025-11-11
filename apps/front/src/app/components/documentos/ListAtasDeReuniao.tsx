import { useEffect, useState } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'

import { Card, List, ListItem, ListItemAvatar, ListItemIcon, Skeleton, Typography } from '@mui/material'

import HoverButton from '../iris/HoverButton'
import PaginationIris from '../iris/PaginationIris'

import TextWithLegend from '@/components/ui/TextWithLegend'
import { TipoDocumentoEnum } from '@/enum/documentos/TipoDocumentoEnum'
import useGetAllDocumentos from '@/hooks/useGetAllDocumentos'
import type { FilterAtaDocumentosType } from '@/types/documentos/FilterAtaDocumentosType'
import type { DocumentosType } from '@/types/documentos/DocumentosType'

const StyledList = styled(List, {
  shouldForwardProp: prop => prop !== 'showLastBorder'
})(() => ({
  '& .MuiListItem-root': {
    background: '#fff',
    paddingBlock: 8,
    borderTop: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    '&:not(:first-of-type)': {
      borderTop: '1px solid var(--mui-palette-divider)'
    },
    '&:not(:last-child)': {
      borderBlockEnd: 0
    },
    '& .MuiListItemText-root': {
      marginBlockStart: 0,
      '& .MuiTypography-root': {
        fontWeight: 500
      }
    }
  }
}))

export default function ListAtasDeReuniao({ tipo, ano }: FilterAtaDocumentosType) {
  const { documentos, error, isLoading, getAllDocumentos } = useGetAllDocumentos()
  const [page, setPage] = useState(0)

  const getIconByTipo = (tipo: string | number) => {
    const tipoNum = Number(tipo)

    switch (tipoNum) {
      case TipoDocumentoEnum.CONSELHO_DELIBERATIVO:
        return 'fa-regular fa-gavel'

      case TipoDocumentoEnum.CONSELHO_FISCAL:
        return 'fa-regular fa-file-magnifying-glass'

      case TipoDocumentoEnum.DIRETORIA_EXECUTIVA:
        return 'fa-regular fa-briefcase'

      default:
        return 'fa-regular fa-file'
    }
  }

  const getLabelTipo = (tipo: string | number) => {
    const tipoNum = Number(tipo)

    switch (tipoNum) {
      case TipoDocumentoEnum.CONSELHO_DELIBERATIVO:
        return 'Conselho Deliberativo'

      case TipoDocumentoEnum.CONSELHO_FISCAL:
        return 'Conselho Fiscal'

      case TipoDocumentoEnum.DIRETORIA_EXECUTIVA:
        return 'Diretoria Executiva'

      default:
        return 'Outros'
    }
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getAllDocumentos({ tipo, ano, pageIndex: page, pageSize: 10 })
    }

    fetchData()
  }, [tipo, ano, getAllDocumentos, page])

  useEffect(() => {
    setPage(0)
  }, [tipo, ano])

  if (error) {
    return <div className='text-error text-center'>Erro ao buscar documentos</div>
  }

  return (
    <>
      {isLoading ? (
        <Skeleton variant='rectangular' height='640px' sx={{ borderRadius: '5px' }} />
      ) : (
        <>
          <Card
            variant='outlined'
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              backgroundColor: '#F2F2F2'
            }}
          >
            {documentos && documentos.dados && documentos.dados.length > 0 ? (
              <StyledList className='w-full py-0 my-0'>
                {documentos.dados.map((documento: DocumentosType, index: number) => {
                  return (
                    <ListItem key={index} className={`w-full h-[100px]`}>
                      <ListItemAvatar className='flex gap-5 items-center is-full'>
                        <ListItemIcon className='w-[60px] h-[60px] flex items-center justify-center bg-primary-main/10 rounded-full'>
                          <i className={`${getIconByTipo(documento.tipo || '')} text-primary-main text-xl`} />
                        </ListItemIcon>
                        <TextWithLegend
                          legend={new Date(documento.dtDocumento || '').toLocaleDateString('pt-BR')}
                          text={getLabelTipo(documento.tipo || '')}
                          legendPosition='bottom'
                          className='flex-1'
                        />
                        <HoverButton url={documento.link} />
                      </ListItemAvatar>
                    </ListItem>
                  )
                })}
              </StyledList>
            ) : (
              <div className='h-full flex-1 flex flex-col justify-center items-center gap-4 p-20'>
                <Image src={'/images/iris/nao-encontrado.svg'} alt='sem documentos' width={99} height={94} />
                <Typography variant='body1'>Não encontramos atas com os filtros selecionados</Typography>
              </div>
            )}
          </Card>

          <div className='w-full   flex flex-col items-center justify-center mt-5'>
            <div className='w-full  flex flex-col items-center justify-end '>
              <PaginationIris
                totalPaginas={documentos?.total_paginas || 1}
                page={page + 1 || 1}
                handleChange={(_, value) => handleChange(_, value - 1)}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
