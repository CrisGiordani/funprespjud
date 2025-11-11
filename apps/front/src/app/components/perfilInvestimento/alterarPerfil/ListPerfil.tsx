import { useEffect, useMemo } from 'react'

import BoxPerfilInvestimento from './BoxPerfilInvestimento'

import { useGetPerfilSolicitado } from '@/hooks/perfilInvestimento/useGetPerfilSolicitado'
import { useAuth } from '@/contexts/AuthContext'
import { useGetPerfilIndicado } from '@/hooks/perfilInvestimento/useGetPerfilIndicado'
import { useGetPerfilAtual } from '@/hooks/perfilInvestimento/useGetPerfilAtual'
import { PerfilInvestimentoEnum } from '@/enum/perfilInvestimento/PerfilInvestimentoEnum'
import { useCancelarSolicitacaoAlteracaoPerfilInvestimento } from '@/hooks/perfilInvestimento/useCancelarSolicitacaoAlteracaoPerfilInvestimento'

export default function ListPerfil({
  handleClick,
  setDetalhamentoPerfilAtual,
  setDetalhamentoPerfilIndicado,
  setPerfilSelecionado
}: {
  handleClick: () => void
  setDetalhamentoPerfilAtual: (value: any) => void
  setDetalhamentoPerfilIndicado: (value: any) => void
  setPerfilSelecionado: (value: any) => void
}) {
  const { user } = useAuth()
  const { perfilIndicado, getPerfilIndicado } = useGetPerfilIndicado()
  const { perfilAtual, getPerfilAtual } = useGetPerfilAtual()
  const { perfilSolicitado, getPerfilSolicitado } = useGetPerfilSolicitado()
  const { statusCancelamento, cancelarSolicitacaoAlteracaoPerfil } = useCancelarSolicitacaoAlteracaoPerfilInvestimento()

  // Função para verificar se um perfil é o atual
  const isPerfilAtual = (perfilId: number) => {
    const isPerfilAtual = perfilAtual?.idPerfil == perfilId

    return isPerfilAtual
  }

  // Função para verificar se um perfil é o indicado
  const isPerfilIndicado = (perfilId: number) => {
    return perfilIndicado?.idPerfil === perfilId
  }

  // Função para ordenar os perfis com o indicado no meio
  const perfisOrdenados = useMemo(() => {
    const perfis = [
      {
        nomePerfil: 'Horizonte 2040',
        benchmark: 'IPCA + 4,25%',
        limiteRisco: '9,00%',
        dataAposentadoria: 'entre 2031 e 2046',
        dataPorcentagem: [97.4, 0.0, 0.8, 1.3, 0.6, 0.0],
        alocacaoObjetiva: [97.4, 0.0, 0.8, 1.3, 0.6, 0.0],
        idPerfil: PerfilInvestimentoEnum.HORIZONTE_2040,
        icon: 'fa-duotone fa-regular fa-hourglass-half',
        isPerfilSolicitado: PerfilInvestimentoEnum.HORIZONTE_2040 == perfilSolicitado?.idPerfil
      },
      {
        nomePerfil: 'Horizonte 2050',
        benchmark: 'IPCA + 5,00%',
        limiteRisco: '10,00%',
        dataAposentadoria: 'a partir de 2047',
        dataPorcentagem: [73.1, 13.7, 5.0, 1.3, 8.2, 0.0],
        alocacaoObjetiva: [73.1, 13.7, 5.0, 1.3, 8.2, 0.0],
        idPerfil: PerfilInvestimentoEnum.HORIZONTE_2050,
        icon: 'fa-duotone fa-regular fa-hourglass-start',
        isPerfilSolicitado: PerfilInvestimentoEnum.HORIZONTE_2050 == perfilSolicitado?.idPerfil
      },
      {
        nomePerfil: 'Horizonte Protegido',
        benchmark: '90% IMA-B5 + 10%',
        limiteRisco: 'gestão passiva',
        dataAposentadoria: 'até 2030',
        dataPorcentagem: [100.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        alocacaoObjetiva: [100.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        idPerfil: PerfilInvestimentoEnum.HORIZONTE_PROTEGIDO,
        icon: 'fa-duotone fa-regular fa-hourglass-end',
        isPerfilSolicitado: PerfilInvestimentoEnum.HORIZONTE_PROTEGIDO == perfilSolicitado?.idPerfil
      }
    ]

    // Se não há perfil indicado, mantém a ordem original
    if (!perfilIndicado?.idPerfil) {
      return perfis
    }

    // Encontra o índice do perfil indicado
    const indexIndicado = perfis.findIndex(perfil => perfil.idPerfil === perfilIndicado.idPerfil)

    if (indexIndicado === -1) {
      return perfis // Se não encontrou, mantém ordem original
    }

    // Reorganiza o array para colocar o indicado no meio (índice 1)
    const perfisReorganizados = [...perfis]
    const perfilIndicadoObj = perfisReorganizados.splice(indexIndicado, 1)[0]

    // Se o indicado já está no meio, não precisa reorganizar
    if (indexIndicado === 1) {
      return perfis
    }

    // Coloca o perfil indicado no meio
    perfisReorganizados.splice(1, 0, perfilIndicadoObj)

    return perfisReorganizados
  }, [perfilIndicado, perfilSolicitado])

  useEffect(() => {
    if (user?.cpf) {
      getPerfilAtual(user.cpf)
      getPerfilIndicado(user.cpf)
      getPerfilSolicitado(user.cpf)
    }
  }, [user, getPerfilAtual, getPerfilIndicado, getPerfilSolicitado])

  useEffect(() => {
    if (perfilAtual) {
      setDetalhamentoPerfilAtual(perfilAtual)
    }

    if (perfilIndicado) {
      setDetalhamentoPerfilIndicado(perfilIndicado)
    }

    if (perfilSolicitado) {
      setPerfilSelecionado(perfilSolicitado)
    }
  }, [
    perfilAtual,
    perfilIndicado,
    perfilSolicitado,
    setDetalhamentoPerfilAtual,
    setDetalhamentoPerfilIndicado,
    setPerfilSelecionado
  ])

  useEffect(() => {
    if (statusCancelamento) {
      getPerfilSolicitado(user?.cpf ?? '')
    }
  }, [statusCancelamento, cancelarSolicitacaoAlteracaoPerfil, perfilSolicitado, getPerfilSolicitado, user?.cpf])

  return (
    <div className='flex justify-center items-center my-8'>
      <div className='grid grid-cols-1 sm:grid-cols-1 grid-rows-1 gap-10 justify-center w-full md:grid-cols-3 '>
        {perfisOrdenados.map(perfil => {
          const isAtual = isPerfilAtual(perfil.idPerfil)
          const isIndicado = isPerfilIndicado(perfil.idPerfil)

          return (
            <BoxPerfilInvestimento
              cpf={user?.cpf ?? ''}
              key={perfil.idPerfil}
              perfil={perfil}
              isPerfilSolicitado={perfil.isPerfilSolicitado}
              isPerfilAtual={isAtual}
              isPerfilIndicado={isIndicado}
              handleClick={handleClick}
              handleCancelarSolicitacaoAlteracaoPerfil={() => cancelarSolicitacaoAlteracaoPerfil(user?.cpf ?? '')}
              setPerfilSelecionado={() => setPerfilSelecionado(perfil)}
            />
          )
        })}
      </div>
    </div>
  )
}
