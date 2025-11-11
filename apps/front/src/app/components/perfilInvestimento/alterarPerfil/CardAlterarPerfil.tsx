import { useEffect } from 'react'

import { Box, Divider, Typography } from '@mui/material'

import BoxConsideracaoPerfil from './BoxConsideracaoPerfil'
import ListPerfil from './ListPerfil'
import type { UserType } from '@/types/UserType'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { TooltipInfo } from '../../common/TooltipInfo'
import useGetParticipante from '@/hooks/participante/useGetParticipante'

export default function CardAlterarPerfil({
  user,
  handleClick,
  setDetalhamentoPerfilAtual,
  setDetalhamentoPerfilIndicado,
  setPerfilSelecionado
}: {
  user: UserType
  handleClick: () => void
  setDetalhamentoPerfilAtual: (value: any) => void
  setDetalhamentoPerfilIndicado: (value: any) => void
  setPerfilSelecionado: (value: any) => void
}) {
  const { participante, getParticipante } = useGetParticipante()

  useEffect(() => {
    if (user?.cpf) {
      getParticipante(user.cpf)
    }
  }, [user, getParticipante])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Alterar perfil' />

      <CardCustomized.Content>
        <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 mb-4 gap-4'>
          <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
          <div>
            <Typography variant='h5' className='text-primary-main font-bold mb-1'>
              Importante
            </Typography>
            <Typography variant='body1'>
              Alterações de perfil só podem ser realizadas durante campanhas destinadas a este propósito e não poderão
              ser realizadas por beneficiários que já estejam recebendo renda da fundação.
            </Typography>
          </div>
        </Box>

        <Typography variant='h5' sx={{ color: 'var(--mui-palette-text-secondary)' }}>
          O que considerar ao escolher o seu Perfil:
        </Typography>

        <div className='grid grid-rows-1 gap-6 grid-cols-1 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 mt-4'>
          <BoxConsideracaoPerfil
            icon='fa-regular fa-1'
            title='Tempo até a aposentadoria'
            description='No modelo Ciclo de Vida, o tempo até a aposentadoria é uma das variáveis que mais impactam o valor da aposentadoria.'
          />
          <BoxConsideracaoPerfil
            icon='fa-regular fa-2'
            title='Data de aposentadoria e risco assumido'
            description='Escolher um horizonte inadequado para a sua data de aposentadoria pode te expor a risco excessivo no curto prazo, ou a retornos abaixo do esperado, no longo prazo.'
          />
          <BoxConsideracaoPerfil
            icon='fa-regular fa-3'
            title='Nossa indicação'
            description='Nossa indicação considera a sua data de aposentadoria para encontrar o equilíbrio entre rentabilidade e risco.'
          />
        </div>

        <div className='flex flex-col text-center gap-4 mt-4'>
          <Typography variant='body1'>
            Saiba mais sobre os perfis de investimentos, assistindo ao nosso vídeo explicativo ou conferindo a Política
            de investimentos.
          </Typography>

          <div className='flex flex-col sm:flex-row justify-center items-center gap-4'>
            <div className='max-w-[780px] flex flex-wrap items-center justify-center text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='outlined'
                color='primary'
                startIcon={<i className='fa-regular fa-eye ' />}
                onClick={() => {
                  window.open(
                    'https://www.youtube.com/watch?v=l-o2RQ4lFFU&list=PLXC1vMS60dFnqHmMsfKhoHV1L22lNyAJv',
                    '_blank'
                  )
                }}
                sx={{ width: '340px' }}
              >
                Assistir ao vídeo explicativo
              </ButtonCustomized>
              <ButtonCustomized
                variant='outlined'
                color='primary'
                startIcon={<i className='fa-regular fa-file-pdf' />}
                onClick={() => {
                  window.open(
                    'https://www.funprespjud.com.br/wp-content/uploads/2024/12/Politica-de-Investimentos-2025-2029.pdf',
                    '_blank'
                  )
                }}
                sx={{ width: '340px' }}
              >
                Ver Política de Investimento
              </ButtonCustomized>
            </div>
          </div>
        </div>

        <Divider sx={{ margin: '2rem 0' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant='h5' sx={{ fontSize: '1.25rem' }}>
            Idade de aposentadoria
          </Typography>
          <Typography variant='body1'>
            O Perfil Indicado é apenas uma sugestão, com base em estudos técnicos e no Modelo Ciclo de Vida, que utiliza
            Fundos Data-Alvo. Dessa forma, a indicação considera a data estimada da sua aposentadoria para definir as
            metas de rendimento e a composição da carteira de ativos.
          </Typography>
          <Typography variant='body1' sx={{ marginTop: '0.5rem', display: 'flex', alignItems: 'flex-end' }}>
            Nossa indicação considera que a sua aposentadoria ocorrerá aos:
            <span className='text-primary-main font-bold text-xl align-middle ms-1'>
              {participante?.sexo === 'Masculino' ? '65 anos' : '62 anos'}
              <TooltipInfo
                descriptionTooltip='Os cálculos consideram as idades mínimas exigidas por lei para aposentadoria: 62 anos para mulheres e 65 anos para homens.'
                className='text-xl ml-1'
              />
            </span>
          </Typography>
        </Box>

        <Divider sx={{ margin: '2rem 0' }} />

        <ListPerfil
          handleClick={handleClick}
          setDetalhamentoPerfilAtual={setDetalhamentoPerfilAtual}
          setDetalhamentoPerfilIndicado={setDetalhamentoPerfilIndicado}
          setPerfilSelecionado={setPerfilSelecionado}
        />

        <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 mb-4 gap-4'>
          <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
          <div>
            <Typography variant='h5' className='text-primary-main font-bold mb-1'>
              Importante
            </Typography>
            <Typography variant='body1'>
              A alocação dos investimentos será ajustada automaticamente, aumentando a proteção do capital acumulado à
              medida em que a data provável da sua aposentadoria se aproximar.
            </Typography>
          </div>
        </Box>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
