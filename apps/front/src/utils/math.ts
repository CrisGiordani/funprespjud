export function calcularPorcentagem(valor: number, total: number): number {
  if (total === 0) {
    return 0
  }

  return (valor / total) * 100
}

export function calcularPorcentagemDeAcrescimo(valorAportado: number, valorRentabilizado: number): number {
  if (valorAportado == 0) {
    return 0
  }

  return ((valorRentabilizado - valorAportado) / valorAportado) * 100
}
