import React, { useState, useEffect } from 'react'

import { Box, Typography, Slider, FormControl, FormControlLabel, Checkbox } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

import type { SidebarSimulacaoPropsType } from '@/types/simulacao-beneficio/SidebarSimulacaoPropsTypes'
import type { ParametrosSimulacaoType } from '@/types/simulacao-beneficio/ParametrosSimulacaoType'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { AccordionSimulacaoFilter } from './AccordionSimulacaoFilter'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { aplicarMascaraDinheiro, aplicarMascaraDecimal, formatCurrency } from '@/app/utils/formatters'
import { TooltipInfo } from '../common/TooltipInfo'
import EditableTextField from '@/@layouts/components/customized/EditableTextField'
import { useSimuladorDefault } from '@/contexts/SimuladorDefaultContext'
import type { SimulacaoResponseType } from '@/types/simulacao-beneficio/ParametrosSimulacaoResponseType'

const formatarContribuicaoFacultativa = (value: number | undefined) => {
  if (!value) return ''

  const valueStringArr = value.toString().split('.')

  if (valueStringArr[1] && valueStringArr[1]?.length === 1) {
    return aplicarMascaraDecimal(valueStringArr[0] + ',' + valueStringArr[1] + '0')
  }

  return aplicarMascaraDecimal(valueStringArr[0] + ',00')
}

export default function SidebarSimulacao({
  simulacao,
  simularBeneficio,
  isLoading,
  simulacaoDefaultValues,
  isVinculado,
  isBPD,
  isAutopatrocinado
}: SidebarSimulacaoPropsType) {
  const { setSimuladorDefault } = useSimuladorDefault()

  const [expanded, setExpanded] = useState<string[]>([
    'informacoes-gerais',
    'contribuicao-mensal',
    'beneficio-suplementar'
  ])

  const [checkedFacultativa, setCheckedFacultativa] = useState(true)

  const {
    formState: { errors },
    control,
    getValues,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      idadeAposentadoria: simulacaoDefaultValues.idadeAposentadoria,
      remuneracao: isBPD ? 0 : aplicarMascaraDinheiro(simulacaoDefaultValues.remuneracao || 0) || 'R$ 0,00',
      rentabilidade: formatarContribuicaoFacultativa(simulacaoDefaultValues.rentabilidade),
      contribuicaoNormal: isBPD ? 0 : simulacaoDefaultValues.contribuicaoNormal,
      contribuicaoFacultativa: isBPD
        ? simulacaoDefaultValues.contribuicaoFacultativa
          ? aplicarMascaraDinheiro(simulacaoDefaultValues.contribuicaoFacultativa?.toString())
          : 'R$ 0,00'
        : formatarContribuicaoFacultativa(simulacaoDefaultValues.contribuicaoFacultativa),
      aporteExtra: aplicarMascaraDinheiro(simulacaoDefaultValues.aporteExtra) || 'R$ 0,00',
      saqueReserva: simulacaoDefaultValues.saqueReserva,
      prazoBeneficio: simulacaoDefaultValues.prazoBeneficio,
      baseContribuicaoVinculado: formatCurrency(simulacaoDefaultValues.baseContribuicao ?? 0)
    },
    mode: 'all'
  })

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(prev => (isExpanded ? [...prev, panel] : prev.filter(p => p !== panel)))
  }

  const validaContribuicaoFacultativa = (valor: string | null) => {
    if (valor && parsedToNumber(valor) < 250) {
      return 'O valor minimo da contribuição facultativa é de 2,5%'
    }

    return null
  }

  const validaBaseContribuicaoVinculado = (valor: number | string | undefined) => {
    if (isAutopatrocinado) return null

    const baseContribuicaoVinculado = parsedToNumber(formatCurrency(simulacaoDefaultValues.baseContribuicao ?? 0))

    if (!valor || (valor && parsedToNumber(valor.toString()) < baseContribuicaoVinculado)) {
      return `O valor minimo da contribuição é de ${formatCurrency(simulacaoDefaultValues.baseContribuicao ?? 0)}`
    }

    return null
  }

  const validaIdadeAposentadoria = (valor: number | string | undefined) => {
    if (!simulacao) return null

    const nascimento = simulacao.dadosParticipante.data_nascimento
    const idade = new Date().getFullYear() - nascimento.split('/').map(Number)[2]

    if (!valor || (valor && parsedToNumber(valor.toString()) < idade)) {
      return `O valor minimo não pode ser menor que a sua idade`
    }

    return null
  }

  const validaRemuneracao = (valor: number | string | undefined) => {
    if (isAutopatrocinado) return null
    if (!simulacao) return null

    const tetoRPPS = Number(simulacao.tetoRPPS)

    if (!valor || (valor && parsedToNumberFloat(valor.toString()) < tetoRPPS)) {
      return `O valor da remuneração não pode ser menor que o teto do RGPS (${aplicarMascaraDinheiro(tetoRPPS)})`
    }

    return null
  }

  const handleChangeValorComMascara = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: any) => {
    const valor = e.target.value

    const isRentabilidade = field === 'rentabilidade'

    const isContribuicaoFacultativa =
      field === 'contribuicaoFacultativa' && isBPD ? false : field === 'contribuicaoFacultativa'

    if (isRentabilidade || isContribuicaoFacultativa) {
      const valorFormatado = aplicarMascaraDecimal(valor)

      setValue(field, valorFormatado)

      return
    }

    const valorFormatado = aplicarMascaraDinheiro(valor)

    setValue(field, valorFormatado)
  }

  const parsedToNumber = (value: string) => {
    const onlyNumbers = parseInt(value.replace(/\D/g, ''))

    if (onlyNumbers === 0 || isNaN(onlyNumbers)) {
      return 0
    }

    return onlyNumbers
  }

  const parsedToNumberFloat = (value: string) => {
    const onlyNumbers = Number(value.replaceAll('R$', '').replaceAll('.', '').replaceAll(',', '.'))

    if (onlyNumbers === 0 || isNaN(onlyNumbers)) {
      return 0
    }

    return onlyNumbers
  }

  const handleSubmitFilters = async () => {
    const baseContribuicao = isAutopatrocinado
      ? parsedToNumberFloat(getValues('remuneracao').toString())
      : parsedToNumberFloat(getValues('baseContribuicaoVinculado').toString())

    const parametros: ParametrosSimulacaoType = {
      cpf: simulacaoDefaultValues.cpf,
      idadeAposentadoria: getValues('idadeAposentadoria'),
      remuneracao: isBPD || isAutopatrocinado ? 0 : parsedToNumberFloat(getValues('remuneracao').toString()),
      rentabilidade: parsedToNumberFloat(getValues('rentabilidade').toString()),
      contribuicaoNormal: isBPD ? 0 : getValues('contribuicaoNormal'),
      contribuicaoFacultativa: parsedToNumberFloat(getValues('contribuicaoFacultativa') || '0'),
      aporteExtra: parsedToNumberFloat(getValues('aporteExtra')),
      saqueReserva: getValues('saqueReserva'),
      prazoBeneficio: getValues('prazoBeneficio'),
      baseContribuicao
    }

    if (simularBeneficio) {
      await simularBeneficio(parametros).then(() => {
        setSimuladorDefault(null as unknown as SimulacaoResponseType)
      })
    }
  }

  useEffect(() => {
    if (simulacaoDefaultValues?.contribuicaoFacultativa) {
      const valorContribuicaoFacultativa = formatarContribuicaoFacultativa(
        simulacaoDefaultValues.contribuicaoFacultativa
      )

      setCheckedFacultativa(false)
      setValue(
        'contribuicaoFacultativa',
        isBPD ? aplicarMascaraDinheiro(valorContribuicaoFacultativa) : valorContribuicaoFacultativa
      )
    } else {
      setValue('contribuicaoFacultativa', isBPD ? 'R$ 0,00' : '')
    }
  }, [simulacaoDefaultValues.contribuicaoFacultativa, isBPD])

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title='Parâmetros da simulação'
        subheader='Utilize os parâmetros abaixo para simular mudanças em seu benefício Funpresp-Jud'
      />
      <CardCustomized.Content>
        <form
          onSubmit={e => {
            e.preventDefault()

            handleSubmitFilters()
          }}
          noValidate
          className='w-full'
        >
          <AccordionSimulacaoFilter
            simulacao={simulacao}
            title='Informações Gerais'
            expanded={expanded.includes('informacoes-gerais')}
            onChange={handleAccordionChange('informacoes-gerais')}
          >
            <div className='flex flex-col items-center gap-4'>
              <Controller
                name='idadeAposentadoria'
                control={control}
                render={({ field }) => (
                  <EditableTextField
                    {...field}
                    label='Qual a sua idade provável de aposentadoria?'
                    onChange={e => field.onChange(parsedToNumber(e.target.value.toString()))}
                    error={!!validaIdadeAposentadoria(field.value)}
                    helperText={validaIdadeAposentadoria(field.value) as string}
                    inputProps={{
                      style: {
                        marginTop: '0.5rem'
                      }
                    }}
                  />
                )}
              />

              {isVinculado && !isAutopatrocinado ? (
                <Box className='w-full flex flex-row items-center gap-2'>
                  <Controller
                    name='baseContribuicaoVinculado'
                    control={control}
                    render={({ field }) => (
                      <EditableTextField
                        {...field}
                        label='Qual a sua base de contribuição Funpresp-Jud?'
                        onChange={e => handleChangeValorComMascara(e, 'baseContribuicaoVinculado')}
                        error={!!validaBaseContribuicaoVinculado(field.value)}
                        helperText={`A base de contribuição mínima é ${formatCurrency(simulacao?.urp.tetoUrp ?? 0)}`}
                        inputProps={{
                          style: {
                            marginTop: '0.5rem'
                          }
                        }}
                      />
                    )}
                  />

                  <TooltipInfo
                    descriptionTooltip='É o valor utilizado como base para calcular suas contribuições mensais, devendo ser no mínimo 10 URPs.'
                    className='text-xl'
                  />
                </Box>
              ) : isAutopatrocinado ? (
                <Box className='w-full flex flex-row items-center gap-2'>
                  <Controller
                    name='remuneracao'
                    control={control}
                    render={({ field }) => (
                      <EditableTextField
                        {...field}
                        label='Qual a sua base de contribuição Funpresp-Jud?'
                        onChange={e => handleChangeValorComMascara(e, 'remuneracao')}
                        error={!!errors.remuneracao}
                        helperText={errors.remuneracao?.message as string}
                        inputProps={{
                          style: {
                            marginTop: '0.5rem'
                          }
                        }}
                      />
                    )}
                  />

                  <TooltipInfo
                    descriptionTooltip='É o valor utilizado como base para calcular suas contribuições mensais dentro da fundação.'
                    className='text-xl'
                  />
                </Box>
              ) : (
                !isBPD && (
                  <Controller
                    name='remuneracao'
                    control={control}
                    render={({ field }) => (
                      <EditableTextField
                        {...field}
                        label='Qual a sua remuneração atual?'
                        onChange={e => handleChangeValorComMascara(e, 'remuneracao')}
                        error={!!validaRemuneracao(field.value)}
                        helperText={validaRemuneracao(field.value) as string}
                        inputProps={{
                          style: {
                            marginTop: '0.5rem'
                          }
                        }}
                      />
                    )}
                  />
                )
              )}

              <Controller
                name='rentabilidade'
                control={control}
                render={({ field }) => (
                  <FormControl variant='filled' fullWidth>
                    <EditableTextField
                      {...field}
                      label='Qual a rentabilidade real projetada anual?'
                      onChange={e => handleChangeValorComMascara(e, 'rentabilidade')}
                      error={!!errors.rentabilidade}
                      helperText={errors.rentabilidade?.message as string}
                      suffix='%'
                    />
                  </FormControl>
                )}
              />
            </div>
          </AccordionSimulacaoFilter>

          <AccordionSimulacaoFilter
            simulacao={simulacao}
            title='Contribuição'
            expanded={expanded.includes('contribuicao-mensal')}
            onChange={handleAccordionChange('contribuicao-mensal')}
          >
            <div className='flex flex-col items-center gap-4'>
              {!isBPD && (
                <Controller
                  name='contribuicaoNormal'
                  control={control}
                  render={({ field }) => (
                    <FormControl variant='filled' fullWidth>
                      {isVinculado ? (
                        <Typography variant='body1'>Qual a contribuição vinculada mensal desejada?</Typography>
                      ) : (
                        <Typography variant='body1'>Qual a contribuição normal mensal desejada?</Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, marginTop: '0.5rem' }}>
                        <Slider
                          {...field}
                          min={6.5}
                          max={isVinculado ? 22 : 8.5}
                          step={0.5}
                          onChange={(_, value) => field.onChange(value as number)}
                          valueLabelDisplay='auto'
                          sx={{ flex: 1, width: '100%' }}
                        />
                        <Typography variant='body1' sx={{ ml: '0.5rem' }}>
                          {aplicarMascaraDecimal(Number.isInteger(field.value) ? `${field.value}.0` : field.value, 1)} %
                        </Typography>
                      </Box>
                    </FormControl>
                  )}
                />
              )}

              {isBPD ? (
                <Box className='w-full flex flex-row items-center gap-2'>
                  <Controller
                    name='contribuicaoFacultativa'
                    control={control}
                    render={({ field }) => (
                      <FormControl variant='filled' fullWidth>
                        <EditableTextField
                          {...field}
                          label='Qual a contribuição facultativa mensal desejada?'
                          onChange={e => handleChangeValorComMascara(e, 'contribuicaoFacultativa')}
                          error={!!errors.contribuicaoFacultativa}
                          helperText={errors.contribuicaoFacultativa?.message as string}
                          inputProps={{
                            style: {
                              marginTop: '0.5rem'
                            }
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </Box>
              ) : (
                <>
                  <Box className='w-full flex flex-row items-center gap-2'>
                    <Controller
                      name='contribuicaoFacultativa'
                      control={control}
                      render={({ field }) => (
                        <FormControl variant='filled' fullWidth>
                          <EditableTextField
                            {...field}
                            label='Qual a contribuição facultativa mensal desejada?'
                            onChange={e => handleChangeValorComMascara(e, 'contribuicaoFacultativa')}
                            error={!checkedFacultativa && !!validaContribuicaoFacultativa(field.value)}
                            helperText={!checkedFacultativa && (validaContribuicaoFacultativa(field.value) as string)}
                            disabled={checkedFacultativa}
                            {...(!checkedFacultativa && {
                              suffix: '%'
                            })}
                          />
                        </FormControl>
                      )}
                    />
                    <TooltipInfo
                      descriptionTooltip='Com valor mínimo de 2,5%, contribuições facultativas auxiliam consideravelmente em rendas maiores na aposentadoria.'
                      className='text-xl'
                    />
                  </Box>

                  <Box className='w-full flex flex-row items-center gap-2'>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedFacultativa}
                          onChange={() => {
                            setCheckedFacultativa(!checkedFacultativa)

                            if (checkedFacultativa) {
                              setValue(
                                'contribuicaoFacultativa',
                                formatarContribuicaoFacultativa(simulacaoDefaultValues.contribuicaoFacultativa) ||
                                  '2,50'
                              )
                            } else {
                              setValue('contribuicaoFacultativa', '')
                            }
                          }}
                        />
                      }
                      label='Não quero realizar contribuições facultativas'
                      sx={{
                        alignItems: 'flex-start',
                        '& .MuiButtonBase-root': {
                          paddingTop: 0
                        }
                      }}
                    />
                  </Box>
                </>
              )}

              <Box className='w-full flex flex-row items-center gap-2'>
                <Controller
                  name='aporteExtra'
                  control={control}
                  render={({ field }) => (
                    <FormControl variant='filled' fullWidth>
                      <EditableTextField
                        {...field}
                        label='Valores de aportes extraordinários ou portabilidade?'
                        onChange={e => handleChangeValorComMascara(e, 'aporteExtra')}
                        error={!!errors.aporteExtra}
                        helperText={errors.aporteExtra?.message as string}
                        inputProps={{
                          style: {
                            marginTop: '0.5rem'
                          }
                        }}
                      />
                    </FormControl>
                  )}
                />
              </Box>
            </div>
          </AccordionSimulacaoFilter>

          <AccordionSimulacaoFilter
            simulacao={simulacao}
            title='Benefício Suplementar'
            expanded={expanded.includes('beneficio-suplementar')}
            onChange={handleAccordionChange('beneficio-suplementar')}
          >
            <div className='flex flex-col items-center gap-4'>
              <Controller
                name='saqueReserva'
                control={control}
                render={({ field }) => (
                  <FormControl variant='filled' fullWidth>
                    <Box className='flex items-center gap-2'>
                      <Typography variant='body1'>Saque do saldo da reserva suplementar?</Typography>
                      <TooltipInfo
                        descriptionTooltip='Saques do saldo da reserva suplementar afetam negativamente sua renda na aposentadoria.'
                        className='text-xl'
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Slider
                        {...field}
                        min={0}
                        max={25}
                        step={1}
                        onChange={(_, value) => field.onChange(value as number)}
                        valueLabelDisplay='auto'
                        sx={{ flex: 1 }}
                      />
                      <Typography variant='body1' sx={{ ml: '0.5rem' }}>
                        {field.value} %
                      </Typography>
                    </Box>
                  </FormControl>
                )}
              />

              <Controller
                name='prazoBeneficio'
                control={control}
                render={({ field }) => (
                  <FormControl variant='filled' fullWidth>
                    <Typography variant='body1'>Tempo de recebimento do benefício suplementar?</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Slider
                        {...field}
                        min={60}
                        max={480}
                        step={1}
                        onChange={(_, value) => field.onChange(value as number)}
                        valueLabelDisplay='auto'
                        sx={{ flex: 1 }}
                      />
                      <Typography variant='body1' sx={{ ml: '0.5rem' }}>
                        {field.value} meses
                      </Typography>
                    </Box>
                  </FormControl>
                )}
              />
            </div>
          </AccordionSimulacaoFilter>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: '2rem' }}>
            <ButtonCustomized
              variant='contained'
              color='primary'
              type='submit'
              disabled={
                isLoading ||
                validaIdadeAposentadoria(watch('idadeAposentadoria')) !== null ||
                (!isVinculado
                  ? !isBPD
                    ? validaRemuneracao(watch('remuneracao')) !== null
                    : false
                  : validaBaseContribuicaoVinculado(watch('baseContribuicaoVinculado')) !== null) ||
                (!isBPD &&
                  !checkedFacultativa &&
                  validaContribuicaoFacultativa(watch('contribuicaoFacultativa')) !== null)
              }
              sx={{ width: 'auto', padding: '0.5rem 2rem' }}
            >
              {isLoading ? 'Aplicando...' : 'Aplicar parâmetros'}
            </ButtonCustomized>
          </Box>
        </form>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
