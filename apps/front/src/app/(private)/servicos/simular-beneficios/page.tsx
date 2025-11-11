import CardSimularBeneficios from '@/app/components/simular-beneficio/CardSimularBeneficios'

export default function Page() {
  return (
    <div className='mx-auto'>
      <div className='grid grid-cols-1  gap-12'>
        <div className='flex flex-col h-full'>
          <CardSimularBeneficios simulacao={true} />
        </div>
      </div>
    </div>
  )
}
