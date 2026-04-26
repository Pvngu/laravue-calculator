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
  <header class="vcal:rounded-xl vcal:border vcal:border-slate-200 vcal:bg-white/90 vcal:px-4 vcal:py-3 vcal:shadow-sm">
    <p class="vcal:min-h-4 vcal:text-xs vcal:font-medium vcal:uppercase vcal:tracking-wide vcal:text-slate-500" aria-live="polite">
      {{ expression || 'Ready' }}
    </p>
    <p
      class="vcal:mt-1 vcal:text-right vcal:font-mono vcal:text-3xl vcal:font-black vcal:leading-none vcal:tracking-wide vcal:text-slate-900 vcal:sm:text-4xl"
      aria-live="assertive"
    >
      {{ display }}
    </p>
  </header>
</template>
