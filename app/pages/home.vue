<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const wallet = useWalletStore()

await Promise.all([
  useAsyncData('account', () => wallet.loadAccount()),
  useAsyncData('transactions', () => wallet.loadTransactions()),
])

const name = computed(() => auth.user?.name ?? 'User')
</script>

<template>
  <main class="home">
    <div class="avatar" aria-hidden="true">{{ name.charAt(0).toUpperCase() }}</div>
    <p class="greet"><span>Good day,</span><strong>{{ name }}!</strong></p>
    <button type="button" class="bell" aria-label="Notifications"><AppIcon name="bell" :size="24" /></button>

    <BalanceCard
      :balance="wallet.balance" :hidden="wallet.balanceHidden"
      :is-new="wallet.transactions.length === 0" @toggle="wallet.toggleBalance()"
    />
    <QuickActions />
    <OverviewCard :transactions="wallet.transactions" />

    <h2 class="recent">Recent Activity</h2>
    <NuxtLink to="/activity" class="see-all">See all</NuxtLink>
    <ActivityCard :transactions="wallet.transactions" />

    <BottomNav />
  </main>
</template>

<style scoped>
.home { position: relative; width: 393px; height: 852px; overflow: hidden; }
.avatar {
  position: absolute; left: 27px; top: 32px; width: 51px; height: 50px; display: grid; place-items: center;
  border-radius: 50%; background: linear-gradient(145deg, #153a6e, #0b153b);
  font: 700 16px var(--font); color: #f2f5f8;
}
.greet { position: absolute; left: 92px; top: 44px; margin: 0; font: 500 12px/14px var(--font); color: rgba(0, 0, 0, 0.5); }
.greet strong { display: block; font-weight: 700; color: var(--navy-900); }
.bell {
  position: absolute; left: 316px; top: 32px; width: 50px; height: 50px; display: grid; place-items: center;
  background: none; border: 0; color: var(--navy-900); cursor: pointer;
}
.bell:focus-visible { outline: 3px solid var(--navy-500); border-radius: 50%; }
.recent { position: absolute; left: 40px; top: 527px; margin: 0; font: 500 9px/1.5 var(--font); color: var(--navy-900); }
.see-all { position: absolute; left: 310px; top: 527px; font: 500 9px/1.5 var(--font); color: var(--navy-900); text-decoration: none; }
</style>