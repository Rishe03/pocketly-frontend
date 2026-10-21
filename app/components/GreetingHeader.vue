<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const name = computed(() => auth.user?.name ?? 'User')
</script>

<template>
  <header class="top">
    <div class="avatar" aria-hidden="true">{{ name.charAt(0).toUpperCase() }}</div>
    <p class="greet"><span>Good day,</span><strong>{{ name }}!</strong></p>
    <button type="button" class="bell" aria-label="Notifications"><AppIcon name="bell" :size="24" /></button>
  </header>
</template>

<style scoped>
.top { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.avatar {
  position: absolute; left: 27px; top: 32px; width: 51px; height: 50px; display: grid; place-items: center;
  border-radius: 50%; background: linear-gradient(145deg, #153a6e, #0b153b);
  font: 700 16px var(--font); color: #f2f5f8;
}
.greet { position: absolute; left: 92px; top: 44px; margin: 0; font: 500 12px/14px var(--font); color: rgba(0, 0, 0, 0.5); }
.greet strong { display: block; font-weight: 700; color: var(--navy-900); }
.bell {
  position: absolute; left: 316px; top: 32px; width: 50px; height: 50px; display: grid; place-items: center;
  background: none; border: 0; color: var(--navy-900); cursor: pointer; pointer-events: auto;
}
.bell:focus-visible { outline: 3px solid var(--navy-500); border-radius: 50%; }
</style>