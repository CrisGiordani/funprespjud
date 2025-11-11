import { useEffect, useCallback, useState } from 'react'

import Link from 'next/link'

import { Typography } from '@mui/material'

import { Carousel } from '@/app/components/ui/Carousel'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { PapeisEPermissoesService2, PermissoesEnum } from '@/services/PapeisEPermissoesService'
import { useAuth } from '@/contexts/AuthContext'
import type { PermissionType } from '@/types/permissions/PermissionType'

const carouselData = [
  {
    id: 1,
    image: '/images/fotos/dashboard/percentual-participante.png',
    title: 'Janela para aumento do Percentual de Contribuição',
    description:
      'Aumentar o percentual agora rende mais contrapartida do órgão patrocinador, maior benefício fiscal e uma reserva mais robusta. Aproveite o período aberto!',
    buttonText: 'Simule e ajuste sua contribuição',
    buttonLink: '/servicos/simular-beneficios',
    permission: [PermissoesEnum.VER_CARROSSEL_CAMPANHA]
  },
  {
    id: 2,
    image: '/images/fotos/dashboard/perfil-investimentos.png',
    title: 'Revisão do Perfil de Investimento',
    description:
      'O Perfil de Investimento indicado pela Funpresp-Jud foi criado para acompanhar o participante em cada etapa da sua jornada de investimentos, até a data provável de aposentadoria.',
    buttonText: 'Saiba mais sobre os perfis',
    buttonLink: 'https://www.youtube.com/watch?v=l-o2RQ4lFFU&list=PLXC1vMS60dFnqHmMsfKhoHV1L22lNyAJv',
    permission: [PermissoesEnum.VER_CARROSSEL_CAMPANHA]
  },
  {
    id: 3,
    image: '/images/fotos/dashboard/redes-sociais.png',
    title: 'Redes sociais',
    description:
      'Acompanhe as redes da Funpresp-Jud e fique por dentro de novidades, campanhas e conteúdos exclusivos preparados para você.',
    buttonText: 'Seguir agora',
    buttonLink: 'https://linktr.ee/funpresp.jud',
    permission: []
  },
  {
    id: 4,
    image: '/images/fotos/dashboard/canais-de-atendimento.png',
    title: 'Canais de atendimento',
    description: 'Tem alguma dúvida ou precisa de ajuda? Fale com conosco pelos nossos canais oficiais!',
    buttonText: 'Nossos canais',
    buttonLink: 'https://linktr.ee/funpresp_jud',
    permission: []
  }
]

export function CardCarousel() {
  const { user } = useAuth()
  const [userPermissions, setUserPermissions] = useState<PermissionType[]>([])

  const getUserPermissions = useCallback(async () => {
    if (user?.roles) {
      const permissions = await PapeisEPermissoesService2.getPermissionsUser(user.roles, user.cpf)

      setUserPermissions(permissions || [])
    }
  }, [user?.roles])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  return (
    <CardCustomized.Root className='relative'>
      <Carousel
        infiniteNext
        carouselData={carouselData
          .filter(
            card => card.permission.length === 0 || PapeisEPermissoesService2.can(userPermissions, card.permission)
          )
          .map(card => (
            <>
              <CardCustomized.Media
                component='img'
                image={card.image}
                sx={{
                  height: 'auto',
                  maxHeight: '360px'
                }}
              />
              <CardCustomized.Header
                title={
                  <Typography variant='h4' sx={{ padding: '0 1rem' }}>
                    {card.title}
                  </Typography>
                }
                subheader={
                  <Typography variant='body1' sx={{ padding: '0 1rem', marginTop: '.5rem' }}>
                    {card.description}
                  </Typography>
                }
              />
              <CardCustomized.Content className='pb-1'>
                <div className='w-full flex justify-center m-auto'>
                  {card.buttonLink && (
                    <ButtonCustomized
                      variant='contained'
                      type='button'
                      sx={{
                        width: 'auto',
                        padding: '0.5rem 1rem'
                      }}
                    >
                      <Link href={card.buttonLink} target={card.buttonLink.includes('https') ? '_blank' : undefined}>
                        {card.buttonText}
                      </Link>
                    </ButtonCustomized>
                  )}
                </div>
              </CardCustomized.Content>
            </>
          ))}
      />
    </CardCustomized.Root>
  )
}
