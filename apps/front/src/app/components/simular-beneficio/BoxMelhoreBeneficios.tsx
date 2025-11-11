import { Box, Typography } from '@mui/material'

export function BoxMelhoreBeneficios() {
  return (
    <Box className='flex items-start bg-gray-100 p-4 rounded-xl mt-4 gap-4'>
      <i className='fa-solid fa-circle-info text-primary-main text-2xl'></i>
      <div>
        <Typography variant='h5' className='text-primary-main font-bold mb-1'>
          Melhore seus benefícios Funpresp-Jud
        </Typography>
        <div>
          <Typography
            variant='body1'
            sx={{ marginBottom: '0.5rem', color: 'var(--mui-palette-text-primary) !important' }}
          >
            É possível aumentar seu benefício Funpresp-Jud alterando os seguintes parâmetros:
          </Typography>

          <Typography variant='body1' sx={{ color: 'var(--mui-palette-text-primary) !important' }}>
            <ul className='list-disc list-inside ml-4'>
              <li>Postergando a idade de aposentadoria;</li>
              <li>Aumentando os percentuais de contribuição normal/vinculada ou facultativa;</li>
              <li>Realizando contribuições facultativas e/ou aportes;</li>
              <li>Diminuindo o prazo de recebimento do benefício suplementar;</li>
              <li>
                Incluindo na base de contribuição das parcelas remuneratórias (cargo em comissão, função de confiança,
                local de trabalho, gratificação por exercício cumulativo de jurisdição ou ofícios e outras).
              </li>
            </ul>
          </Typography>
        </div>
      </div>
    </Box>
  )
}
