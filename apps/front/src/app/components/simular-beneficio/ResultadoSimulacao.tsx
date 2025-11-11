import { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'

import Link from 'next/link'

import { Typography, Button, Box, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { Download } from '@mui/icons-material'

import { AccordionVisaoGeral } from './AccordionVisaoGeral'
import { AccordionComparacaoBeneficio } from './AccordionComparacaoBeneficio'
import { AccordionComparacaoPerformance } from './AccordionComparacaoPerformance'
import { AccordionSimulacaoBeneficioLiquido } from './AccordionSimulacaoBeneficioLiquido'
import { AccordionDadosCalculo } from './AccordionDadosCalculo'
import type { ResultadoSimulacaoPropsType } from '@/types/simulacao-beneficio/ResultadoSimulacaoPropsTypes'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { useSimuladorDefault } from '@/contexts/SimuladorDefaultContext'
import { PapeisEPermissoesService2, PermissoesEnum } from '@/services/PapeisEPermissoesService'
import { useAuth } from '@/contexts/AuthContext'
import type { PermissionType } from '@/types/permissions/PermissionType'

export default function ResultadoSimulacao({
  onVoltar,
  simulacao,
  isVinculado,
  isBPD,
  isAutopatrocinado
}: ResultadoSimulacaoPropsType) {
  const [expanded, setExpanded] = useState<string[]>(['panel1'])
  const [userPermissions, setUserPermissions] = useState<PermissionType[]>([])

  // Add null checking for simulacao
  const [beneficioEspecial, setBeneficioEspecial] = useState(simulacao?.beneficios?.beneficio_especial || 0)

  const [beneficioRPPS, setBeneficioRPPS] = useState(simulacao?.beneficios?.beneficio_rpps || 0)
  const { simuladorDefault } = useSimuladorDefault()

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(prev => (isExpanded ? [...prev, panel] : prev.filter(p => p !== panel)))
  }

  const { user } = useAuth()

  const getUserPermissions = useCallback(async () => {
    if (user?.roles) {
      const permissions = await PapeisEPermissoesService2.getPermissionsUser(user.roles, user.cpf)

      setUserPermissions(permissions || [])
    }
  }, [user?.roles])

  useEffect(() => {
    getUserPermissions()
  }, [getUserPermissions])

  // Show loading state if simulacao is null
  if (!simulacao) {
    return (
      <Box
        sx={{
          width: '100%',
          p: 10,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          border: 1,
          borderColor: 'divider',
          mb: 2,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant='h6' sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Carregando simulação...
        </Typography>
        <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={onVoltar} sx={{ mt: 3, minWidth: 90 }}>
          Voltar
        </Button>
      </Box>
    )
  }

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Typography variant='h3'>Resultado da Simulação</Typography>
            <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={onVoltar}>
              Voltar
            </Button>
          </Box>
        }
      />
      <CardCustomized.Content>
        {simulacao && !simuladorDefault ? (
          <>
            <AccordionVisaoGeral
              simulacao={simulacao}
              expanded={expanded.includes('panel1')}
              onChange={handleChange('panel1')}
              beneficioEspecial={beneficioEspecial}
              setBeneficioEspecial={setBeneficioEspecial}
              beneficioRPPS={beneficioRPPS}
              setBeneficioRPPS={setBeneficioRPPS}
              subtitle={
                <>
                  <span className='font-bold'>
                    Nosso simulador projeta seu patrimônio e benefícios de aposentadoria
                  </span>
                  , com base na sua contribuição atual. Além disso,{' '}
                  <span className='font-bold'>permite simular mudanças a longo prazo</span>, ajustando parâmetros, como
                  idade de aposentadoria, percentuais de contribuição ou aportes.
                </>
              }
              isVinculado={isVinculado}
              isBPD={isBPD}
              isAutopatrocinado={isAutopatrocinado}
            />

            <AccordionComparacaoBeneficio
              simulacao={simulacao}
              expanded={expanded.includes('panel2')}
              onChange={handleChange('panel2')}
              beneficioEspecial={beneficioEspecial}
              setBeneficioEspecial={setBeneficioEspecial}
              beneficioRPPS={beneficioRPPS}
              setBeneficioRPPS={setBeneficioRPPS}
              subtitle='Abaixo, somamos o benefício mensal a ser pago pela Funpresp-Jud aos valores a serem recebidos pelos benefícios especial e Regime Próprio de Previdência Social (RPPS) informados pelo participante para calcular o quão próximo você se encontra do valor que deseja receber de aposentadoria.'
            />

            <AccordionComparacaoPerformance
              simulacao={simulacao}
              expanded={expanded.includes('panel3')}
              onChange={handleChange('panel3')}
              subtitle='Veja a projeção da evolução patrimonial nos parâmetros atuais em comparação à evolução patrimonial desta simulação.'
            />
            <AccordionSimulacaoBeneficioLiquido
              simulacao={simulacao}
              expanded={expanded.includes('panel4')}
              onChange={handleChange('panel4')}
              subtitle='Utilizamos os valores brutos desta simulação para prever de forma aproximada o valor do seu benefício líquido.'
            />
            <AccordionDadosCalculo
              simulacao={simulacao}
              expanded={expanded.includes('panel5')}
              onChange={handleChange('panel5')}
              subtitle='Veja os parâmetros usados para realizar os cálculos dessa simulação.'
            />
            {PapeisEPermissoesService2.can(userPermissions, [PermissoesEnum.VER_CARROSSEL_CAMPANHA]) && (
              <Box className='flex flex-col items-center justify-center gap-4 pt-6 border-t-2 border-top-color:var(--mui-palette-divider)'>
                <Typography variant='body1' className='text-center max-w-[680px]'>
                  Preencha o formulário de aumento de percentual abaixo e entregue à Gestão de Pessoas do seu orgão para
                  atualizar seu perfil de contribuição!
                </Typography>
                <Link
                  href='https://www.funprespjud.com.br/wp-content/uploads/2025/07/aumento-percentual-de-contribuicao1.pdf'
                  target='_blank'
                >
                  <Button variant='contained' color='primary' startIcon={<Download />}>
                    Ver formulário
                  </Button>
                </Link>
              </Box>
            )}
          </>
        ) : (
          <Box className='flex flex-col items-center justify-center gap-4 pt-6 border-t-2 border-top-color:var(--mui-palette-divider)'>
            <Image src='/images/iris/simulacao.svg' alt='Não há simulação para exibir' width={130} height={99} />
            <Typography variant='body1'>Aplique os parâmetros da simulação para começar a simulação</Typography>
          </Box>
        )}
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
