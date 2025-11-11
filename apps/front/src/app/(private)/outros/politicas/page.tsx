/* eslint-disable react/no-unescaped-entities */
'use client'

import { Typography } from '@mui/material'

import { CardCustomized } from '@/components/ui/CardCustomized'

function SectionWithNumber({
  number,
  text,
  isSubitem,
  isNotTextBold
}: {
  number: string
  text: string
  isSubitem?: boolean
  isNotTextBold?: boolean
}) {
  return (
    <Typography
      variant='body1'
      sx={{ fontWeight: isNotTextBold ? 'normal' : 'bold', marginLeft: isSubitem ? '1rem' : '0' }}
    >
      <span className={`text-primary-main font-bold ${isSubitem ? 'text-[1rem]' : 'text-[1.25rem]'}`}>{number}</span>{' '}
      {text}
    </Typography>
  )
}

export default function Page() {
  return (
    <CardCustomized.Root>
      <CardCustomized.Header title='Política de Privacidade' />
      <CardCustomized.Content className='flex flex-col gap-2'>
        <Typography variant='body1'>
          Esta Política de Privacidade visa demonstrar o compromisso assumido pela Funpresp-Jud com a proteção dos dados
          pessoais cadastrados e coletados na área restrita do Portal do Participante.
        </Typography>
        <Typography variant='body1'>
          Os dados coletados serão de uso exclusivo da Funpresp-Jud e armazenados em banco de dados próprio.
        </Typography>
        <Typography variant='body1'>
          Ao inserir seus dados pessoais, o usuário aceita explicitamente, de forma voluntária e nos termos desta
          Política de Privacidade, em conformidade com a Lei nº 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção
          de Dados Pessoais – LGPD), o fornecimento de seus dados pessoais para que sejam processados ou utilizados pela
          Funpresp-Jud, com os seguintes objetivos:
        </Typography>
        <ul className='ml-8'>
          <li>
            <Typography variant='body1'>Entrar em contato com o Participante;</Typography>
          </li>
          <li>
            <Typography variant='body1'>Firmar contratos;</Typography>
          </li>
          <li>
            <Typography variant='body1'>
              Enviar informações sobre a rentabilidade do Plano de Benefícios JusMP-Prev;
            </Typography>
          </li>
          <li>
            <Typography variant='body1'>
              Fornecer explicações e divulgações sobre as ações desenvolvidas pela Fundação.
            </Typography>
          </li>
        </ul>
        <Typography variant='body1'>
          Os dados serão utilizados exclusivamente para finalidades legítimas e comerciais previamente declaradas, com a
          devida proteção aos direitos do titular.
        </Typography>

        <SectionWithNumber number='1' text='Sobre a finalidade da coleta de dados pessoais' />
        <SectionWithNumber number='1.1' text='Acesso à área restrita, no Portal do Participante' isSubitem />
        <ul className='ml-12'>
          <li className='ml-4'>
            <Typography variant='body1'>
              <span className='font-bold'>Consultas e Serviços: </span>extrato de contribuição, demonstrativo de
              contribuição, Certificado do Participante, contribuição esporádica e facultativa, rentabilidade,
              atualização de dados pessoais, alteração do percentual de contribuição, estatuto da Fundação, regulamento
              do plano e formulários.
            </Typography>
          </li>
          <li className='ml-4'>
            <Typography variant='body1'>
              <span className='font-bold'>Simulações e solicitações: </span>simulação e solicitação de benefício, de
              autopatrocínio e de resgate.
            </Typography>
          </li>
          <li className='ml-4'>
            <Typography variant='body1'>
              <span className='font-bold'>Cobertura Adicional de Risco (CAR): </span>simulação e formulário para
              contratação da CAR.
            </Typography>
          </li>
        </ul>

        <SectionWithNumber number='1.2' text='Adesão' isSubitem />
        <ul className='ml-12'>
          <li className='ml-4'>
            <Typography variant='body1'>
              <span className='font-bold'>Adesão digital ao Plano JusMP-Prev: </span>preenchimento de formulário digital
              com dados, como nome, CPF, endereço, órgão onde trabalha, telefones e e-mail.
            </Typography>
          </li>
        </ul>
        <SectionWithNumber number='1.3' text='Contato' isSubitem />
        <ul className='ml-12'>
          <li className='ml-4'>
            <Typography variant='body1'>
              <span className='font-bold'>Área para contato sobre dúvidas ou sugestões: </span>Nome, CPF e e-mail.
            </Typography>
          </li>
        </ul>

        <Typography variant='body1' className='font-bold'>
          Importante!
        </Typography>
        <Typography variant='body1'>
          Os dados de acesso à área restrita do Portal do Participante são de responsabilidade exclusiva do usuário,
          assim como a senha de acesso, que não deve ser compartilhada com terceiros.
        </Typography>
        <Typography variant='body1'>
          Caso o usuário precise alterar ou recuperar sua senha, poderá fazer a qualquer momento, clicando no link
          "Esqueci minha senha", na página de acesso à área restrita.
        </Typography>
        <Typography variant='body1'>
          É de inteira responsabilidade do usuário a veracidade das informações declaradas no Portal do Participante da
          Funpresp-Jud.
        </Typography>

        <SectionWithNumber number='2' text='Sobre o compartilhamento de dados pessoais' />
        <Typography variant='body1'>
          Os dados pessoais coletados pela Funpresp-Jud são compartilhados apenas para processamento das atividades
          referentes à entrega dos seus próprios serviços junto a parceiros tecnológicos ou autoridades competentes.
        </Typography>

        <SectionWithNumber number='3' text='Sobre retenção de dados' />
        <Typography variant='body1'>
          A Funpresp-Jud guardará as informações pessoais de beneficiários, ex-beneficiários e pessoas que simularam uma
          adesão ao plano, por tempo indeterminado ou conforme se revele necessário para o cumprimento de obrigações
          legais e regulatórias às quais ela esteja sujeita, além de seu uso para o exercício de algum direito em face
          de processo judicial ou extrajudicial ou, ainda, nas hipóteses mencionadas pelo art. 16 da Lei nº. 13.709, de
          14 de agosto de 2018.
        </Typography>

        <SectionWithNumber number='4' text='Sobre a atualização dessa Política de Privacidade' />
        <SectionWithNumber
          number='4.1'
          text='Esta política é continuamente aprimorada e adequada, com o objetivo de garantir maior transparência e segurança aos usuários. A Funpresp-Jud reserva-se o direito de modificá-la a qualquer momento.'
          isSubitem
          isNotTextBold
        />
        <SectionWithNumber
          number='4.2'
          text='Em caso de alterações nesta Política de Privacidade, a Funpresp-Jud informará o teor das modificações realizadas, conforme previsto no § 6º do art. 8º da Lei nº 13.709/2018.'
          isSubitem
          isNotTextBold
        />

        <SectionWithNumber number='5' text='Dúvidas' />

        <Typography variant='body1'>
          Em caso de dúvidas relacionadas a esta Política de Privacidade, entre em contato com a equipe de atendimento
          da Funpresp-Jud, pelo e-mail:{' '}
          <a href='mailto:sap@funprespjud.com.br' className='text-primary-main'>
            sap@funprespjud.com.br
          </a>
          .
        </Typography>
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
