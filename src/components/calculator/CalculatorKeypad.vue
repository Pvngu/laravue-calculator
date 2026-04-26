<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['press'])

function buttonClass(item) {
  const base = 'vcal:flex vcal:h-14 vcal:items-center vcal:justify-center vcal:rounded-xl vcal:text-xl vcal:font-extrabold vcal:transition-all vcal:active:scale-95 vcal:shadow-sm vcal:hover:shadow-md'

  if (item.type === 'operator') {
    return `${base} vcal:bg-amber-600 vcal:text-white vcal:hover:bg-amber-500`
  }

  if (item.type === 'equals') {
    return `${base} vcal:bg-teal-700 vcal:text-white vcal:hover:bg-teal-600`
  }

  if (item.type === 'action') {
    return `${base} vcal:bg-slate-100 vcal:text-slate-900 vcal:hover:bg-slate-200`
  }

  return `${base} vcal:bg-white vcal:text-slate-900 vcal:hover:bg-slate-50 vcal:border vcal:border-slate-100`
}
</script>

<template>
  <div class="vcal:grid vcal:grid-cols-4 vcal:gap-2" role="group" aria-label="Calculator keypad">
    <button
      v-for="item in items"
      :key="item.key"
      :class="buttonClass(item)"
      @click="emit('press', item)"
    >
      <span class="vcal:-translate-y-0.5">
        {{ item.label }}
      </span>
    </button>
  </div>
</template>
