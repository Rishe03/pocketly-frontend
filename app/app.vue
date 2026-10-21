<script setup lang="ts">
const scale = ref(1)

// Scale the 393 x 852 screen down to fit the window; never scale it up
function fit() {
  scale.value = Math.min(1, window.innerWidth / 393, window.innerHeight / 852)
}

onMounted(() => {
  fit()
  window.addEventListener('resize', fit)
})
onBeforeUnmount(() => window.removeEventListener('resize', fit))
</script>

<template>
  <div class="stage">
    <div class="screen" :style="{ transform: `scale(${scale})` }">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
html, body { height: 100%; overflow: hidden; }

.stage {
  position: fixed; inset: 0; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: #000;
}
.screen {
  position: relative; flex: none; width: 393px; height: 852px;
  overflow: hidden; background: var(--bg); transform-origin: center center;
}

/* On real phones, blend the side gaps into the app instead of black */
@media (max-width: 599px) {
  .stage { background: var(--bg); }
}
</style>