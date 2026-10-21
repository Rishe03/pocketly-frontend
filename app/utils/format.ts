export const formatPeso = (n: number) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatAccountNo = (n: string) =>
  n.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
export const formatPesoShort = (n: number) => '₱' + n.toLocaleString('en-PH')