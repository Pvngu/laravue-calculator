<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['press'])

function buttonClass(item) {
  const base = 'flex h-14 items-center justify-center rounded-xl text-xl font-extrabold transition-all active:scale-95 shadow-sm hover:shadow-md'

  if (item.type === 'operator') {
    return `${base} bg-amber-600 text-white hover:bg-amber-500`
  }

  if (item.type === 'equals') {
    return `${base} bg-teal-700 text-white hover:bg-teal-600`
  }

  if (item.type === 'action') {
    return `${base} bg-slate-100 text-slate-900 hover:bg-slate-200`
  }

  return `${base} bg-white text-slate-900 hover:bg-slate-50 border border-slate-100`
}
</script>

<template>
  <div class="grid grid-cols-4 gap-2" role="group" aria-label="Calculator keypad">
    <button
      v-for="item in items"
      :key="item.key"
      :class="buttonClass(item)"
      @click="emit('press', item)"
    >
      <span class="-translate-y-0.5">
        {{ item.label }}
      </span>
    </button>
  </div>
</template>
