import { Divider, Typography, Box } from '@mui/material'

import type { ChildrenType } from '@/@core/types'

const LeftAlignedDivider = ({ children }: ChildrenType) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        sx={{
          whiteSpace: 'nowrap',
          marginRight: 1,
          fontWeight: 400,
          fontSize: '0.8125rem',
          color: 'primary.light',
          lineHeight: 2
        }}
      >
        {children}
      </Typography>
      <Divider sx={{ flexGrow: 1, borderColor: 'primary.light' }} />
    </Box>
  )
}

export default LeftAlignedDivider
