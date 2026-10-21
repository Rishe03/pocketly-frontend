<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const savedMobile = useCookie<string>('pocketly_mobile', { maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' })
const mobile = ref(savedMobile.value ?? '')
const mpin = ref('')
const loading = ref(false)
const errors = reactive({ mobile: '', mpin: '', form: '' })

watch(mobile, v => { mobile.value = v.replace(/\D/g, '').slice(0, 10) })

function addDigit(d: string) { if (mpin.value.length < 4) mpin.value += d }
function removeDigit() { mpin.value = mpin.value.slice(0, -1) }

function validate() {
  errors.mobile = /^9\d{9}$/.test(mobile.value)
    ? '' : 'Enter a valid 10-digit number starting with 9.'
  errors.mpin = mpin.value.length === 4 ? '' : 'Enter your 4-digit MPIN.'
  errors.form = ''
  return !errors.mobile && !errors.mpin
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    await auth.login(mobile.value, mpin.value)
    savedMobile.value = mobile.value
    await navigateTo('/home')
  } catch (e: any) {
    errors.form = e?.statusCode === 401
      ? 'Incorrect mobile number or MPIN.'
      : 'Something went wrong. Please try again.'
    mpin.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login">
    <header class="hero">
      <div class="hero-bg" aria-hidden="true" />
      <img class="logo" src="/logo.svg" alt="" width="66" height="66" />
      <h1 class="wordmark">POCKETLY.</h1>
      <p class="tagline">Your pocket-sized bank for the goals that matter</p>
    </header>

    <form novalidate @submit.prevent="onSubmit">
      <div class="fields">
        <label for="mobile" class="field-label">Mobile Number</label>
        <div class="row">
          <span class="prefix">+63</span>
          <input
            id="mobile" v-model="mobile" type="tel" inputmode="numeric" placeholder="9XX XXX XXXX"
            autocomplete="tel-national" :aria-invalid="!!errors.mobile" aria-describedby="mobile-err"
          />
          <p id="mobile-err" class="err" aria-live="polite">{{ errors.mobile }}</p>
        </div>

        <p class="prompt">Enter your 4-digit MPIN</p>
        <div class="dots-wrap">
          <MpinDots :length="4" :filled="mpin.length" />
          <p class="err err-center" aria-live="polite">{{ errors.mpin }}</p>
        </div>

        <div class="pad-wrap">
          <Keypad @digit="addDigit" @remove="removeDigit" />
          <p class="err err-center form-err" aria-live="polite">{{ errors.form }}</p>
        </div>
      </div>

      <button class="primary" type="submit" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Log in' }}
      </button>
    </form>

    <p class="forgot"><NuxtLink to="/forgot-mpin">Forgot MPIN?</NuxtLink></p>
    <p class="signup">New To Pocketly? <NuxtLink to="/register">Create Account</NuxtLink></p>
    <p class="terms">
      By continuing, you agree to our <NuxtLink to="/terms">Terms &amp; Conditions</NuxtLink><br />
      and <NuxtLink to="/security">Security Policy</NuxtLink>.
    </p>
  </main>
</template>

<style scoped>
.login { min-height: 100%; padding-bottom: 27px; }

/* Header: 393 x 128 visible, 50px bottom curve (gradient box is 317px tall, shifted up 189px) */
.hero { position: relative; height: 128px; overflow: hidden; border-radius: 0 0 50px 50px; }
.hero-bg {
  position: absolute; left: 0; right: 0; top: -189px; height: 317px; border-radius: 50px;
  background: linear-gradient(to bottom, #0b153b 0%, #153a6e 75%, #2f5d8c 90.385%);
}
.logo { position: absolute; left: 51px; top: 28px; width: 66px; height: 66px; }
.wordmark {
  position: absolute; left: 121px; top: 47px; margin: 0; white-space: nowrap;
  font: 900 20px/1.5 var(--font); color: #fff;
}
.tagline {
  position: absolute; left: 121px; top: 72px; margin: 0; white-space: nowrap;
  font: 500 9px/1.5 var(--font); color: #fff;
}

/* Fields: left margin 40, right margin 30, as in the design */
.fields { padding: 0 30px 0 40px; }
.field-label { display: block; margin-top: 27px; font: 500 9px/1.5 var(--font); color: rgba(0, 0, 0, 0.6); }
.row { position: relative; display: flex; gap: 18px; margin-top: 15.5px; }
.prefix, input {
  box-sizing: border-box; height: 46px; border: 0.6px solid rgba(128, 128, 128, 0.3);
  border-radius: 10px; font: 500 12px var(--font); color: var(--navy-900);
}
.prefix { width: 59px; display: grid; place-items: center; background: var(--bg); }
input { flex: 1; min-width: 0; padding: 0 12px; background: rgba(255, 255, 255, 0.1); font-size: 13px; }
/* Design uses 40% opacity (too faint for contrast); 65% keeps the look and passes AA */
input::placeholder { color: rgba(11, 21, 59, 0.65); }
input:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; }

.prompt { margin: 17px 10px 0 0; text-align: center; font: 500 11px/1.5 var(--font); color: var(--navy-900); }
.dots-wrap { position: relative; margin: 10.5px 10px 0 0; }
.pad-wrap { position: relative; margin-top: 30px; }

/* Errors sit in the existing gaps, so they never shift the layout */
.err {
  position: absolute; top: 100%; left: 0; margin: 3px 0 0;
  font: 500 11px/15px var(--font); color: #b00020;
}
.err-center { right: 0; text-align: center; }
.form-err { margin-top: 12px; }

.primary {
  display: block; box-sizing: border-box; width: calc(100% - 116px); height: 46px;
  margin: 47px auto 0; border: 0; border-radius: 10px; cursor: pointer;
  background: linear-gradient(to right, #0b153b, #153a6e 66.346%);
  font: 700 12px var(--font); color: #fff;
}
.primary:disabled { opacity: 0.6; cursor: wait; }
.primary:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 3px; }

.forgot { margin: 30px 0 0; text-align: center; font: 500 11px/1.5 var(--font); }
.signup { margin: 15.5px 0 0; text-align: center; font: 400 11px/1.5 var(--font); color: rgba(11, 21, 59, 0.8); }
.terms {
  max-width: 242px; margin: 46.5px auto 0; text-align: center;
  font: 400 8px/1.5 var(--font); color: rgba(11, 21, 59, 0.8);
}
.forgot a, .signup a, .terms a { color: var(--navy-900); text-decoration: underline; font-weight: 700; }
.forgot a { font-weight: 500; }
a:focus-visible { outline: 3px solid var(--navy-500); outline-offset: 2px; border-radius: 4px; }
</style>