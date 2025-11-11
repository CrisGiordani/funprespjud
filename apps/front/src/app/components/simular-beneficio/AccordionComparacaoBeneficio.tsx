import React, { useEffect, useMemo, useState } from 'react'

import { Typography, Box, Grid } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AccordionSimulacao } from './AccordionSimulacao'
import { ComparativoDoughnut } from './ComparativoDoughnut'
import { BoxMelhoreBeneficios } from './BoxMelhoreBeneficios'
import type { AccordionComparacaoBeneficioPropsType } from '@/types/simulacao-beneficio/AccordionComparacaoBeneficioPropsTypes'
import { formatCurrency, aplicarMascaraDinheiro } from '@/app/utils/formatters'
import EditableTextField from '@/@layouts/components/customized/EditableTextField'
import { BeneficioInput } from './BeneficioInput'
import { TitleSubtitleSection } from './TitleSubtitleSection'
import { calcularPorcentagem } from '@/utils/math'
import { constants } from '@/utils/constants'

const TETO_RGPS = constants.TETO_RGPS

const beneficioSchema = z.object({
  beneficioEspecial: z.string().min(1, 'Benefício especial é obrigatório'),
  beneficioRPPS: z.string().min(1, 'Benefício RPPS é obrigatório')
})

type BeneficioFormData = z.infer<typeof beneficioSchema>

const parseMonetaryInput = (value: string): number => {
  return Number(value.replace('R$', '').replace('.', '').replace(',', '.'))
}

export function AccordionComparacaoBeneficio({
  simulacao,
  expanded,
  onChange,
  beneficioEspecial,

  //setBeneficioEspecial,
  beneficioRPPS,
  setBeneficioRPPS,
  subtitle
}: AccordionComparacaoBeneficioPropsType) {
  const [total, setTotal] = useState(0)

  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BeneficioFormData>({
    resolver: zodResolver(beneficioSchema),
    defaultValues: {
      beneficioEspecial: aplicarMascaraDinheiro(beneficioEspecial.toString()),
      beneficioRPPS:
        beneficioRPPS > 0
          ? aplicarMascaraDinheiro(beneficioRPPS.toString())
          : aplicarMascaraDinheiro(TETO_RGPS.toString())
    },
    mode: 'all'
  })

  const [beneficioDesejado, setBeneficioDesejado] = useState(simulacao.beneficios.beneficios_funpresp_jud)

  // Setar o teto do INSS se o beneficioRPPS estiver vazio
  useEffect(() => {
    if (beneficioRPPS <= 0) {
      setBeneficioRPPS(TETO_RGPS)
    }
  }, [beneficioRPPS, setBeneficioRPPS])

  const handleBeneficioEspecialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    const valorFormatado = aplicarMascaraDinheiro(valor)

    setValue('beneficioEspecial', valorFormatado)
  }

  const handleBeneficioRPPSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    const valorFormatado = aplicarMascaraDinheiro(valor)

    setValue('beneficioRPPS', valorFormatado)
  }

  const handleBeneficioDesejadoChange = (valorFormatado: string) => {
    const valorNumerico = parseMonetaryInput(valorFormatado)

    setBeneficioDesejado(valorNumerico)
  }

  const valorEspecial = watch('beneficioEspecial')
  const valorRPPS = watch('beneficioRPPS')

  useEffect(() => {
    if (valorEspecial && valorRPPS) {
      setTotal(
        parseMonetaryInput(valorEspecial) + parseMonetaryInput(valorRPPS) + simulacao.beneficios.beneficios_funpresp_jud
      )
    }
  }, [valorEspecial, valorRPPS, simulacao])

  const percentualCalculado = useMemo(() => {
    if (beneficioDesejado <= 0) return 0

    return calcularPorcentagem(total, beneficioDesejado)
  }, [beneficioDesejado, total])

  return (
    <form className='mb-6'>
      <AccordionSimulacao
        simulacao={simulacao}
        title='2. Benefícios projetados e comparação ao benefício previdenciário desejado'
        subtitle={subtitle}
        expanded={expanded}
        onChange={onChange}
      >
        <Grid container spacing={2} columns={{ md: 12, lg: 17 }}>
          <Grid item md={12} lg={5}>
            <BeneficioInput
              descriptionTooltip='Benefício exclusivamente oferecido para servidores públicos admitidos até 13/10/2013 que migraram do regime previdenciário anterior (integralidade/paridade ou média remuneratória/reajuste) e agora contribuem para o RPPS com limitação ao teto do INSS. Esse valor pode ser consultado junto ao órgão.'
              icon='fa-regular fa-envelope-open-dollar'
            >
              <Controller
                name='beneficioEspecial'
                control={control}
                render={({ field }) => (
                  <EditableTextField
                    {...field}
                    label='Benefício especial'
                    type='text'
                    variant='filled'
                    onChange={handleBeneficioEspecialChange}
                    error={!!errors.beneficioEspecial}
                    helperText={errors.beneficioEspecial?.message}
                    sx={{ width: '155px' }}
                  />
                )}
              />
            </BeneficioInput>
          </Grid>

          <Grid item md={12} lg={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <i className={`fa-regular fa-plus text-primary-main text-2xl`}></i>
          </Grid>

          <Grid item md={12} lg={5}>
            <BeneficioInput
              descriptionTooltip='Benefício pago pelo órgão, conforme as regras de cálculo, não podendo exceder, para participantes patrocinados, o teto do Regime Geral de Previdência Social (RGPS).'
              icon='fa-kit fa-rocking-chair'
            >
              <Controller
                name='beneficioRPPS'
                control={control}
                render={({ field }) => (
                  <EditableTextField
                    {...field}
                    label='Benefício RPPS'
                    type='text'
                    variant='filled'
                    placeholder='R$ 0,00'
                    onChange={handleBeneficioRPPSChange}
                    error={!!errors.beneficioRPPS}
                    helperText={errors.beneficioRPPS?.message}
                    sx={{ width: '155px' }}
                  />
                )}
              />
            </BeneficioInput>
          </Grid>

          <Grid item md={12} lg={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <i className={`fa-regular fa-plus text-primary-main text-2xl`}></i>
          </Grid>

          <Grid item md={12} lg={5}>
            <Box
              display='flex'
              flexDirection='row'
              flexWrap='wrap'
              alignItems='center'
              justifyContent='start'
              gap='1rem'
            >
              <div className={`w-[65px] h-[65px] flex justify-center items-center bg-primary-main/10 rounded-full`}>
                <i className={`fa-kit fa-regular-money-bill-wave-circle-dollar text-primary-main text-xl`}></i>
              </div>

              <Box>
                <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary) !important' }}>
                  Benefício Funpresp-Jud
                </Typography>

                <Typography
                  variant='h5'
                  sx={{ fontSize: '1.25rem', color: 'var(--mui-palette-text-primary) !important' }}
                >
                  {formatCurrency(simulacao.beneficios.beneficios_funpresp_jud)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box display='flex' flexDirection='row' alignItems='center' justifyContent='center' mt={4} width='100%'>
          <i className={`fa-regular fa-equals text-primary-main text-3xl mr-4`}></i>

          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            p='1.5rem'
            borderRadius={1}
            minWidth={300}
            border={1}
            borderColor={'var(--mui-palette-primary-main)'}
            boxShadow={0}
            className='bg-primary-main/10'
            gap='1rem'
          >
            <div className={`w-[65px] h-[65px] flex justify-center items-center bg-primary-main rounded-full`}>
              <i className={`fa-regular fa-coins text-white text-2xl`}></i>
            </div>

            <div className='flex flex-col items-start justify-center'>
              <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-secondary) !important' }}>
                Benefício previdenciário bruto
              </Typography>

              <Typography
                variant='h5'
                sx={{ fontSize: '1.25rem', color: 'var(--mui-palette-text-primary) !important' }}
              >
                {formatCurrency(total)}
              </Typography>
            </div>
          </Box>
        </Box>

        <Box>
          <TitleSubtitleSection
            title='Benefício previdenciário desejado x Benefício previdenciário bruto'
            subtitle={
              <>
                <span className='font-bold'>Informe</span> o valor desejado (benefício previdenciário desejado) para
                aposentadoria e <span className='font-bold'>compare</span> com o valor projetado (benefício
                previdenciário bruto) acima.
              </>
            }
          />

          <Box display='flex' width='100%'>
            <ComparativoDoughnut
              simulacao={simulacao}
              label='Benefício previdenciário desejado'
              descriptionTooltip='Valor que você gostaria de ganhar mensalmente após se aposentar.'
              label2='Benefício previdenciário bruto'
              valor2={formatCurrency(total)}
              valor={formatCurrency(beneficioDesejado)}
              percentual={percentualCalculado}
              isInput={true}
              onValueChange={handleBeneficioDesejadoChange}
            />
          </Box>
        </Box>

        <BoxMelhoreBeneficios />
      </AccordionSimulacao>
    </form>
  )
}
