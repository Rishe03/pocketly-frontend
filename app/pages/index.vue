<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const SPLASH_MS = 2500 // how long the welcome screen shows; set to 0 to keep it on screen
const auth = useAuthStore()
const next = computed(() => (auth.isLoggedIn ? '/home' : '/login'))

let timer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  if (SPLASH_MS > 0) timer = setTimeout(() => navigateTo(next.value), SPLASH_MS)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <main class="welcome">
    <img class="glow g1" src="/glow-1.svg" alt="" />
    <img class="glow g2" src="/glow-2.svg" alt="" />
    <img class="icon" src="/app-icon.svg" alt="" width="115" height="115" />
    <h1 class="word">POCKETLY.</h1>
    <p class="tag">Where every peso gets a pocket.</p>
    <NuxtLink :to="next" class="skip" aria-label="Continue" />
  </main>
</template>

<style scoped>
.welcome {
  position: relative; width: 393px; height: 852px; overflow: hidden;
  background: linear-gradient(to bottom, #040a14 0%, #0a1b33 50%, #1b3f6b 100%);
}
.glow { position: absolute; width: 287px; height: 296px; max-width: none; }
.g1 { left: -100px; top: -89px; }
.g2 { left: 196px; top: 657px; }
.icon { position: absolute; left: 135px; top: 272px; width: 115px; height: 115px; }
.word { position: absolute; left: 111px; top: 412px; margin: 0; white-space: nowrap; font: 900 30px/1.5 var(--font); color: #fff; }
.tag { position: absolute; right: 126px; top: 452px; margin: 0; white-space: nowrap; text-align: right; font: 500 9px/1.5 var(--font); color: #fff; }
.skip { position: absolute; inset: 0; }
.skip:focus-visible { outline: 3px solid #fff; outline-offset: -6px; }
</style>