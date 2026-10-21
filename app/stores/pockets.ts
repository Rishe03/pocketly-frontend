import { useWalletStore } from '~/stores/wallet'

export interface Pocket {
  id: string
  name: string
  targetAmount: number
  balance: number
  lockedUntil: string | null
  status: string
}

export interface NewPocket {
  name: string
  targetAmount: number
  lockedUntil: string | null
  openingDeposit: number
}

export const usePocketsStore = defineStore('pockets', () => {
  const pockets = ref<Pocket[]>([])

  const totalSaved = computed(() => pockets.value.reduce((sum, p) => sum + p.balance, 0))
  const percent = (p: Pocket) =>
    p.targetAmount > 0 ? Math.min(100, Math.round((p.balance / p.targetAmount) * 100)) : 0

  async function loadPockets() {
    pockets.value = await $fetch<Pocket[]>('/api/pockets')
    return pockets.value
  }

  async function createPocket(input: NewPocket) {
    const created = await $fetch<Pocket>('/api/pockets', { method: 'POST', body: input })
    const wallet = useWalletStore()
    // The balance and activity changed too, so refresh them
    await Promise.all([loadPockets(), wallet.loadAccount(), wallet.loadTransactions()])
    return created
  }

  return { pockets, totalSaved, percent, loadPockets, createPocket }
})