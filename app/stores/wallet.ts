interface Transaction {
  id: string
  type: string
  amount: number
  note: string
  createdAt: string
}

export const useWalletStore = defineStore('wallet', () => {
  const accountNumber = ref('')
  const balance = ref(0)
  const dailyCap = ref(500)
  const transactions = ref<Transaction[]>([])
  const balanceHidden = ref(false)

  async function loadAccount() {
    const data = await $fetch<{ accountNumber: string; balance: number; dailyCap: number }>('/api/account')
    accountNumber.value = data.accountNumber
    balance.value = data.balance
    dailyCap.value = data.dailyCap
    return data
  }

  async function loadTransactions() {
    const data = await $fetch<Transaction[]>('/api/transactions')
    transactions.value = data
    return data
  }

  function toggleBalance() {
    balanceHidden.value = !balanceHidden.value
  }

  return { accountNumber, balance, dailyCap, transactions, balanceHidden, loadAccount, loadTransactions, toggleBalance }
})