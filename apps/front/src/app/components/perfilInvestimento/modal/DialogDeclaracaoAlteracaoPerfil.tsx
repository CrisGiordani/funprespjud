import { useState } from 'react'

import Image from 'next/image'

import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'

import { ButtonCustomized } from '@/components/ui/ButtonCustomized'
import { DialogCustomized } from '@/components/ui/DialogCustomized'

export default function DialogDeclaracaoAlteracaoPerfil({
  isOpen,
  handleClose,
  handleBack,
  handleToken,
  handlePostSolicitarAlteracaoPerfil
}: {
  isOpen: boolean
  handleClose: () => void
  handleBack: () => void
  handleToken: () => void
  handlePostSolicitarAlteracaoPerfil: () => void
}) {
  const [isDeclaro, setIsDeclaro] = useState(false)
  const [isAutorizo, setIsAutorizo] = useState(false)

  return (
    <DialogCustomized
      id='atencao'
      open={isOpen}
      onClose={handleClose}
      title={
        <div className='w-full flex flex-col justify-center items-center mt-4 gap-4'>
          <Image src='/images/iris/modal-alteracao-perfil.svg' alt='Atenção' width={82} height={84} />
          <Typography variant='h4' className='text-center'>
            Declaração de alteração de perfil
          </Typography>
        </div>
      }
      content={
        <div className='flex flex-col gap-2'>
          <Typography variant='body1'>
            Ao prosseguir, <span className='font-bold'>DECLARO </span>
            que as informações prestadas são verdadeiras, responsabilizando-me pela atualização e por fornecer os
            comprovantes sempre que solicitados, e que estou ciente de que:
          </Typography>

          <ul className='flex flex-col gap-2 ml-6 my-2'>
            <li>
              <Typography variant='body1'>
                A alteração do Perfil de Investimento, neste ato formalizada por mim, de forma livre e consciente,
                considera a minha tolerância a risco e os meus objetivos em matéria de retorno financeiro, sendo eu o
                único responsável pelos riscos dela decorrentes, concordando que eventuais perdas financeiras
                resultantes dessa decisão, associadas ao risco do mercado financeiro, não poderão ser atribuídas à
                Funpresp-Jud;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Tenho pleno conhecimento das disposições contidas no Regulamento dos Perfis e no Guia Perfis de
                Investimento, contendo todas as informações e esclarecimentos necessários para a tomada da minha decisão
                e compreendi todas as regras e riscos financeiros envolvidos, inclusive as consequências da minha
                escolha;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                A minha escolha é feita a meu exclusivo critério e sob minha integral responsabilidade, isentando a
                Funpresp-Jud de qualquer responsabilidade por perdas, diretas ou indiretas, decorrentes da minha opção e
                na hipótese dos investimentos não atingirem os resultados por mim esperados ou da utilização de qualquer
                material, informação ou programa de educação financeira e previdenciária disponibilizado pela
                Funpresp-Jud;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Os resultados de rentabilidade de minhas RESERVAS INDIVIDUAIS poderão ser distintos de outros
                participantes, podendo sofrer variações positivas e negativas;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Idênticas contribuições alocadas por participantes no PLANO JUSMP-PREV poderão resultar em diferentes
                RESERVAS INDIVIDUAIS devido às diferenças entre os PERFIS DE INVESTIMENTO;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                A rentabilidade obtida no passado não representa garantia de rentabilidade futura. Não é oferecida
                qualquer garantia para cobertura de perdas ocorridas em função do perfil escolhido;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                A Minha Reserva Individual será alocada na carteira de investimentos definida acima, seguindo as
                diretrizes estabelecidas na Política de Investimento do Plano JusMP-Prev;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Poderei alterar meu perfil de investimento uma vez ao ano, nos prazos definidos pela Funpresp-Jud ou nas
                situações previstas no Regulamento de Perfis de Investimento do plano JusMP-Prev;
              </Typography>
            </li>
            <li>
              <Typography variant='body1'>
                Na hipótese de não alterar a minha opção por um dos perfis de investimento, os recursos referentes a
                minha RESERVA INDIVIDUAL serão mantidos na última opção efetuada.
              </Typography>
            </li>
          </ul>
          <div>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={isDeclaro} onChange={() => setIsDeclaro(!isDeclaro)} />}
                label={
                  <Typography variant='body1'>
                    <span className='font-bold'>DECLARO </span> que as informações prestadas são verdadeiras e
                    <span className='font-bold'> estou ciente </span>dos termos descritos acima.
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  '& .MuiButtonBase-root': {
                    paddingTop: 0
                  }
                }}
              />
            </FormGroup>
            <FormGroup row className='mt-4'>
              <FormControlLabel
                control={<Checkbox checked={isAutorizo} onChange={() => setIsAutorizo(!isAutorizo)} />}
                label={
                  <Typography variant='body1'>
                    <span className='font-bold'>AUTORIZO </span> o órgão patrocinador a disponibilizar à Funpresp-Jud,
                    na forma regulamentada, os meus dados pessoais, funcionais e financeiros.
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  '& .MuiButtonBase-root': {
                    paddingTop: 0
                  }
                }}
              />
            </FormGroup>
          </div>

          <div className='w-full mt-2'>
            <div className='max-w-[310px] flex flex-col text-center gap-4 m-auto'>
              <ButtonCustomized
                variant='contained'
                color='primary'
                disabled={!isDeclaro || !isAutorizo}
                onClick={() => {
                  handleToken(), handleClose(), handlePostSolicitarAlteracaoPerfil()
                }}
              >
                Concluir Solicitação
              </ButtonCustomized>

              <ButtonCustomized
                variant='outlined'
                color='primary'
                onClick={() => {
                  handleBack(), handleClose()
                }}
              >
                Voltar
              </ButtonCustomized>
            </div>
          </div>
        </div>
      }
    />
  )
}
