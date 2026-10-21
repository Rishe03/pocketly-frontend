<script setup lang="ts">
import { useWalletStore } from '~/stores/wallet'
import { usePocketsStore } from '~/stores/pockets'

definePageMeta({ middleware: 'auth' })

const wallet = useWalletStore()
const store = usePocketsStore()

await Promise.all([
  useAsyncData('pockets', () => store.loadPockets()),
  useAsyncData('account', () => wallet.loadAccount()),
])

// The "create" card sits under the last visible row of pockets (two rows fit on screen)
const rows = computed(() => Math.min(2, Math.ceil(store.pockets.length / 2)))
const createTop = computed(() => 348 + rows.value * 152 + (rows.value === 2 ? 1 : 0))
</script>

<template>
  <main class="page">
    <GreetingHeader />

    <h1 class="title">Goal Pockets</h1>
    <p class="sub">Your savings envelopes, one goal each.</p>
    <NuxtLink to="/pockets/new" class="plus" aria-label="Create a new pocket"><AppIcon name="plus" :size="24" /></NuxtLink>

    <SavedCard
      :total="store.totalSaved" :count="store.pockets.length" :main-balance="wallet.balance"
      :hidden="wallet.balanceHidden" @toggle="wallet.toggleBalance()"
    />

    <ul v-if="store.pockets.length" class="grid" :class="{ scroll: store.pockets.length > 4 }" aria-label="Your pockets">
      <li v-for="p in store.pockets" :key="p.id">
        <PocketCard :pocket="p" :percent="store.percent(p)" />
      </li>
    </ul>

    <CreatePocketCard :first="!store.pockets.length" :top="createTop" />

    <BottomNav />
  </main>
</template>

<style scoped>
.page { position: relative; width: 393px; height: 852px; overflow: hidden; }
.title { position: absolute; left: 32px; top: 109px; margin: 0; font: 600 25px/1.5 var(--font); color: var(--navy-900); }
.sub { position: absolute; left: 32px; top: 147px; margin: 0; font: 400 10px/1.5 var(--font); color: rgba(0, 0, 0, 0.5); }
.plus {
  position: absolute; left: 306px; top: 110px; width: 50px; height: 50px; display: grid; place-items: center;
  border-radius: 50%; color: #fff; background: linear-gradient(145deg, #153a6e, #0b153b);
  box-shadow: 0 4px 8px rgba(11, 21, 59, 0.3);
}
.plus:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 3px; }

.grid {
  position: absolute; left: 31px; top: 348px; width: 332px; margin: 0; padding: 0; list-style: none;
  display: grid; grid-template-columns: 161px 161px; gap: 13px 10px;
}
/* More than four pockets: the grid scrolls inside its own area so the screen itself never scrolls */
.grid.scroll { height: 291px; overflow-y: auto; scrollbar-width: none; align-content: start; }
.grid.scroll::-webkit-scrollbar { display: none; }
</style>