<script setup>
import { Button as AButton } from 'ant-design-vue'

defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['press'])

function buttonClass(item) {
  if (item.type === 'operator') {
    return 'h-14 !rounded-xl !border-0 !bg-amber-600 !text-white !text-xl !font-extrabold'
  }

  if (item.type === 'equals') {
    return 'h-14 !rounded-xl !border-0 !bg-teal-700 !text-white !text-xl !font-extrabold'
  }

  if (item.type === 'action') {
    return 'h-14 !rounded-xl !bg-slate-100 !text-slate-900 !text-xl !font-extrabold'
  }

  return 'h-14 !rounded-xl !bg-white !text-slate-900 !text-xl !font-extrabold'
}
</script>

<template>
  <div class="grid grid-cols-4 gap-2" role="group" aria-label="Calculator keypad">
    <AButton
      v-for="item in items"
      :key="item.key"
      :class="buttonClass(item)"
      @click="emit('press', item)"
    >
        <span class="-translate-y-0.5">
            {{ item.label }}
        </span>
    </AButton>
  </div>
</template>
