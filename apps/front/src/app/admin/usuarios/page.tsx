// MUI Imports
import { Card, Box, Typography } from '@mui/material'

import UserList from './components/UserList'

const UsuariosPage = () => {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' sx={{ mb: 4, fontWeight: 600 }}>
          Administração de Usuários
        </Typography>

        <UserList />
      </Box>
    </Card>
  )
}

export default UsuariosPage
