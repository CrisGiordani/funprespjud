import { Box } from '@mui/material'

export function TableCustomized({ headers, rows }: { headers: React.ReactNode[]; rows: React.ReactNode[][] }) {
  return (
    <Box sx={{ width: '100%', mx: 'auto', mb: 4, overflowX: 'none' }}>
      <Box
        component='table'
        sx={{
          width: '100%',
          minWidth: 600,
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          borderCollapse: 'separate',
          borderSpacing: 0
        }}
      >
        <Box component='thead' sx={{ bgcolor: '#0578BE' }}>
          <Box component='tr'>
            {headers.map((header, idx) => (
              <Box key={idx} component='th' sx={{ color: '#fff', py: 5, px: 5, fontWeight: 600, textAlign: 'center' }}>
                {header}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component='tbody' sx={{ textAlign: 'center' }}>
          {rows.map((row, idx) => (
            <Box component='tr' key={idx}>
              {row.map((cell, cidx: number) => (
                <Box
                  component='td'
                  sx={{
                    py: 5,
                    px: 5,
                    borderTop: '1px solid #CCCCCC',
                    borderRight: row.length - 1 !== cidx ? '1px solid #CCCCCC' : 'none'
                  }}
                  key={cidx}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
