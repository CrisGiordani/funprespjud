import React from 'react'

import { Button } from '@mui/material'
import { Download } from '@mui/icons-material'

interface DownloadCsvButtonProps {
  simulacao: any
}

export function DownloadCsvButton({ simulacao }: DownloadCsvButtonProps) {
  const handleDownloadCsv = () => {
    const csvData = simulacao.contribuicoesSimuladas.map((item: any) => ({
      referencia: item.referencia,
      conta: item.conta,
      valorContribuicao: item.valorContribuicao,
      valorCota: item.valorCota,
      quantidadeCotasAtual: item.quantidadeCotasAtual,
      saldoCotaTotal: item.saldoCotaTotal,
      valorSaldoTotal: item.valorSaldoTotal
    }))

    const headers = [
      'Referência',
      'Conta',
      'Valor Contribuição',
      'Valor Cota',
      'Quantidade Cotas',
      'Saldo Cota Total',
      'Valor Saldo Total'
    ]

    const csvContent =
      '\uFEFF' + headers.join(',') + '\n' + csvData.map((row: any) => Object.values(row).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'contribuicao_simulada.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='text-center mb-4'>
      <p className='text-gray-700 mb-4'>Gostaria de visualizar os valores desta simulação em detalhes?</p>
      <Button variant='contained' color='primary' startIcon={<Download />} onClick={handleDownloadCsv}>
        Baixar CSV
      </Button>
    </div>
  )
}
