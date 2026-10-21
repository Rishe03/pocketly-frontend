<script setup lang="ts">
defineProps<{ balance: number; hidden: boolean; isNew: boolean }>()
defineEmits<{ toggle: [] }>()
</script>

<template>
  <section class="card" aria-label="Main balance">
    <p class="label">Main Balance ·  Everyday spending</p>
    <div class="row">
      <p class="amount">{{ hidden ? '₱••••••' : formatPeso(balance) }}</p>
      <button
        type="button" class="eye" :aria-label="hidden ? 'Show balance' : 'Hide balance'"
        :aria-pressed="hidden" @click="$emit('toggle')"
      >
        <AppIcon :name="hidden ? 'eye-off' : 'eye'" :size="22" />
      </button>
    </div>
    <p class="pill">{{ isNew ? 'New account ·Active' : 'Active' }}</p>
  </section>
</template>

<style scoped>
.card {
  position: absolute; left: 22px; top: 107px; width: 349px; height: 140px;
  border-radius: 25px; color: #fff; box-shadow: 0 4px 5px rgba(0, 0, 0, 0.25);
  background: linear-gradient(to right, #0b1f3b, #153a6e 74.519%, #2f5d8c 99.99%);
}
.label {
  position: absolute; left: 32px; top: 26px; margin: 0; white-space: pre;
  font: 600 10px/1.5 var(--font); color: rgba(242, 245, 248, 0.8);
}
.row { position: absolute; left: 32px; top: 44px; display: flex; align-items: center; gap: 12px; }
.amount { margin: 0; font: 700 30px/1.21 var(--font-num); }
.eye {
  width: 44px; height: 44px; display: grid; place-items: center;
  background: none; border: 0; color: #fff; cursor: pointer;
}
.eye:focus-visible { outline: 3px solid #fff; border-radius: 10px; }
.pill {
  position: absolute; left: 31px; top: 92px; width: 124px; height: 22px; margin: 0;
  box-sizing: border-box; padding-left: 15px; border-radius: 25px;
  background: rgba(242, 245, 248, 0.3);
  font: 500 9px/22px var(--font); color: rgba(242, 245, 248, 0.9);
}
</style>