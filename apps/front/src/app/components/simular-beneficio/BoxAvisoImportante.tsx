import { Box, Typography } from '@mui/material'

export function BoxAvisoImportante() {
  return (
    <Box className='flex items-start bg-gray-100 p-4 rounded-xl gap-4'>
      <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
      <div>
        <Typography variant='h5' className='text-primary-main font-bold mb-1'>
          Importante
        </Typography>
        <Typography
          variant='body1'
          sx={{ marginBottom: '0.5rem', color: 'var(--mui-palette-text-primary) !important' }}
        >
          Não está sendo considerado, nas projeções, o valor do aporte extraordinário para a aposentadoria das mulheres,
          conforme previsto no inciso IV do art. 17 da Lei nº 12.618/2012. Isso ocorre porque sua aplicação dependerá da
          regra adotada para a concessão da aposentadoria pelo RPPS. Atualmente, têm direito a esse aporte apenas as
          servidoras que se aposentarem por alguma das regras de transição prevista, na EC nº 103/2019, que mantém a
          exigência de tempo de contribuição inferior a 35 anos para mulheres.
        </Typography>
      </div>
    </Box>
  )
}
