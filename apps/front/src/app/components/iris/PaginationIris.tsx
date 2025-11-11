import { Pagination } from '@mui/material'

import type { PaginationIrisType } from '@/types/paginacao/pagination-iris.type'

export default function PaginationIris({ totalPaginas, page, handleChange }: PaginationIrisType) {
  return (
    <div className='flex flex-col gap-4'>
      <Pagination count={totalPaginas} color='primary' page={page} onChange={handleChange} />
    </div>
  )
}
