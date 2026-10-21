<script setup lang="ts">
import { useWalletStore } from '~/stores/wallet'
import { usePocketsStore } from '~/stores/pockets'

definePageMeta({ middleware: 'auth' })

const wallet = useWalletStore()
const store = usePocketsStore()

await Promise.all([
  useAsyncData('account', () => wallet.loadAccount()),
  useAsyncData('pockets', () => store.loadPockets()),
])

const chips = [0, 500, 1000]
const form = reactive({ name: '', target: '', lockedUntil: '', deposit: wallet.balance >= 500 ? 500 : 0 })
const errors = reactive({ name: '', duplicate: '', target: '', lockedUntil: '', deposit: '', form: '' })
const submitting = ref(false)

const manila = (offsetDays = 0) => new Date(Date.now() + 8 * 3600e3 + offsetDays * 86400e3).toISOString().slice(0, 10)
const today = manila()
const tomorrow = manila(1)

const targetNumber = computed(() => Number(form.target) || 0)
const previewName = computed(() => form.name.trim() || 'Your pocket')
const previewPct = computed(() => (targetNumber.value ? Math.min(100, (form.deposit / targetNumber.value) * 100) : 0))

// Digits only, one decimal point, two decimals at most
watch(() => form.target, (v) => {
  const clean = v.replace(/[^\d.]/g, '').replace(/^(\d*\.?\d*).*$/, '$1').replace(/^(\d*\.\d{2}).*$/, '$1')
  if (clean !== v) form.target = clean
})
watch(() => form.name, () => { errors.name = ''; errors.duplicate = '' })

function validate() {
  const name = form.name.trim()
  errors.name = !name ? 'Enter a pocket name.' : name.length > 60 ? 'Use 60 characters or fewer.' : ''
  errors.duplicate = !errors.name && store.pockets.some(p => p.name.toLowerCase() === name.toLowerCase())
    ? `You already have a pocket named “${name}”. Pocket names must be different. Try a new name.`
    : ''
  errors.target = !form.target
    ? 'Enter a target amount.'
    : targetNumber.value <= 0 ? 'The target must be more than ₱0.'
    : targetNumber.value > 10_000_000 ? 'That target is too large.' : ''
  errors.lockedUntil = form.lockedUntil && form.lockedUntil <= today ? 'Pick a date after today.' : ''
  errors.deposit = form.deposit > wallet.balance
    ? 'Not enough in your Main Balance.'
    : targetNumber.value && form.deposit > targetNumber.value ? 'The opening deposit cannot be more than the target.' : ''
  errors.form = ''
  return !errors.name && !errors.duplicate && !errors.target && !errors.lockedUntil && !errors.deposit
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    await store.createPocket({
      name: form.name.trim(),
      targetAmount: Number(form.target),
      lockedUntil: form.lockedUntil || null,
      openingDeposit: form.deposit,
    })
    await navigateTo('/pockets')
  } catch (e: any) {
    if (e?.statusCode === 409) errors.duplicate = e?.data?.message ?? 'That pocket name is already used.'
    else errors.form = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <NuxtLink to="/pockets" class="back" aria-label="Back to Goal Pockets"><AppIcon name="chevron-left" :size="20" /></NuxtLink>
    <h1 class="heading">New goal pocket</h1>

    <section class="preview" aria-label="Pocket preview">
      <span class="tile" aria-hidden="true"><AppIcon name="pockets" :size="22" /></span>
      <p class="abs p-name">{{ previewName }}</p>
      <p class="abs p-amt">{{ formatPesoShort(form.deposit) }} of {{ formatPesoShort(targetNumber) }}</p>
      <div class="p-track" aria-hidden="true"><span :style="{ width: previewPct + '%' }" /></div>
    </section>

    <form class="form" novalidate @submit.prevent="onSubmit">
      <div class="field first">
        <label for="name">Pocket name</label>
        <input
          id="name" v-model="form.name" class="input" type="text" maxlength="60" autocomplete="off"
          placeholder="e.g. Phone Upgrade" :aria-invalid="!!errors.name || !!errors.duplicate"
          :aria-describedby="errors.name ? 'name-err' : undefined"
        />
        <p v-if="errors.name" id="name-err" class="err" role="alert">{{ errors.name }}</p>
      </div>

      <p v-if="errors.duplicate" class="banner" role="alert">{{ errors.duplicate }}</p>

      <div class="field">
        <label for="target">Target amount</label>
        <input
          id="target" v-model="form.target" class="input" type="text" inputmode="decimal" autocomplete="off"
          placeholder="0" :aria-invalid="!!errors.target" :aria-describedby="errors.target ? 'target-err' : undefined"
        />
        <p v-if="errors.target" id="target-err" class="err" role="alert">{{ errors.target }}</p>
      </div>

      <div class="field">
        <label for="lock">Lock until (optional)</label>
        <input
          id="lock" v-model="form.lockedUntil" class="input" type="date" :min="tomorrow"
          :aria-invalid="!!errors.lockedUntil" :aria-describedby="errors.lockedUntil ? 'lock-err' : 'lock-hint'"
        />
        <p v-if="errors.lockedUntil" id="lock-err" class="err" role="alert">{{ errors.lockedUntil }}</p>
        <p id="lock-hint" class="hint">You cannot withdraw from this pocket until this date. You can still add money.</p>
      </div>

      <div class="field deposit">
        <p id="dep-label" class="dep-label">Opening deposit from Main Balance</p>
        <div class="chips" role="radiogroup" aria-labelledby="dep-label">
          <button
            v-for="c in chips" :key="c" type="button" class="chip" role="radio"
            :aria-checked="form.deposit === c" :disabled="c > wallet.balance" @click="form.deposit = c"
          >
            {{ c === 0 ? '₱0' : formatPesoShort(c) }}
          </button>
        </div>
        <p v-if="errors.deposit" class="err" role="alert">{{ errors.deposit }}</p>
      </div>

      <p v-if="errors.form" class="err form-err" role="alert">{{ errors.form }}</p>
      <button class="cta" type="submit" :disabled="submitting">{{ submitting ? 'Creating…' : 'Create pocket' }}</button>
    </form>
  </main>
</template>

<style scoped>
.page { position: relative; width: 393px; height: 852px; overflow: hidden; }
.abs { position: absolute; margin: 0; }

.back {
  position: absolute; left: 18.5px; top: 18.5px; width: 40.7px; height: 40.7px; display: grid; place-items: center;
  border-radius: 50%; background: #e4ebf3; color: var(--navy-900);
}
.back:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; }
.heading { position: absolute; left: 70px; top: 27px; margin: 0; font: 700 15px/1.5 var(--font); color: #0a0a0a; }

.preview {
  position: absolute; left: 18px; top: 84px; width: 356px; height: 92px; border-radius: 24px;
  background: linear-gradient(100deg, #0b1f3b, #153a6e 70%, #2f5d8c); box-shadow: 0 4px 5px rgba(0, 0, 0, 0.25);
}
.tile {
  position: absolute; left: 18.5px; top: 20px; width: 52px; height: 52px; display: grid; place-items: center;
  border-radius: 15px; background: rgba(255, 255, 255, 0.12); color: #fff;
}
.p-name { left: 85px; top: 23.5px; font: 700 14px/1.5 var(--font); color: #fff; }
.p-amt { left: 86px; top: 42px; font: 400 12px/1.5 var(--font); color: rgba(255, 255, 255, 0.78); }
.p-track { position: absolute; left: 85px; top: 67.6px; width: 252px; height: 7.4px; overflow: hidden; border-radius: 4px; background: rgba(255, 255, 255, 0.25); }
.p-track span { display: block; height: 100%; border-radius: 4px; background: #fff; }

.form { position: absolute; left: 18.5px; top: 203.6px; width: 356px; }
.field { margin-top: 26.8px; }
.field.first { margin-top: 0; }
.banner + .field { margin-top: 8.9px; }
label { display: block; margin: 0 0 2.2px; font: 700 11px/1.5 var(--font); color: #4a5b73; }
.input {
  box-sizing: border-box; width: 100%; height: 48px; padding: 0 14.5px; border: 1px solid #d5dde6; border-radius: 12px;
  background: #fff; font: 400 13px var(--font); color: #0a0a0a;
}
.input::placeholder { color: #6b7a90; }
.input:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 1px; }
.input[aria-invalid='true'] { border-color: #b3261e; }

.banner {
  margin: 7.6px 11.5px 0; padding: 12px 18px; border-radius: 12px; background: #fdecea;
  border: 0.5px solid rgba(122, 26, 18, 0.25); font: 500 10px/1.45 var(--font); color: #7a1a12;
}
.err { margin: 4px 0 0; font: 500 10px/1.4 var(--font); color: #b00020; }
.hint { margin: 12.4px 1.5px 0; font: 400 11px/1.5 var(--font); color: #4a5b73; }

.deposit { margin-top: 24px; }
.dep-label { margin: 0 0 8.7px; font: 700 12px/1.5 var(--font); color: #4a5b73; }
.chips { display: grid; grid-template-columns: repeat(3, 113.7px); gap: 7.4px; }
.chip {
  height: 40.8px; border: 0; border-radius: 12px; background: #dfe8f2; cursor: pointer;
  font: 700 11px var(--font); color: #123a63;
}
.chip[aria-checked='true'] { background: linear-gradient(135deg, #123a63, #2f5d8c); color: #fff; }
.chip:disabled { opacity: 0.45; cursor: not-allowed; }
.chip:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; }

.cta {
  position: absolute; left: 0; top: 576.2px; width: 356px; height: 50px; border: 0; border-radius: 16px; cursor: pointer;
  background: linear-gradient(135deg, #153a6e, #2f5d8c); font: 700 12px var(--font); color: #fff;
}
.cta:disabled { opacity: 0.6; cursor: wait; }
.cta:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 3px; }
.form-err { position: absolute; top: 552px; left: 0; width: 356px; margin: 0; text-align: center; }
</style>