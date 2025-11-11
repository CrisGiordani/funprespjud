import Image from 'next/image'

import { Card, Typography } from '@mui/material'

export default function BoxHistoricoNaoEncontrado({ mensagem }: { mensagem: string }) {
  return (
    <Card variant='outlined' className='flex items-center bg-tertiary-main p-4 px-8'>
      <Image src='/images/iris/SemHistorico.svg' alt='Histórico não encontrado' width={100} height={100} />
      <Typography variant='body1' className='text-gray-800 text-center mt-4'>
        {mensagem}
      </Typography>
    </Card>
  )
}
