<script setup lang="ts">
const props = defineProps<{ transactions: { type: string; amount: number }[] }>()

const sum = (types: string[]) =>
  props.transactions.filter(t => types.includes(t.type)).reduce((s, t) => s + t.amount, 0)

const acquired = computed(() => sum(['cash_in', 'transfer_in']))
const savings = computed(() => sum(['pocket_deposit']))
const spending = computed(() => sum(['transfer_out', 'external_transfer_out', 'cash_out']))
const pct = (n: number) => (acquired.value ? Math.min(100, Math.round((n / acquired.value) * 100)) : 0)
const spentPct = computed(() => pct(spending.value))
const savedPct = computed(() => pct(savings.value))
</script>

<template>
  <section class="overview" aria-labelledby="ov-title">
    <h2 id="ov-title" class="t title">30-day overview</h2>
    <p class="t range">Last 30 days</p>
    <p class="t k k1">Total Acquire Balance</p>
    <p class="t k k2">Transfer Savings</p>
    <p class="t k k3">Total Spending</p>
    <p class="t v v1">{{ formatPesoShort(acquired) }}</p>
    <p class="t v v2">{{ formatPesoShort(savings) }}</p>
    <p class="t v v3">{{ formatPesoShort(spending) }}</p>
    <div class="track" role="img" :aria-label="`Spent ${spentPct}%, saved ${savedPct}%`">
      <span class="seg spent" :style="{ width: spentPct + '%' }" />
      <span class="seg saved" :style="{ width: savedPct + '%' }" />
    </div>
    <span class="sw sw1" aria-hidden="true" />
    <p class="t lg lg1">Spent {{ spentPct }}%</p>
    <span class="sw sw2" aria-hidden="true" />
    <p class="t lg lg2">Saved {{ savedPct }}%</p>
  </section>
</template>

<style scoped>
.overview { position: absolute; left: 22px; top: 380px; width: 352px; height: 132px; border-radius: 20px; background: #fff; }
.t { position: absolute; margin: 0; }
.title { left: 25px; top: 10px; font: 600 9px/1.5 var(--font); color: var(--navy-900); }
.range { left: 272px; top: 10px; font: 400 9px/1.5 var(--font); color: rgba(11, 21, 59, 0.5); }
.k { font: 500 8px/1.5 var(--font); color: rgba(11, 21, 59, 0.5); }
.k1 { left: 23px; top: 37px; } .k2 { left: 146px; top: 37px; } .k3 { left: 267px; top: 38px; }
.v { top: 59px; font: 500 15px/1.21 var(--font-num); color: var(--navy-900); }
.v1 { left: 23px; } .v2 { left: 145px; } .v3 { left: 265px; }
.track { position: absolute; left: 18px; top: 85px; width: 319px; height: 12px; display: flex; overflow: hidden; border-radius: 6px; background: #dde2e8; }
.spent { background: #0b153b; } .saved { background: #153a6e; }
.sw { position: absolute; top: 108px; width: 13px; height: 12px; border-radius: 3px; }
.sw1 { left: 25px; background: #0b153b; } .sw2 { left: 109px; background: #153a6e; }
.lg { top: 108px; font: 500 8px/12px var(--font); color: rgba(11, 21, 59, 0.5); }
.lg1 { left: 44px; } .lg2 { left: 131px; }
</style>