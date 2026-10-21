export default defineEventHandler(async () => {
  const db = getPg()
  
  try {
    const accounts = await db.query('SELECT * FROM accounts LIMIT 1')
    
    if (accounts.length === 0) {
      return { balance: 0, pockets: [] }
    }

    const pockets = await db.query(
      'SELECT * FROM pockets WHERE account_id = $1',
      [accounts[0].id]
    )

    return {
      balance: accounts[0].balance,
      pockets: pockets
    }
  } catch (error) {
    console.error("Database error:", error)
    return { balance: 0, pockets: [] }
  }
})