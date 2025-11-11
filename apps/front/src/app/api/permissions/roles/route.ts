import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

import type { RoleType } from '@/types/permissions/RolesType'

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedRoles: RoleType[] = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.rolePermissions.map(rp => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description
      }))
    }))

    return NextResponse.json({
      roles: formattedRoles
    })
  } catch (error) {
    console.error('Erro ao buscar papéis:', error)

    return NextResponse.json({ error: 'Erro ao buscar papeis' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Criar o role primeiro
    const role = await prisma.role.create({
      data: {
        name: body.name,
        description: body.description
      }
    })

    // Se há permissões para associar, criar os relacionamentos
    if (body.permissions && body.permissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: body.permissions.map((permissionId: number) => ({
          roleId: role.id,
          permissionId: permissionId
        }))
      })
    }

    // Buscar o role criado com suas permissões
    const roleWithPermissions = await prisma.role.findUnique({
      where: { id: role.id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: 'Papel adicionado com sucesso',
        role: {
          id: roleWithPermissions!.id,
          name: roleWithPermissions!.name,
          description: roleWithPermissions!.description,
          permissions: roleWithPermissions!.rolePermissions.map(rp => ({
            id: rp.permission.id,
            name: rp.permission.name,
            description: rp.permission.description
          }))
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erro ao criar papel:', error)

    // Retornar erro mais específico para debug
    const errorMessage = error.message || 'Erro desconhecido'
    const errorCode = error.code || 'UNKNOWN'

    return NextResponse.json(
      {
        error: 'Erro ao adicionar papel',
        details: errorMessage,
        code: errorCode
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { roleId, permissions } = body

    // Verificar se o role existe
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId }
    })

    if (!existingRole) {
      return NextResponse.json({ error: 'Papel não encontrado' }, { status: 404 })
    }

    // Usar transação para garantir consistência
    await prisma.$transaction(async tx => {
      // Remover todas as permissões existentes do role
      await tx.rolePermission.deleteMany({
        where: { roleId: roleId }
      })

      // Adicionar as novas permissões
      if (permissions && permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((permissionId: number) => ({
            roleId: roleId,
            permissionId: permissionId
          }))
        })
      }
    })

    // Buscar o role atualizado com suas permissões
    const updatedRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: 'Permissões atualizadas com sucesso',
        role: {
          id: updatedRole!.id,
          name: updatedRole!.name,
          description: updatedRole!.description,
          permissions: updatedRole!.rolePermissions.map(rp => ({
            id: rp.permission.id,
            name: rp.permission.name,
            description: rp.permission.description
          }))
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao atualizar permissões:', error)

    return NextResponse.json({ error: 'Erro ao atualizar permissões' }, { status: 500 })
  }
}
