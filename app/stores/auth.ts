export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ name: string; mobile: string } | null>(null)
  const isLoggedIn = computed(() => user.value !== null)

  async function login(mobile: string, mpin: string) {
    user.value = await $fetch('/api/login', {
      method: 'POST',
      body: { mobile, mpin },
    })
  }
  function logout() { user.value = null }

  return { user, isLoggedIn, login, logout }
})