import AccordionPreVisualizacao from './AccordionPreVisualizacao'
import type { PatrocinadorDTOType } from '@/types/patrocinador/PatrocinadorDTOType'
import { useGetImpostoDeRendaRelatorio } from '@/hooks/impostoDeRenda/useGetImpostoDeRendaRelatorio'
import type { UserType } from '@/types/UserType'
import { CardCustomized } from '@/components/ui/CardCustomized'
import { ButtonCustomized } from '@/components/ui/ButtonCustomized'

export default function PreVisualizacaoDemonstrativo({
  patrocinador,
  ano,
  user
}: {
  patrocinador: PatrocinadorDTOType
  ano: string | null | number
  user: UserType
}) {
  const { getImpostoDeRendaRelatorio, isLoading } = useGetImpostoDeRendaRelatorio()

  return (
    <CardCustomized.Root>
      <CardCustomized.Header
        title={`Pré-visualização do demonstrativo do ${patrocinador?.nome} no ano base ${ano}`}
        subheader={`Gerado em: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}, às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
      />
      <CardCustomized.Content>
        <div className='w-full mb-4'>
          <div className='max-w-[300px]'>
            <ButtonCustomized
              variant='contained'
              color='primary'
              startIcon={<i className='fa-regular fa-arrow-down-to-bracket'></i>}
              onClick={async () => await getImpostoDeRendaRelatorio(user.cpf, ano || 2024, patrocinador?.sigla || '')}
              disabled={isLoading}
            >
              Baixar demonstrativo
            </ButtonCustomized>
          </div>
        </div>

        <AccordionPreVisualizacao patrocinador={patrocinador} ano={ano} user={user} />
      </CardCustomized.Content>
    </CardCustomized.Root>
  )
}
