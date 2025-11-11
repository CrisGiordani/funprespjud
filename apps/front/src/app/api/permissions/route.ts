import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

import type { PermissionsResponseType } from '@/types/permissions/PermissionType'

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    return NextResponse.json<PermissionsResponseType>({
      permissions: permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        description: permission.description
      }))
    })
  } catch (error) {
    console.error('Erro ao buscar permissões:', error)

    return NextResponse.json<PermissionsResponseType>(
      {
        permissions: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const permission = await prisma.permission.create({
      data: {
        name: body.name,
        description: body.description
      }
    })

    return NextResponse.json(
      {
        message: 'Permissão adicionada com sucesso',
        permission: {
          id: permission.id,
          name: permission.name,
          description: permission.description
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar permissão:', error)

    return NextResponse.json({ error: 'Erro ao adicionar permissão' }, { status: 500 })
  }
}
