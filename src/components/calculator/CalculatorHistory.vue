<script setup>
import { Button as AButton, Empty as AEmpty, Tag as ATag } from 'ant-design-vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <aside class="rounded-xl border border-slate-200 bg-white/85 p-3">
    <p class="text-xs font-bold uppercase tracking-wide text-slate-500">Recent</p>

    <div v-if="items.length === 0" class="pt-2">
      <AEmpty :image="AEmpty.PRESENTED_IMAGE_SIMPLE" description="No actions yet" />
    </div>

    <ul v-else class="mt-2 space-y-2">
      <li v-for="item in items" :key="item.id">
        <AButton
          block
          class="h-auto! rounded-lg! border-slate-200! px-3! py-2! text-left!"
          @click="emit('select', item)"
        >
          <span class="block text-[11px] leading-tight text-slate-500">{{ item.expression }}</span>
          <span class="mt-1 flex items-center justify-between">
            <span class="font-mono text-sm font-bold text-slate-900">{{ item.result }}</span>
            <ATag color="cyan">reuse</ATag>
          </span>
        </AButton>
      </li>
    </ul>
  </aside>
</template>
