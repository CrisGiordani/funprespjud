import React from 'react'

import { Card, Typography, Grid, Chip } from '@mui/material'

import type { CardContribuicaoType } from '@/types/simulacao-beneficio/CardContribuicaoTypes'

export function CardsContribuicoes({ cards }: { cards: CardContribuicaoType[] }) {
  return (
    <Grid container spacing={2} columns={20} justifyContent='center'>
      {cards.map((card, idx) =>
        card.title === '' ? (
          <Grid key={idx} item xs={1} sm={1}>
            <div className='h-full flex justify-center items-center'>
              <i className={`${card.iconClass} text-4xl text-primary-main`} />
            </div>
          </Grid>
        ) : (
          <Grid key={idx} item xs={12} sm={6}>
            <Card
              variant='outlined'
              sx={{
                height: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                gap: '0.5rem',
                padding: '1rem',
                borderColor: card.primary ? 'var(--mui-palette-primary-main)' : '',
                backgroundColor: card.primary
                  ? 'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)'
                  : ''
              }}
            >
              {card.iconClass !== '' && (
                <div
                  className={`w-[70px] h-[70px] flex justify-center items-center rounded-full ${card.primary ? 'bg-primary-main' : 'bg-primary-main/10'}`}
                >
                  <i className={`${card.iconClass} text-2xl ${card.primary ? 'text-white' : 'text-primary-main'}`}></i>
                </div>
              )}

              <Typography variant='body1'>{card.title}</Typography>

              <div className={`flex flex-row items-start flex-wrap ${!card.percent && 'justify-start'} gap-4`}>
                <Typography
                  variant='h5'
                  sx={{
                    fontSize: '1.25rem',
                    color: 'var(--mui-palette-text-primary)'
                  }}
                >
                  {card.value}
                </Typography>
                {card.percent && (
                  <Chip
                    label={card.percent}
                    color='primary'
                    sx={{
                      fontSize: '1rem',
                      padding: '1.1rem 0.3rem',
                      borderRadius: '100px'
                    }}
                  />
                )}
              </div>
            </Card>
          </Grid>
        )
      )}
    </Grid>
  )
}
