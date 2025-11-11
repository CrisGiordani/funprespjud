import { Box, Tooltip } from '@mui/material'

interface RoleIconsProps {
  roles: string[]
}

export const roleIconMap: Record<string, string> = {
  USER_PARTICIPANT: 'fa-user',
  USER_OPERATOR: 'fa-headset',
  USER_ADMIN: 'fa-crown',
  USER_SPONSOR: 'fa-landmark',
  USER_REPRESENTATIVE: 'fa-person-chalkboard'
}

const roleDisplayNames: Record<string, string> = {
  USER_PARTICIPANT: 'Participante',
  USER_OPERATOR: 'Operador',
  USER_ADMIN: 'Administrador',
  USER_SPONSOR: 'Patrocinador',
  USER_REPRESENTATIVE: 'Representante'
}

const RoleIcons = ({ roles }: RoleIconsProps) => {
  if (!roles || roles.length === 0) {
    return <span>-</span>
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {roles.map((role, index) => {
        const iconClass = roleIconMap[role]
        const displayName = roleDisplayNames[role]

        if (!iconClass) {
          return (
            <Box
              key={index}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '20px',
                border: '1px solid #e0e0e0',
                fontSize: '12px',
                color: '#666',
                fontWeight: 500
              }}
            >
              {role}
            </Box>
          )
        }

        return (
          <Tooltip key={index} title={displayName} arrow>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                backgroundColor: '#e3f2fd',
                borderRadius: '50%',
                border: '1px solid #bbdefb',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#bbdefb',
                  transform: 'scale(1.05)',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
                }
              }}
            >
              <i
                className={`fas ${iconClass}`}
                style={{
                  fontSize: '14px',
                  color: '#1976d2'
                }}
              />
            </Box>
          </Tooltip>
        )
      })}
    </Box>
  )
}

export default RoleIcons
