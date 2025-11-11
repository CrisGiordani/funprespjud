export type PermissionType = {
  id: number
  name: string
  description: string
}

export type PermissionsResponseType = {
  permissions: PermissionType[]
}
