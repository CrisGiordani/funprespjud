import { apiNode, redirectToLogin } from '@/lib/api'

import type { PermissionsResponseType, PermissionType } from '@/types/permissions/PermissionType'
import type { RolesResponseType } from '@/types/permissions/RolesType'
import { ParticipanteService } from './ParticipanteService'
import { cacheUtils } from '@/hooks/useCache'

/**
 * Implementação de RBAC (Role Based Access Control)
 */
export enum PermissoesEnum {
  VER_EMPRESTIMO = 'VER_EMPRESTIMO',
  FAZER_SIMULACAO = 'FAZER_SIMULACAO',
  VER_CARROSSEL_CAMPANHA = 'VER_CARROSSEL_CAMPANHA'
}

enum CanSeeEmprestimoSituacaoEnum {
  PATROCINADO = 'PATROCINADO',
  VINCULADO = 'VINCULADO',
  ASSISTIDO = 'ASSISTIDO'
}

export const PapeisEPermissoesService2 = {
  getRoles: async (): Promise<RolesResponseType> => {
    const response = await apiNode.get('/permissions/roles')

    return response.data
  },
  getPermissions: async (): Promise<PermissionsResponseType> => {
    const response = await apiNode.get('/permissions')

    return response.data
  },
  can: (userPermissions: PermissionType[], permissions: string[]): boolean => {
    return permissions.some(p => userPermissions.some((permission: PermissionType) => permission.name === p))
  },
  getPermissionsUser: async (rolesNames: string[], participantId?: string) => {
    const key = `participante:${participantId}:comPatrocinadores`
    let responseParticipante = cacheUtils.get(key)

    if (!responseParticipante && participantId) {
      const resp = await ParticipanteService.getParticipante(participantId, true)

      if (resp.success && resp.data) {
        responseParticipante = resp.data
        cacheUtils.set(key, responseParticipante, 10 * 60 * 1000) // 10min
      }
    }

    if (responseParticipante?.planoSituacao === 'ENCERRADO') {
      redirectToLogin()
    }

    // Adiciona o plano situação como se fosse um papel
    if (responseParticipante?.planoSituacao && !rolesNames.some(role => role === responseParticipante.planoSituacao)) {
      rolesNames.push(responseParticipante.planoSituacao as string)
    }

    // Adiciona os patrocinadores como se fossem papeis
    if (responseParticipante?.patrocinadores?.length > 0) {
      for (const patrocinador of responseParticipante.patrocinadores) {
        if (!rolesNames.some(role => role === patrocinador.sigla)) {
          rolesNames.push(patrocinador.sigla as string)
        }
      }
    }

    const roles = await PapeisEPermissoesService2.getRoles()
    const rolesFiltered = roles.roles.filter(role => rolesNames.includes(role.name))
    const permissions = rolesFiltered.flatMap(role => role.permissions)

    if (permissions.some(permission => permission.name === PermissoesEnum.VER_EMPRESTIMO)) {
      const canSeeEmprestimo =
        rolesNames.includes(CanSeeEmprestimoSituacaoEnum.PATROCINADO) ||
        rolesNames.includes(CanSeeEmprestimoSituacaoEnum.VINCULADO) ||
        rolesNames.includes(CanSeeEmprestimoSituacaoEnum.ASSISTIDO)

      if (!canSeeEmprestimo) {
        return permissions.filter(permission => permission.name !== PermissoesEnum.VER_EMPRESTIMO)
      }
    }

    return permissions
  }
}
