import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import Image from 'next/image'

import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'

import { DialogCustomized } from '@/components/ui/DialogCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { PerfilInvestimentoEnum } from '@/enum/perfilInvestimento/PerfilInvestimentoEnum'

export enum ChangeTypeEnum {
  HORIZONTE_2040_2050 = 'horizonte-2040->2050',
  HORIZONTE_2040_PROTEGIDO = 'horizonte-2040->protegido',
  HORIZONTE_2050_2040 = 'horizonte-2050->2040',
  HORIZONTE_2050_PROTEGIDO = 'horizonte-2050->protegido',
  HORIZONTE_PROTEGIDO_2040 = 'horizonte-protegigo->2040',
  HORIZONTE_PROTEGIDO_2050 = 'horizonte-protegigo->2050'
}

const textChangeTypeMap = new Map<ChangeTypeEnum, ReactNode>([
  [
    ChangeTypeEnum.HORIZONTE_2040_2050,
    <Typography variant='body1' key={ChangeTypeEnum.HORIZONTE_2040_2050}>
      O perfil{' '}
      <span className='font-bold'>
        Horizonte 2050 é sugerido para participantes com data de aposentadoria a partir de 1º/01/2047
      </span>{' '}
      e contará com{' '}
      <span className='font-bold'>
        maior diversificação dos investimentos e prazos mais longos nos ativos de Renda Fixa comparativamente aos demais
        perfis de investimento,
      </span>{' '}
      buscando <span className='font-bold'>maior retorno real dos</span> investimentos, porém{' '}
      <span className='font-bold'>sujeito a maiores níveis de risco.</span>
    </Typography>
  ],
  [
    ChangeTypeEnum.HORIZONTE_2040_PROTEGIDO,
    <Typography variant='body1' key={ChangeTypeEnum.HORIZONTE_2040_PROTEGIDO}>
      O perfil{' '}
      <span className='font-bold'>
        Horizonte Protegido é sugerido para quem já está recebendo renda da Fundação e também para os participantes cuja
        data esperada de aposentadoria ocorrerá nos próximos 5 anos.
      </span>{' '}
      Ele busca <span className='font-bold'>retornos reais menos elevados</span> que os demais perfis, embora com{' '}
      <span className='font-bold'>maior proteção contra riscos de investimentos.</span>
    </Typography>
  ],
  [
    ChangeTypeEnum.HORIZONTE_2050_2040,
    <Typography variant='body1' key={ChangeTypeEnum.HORIZONTE_2050_2040}>
      O perfil{' '}
      <span className='font-bold'>
        Horizonte 2040 é sugerido para participantes com previsão de aposentadoria entre 1º/01/2031 e 31/12/2046
      </span>{' '}
      e contará com{' '}
      <span className='font-bold'>
        menor diversificação dos investimentos e prazos menos longos nos ativos de Renda Fixa comparativamente ao perfil
        Horizonte 2050, buscando um retorno real inferior ao citado perfil, porém com nível de risco também inferior.
      </span>
    </Typography>
  ],
  [
    ChangeTypeEnum.HORIZONTE_2050_PROTEGIDO,
    <Typography variant='body1' key={ChangeTypeEnum.HORIZONTE_2050_PROTEGIDO}>
      O perfil{' '}
      <span className='font-bold'>
        Horizonte Protegido é sugerido para quem já está recebendo renda da Fundação e também para os participantes cuja
        data esperada de aposentadoria ocorrerá nos próximos 5 anos.
      </span>{' '}
      Ele busca <span className='font-bold'>retornos reais menos elevados</span> que os demais perfis, embora com{' '}
      <span className='font-bold'>maior proteção contra riscos de investimentos.</span>
    </Typography>
  ],
  [
    ChangeTypeEnum.HORIZONTE_PROTEGIDO_2040,
    <Typography variant='body1' key={ChangeTypeEnum.HORIZONTE_PROTEGIDO_2040}>
      O perfil{' '}
      <span className='font-bold'>
        Horizonte 2040 é sugerido para participantes com previsão de aposentadoria entre 1º/01/2031 e 31/12/2046
      </span>{' '}
      e contará com{' '}
      <span className='font-bold'>
        maior diversificação dos investimentos e prazos mais longos nos ativos de Renda Fixa comparativamente ao perfil
        Horizonte Protegido, buscando um retorno real superior ao citado perfil, porém com nível de risco também
        superior.
      </span>
    </Typography>
  ],
  [
    ChangeTypeEnum.HORIZONTE_PROTEGIDO_2050,
    <Typography variant='body1' key={ChangeTypeEnum.HORIZONTE_PROTEGIDO_2050}>
      O perfil{' '}
      <span className='font-bold'>
        Horizonte 2050 é sugerido para participantes com data de aposentadoria a partir de 1º/01/2047
      </span>{' '}
      e contará com{' '}
      <span className='font-bold'>
        maior diversificação dos investimentos e prazos mais longos nos ativos de Renda Fixa comparativamente aos demais
        perfis de investimento,
      </span>{' '}
      buscando <span className='font-bold'>maior retorno real dos</span> investimentos, porém{' '}
      <span className='font-bold'>sujeito a maiores níveis de risco.</span>
    </Typography>
  ]
])

export default function DialogAtencao({
  idPerfilAtual,
  idPerfilSolicitado,
  isOpen,
  handleClose,
  handleDeclaracaoAlteracaoPerfil
}: {
  idPerfilAtual: number
  idPerfilSolicitado: number
  isOpen: boolean
  handleClose: () => void
  handleDeclaracaoAlteracaoPerfil: () => void
}) {
  const [checked, setChecked] = useState(false)

  const changeTo = useMemo(() => {
    // Horizonte 2040 -> Horizonte 2050
    if (
      idPerfilAtual === PerfilInvestimentoEnum.HORIZONTE_2040 &&
      idPerfilSolicitado === PerfilInvestimentoEnum.HORIZONTE_2050
    ) {
      return ChangeTypeEnum.HORIZONTE_2040_2050
    }

    // Horizonte 2040 -> Horizonte Protegido
    if (
      idPerfilAtual === PerfilInvestimentoEnum.HORIZONTE_2040 &&
      idPerfilSolicitado === PerfilInvestimentoEnum.HORIZONTE_PROTEGIDO
    ) {
      return ChangeTypeEnum.HORIZONTE_2040_PROTEGIDO
    }

    // Horizonte 2050 -> Horizonte 2040
    if (
      idPerfilAtual === PerfilInvestimentoEnum.HORIZONTE_2050 &&
      idPerfilSolicitado === PerfilInvestimentoEnum.HORIZONTE_2040
    ) {
      return ChangeTypeEnum.HORIZONTE_2050_2040
    }

    // Horizonte 2050 -> Horizonte Protegido
    if (
      idPerfilAtual === PerfilInvestimentoEnum.HORIZONTE_2050 &&
      idPerfilSolicitado === PerfilInvestimentoEnum.HORIZONTE_PROTEGIDO
    ) {
      return ChangeTypeEnum.HORIZONTE_2050_PROTEGIDO
    }

    // Horizonte Protegido -> Horizonte 2040
    if (
      idPerfilAtual === PerfilInvestimentoEnum.HORIZONTE_PROTEGIDO &&
      idPerfilSolicitado === PerfilInvestimentoEnum.HORIZONTE_2040
    ) {
      return ChangeTypeEnum.HORIZONTE_PROTEGIDO_2040
    }

    // Horizonte Protegido -> Horizonte 2050
    if (
      idPerfilAtual === PerfilInvestimentoEnum.HORIZONTE_PROTEGIDO &&
      idPerfilSolicitado === PerfilInvestimentoEnum.HORIZONTE_2050
    ) {
      return ChangeTypeEnum.HORIZONTE_PROTEGIDO_2050
    }

    return null
  }, [idPerfilAtual, idPerfilSolicitado])

  return (
    <DialogCustomized
      id='atencao'
      open={isOpen}
      onClose={handleClose}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image src='/images/iris/modal-atencao.svg' alt='Atenção' width={82} height={84} />
          <Typography variant='h4' className='text-center'>
            Atenção
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>Prezado(a) Participante,</Typography>

          <Typography variant='body1'>
            Alterações de perfis podem impactar a rentabilidade do investimento, o nível de risco assumido e a formação
            de patrimônio pelo participante. O tempo é uma das variáveis que mais impactam no valor que será recebido na
            aposentadoria, por isso, a alteração para um perfil com horizonte temporal maior ou menor do que o tempo que
            falta para a sua aposentadoria poderá impactar significativamente a formação do seu patrimônio.
          </Typography>

          {changeTo && textChangeTypeMap.get(changeTo)}

          <Typography variant='body1'>
            Lembre-se que é possível alterar o perfil de investimento quantas vezes desejar durante as campanhas
            destinadas a este propósito.
          </Typography>

          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
              label='Estou ciente das circunstâncias descritas e desejo prosseguir para a declaração de alteração de perfil.'
              sx={{
                alignItems: 'flex-start',
                '& .MuiButtonBase-root': {
                  paddingTop: 0
                }
              }}
            />
          </FormGroup>

          <div className='w-full mt-2'>
            <div className='max-w-[310px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='contained'
                color='primary'
                disabled={!checked}
                onClick={() => {
                  handleDeclaracaoAlteracaoPerfil(), handleClose()
                }}
              >
                Prosseguir
              </ButtonCustomized>
              <ButtonCustomized variant='outlined' color='primary' onClick={handleClose}>
                Cancelar Solicitação
              </ButtonCustomized>
            </div>
          </div>
        </div>
      }
    />
  )
}
