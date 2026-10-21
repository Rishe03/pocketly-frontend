<script setup lang="ts">
const route = useRoute()

// off = icon centre when inactive, on = circle centre when active, iconTop = icon offset from the tab top
const tabs = [
  { key: 'home', to: '/home', label: 'Home', icon: 'home', size: 23, off: 59.5, on: 69, iconTop: 41 },
  { key: 'pockets', to: '/pockets', label: 'Pockets', icon: 'pockets', size: 24, off: 146, on: 144, iconTop: 40 },
  { key: 'insights', to: '/insights', label: 'Insights', icon: 'chart', size: 23, off: 238.5, on: 238.5, iconTop: 41 },
  { key: 'profile', to: '/profile', label: 'Profile', icon: 'user', size: 23, off: 332.5, on: 332.5, iconTop: 42 },
]

const active = computed(
  () => tabs.find(t => route.path === t.to || route.path.startsWith(t.to + '/'))?.key ?? 'home',
)
</script>

<template>
  <nav class="nav" aria-label="Main navigation">
    <div class="bar" />
    <NuxtLink
      v-for="t in tabs" :key="t.key" :to="t.to" class="tab"
      :style="{ left: (active === t.key ? t.on : t.off) - 32 + 'px' }"
      :aria-current="active === t.key ? 'page' : undefined"
    >
      <span v-if="active === t.key" class="circle"><AppIcon :name="t.icon" :size="22" /></span>
      <AppIcon v-else :name="t.icon" :size="t.size" class="ico" :style="{ top: t.iconTop + 'px' }" />
      <span class="lbl">{{ t.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.nav { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
.bar {
  position: absolute; left: 0; top: 792px; width: 393px; height: 101px; box-sizing: border-box;
  border: 0.5px solid rgba(11, 21, 59, 0.05); border-radius: 15px; background: #fff;
}
.tab { position: absolute; top: 762px; width: 64px; height: 90px; color: var(--navy-900); text-decoration: none; pointer-events: auto; }
.circle {
  position: absolute; left: 2px; top: 0; width: 60px; height: 60px; display: grid; place-items: center;
  border-radius: 50%; color: #fff; background: linear-gradient(145deg, #153a6e, #0b153b);
  box-shadow: 0 6px 10px rgba(11, 21, 59, 0.35);
}
.ico { position: absolute; left: 50%; transform: translateX(-50%); }
.lbl { position: absolute; left: 0; right: 0; top: 68px; text-align: center; font: 500 8px/12px var(--font); color: rgba(11, 21, 59, 0.8); }
.tab:focus-visible { outline: 3px solid var(--navy-500); outline-offset: -2px; border-radius: 12px; }
</style>