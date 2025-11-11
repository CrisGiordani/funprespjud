'use client'

import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { PerfilType } from '@/types/perfil/perfil'
import { FotoPerfilService } from '@/services/FotoPerfilService'
import { useAuth } from './AuthContext'

type ProfileContextType = {
  profile: PerfilType
  setProfile: (profile: PerfilType) => void
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export const useProfile = () => {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used within an ProfileProvider')
  }

  return context
}

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const [profile, setProfile] = useState<PerfilType>({
    nome: '',
    email: '',
    fotoPerfil: ''
  })

  const { user } = useAuth()

  const fetchProfile = useCallback(
    async (cpf: string) => {
      try {
        // getFotoPerfil retorna null se não houver avatar (caso normal)
        const fotoPerfil = await FotoPerfilService.getFotoPerfil(cpf)

        setProfile({
          nome: user?.nome || '',
          email: user?.email || '',
          fotoPerfil: fotoPerfil || ''
        })
      } catch (error) {
        // Se houver erro (como 401), limpa o perfil
        console.log('Erro ao buscar foto do perfil:', error)
        setProfile({
          nome: user?.nome || '',
          email: user?.email || '',
          fotoPerfil: ''
        })
      }
    },
    [user]
  )

  useEffect(() => {
    if (user?.cpf) {
      fetchProfile(user.cpf)
    } else {
      // Se não há usuário, limpa o perfil
      setProfile({
        nome: '',
        email: '',
        fotoPerfil: ''
      })
    }
  }, [fetchProfile, user])

  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>
}
