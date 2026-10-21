<script setup lang="ts">
defineProps<{ length: number; filled: number }>()
</script>

<template>
  <div class="dots" role="img" :aria-label="`${filled} of ${length} digits entered`">
    <span v-for="i in length" :key="i" class="dot" :class="{ on: i <= filled }" />
  </div>
</template>

<style scoped>
.dots { display: flex; gap: 15px; justify-content: center; }
.dot {
  box-sizing: border-box; width: 20px; height: 20px; border-radius: 50%;
  border: 1.5px solid var(--navy-900);
}
.dot.on { background: var(--navy-900); }
</style>