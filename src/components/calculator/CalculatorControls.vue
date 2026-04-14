<script setup>
import { Button as AButton } from 'ant-design-vue'

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
    <AButton class="h-11 !rounded-lg !font-semibold" @click="emit('copy')">
      {{ copied ? 'Copied' : 'Copy' }}
    </AButton>
    <AButton class="h-11 !rounded-lg !font-semibold" :disabled="!canUndo" @click="emit('undo')">
      Undo
    </AButton>
    <AButton danger class="h-11 !rounded-lg !font-semibold" @click="emit('clear')">
      Clear
    </AButton>
  </div>
</template>
