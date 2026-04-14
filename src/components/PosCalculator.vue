<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Card as ACard } from 'ant-design-vue'
import CalculatorDisplay from './calculator/CalculatorDisplay.vue'
import CalculatorControls from './calculator/CalculatorControls.vue'
import CalculatorKeypad from './calculator/CalculatorKeypad.vue'
import CalculatorHistory from './calculator/CalculatorHistory.vue'
import { keypadItems } from './calculator/keypad'
import { useCalculatorEngine } from '../composables/useCalculatorEngine'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '0'
  },
  precision: {
    type: Number,
    default: 12
  },
  maxHistory: {
    type: Number,
    default: 5
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  showHistory: {
    type: Boolean,
    default: true
  },
  autofocus: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'POS Calculator'
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'evaluate', 'copy', 'error'])

const {
  display,
  expression,
  history,
  canUndo,
  inputDigit,
  inputDecimal,
  toggleSign,
  clearAll,
  backspace,
  percent,
  setOperator,
  evaluate,
  undo,
  useHistoryResult,
  setDisplay,
  resetUndo
} = useCalculatorEngine({
  initialValue: String(props.modelValue ?? '0'),
  maxHistory: props.maxHistory,
  precision: props.precision
})

const rootRef = ref(null)
const copied = ref(false)

watch(
  () => props.modelValue,
  (next) => {
    const asString = String(next ?? '0')
    if (asString !== display.value) {
      setDisplay(asString)
      resetUndo()
    }
  }
)

watch(display, (next) => {
  emit('update:modelValue', next)
  emit('change', {
    value: next,
    expression: expression.value
  })
})

async function copyResult() {
  const value = display.value

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
    } else {
      const helper = document.createElement('textarea')
      helper.value = value
      helper.setAttribute('readonly', '')
      helper.style.position = 'absolute'
      helper.style.left = '-9999px'
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      document.body.removeChild(helper)
    }

    copied.value = true
    emit('copy', value)
    window.setTimeout(() => {
      copied.value = false
    }, 900)
  } catch (error) {
    emit('error', {
      code: 'COPY_FAILED',
      message: 'Unable to copy result to clipboard',
      error
    })
  }
}

function runEvaluate() {
  const payload = evaluate()

  if (!payload) {
    return
  }

  if (payload.result === 'Error') {
    emit('error', {
      code: 'MATH_ERROR',
      message: 'Invalid arithmetic operation'
    })
    return
  }

  emit('evaluate', payload)
}

function applyHistory(item) {
  useHistoryResult(item.result)
}

function handleUndo() {
  undo()
}

function onKeypadPress(item) {
  switch (item.action) {
    case 'digit':
      inputDigit(item.value)
      break
    case 'decimal':
      inputDecimal()
      break
    case 'operator':
      setOperator(item.value)
      break
    case 'evaluate':
      runEvaluate()
      break
    case 'clear':
      clearAll()
      break
    case 'backspace':
      backspace()
      break
    case 'percent':
      percent()
      break
    case 'sign':
      toggleSign()
      break
    default:
      break
  }
}

function focusRoot() {
  if (props.autofocus) {
    rootRef.value?.focus()
  }
}

function isEditableTarget(eventTarget) {
  if (!(eventTarget instanceof HTMLElement)) {
    return false
  }

  if (eventTarget.isContentEditable) {
    return true
  }

  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(eventTarget.tagName)
}

function handleKeydown(event) {
  if (!props.keyboard) {
    return
  }

  const target = event.target
  const insideComponent = rootRef.value?.contains(target)

  if (isEditableTarget(target) && !insideComponent) {
    return
  }

  const { key, ctrlKey, metaKey } = event

  if ((ctrlKey || metaKey) && key.toLowerCase() === 'c') {
    event.preventDefault()
    copyResult()
    return
  }

  if (/^[0-9]$/.test(key)) {
    event.preventDefault()
    inputDigit(key)
    return
  }

  if (key === '.' || key === ',') {
    event.preventDefault()
    inputDecimal()
    return
  }

  if (key === '+') {
    event.preventDefault()
    setOperator('+')
    return
  }

  if (key === '-') {
    event.preventDefault()
    setOperator('-')
    return
  }

  if (key === '*' || key.toLowerCase() === 'x') {
    event.preventDefault()
    setOperator('*')
    return
  }

  if (key === '/') {
    event.preventDefault()
    setOperator('/')
    return
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault()
    runEvaluate()
    return
  }

  if (key === 'Backspace') {
    event.preventDefault()
    backspace()
    return
  }

  if (key === 'Escape') {
    event.preventDefault()
    clearAll()
    return
  }

  if ((ctrlKey || metaKey) && key.toLowerCase() === 'z') {
    event.preventDefault()
    handleUndo()
  }
}

onMounted(() => {
  focusRoot()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section
    ref="rootRef"
    class="w-full"
    tabindex="0"
    :aria-label="title"
  >
    <ACard
      class="w-full border-slate-200 bg-linear-to-br from-amber-50 via-sky-50 to-slate-100 shadow-lg"
      :body-style="{ padding: '12px' }"
    >
      <div
        class="grid gap-3"
        :class="compact ? 'grid-cols-1 max-w-105' : 'grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px]'"
      >
        <div class="grid gap-3">
          <CalculatorDisplay :expression="expression" :display="display" />

          <CalculatorControls
            :copied="copied"
            :can-undo="canUndo"
            @copy="copyResult"
            @undo="handleUndo"
            @clear="clearAll"
          />

          <CalculatorKeypad :items="keypadItems" @press="onKeypadPress" />
        </div>

        <CalculatorHistory
          v-if="showHistory && !compact"
          :items="history"
          @select="applyHistory"
        />
      </div>
    </ACard>
  </section>
</template>
