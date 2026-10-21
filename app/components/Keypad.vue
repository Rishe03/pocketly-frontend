<script setup lang="ts">
const emit = defineEmits<{ digit: [d: string]; remove: [] }>()
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
</script>

<template>
  <div class="keypad">
    <button v-for="k in keys" :key="k" type="button" class="key" @click="emit('digit', k)">{{ k }}</button>
    <span aria-hidden="true" />
    <button type="button" class="key" @click="emit('digit', '0')">0</button>
    <button type="button" class="key" aria-label="Delete last digit" @click="emit('remove')">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
        <line x1="18" y1="9" x2="12" y2="15" />
        <line x1="12" y1="9" x2="18" y2="15" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px 19px; }
.key {
  height: 46px; border: 0; border-radius: 10px; background: #fff; cursor: pointer;
  display: grid; place-items: center;
  font: 600 16px/1.5 var(--font); color: var(--navy-900);
}
.key:active { background: #e8edf3; }
.key:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; }
</style>