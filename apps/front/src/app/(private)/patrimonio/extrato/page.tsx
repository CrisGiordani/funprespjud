'use client'

import CardExtrato from '@/app/components/extratos/CardExtrato'

export default function Page() {
  return (
    <div className='mx-auto'>
      <div className='grid grid-cols-1 gap-12'>
        <div className='flex flex-col h-full'>
          <CardExtrato />
        </div>
      </div>
    </div>
  )
}
