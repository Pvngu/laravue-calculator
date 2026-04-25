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
  <div class="grid grid-cols-3 gap-2">
    <button
      class="flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-95 disabled:opacity-50"
      @click="emit('copy')"
    >
      {{ copied ? 'Copied' : 'Copy' }}
    </button>
    <button
      class="flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!canUndo"
      @click="emit('undo')"
    >
      Undo
    </button>
    <button
      class="flex h-11 items-center justify-center rounded-lg bg-red-50 px-4 font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 active:scale-95"
      @click="emit('clear')"
    >
      Clear
    </button>
  </div>
</template>
