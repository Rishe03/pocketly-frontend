<script setup lang="ts">
defineProps<{ total: number; count: number; mainBalance: number; hidden: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <section class="saved" aria-label="Total saved in pockets">
    <p class="label">Total saved in pockets</p>
    <div class="row">
      <p class="amount">{{ hidden ? '₱••••••' : formatPesoShort(total) }}</p>
      <button
        type="button" class="eye" :aria-label="hidden ? 'Show balances' : 'Hide balances'"
        :aria-pressed="hidden" @click="$emit('toggle')"
      >
        <AppIcon :name="hidden ? 'eye-off' : 'eye'" :size="22" />
      </button>
    </div>
    <p class="meta">
      {{ count }} {{ count === 1 ? 'pocket' : 'pockets' }}<br />
      Main Balance <strong>{{ hidden ? '₱••••••' : formatPeso(mainBalance) }}</strong>
    </p>
    <NuxtLink :to="{ path: '/pockets', query: { sheet: 'allocate' } }" class="allocate">
      <AppIcon name="swap" :size="12" />Allocate funds
    </NuxtLink>
  </section>
</template>

<style scoped>
.saved {
  position: absolute; left: 22px; top: 190px; width: 349px; height: 140px; border-radius: 25px; color: #fff;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.25);
  background: linear-gradient(to right, #0b1f3b, #153a6e 74.519%, #2f5d8c 99.99%);
}
.label { position: absolute; left: 30px; top: 18px; margin: 0; font: 600 10px/1.5 var(--font); color: rgba(242, 245, 248, 0.8); }
.row { position: absolute; left: 25px; top: 37px; display: flex; align-items: center; gap: 5px; }
.amount { margin: 0; font: 700 30px/1.21 var(--font-num); }
.eye { width: 44px; height: 44px; display: grid; place-items: center; background: none; border: 0; color: #fff; cursor: pointer; }
.eye:focus-visible { outline: 3px solid #fff; border-radius: 10px; }
.meta { position: absolute; left: 34px; top: 88px; margin: 0; font: 500 9px/13.5px var(--font); color: rgba(242, 245, 248, 0.8); }
.meta strong { font-weight: 700; color: #f2f5f8; }
.allocate {
  position: absolute; left: 202px; top: 84px; width: 124px; height: 35px; box-sizing: border-box; padding-left: 17px;
  display: flex; align-items: center; gap: 6px; border-radius: 10px; background: #f2f5f8;
  font: 600 10px var(--font); color: #000; text-decoration: none;
}
.allocate svg { color: var(--navy-900); }
.allocate:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
</style>