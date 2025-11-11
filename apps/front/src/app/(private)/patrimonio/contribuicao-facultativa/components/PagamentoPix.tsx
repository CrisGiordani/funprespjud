'use client'

import { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'

import { Typography } from '@mui/material'

import { formatarHorasMinutosSegundos } from '@/app/utils/formatters'
import { FormatacaoDinheiroComSifraoPequeno } from './FormatacaoDinheiroComSifraoPequeno'
import { PagamentoPixTempoExpiradoDialog } from './PagamentoPixTempoExpiradoDialog'
import { PagamentoPixPagamentoRealizado } from './PagamentoPixPagamentoRealizado'
import { ActionButton } from './ActionButton'

import { ContribuicaoFacultativaService } from '@/services/ContribuicaoFacultativaService'
import BoxCopy from '@/app/components/ui/BoxCopy'

export function PagamentoPix({
  valor,
  chave,
  onVoltar,
  onTentarNovamente
}: {
  valor: number
  chave: string
  onVoltar: () => void
  onTentarNovamente: () => void
}) {
  const [tempoRestante, setTempoRestante] = useState(65)
  const [pagamentoRealizado, setPagamentoRealizado] = useState(false)
  const [openDialogTempoExpirado, setOpenDialogTempoExpirado] = useState(false)

  // TODO: verificar se o pagamento foi realizado
  const handleVerificarPagamento = useCallback(async () => {
    // a cada 5 segundos, verificar se o pagamento foi realizado e se tá dentro do prazo
    if (tempoRestante % 5 === 0 && tempoRestante > 0) {
      const response = await ContribuicaoFacultativaService.verificarPagamentoPix(chave, '1234567890')

      setPagamentoRealizado(response.status === 'PAGO')
    }
  }, [tempoRestante, chave])

  useEffect(() => {
    handleVerificarPagamento()
  }, [handleVerificarPagamento])

  useEffect(() => {
    if (tempoRestante <= 0) {
      setOpenDialogTempoExpirado(true)

      return
    }

    const interval = setInterval(() => {
      setTempoRestante(tempoRestante - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [tempoRestante])

  if (pagamentoRealizado) {
    return (
      <PagamentoPixPagamentoRealizado
        onNovaContribuicao={() => {
          setPagamentoRealizado(false)
          onVoltar()
        }}
      />
    )
  }

  return (
    <div className='w-full max-w-[724px] flex flex-col items-center gap-2'>
      <Typography variant='h5'>Pagamento via PIX</Typography>

      <Typography variant='body1'>
        Utilize o QR Code ou copie e cole o código em seu aplicativo de banco para realizar o pagamento.
      </Typography>

      <div className='flex flex-col justify-center items-center border border-gray-300 rounded-lg p-4 gap-2'>
        <Typography variant='body1'>O tempo para finalizar essa transação acaba em:</Typography>
        <Typography variant='h5' sx={{ fontWeight: 700 }}>
          {formatarHorasMinutosSegundos(tempoRestante, 'mm:ss')}
        </Typography>
      </div>

      <div className='flex flex-col justify-center items-center gap-2'>
        <FormatacaoDinheiroComSifraoPequeno valor={valor} />
        <div className='w-[250px] h-[250px] bg-gray-100 rounded-lg my-4'>
          <Image src='/images/funpresp/qrcode.png' alt='QR Code' className='w-full h-full' width={230} height={230} />
        </div>

        <BoxCopy description={chave} />
      </div>

      <ActionButton variant='outlined' color='primary' onClick={onVoltar} sx={{ marginTop: '0.5rem' }}>
        Voltar
      </ActionButton>

      {tempoRestante <= 0 && (
        <PagamentoPixTempoExpiradoDialog
          open={openDialogTempoExpirado}
          onClose={() => {
            setOpenDialogTempoExpirado(false)
            onVoltar()
          }}
          onTentarNovamente={() => {
            setOpenDialogTempoExpirado(false)
            onTentarNovamente()
          }}
        />
      )}
    </div>
  )
}
