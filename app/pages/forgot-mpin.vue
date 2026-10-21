<template>
  <div class="p-6 bg-slate-50 h-full">
    <div class="flex items-center mb-6">
      <NuxtLink to="/login" class="mr-4"><UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-blue-950" /></NuxtLink>
      <h1 class="text-xl font-bold text-blue-950">Forgot MPIN</h1>
    </div>
    <p class="text-xs text-slate-500 mb-6">Step 1 of 3</p>

    <h2 class="text-2xl font-bold text-blue-950 mb-2">Forgot your MPIN?</h2>
    <p class="text-xs text-slate-500 mb-8">Enter mobile number associated with your account and we will send you a 6-digit code.</p>

    <UFormGroup label="Mobile Number">
      <UInput placeholder="9XX XXX XXXX" size="lg" />
    </UFormGroup>

    <UButton block size="lg" class="mt-8 bg-blue-950">Send Code</UButton>
  </div>
</template>