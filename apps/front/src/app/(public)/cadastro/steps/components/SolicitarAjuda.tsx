import { Typography } from '@mui/material'

import BoxCopy from '@/app/components/ui/BoxCopy'

export function SolicitarAjudaStep() {
  return (
    <div className='flex flex-col gap-5 mt-6'>
      <div className='text-center'>
        <div className='flex justify-center'>
          <svg xmlns='http://www.w3.org/2000/svg' width='174' height='84' viewBox='0 0 174 84' fill='none'>
            <path
              d='M0.558105 10.7442C0.558105 4.81033 5.36844 0 11.3023 0H82.6046C88.5385 0 93.3488 4.81034 93.3488 10.7442V37.1163C93.3488 43.0501 88.5385 47.8605 82.6046 47.8605L33.7674 47.8605H17.1628H11.3023C5.36844 47.8605 0.558105 43.0501 0.558105 37.1163V10.7442Z'
              fill='#CDE4F2'
            />
            <path d='M17.1628 64.4651L33.7674 47.8605H17.1628V64.4651Z' fill='#CDE4F2' />
            <circle cx='20.093' cy='23.4419' r='3.90698' fill='#0578BE' />
            <circle cx='37.6743' cy='23.4419' r='3.90698' fill='#0578BE' />
            <circle cx='55.2557' cy='23.4419' r='3.90698' fill='#0578BE' />
            <circle cx='72.8372' cy='23.4419' r='3.90698' fill='#0578BE' />
            <path
              d='M173.442 30.2793C173.442 24.3455 168.631 19.5352 162.698 19.5352H91.3953C85.4614 19.5352 80.6511 24.3455 80.6511 30.2793V56.6514C80.6511 62.5853 85.4614 67.3956 91.3953 67.3956L140.232 67.3956H156.837H162.698C168.631 67.3956 173.442 62.5853 173.442 56.6514V30.2793Z'
              fill='#F7A833'
            />
            <path d='M156.837 84.0003L140.232 67.3956H156.837V84.0003Z' fill='#F7A833' />
            <circle cx='3.90698' cy='3.90698' r='3.90698' transform='matrix(-1 0 0 1 157.814 39.0701)' fill='white' />
            <circle cx='3.90698' cy='3.90698' r='3.90698' transform='matrix(-1 0 0 1 140.232 39.0701)' fill='white' />
            <circle cx='3.90698' cy='3.90698' r='3.90698' transform='matrix(-1 0 0 1 122.651 39.0701)' fill='white' />
            <circle cx='3.90698' cy='3.90698' r='3.90698' transform='matrix(-1 0 0 1 105.07 39.0701)' fill='white' />
          </svg>
        </div>

        <Typography variant='h4' className='text-neutral-800 mt-4'>
          Solicitação de ajuda
        </Typography>
        <Typography variant='body1' className='text-left mt-3 text-neutral-700'>
          Se não recebeu nosso e-mail, por favor, verifique as pastas de lixo eletrônico, spam ou lixeira. Caso ainda
          assim não encontre nossas mensagens, é possível que os contatos cadastrados estejam incorretos ou
          desatualizados. Entre em contato conosco para que possamos te ajudar.
        </Typography>
      </div>

      <div className='w-full flex flex-col gap-4 px-4'>
        <BoxCopy title='E-mail:' description='sap@funprespjud.com.br' icon='fa-regular fa-envelope' type='email' />
        <BoxCopy title='Telefone:' description='(61) 3029-5070' icon='fa-regular fa-phone' type='phone' />
        <BoxCopy title='WhatsApp:' description='(61) 4042-5515' icon='fa-brands fa-whatsapp' type='whatsapp' />
      </div>
    </div>
  )
}
