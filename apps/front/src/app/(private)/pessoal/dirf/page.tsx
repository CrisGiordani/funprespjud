'use client'
import { useState } from 'react'

import { Alert } from '@mui/material'

import CardDadosDemonstrativos from '@/app/components/dirf/CardDadosDemonstrativos'
import PreVisualizacaoDemonstrativo from '@/app/components/dirf/PreVisualizacaoDemonstrativo'
import type { PatrocinadorDTOType } from '@/types/patrocinador/PatrocinadorDTOType'
import { useAuth } from '@/contexts/AuthContext'
import { ComoDeclarar } from '@/app/components/dirf/ComoDeclarar'

export default function Page() {
  const [patrocinador, setPatrocinador] = useState<PatrocinadorDTOType | null>(null)
  const [ano, setAno] = useState<string | null>(null)
  const { user, error: userError } = useAuth()

  if (userError) {
    return <Alert severity='error'>Erro ao carregar dados do usuário</Alert>
  }

  return (
    <div className='mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <div className='lg:col-span-4 w-full'>
          <div className='sticky top-20 flex flex-col gap-6'>
            <CardDadosDemonstrativos
              patrocinador={patrocinador}
              setPatrocinador={setPatrocinador}
              ano={ano}
              setAno={setAno}
              user={user}
            />

            <ComoDeclarar />
          </div>
        </div>
        <div className='lg:col-span-8 w-full'>
          {user && patrocinador && ano && (
            <PreVisualizacaoDemonstrativo patrocinador={patrocinador} ano={ano} user={user} />
          )}
        </div>
      </div>
    </div>
  )
}
