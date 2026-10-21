import { db, manilaNow } from '../util/db';
import type { PocketRow } from '../util/db';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; targetAmount?: number; lockedUntil?: string | null; openingDeposit?: number }>(event)

  const name = String(body?.name ?? '').trim()
  const target = Number(body?.targetAmount)
  const deposit = Number(body?.openingDeposit ?? 0)
  const lockedUntil = body?.lockedUntil || null
  const today = manilaNow().slice(0, 10)

  if (!name || name.length > 60)
    throw createError({ statusCode: 400, message: 'Enter a pocket name of up to 60 characters.' })
  if (db.pockets.some(p => p.name.toLowerCase() === name.toLowerCase()))
    throw createError({ statusCode: 409, message: `You already have a pocket named “${name}”. Pocket names must be different. Try a new name.` })
  if (!(target > 0) || target > 10_000_000)
    throw createError({ statusCode: 400, message: 'Enter a target amount above ₱0.' })
  if (lockedUntil && lockedUntil <= today)
    throw createError({ statusCode: 400, message: 'Choose a lock date after today.' })
  if (!(deposit >= 0) || deposit > db.account.balance || deposit > target)
    throw createError({ statusCode: 400, message: 'The opening deposit is more than your Main Balance or the target.' })

  const pocket: PocketRow = { id: `p${Date.now()}`, name, targetAmount: target, balance: deposit, lockedUntil, status: 'active' }
  db.pockets.push(pocket)

  if (deposit > 0) {
    db.account.balance = Math.round((db.account.balance - deposit) * 100) / 100
    db.transactions.unshift({
      id: `t${Date.now()}`, type: 'pocket_deposit', amount: deposit,
      note: `To ${name}`, createdAt: manilaNow().slice(0, 19),
    })
  }

  setResponseStatus(event, 201)
  return pocket
})