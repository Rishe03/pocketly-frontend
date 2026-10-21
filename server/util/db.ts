export interface Account { accountNumber: string; balance: number; dailyCap: number; status: 'active' | 'frozen' | 'closed' }
export interface PocketRow { id: string; name: string; targetAmount: number; balance: number; lockedUntil: string | null; status: 'active' | 'completed' | 'closed' }
export interface TransactionRow { id: string; type: string; amount: number; note: string; createdAt: string }
interface Db { account: Account; pockets: PocketRow[]; transactions: TransactionRow[] }

const g = globalThis as unknown as { __pocketlyDb?: Db }

// Kept on globalThis so the data survives hot reloads while the dev server runs
export const db: Db = (g.__pocketlyDb ??= {
  account: { accountNumber: '4821773015', balance: 4250.75, dailyCap: 500, status: 'active' },
  pockets: [
    { id: 'p1', name: 'Tuition', targetAmount: 30000, balance: 6000, lockedUntil: '2026-12-15', status: 'active' },
    { id: 'p2', name: 'Laptop', targetAmount: 45000, balance: 12500, lockedUntil: null, status: 'active' },
    { id: 'p3', name: 'Emergency', targetAmount: 5000, balance: 3000, lockedUntil: null, status: 'active' },
    { id: 'p4', name: 'Org Trip', targetAmount: 7500, balance: 2250, lockedUntil: null, status: 'active' },
  ],
  transactions: [
    { id: 't3', type: 'transfer_out', amount: 200, note: 'Sent to Maria', createdAt: '2026-10-20T08:05:00' },
    { id: 't2', type: 'pocket_deposit', amount: 500, note: 'To Emergency Fund', createdAt: '2026-10-19T10:10:00' },
    { id: 't1', type: 'cash_in', amount: 5000, note: 'Cash in', createdAt: '2026-10-19T09:30:00' },
  ],
})

// Philippine time (UTC+8) as an ISO string
export const manilaNow = () => new Date(Date.now() + 8 * 3600 * 1000).toISOString()