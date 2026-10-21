<script setup lang="ts">
import type { Pocket } from '~/stores/pockets'

defineProps<{ pocket: Pocket; percent: number }>()
</script>

<template>
  <article class="card">
    <NuxtLink :to="`/pockets/${pocket.id}`" class="stretch" :aria-label="`${pocket.name}, ${percent}% saved. Open pocket`" />
    <AppIcon name="pockets" :size="26" class="jar" />
    <span class="pct">{{ percent }}%</span>
    <h2 class="name">{{ pocket.name }}</h2>
    <p class="amount">{{ formatPesoShort(pocket.balance) }}</p>
    <p class="goal">of {{ formatPesoShort(pocket.targetAmount) }} goal</p>
    <div
      class="track" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"
      :aria-label="`${pocket.name} progress`"
    >
      <span class="fill" :style="{ width: percent + '%' }" />
    </div>
    <NuxtLink :to="`/pockets/${pocket.id}?add=1`" class="add">+ Add funds</NuxtLink>
  </article>
</template>

<style scoped>
.card { position: relative; width: 161px; height: 139px; border-radius: 15px; background: #fff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25); }
.stretch { position: absolute; inset: 0; border-radius: 15px; }
.stretch:focus-visible, .add:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; }
.jar { position: absolute; left: 18px; top: 16px; color: var(--navy-900); }
.pct {
  position: absolute; left: 109px; top: 16px; width: 40.56px; height: 23.33px; display: grid; place-items: center;
  border-radius: 12px; background: #e3ebf5; font: 700 11px var(--font); color: #0b1f3b;
}
.name { position: absolute; left: 16px; top: 53px; margin: 0; font: 600 10px/1.5 var(--font); color: #000; }
.amount { position: absolute; right: 11px; top: 45px; margin: 0; font: 500 12px/13px var(--font); color: #000; }
.goal { position: absolute; right: 11px; top: 61px; margin: 0; font: 300 7px/13px var(--font); color: #000; }
.track { position: absolute; left: 12px; top: 84px; width: 142px; height: 10px; overflow: hidden; border-radius: 5px; background: #dde2e8; }
.fill { display: block; height: 100%; border-radius: 5px; background: linear-gradient(to right, #0b153b, #153a6e); }
.add {
  position: absolute; left: 41px; top: 104px; z-index: 1; width: 84px; height: 25px; display: grid; place-items: center;
  border-radius: 8px; background: #e8eef6; font: 600 9px var(--font); color: rgba(0, 0, 0, 0.6); text-decoration: none;
}
</style>