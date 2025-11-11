import { Grid } from '@mui/material'

import type { CardResumoType } from '@/types/simulacao-beneficio/CardResumoTypes'
import { CardIconTextLabel } from '../common/CardIconTextLabel'

export function CardsResumoSimulacao({ cards }: { cards: CardResumoType[] }) {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card, idx) => (
        <Grid item xs={12} sm={6} key={idx}>
          <CardIconTextLabel
            titulo={card.title}
            subtitulo={card.subtitle}
            valor={card.value}
            icon={card.iconClass}
            destaque={card.destaque}
            valorNegrito={false}
            iconeComBG
          />
        </Grid>
      ))}
    </Grid>
  )
}
