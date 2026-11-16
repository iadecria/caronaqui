// Helpers de formatacao compartilhados (antes em lib/mock-data.ts)

// Funcao para formatar data
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00Z')
  const weekdays = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sab.']
  const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']

  const weekday = weekdays[date.getUTCDay()]
  const day = date.getUTCDate()
  const month = months[date.getUTCMonth()]

  return `${weekday}, ${day} de ${month}`
}

// Funcao para formatar preco
export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
