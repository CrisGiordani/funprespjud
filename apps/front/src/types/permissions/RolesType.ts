import type { PermissionType } from './PermissionType'

export type RoleType = {
  id: number
  name: string
  description: string
  permissions: Array<PermissionType>
}

export type RolesResponseType = {
  roles: RoleType[]
}
