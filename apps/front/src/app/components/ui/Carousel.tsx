'use client'

import { useState, useRef } from 'react'

import { Box, Button, Divider } from '@mui/material'

import { useParentWidth } from '@/@layouts/hooks/useParentWidth'

type CarouselProps = {
  infiniteNext?: boolean
  widthFull?: boolean
  carouselData: React.ReactNode[]
}

export function Carousel({ carouselData, infiniteNext, widthFull }: CarouselProps) {
  const [currentItem, setCurrentItem] = useState(0)
  const parentRef = useRef<HTMLDivElement>(null)

  const { parentWidth } = useParentWidth({ parentRef })

  const nextCard = () => {
    setCurrentItem(prev => {
      if (prev === carouselData.length - 1) {
        return 0
      }

      return prev + 1
    })
  }

  const prevCard = () => {
    setCurrentItem(prev => {
      if (prev === 0) {
        return carouselData.length - 1
      }

      return prev - 1
    })
  }

  const goToCard = (index: number) => {
    setCurrentItem(index)
  }

  return (
    <div ref={parentRef} className='flex-1 flex flex-col justify-between'>
      <div className='flex-1 relative mb-4'>
        {carouselData.map((children, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentItem ? 'opacity-100 relative' : 'opacity-0 pointer-events-none'}`}
          >
            {children}
          </div>
        ))}
      </div>

      <div className={`w-full ${widthFull ? 'px-0' : 'px-6'}`}>
        <Divider
          variant='middle'
          sx={{
            borderColor: '#CCCCCC',
            borderWidth: '1px',
            margin: '.3rem 0'
          }}
        />
      </div>

      <div className={`flex justify-between items-center py-4 ${widthFull ? 'px-0' : 'px-4'}`}>
        <Button
          variant='text'
          onClick={prevCard}
          sx={{ color: 'primary.main', textTransform: 'none', fontSize: '18px' }}
          disabled={currentItem === 0 && !infiniteNext}
        >
          <i className='fa-solid fa-arrow-left mr-2'></i>
          Anterior
        </Button>

        <Box
          className='flex items-center gap-2'
          sx={{
            display: parentWidth <= 415 ? 'none !important' : 'flex !important'
          }}
        >
          {carouselData.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToCard(index)}
              sx={{
                height: '0.6rem',
                width: '0.6rem',
                borderRadius: '50%',
                backgroundColor: index === currentItem ? 'primary.main' : '#CCCCCC',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            />
          ))}
        </Box>

        <Button
          variant='text'
          onClick={nextCard}
          sx={{ color: 'primary.main', textTransform: 'none', fontSize: '18px' }}
          disabled={currentItem === carouselData.length - 1 && !infiniteNext}
        >
          Próximo
          <i className='fa-solid fa-arrow-right ml-2'></i>
        </Button>
      </div>
    </div>
  )
}
