export default defineEventHandler(async (event) => {
  const { mobile, mpin } = await readBody(event)
  const users = [{ mobile: '9171234567', mpin: '1234', name: 'Juan' }]
  const user = users.find(u => u.mobile === mobile && u.mpin === mpin)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }
  return { name: user.name, mobile: user.mobile }
})