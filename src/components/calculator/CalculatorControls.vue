<script setup>
defineProps({
  copied: {
    type: Boolean,
    default: false
  },
  canUndo: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['copy', 'undo', 'clear'])
</script>

<template>
  <div class="vcal:grid vcal:grid-cols-3 vcal:gap-2">
    <button
      class="vcal:flex vcal:h-11 vcal:items-center vcal:justify-center vcal:rounded-lg vcal:border vcal:border-slate-200 vcal:bg-white vcal:px-4 vcal:font-semibold vcal:text-slate-700 vcal:transition-all vcal:hover:bg-slate-50 vcal:hover:shadow-sm vcal:active:scale-95 vcal:disabled:opacity-50"
      @click="emit('copy')"
    >
      {{ copied ? 'Copied' : 'Copy' }}
    </button>
    <button
      class="vcal:flex vcal:h-11 vcal:items-center vcal:justify-center vcal:rounded-lg vcal:border vcal:border-slate-200 vcal:bg-white vcal:px-4 vcal:font-semibold vcal:text-slate-700 vcal:transition-all vcal:hover:bg-slate-50 vcal:hover:shadow-sm vcal:active:scale-95 vcal:disabled:cursor-not-allowed vcal:disabled:opacity-50"
      :disabled="!canUndo"
      @click="emit('undo')"
    >
      Undo
    </button>
    <button
      class="vcal:flex vcal:h-11 vcal:items-center vcal:justify-center vcal:rounded-lg vcal:bg-red-50 vcal:px-4 vcal:font-semibold vcal:text-red-600 vcal:transition-all vcal:hover:bg-red-100 vcal:hover:text-red-700 vcal:active:scale-95"
      @click="emit('clear')"
    >
      Clear
    </button>
  </div>
</template>
