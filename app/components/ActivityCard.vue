<script setup lang="ts">
interface Tx { id: string; type: string; amount: number; note: string; createdAt: string }
const props = defineProps<{ transactions: Tx[] }>()

const latest = computed(() => props.transactions.slice(0, 3))
const incoming = (type: string) => ['cash_in', 'transfer_in'].includes(type)
const day = (iso: string) =>
  new Date(iso + '+08:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', timeZone: 'Asia/Manila' })
</script>

<template>
  <section class="activity" aria-label="Recent activity">
    <ul v-if="latest.length" class="list">
      <li v-for="t in latest" :key="t.id">
        <span class="ico" aria-hidden="true">
          <AppIcon :name="incoming(t.type) ? 'download' : 'upload'" :size="14" />
        </span>
        <span class="txt">
          <span class="note">{{ t.note }}</span>
          <span class="date">{{ day(t.createdAt) }}</span>
        </span>
        <span class="amt" :class="incoming(t.type) ? 'in' : 'out'">
          {{ incoming(t.type) ? '+' : '−' }}{{ formatPeso(t.amount) }}
        </span>
      </li>
    </ul>

    <template v-else>
      <span class="tile" aria-hidden="true"><AppIcon name="download" :size="16" /></span>
      <p class="empty-title">No activity yet</p>
      <p class="empty-text">Cash in to fund your account. Your transactions will show up here.</p>
      <NuxtLink to="/cash" class="cta">Cash in now</NuxtLink>
    </template>
  </section>
</template>

<style scoped>
.activity { position: absolute; left: 21px; top: 553px; width: 352px; height: 147px; border-radius: 20px; background: #fff; }

.list { list-style: none; margin: 0; padding: 8px 14px; }
.list li { display: flex; align-items: center; gap: 10px; height: 40px; }
.ico { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 10px; background: #e6edf5; color: var(--navy-900); }
.txt { flex: 1; display: flex; flex-direction: column; }
.note { font: 500 9px/1.4 var(--font); color: var(--navy-900); }
.date { font: 400 8px/1.4 var(--font); color: rgba(11, 21, 59, 0.5); }
.amt { font: 500 10px var(--font-num); color: var(--navy-900); }
.amt.in { color: #0a7a3d; }

.tile {
  position: absolute; left: 150px; top: 15px; width: 35px; height: 35px; display: grid;
  place-items: center; border-radius: 10px; background: #e6edf5; color: var(--navy-900);
}
.empty-title { position: absolute; left: 139px; top: 58px; margin: 0; font: 500 8px/1.5 var(--font); color: var(--navy-900); }
.empty-text { position: absolute; left: 45px; top: 80px; margin: 0; white-space: nowrap; font: 300 8px/1.5 var(--font); color: var(--navy-900); }
.cta {
  position: absolute; left: 111px; top: 104px; width: 119px; height: 26px; display: grid; place-items: center;
  border-radius: 10px; background: linear-gradient(to right, #0b153b, #153a6e 66.346%);
  font: 700 9px var(--font); color: #fff; text-decoration: none;
}
.cta:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; }
</style>