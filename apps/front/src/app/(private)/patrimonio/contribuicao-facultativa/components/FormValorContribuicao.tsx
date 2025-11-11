'use client'

import { useState } from 'react'

import type { Resolver } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { RadioGroup, Typography } from '@mui/material'

import EditableTextField from '@/@layouts/components/customized/EditableTextField'
import { aplicarMascaraDinheiro, formatCurrency } from '@/app/utils/formatters'
import { ContribuicaoFacultativaService } from '@/services/ContribuicaoFacultativaService'
import type {
  ContribuicaoFacultativaBoletoResponseType,
  ContribuicaoFacultativaPixResponseType
} from '@/types/contribuicao-facultativa/contribuicao-facultativa.type'
import type { ContribuicaoFacultativaFormData } from '../schemas/contribuicao-facultativa.schema'
import { contribuicaoFacultativaSchema, FORMAS_PAGAMENTO_ENUM } from '../schemas/contribuicao-facultativa.schema'
import { RadioCustomized } from './RadioCustomized'
import { ErroGerarPixBoleto } from './ErroGerarPixBoleto'
import { PagamentoPix } from './PagamentoPix'
import { PagamentoBoleto } from './PagamentoBoleto'
import { ActionButton } from './ActionButton'

export function FormValorContribuicao() {
  const [errorFetch, setErrorFetch] = useState<FORMAS_PAGAMENTO_ENUM | null>(null)
  const [pixData, setPixData] = useState<ContribuicaoFacultativaPixResponseType | null>(null)
  const [boletoData, setBoletoData] = useState<ContribuicaoFacultativaBoletoResponseType | null>(null)

  // TODO: pegar o valor mínimo da contribuição do backend
  const valorMinino = 100

  const {
    formState: { errors, isValid },
    control,
    getValues,
    setValue,
    reset
  } = useForm<ContribuicaoFacultativaFormData>({
    resolver: zodResolver(
      contribuicaoFacultativaSchema(formatCurrency(valorMinino))
    ) as Resolver<ContribuicaoFacultativaFormData>,
    defaultValues: {
      valorContribuicao: 'R$ 0,00'
    },
    mode: 'all'
  })

  const resetStates = () => {
    reset()
    setBoletoData(null)
    setPixData(null)
    setErrorFetch(null)
  }

  const handleChangeValorContribuicao = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    const valorFormatado = aplicarMascaraDinheiro(valor)

    setValue('valorContribuicao', valorFormatado)
  }

  const handleFetchGerarQrCodePix = async () => {
    const valor = Number(getValues().valorContribuicao.replace('R$', '').replace('.', '').replace(',', '.'))

    const data = await ContribuicaoFacultativaService.gerarQrCodePix(valor, '1234567890')

    if (data) {
      setPixData(data)
    } else {
      setErrorFetch(FORMAS_PAGAMENTO_ENUM.pix)
    }
  }

  const handleFetchGerarBoleto = async () => {
    const valor = Number(getValues().valorContribuicao.replace('R$', '').replace('.', '').replace(',', '.'))

    const data = await ContribuicaoFacultativaService.gerarBoleto(valor, '1234567890')

    if (data) {
      setBoletoData(data)
    } else {
      setErrorFetch(FORMAS_PAGAMENTO_ENUM.boleto)
    }
  }

  const handleGerar = () => {
    if (getValues().formaPagamento === FORMAS_PAGAMENTO_ENUM.pix) {
      handleFetchGerarQrCodePix()
    }

    if (getValues().formaPagamento === FORMAS_PAGAMENTO_ENUM.boleto) {
      handleFetchGerarBoleto()
    }
  }

  if (pixData) {
    return (
      <PagamentoPix
        valor={Number(getValues().valorContribuicao.replace('R$', '').replace('.', '').replace(',', '.'))}
        chave={pixData.chave}
        onVoltar={resetStates}
        onTentarNovamente={() => {
          if (errorFetch === FORMAS_PAGAMENTO_ENUM.pix) {
            handleFetchGerarQrCodePix()
          }
        }}
      />
    )
  }

  if (boletoData) {
    return <PagamentoBoleto codigo={boletoData.codigo} onNovaContribuicao={resetStates} />
  }

  if (errorFetch) {
    return (
      <ErroGerarPixBoleto
        type={errorFetch}
        onTentarNovamente={() => {
          if (errorFetch === FORMAS_PAGAMENTO_ENUM.pix) {
            handleFetchGerarQrCodePix()
          }

          if (errorFetch === FORMAS_PAGAMENTO_ENUM.boleto) {
            handleFetchGerarBoleto()
          }

          setErrorFetch(null)
        }}
        onVoltar={resetStates}
      />
    )
  }

  return (
    <div className='w-full max-w-[724px] flex flex-col items-center gap-2 text-neutral-600'>
      <Typography variant='h5'>Valor da contribuição</Typography>

      <Typography variant='body1'>
        Informe abaixo o valor que gostaria de contribuir, lembre-se que o valor mínimo possível é{' '}
        <span className='font-bold'>
          {formatCurrency(valorMinino)} (2,5% da sua base de contribuição Funpresp-Jud).
        </span>
      </Typography>

      <form
        onSubmit={e => {
          e.preventDefault()
          handleGerar()
        }}
        noValidate
        className='w-full mt-2'
      >
        <Controller
          name='valorContribuicao'
          control={control}
          render={({ field }) => (
            <EditableTextField
              {...field}
              label='Valor da contribuição'
              placeholder='R$ 0,00'
              onChange={handleChangeValorContribuicao}
              error={!!errors.valorContribuicao}
              helperText={errors.valorContribuicao?.message}
            />
          )}
        />

        <Typography
          variant='h5'
          sx={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '1rem',
            marginTop: '1rem'
          }}
        >
          Forma de pagamento
        </Typography>

        <Controller
          name='formaPagamento'
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} row className='flex flex-row gap-4 '>
              {Object.values(FORMAS_PAGAMENTO_ENUM).map(value => (
                <RadioCustomized
                  key={value}
                  option={{ id: value, label: value }}
                  selectedOption={field.value}
                  setSelectedOption={field.onChange}
                  icon={value === FORMAS_PAGAMENTO_ENUM.boleto ? 'fa-solid fa-barcode-read' : 'fa-brands fa-pix'}
                />
              ))}
            </RadioGroup>
          )}
        />

        <div className='flex justify-center items-center mt-6'>
          <ActionButton type='submit' variant='contained' disabled={!isValid}>
            Gerar
          </ActionButton>
        </div>
      </form>
    </div>
  )
}
