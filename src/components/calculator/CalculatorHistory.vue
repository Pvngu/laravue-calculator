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
  <aside class="vcal:rounded-xl vcal:border vcal:border-slate-200 vcal:bg-white/85 vcal:p-3 vcal:backdrop-blur-sm">
    <p class="vcal:text-xs vcal:font-bold vcal:uppercase vcal:tracking-wide vcal:text-slate-500">Recent</p>

    <div v-if="items.length === 0" class="vcal:flex vcal:flex-col vcal:items-center vcal:justify-center vcal:py-8 vcal:text-center">
      <div class="vcal:mb-2 vcal:text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="vcal:mx-auto vcal:h-10 vcal:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="vcal:text-sm vcal:text-slate-400">No history yet</p>
    </div>

    <ul v-else class="vcal:mt-2 vcal:space-y-2">
      <li v-for="item in items" :key="item.id">
        <button
          class="vcal:group vcal:flex vcal:w-full vcal:flex-col vcal:rounded-lg vcal:border vcal:border-slate-100 vcal:bg-white vcal:p-3 vcal:text-left vcal:transition-all vcal:hover:border-sky-200 vcal:hover:bg-sky-50 vcal:active:scale-98"
          @click="emit('select', item)"
        >
          <span class="vcal:block vcal:text-[11px] vcal:leading-tight vcal:text-slate-400 vcal:transition-colors vcal:group-hover:text-sky-600">{{ item.expression }}</span>
          <span class="vcal:mt-1 vcal:flex vcal:items-center vcal:justify-between">
            <span class="vcal:font-mono vcal:text-sm vcal:font-bold vcal:text-slate-900">{{ item.result }}</span>
            <span class="vcal:rounded vcal:bg-sky-100 vcal:px-1.5 vcal:py-0.5 vcal:text-[10px] vcal:font-medium vcal:text-sky-700 vcal:opacity-0 vcal:transition-opacity vcal:group-hover:opacity-100">
              REUSE
            </span>
          </span>
        </button>
      </li>
    </ul>
  </aside>
</template>
