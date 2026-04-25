<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <aside class="rounded-xl border border-slate-200 bg-white/85 p-3 backdrop-blur-sm">
    <p class="text-xs font-bold uppercase tracking-wide text-slate-500">Recent</p>

    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
      <div class="mb-2 text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-sm text-slate-400">No history yet</p>
    </div>

    <ul v-else class="mt-2 space-y-2">
      <li v-for="item in items" :key="item.id">
        <button
          class="group flex w-full flex-col rounded-lg border border-slate-100 bg-white p-3 text-left transition-all hover:border-sky-200 hover:bg-sky-50 active:scale-98"
          @click="emit('select', item)"
        >
          <span class="block text-[11px] leading-tight text-slate-400 transition-colors group-hover:text-sky-600">{{ item.expression }}</span>
          <span class="mt-1 flex items-center justify-between">
            <span class="font-mono text-sm font-bold text-slate-900">{{ item.result }}</span>
            <span class="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 opacity-0 transition-opacity group-hover:opacity-100">
              REUSE
            </span>
          </span>
        </button>
      </li>
    </ul>
  </aside>
</template>
