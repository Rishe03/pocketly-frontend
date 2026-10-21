<script setup lang="ts">
defineProps<{ first: boolean; top: number }>()
</script>

<template>
  <NuxtLink to="/pockets/new" class="create" :style="{ top: top + 'px' }">
    <span class="tile" aria-hidden="true"><AppIcon name="plus" :size="22" /></span>
    <span class="txt">
      <strong>{{ first ? 'Create your first pocket' : 'Create a new pocket' }}</strong>
      <span>Name a goal, set a target, then add funds when you have some</span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.create {
  position: absolute; left: 24px; width: 346px; height: 98px; box-sizing: border-box;
  border: 1.5px dashed rgba(21, 58, 110, 0.35); border-radius: 24px; background: rgba(255, 255, 255, 0.4);
  color: inherit; text-decoration: none;
}
.create:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; }
.tile {
  position: absolute; left: 17px; top: 21.5px; width: 50.3px; height: 52px; display: grid; place-items: center;
  border-radius: 15px; color: #fff; background: linear-gradient(145deg, #153a6e, #0b153b);
}
.txt { position: absolute; left: 81px; top: 24px; width: 220px; }
.txt strong { display: block; font: 700 15px/1.5 var(--font); color: #0a0a0a; }
.txt span { display: block; font: 400 10px/1.5 var(--font); color: #4a5b73; }
</style>