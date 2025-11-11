'use client'

import { Grid } from '@mui/material'

import { CardCustomized } from '@/components/ui/CardCustomized'
import ListDocumentosInstitucionais from '@/app/components/documentos/ListDocumentosInstitucionais'
import ListCartilhasParticipantes from '@/app/components/documentos/ListCartilhasParticipantes'
import ListCertificados from '@/app/components/documentos/ListCertificados'
import ListRelatoriosAnuais from '@/app/components/documentos/ListRelatoriosAnuais'
import CardAtasDeReuniao from '@/app/components/documentos/CardAtasDeReuniao'

export default function Page() {
  return (
    <Grid container spacing={6} sx={{ marginTop: '0' }}>
      <Grid item xs={12} md={6}>
        <div className='flex flex-col sticky top-20 gap-6'>
          <CardAtasDeReuniao />
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <div className='flex flex-col sticky top-20 gap-6'>
          <CardCustomized.Root>
            <CardCustomized.Header title='Documentos institucionais' />
            <CardCustomized.Content>
              <ListDocumentosInstitucionais />
            </CardCustomized.Content>
          </CardCustomized.Root>

          <CardCustomized.Root>
            <CardCustomized.Header title='Cartilhas de Participantes' />
            <CardCustomized.Content>
              <ListCartilhasParticipantes />
            </CardCustomized.Content>
          </CardCustomized.Root>

          <CardCustomized.Root>
            <CardCustomized.Header title='Certificados' />
            <CardCustomized.Content>
              <ListCertificados />
            </CardCustomized.Content>
          </CardCustomized.Root>

          <CardCustomized.Root>
            <CardCustomized.Header title='Relatórios anuais' />
            <CardCustomized.Content>
              <ListRelatoriosAnuais />
            </CardCustomized.Content>
          </CardCustomized.Root>
        </div>
      </Grid>
    </Grid>
  )
}
