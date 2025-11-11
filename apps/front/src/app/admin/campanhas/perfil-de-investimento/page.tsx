'use client'
import { useState, useRef } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { HistoricoCampanhasPerfilInvestimento } from './components/HistoricoCampanhasPerfilInvestimento'
import { DialogCampanha } from './components/DialogCampanha'
import type { UserType } from '@/types/UserType'

export default function PerfilDeInvestimentoPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const historicoRef = useRef<{ recarregarLista: () => void }>(null)

  const handleCampanhaCreated = () => {
    // Recarrega a listagem de campanhas
    historicoRef.current?.recarregarLista()
  }

  return (
    <CardCustomized.Root className='h-full p-0'>
      <CardCustomized.Header
        title='Campanha de troca de perfil de investimento '
        subheader='Crie e gerencie campanhas de troca de perfil.'
        action={
          <div className='flex flex-row gap-4'>
            <ButtonCustomized
              startIcon={<i className='fa-regular fa-plus' />}
              variant='contained'
              type='button'
              className='px-8 py-2'
              onClick={() => setOpen(true)}
            >
              Criar Campanha
            </ButtonCustomized>
          </div>
        }
      />

      <DialogCampanha
        user={user as UserType}
        open={open}
        handleClose={() => setOpen(false)}
        onCampanhaCreated={handleCampanhaCreated}
      />

      <CardCustomized.Content className='h-full '>
        <HistoricoCampanhasPerfilInvestimento ref={historicoRef} />
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
