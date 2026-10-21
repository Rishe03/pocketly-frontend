<script setup lang="ts">
const items = [
  { label: 'Cash-in', icon: 'download', to: '/cash' },
  { label: 'Cash-out', icon: 'upload', to: '/cash' },
  { label: 'Transfer', icon: 'swap', to: '/send' },
  { label: 'Bank Transfer', icon: 'bank', to: '/send' },
]
</script>

<template>
  <nav class="actions" aria-label="Quick actions">
    <NuxtLink v-for="a in items" :key="a.label" :to="a.to" class="item">
      <span class="tile"><AppIcon :name="a.icon" :size="26" /></span>
      <span class="label">{{ a.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.actions { position: absolute; left: 40px; top: 272px; width: 312px; display: flex; justify-content: space-between; }
.item { width: 60px; display: flex; flex-direction: column; align-items: center; color: var(--navy-900); text-decoration: none; }
.tile {
  width: 60px; height: 60px; display: grid; place-items: center;
  border-radius: 20px; background: #fff; box-shadow: 0 2px 8px rgba(11, 21, 59, 0.06);
}
.item:focus-visible .tile { outline: 3px solid var(--navy-500); outline-offset: 2px; }
.label { margin-top: 12px; white-space: nowrap; font: 400 10px/1.5 var(--font); }
</style>