<script setup>
defineProps({
  expression: {
    type: String,
    default: ''
  },
  display: {
    type: String,
    required: true
  }
})
</script>

<template>
  <header class="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
    <p class="min-h-4 text-xs font-medium uppercase tracking-wide text-slate-500" aria-live="polite">
      {{ expression || 'Ready' }}
    </p>
    <p
      class="mt-1 text-right font-mono text-3xl font-black leading-none tracking-wide text-slate-900 sm:text-4xl"
      aria-live="assertive"
    >
      {{ display }}
    </p>
  </header>
</template>
