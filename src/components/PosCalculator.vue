<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

const keypad = computed(() => [
  { key: 'clear', label: 'C', type: 'action', action: () => clearAll() },
  { key: 'backspace', label: '⌫', type: 'action', action: () => backspace() },
  { key: 'percent', label: '%', type: 'action', action: () => percent() },
  { key: 'divide', label: '÷', type: 'operator', action: () => setOperator('/') },

  { key: '7', label: '7', type: 'number', action: () => inputDigit('7') },
  { key: '8', label: '8', type: 'number', action: () => inputDigit('8') },
  { key: '9', label: '9', type: 'number', action: () => inputDigit('9') },
  { key: 'multiply', label: '×', type: 'operator', action: () => setOperator('*') },

  { key: '4', label: '4', type: 'number', action: () => inputDigit('4') },
  { key: '5', label: '5', type: 'number', action: () => inputDigit('5') },
  { key: '6', label: '6', type: 'number', action: () => inputDigit('6') },
  { key: 'minus', label: '−', type: 'operator', action: () => setOperator('-') },

  { key: '1', label: '1', type: 'number', action: () => inputDigit('1') },
  { key: '2', label: '2', type: 'number', action: () => inputDigit('2') },
  { key: '3', label: '3', type: 'number', action: () => inputDigit('3') },
  { key: 'plus', label: '+', type: 'operator', action: () => setOperator('+') },

  { key: 'sign', label: '±', type: 'action', action: () => toggleSign() },
  { key: '0', label: '0', type: 'number', action: () => inputDigit('0') },
  { key: 'decimal', label: '.', type: 'number', action: () => inputDecimal() },
  { key: 'equals', label: '=', type: 'equals', action: () => runEvaluate() }
])

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
    class="pos-calculator"
    :class="{ compact: compact }"
    tabindex="0"
    :aria-label="title"
  >
    <div class="calculator-core">
      <header class="display-panel">
        <p class="expression" aria-live="polite">{{ expression || 'Ready' }}</p>
        <p class="result" aria-live="assertive">{{ display }}</p>
      </header>

      <div class="utility-row">
        <button type="button" class="utility" @click="copyResult">
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
        <button type="button" class="utility" :disabled="!canUndo" @click="handleUndo">Undo</button>
        <button type="button" class="utility danger" @click="clearAll">Clear</button>
      </div>

      <div class="keypad" role="group" aria-label="Calculator keypad">
        <button
          v-for="item in keypad"
          :key="item.key"
          type="button"
          class="key"
          :class="item.type"
          @click="item.action"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <aside v-if="showHistory" class="history-panel" :class="{ hidden: compact }">
      <p class="history-title">Recent</p>
      <ul class="history-list">
        <li v-if="history.length === 0" class="history-empty">No actions yet</li>
        <li v-for="item in history" :key="item.id">
          <button class="history-item" type="button" @click="applyHistory(item)">
            <span class="history-expression">{{ item.expression }}</span>
            <span class="history-result">{{ item.result }}</span>
          </button>
        </li>
      </ul>
    </aside>
  </section>
</template>

<style scoped>
.pos-calculator {
  --bg: #f8fafc;
  --surface: #ffffff;
  --ink: #0f172a;
  --muted: #64748b;
  --brand: #0f766e;
  --brand-ink: #ffffff;
  --operator: #ea580c;
  --operator-ink: #ffffff;
  --danger: #dc2626;
  --border: #e2e8f0;
  --ring: #0ea5e9;

  width: 100%;
  max-width: 720px;
  border: 1px solid var(--border);
  background: linear-gradient(145deg, #f8fafc 0%, #eef2ff 100%);
  border-radius: 14px;
  padding: 0.9rem;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
  display: grid;
  grid-template-columns: 1fr minmax(180px, 220px);
  gap: 0.8rem;
  font-family: 'Avenir Next', 'Trebuchet MS', 'Segoe UI', sans-serif;
}

.pos-calculator.compact {
  max-width: 420px;
  grid-template-columns: 1fr;
}

.calculator-core {
  display: grid;
  gap: 0.65rem;
}

.display-panel {
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  background: var(--surface);
}

.expression {
  margin: 0;
  min-height: 1rem;
  color: var(--muted);
  font-size: 0.82rem;
}

.result {
  margin: 0.22rem 0 0;
  color: var(--ink);
  text-align: right;
  font-weight: 800;
  font-size: clamp(1.35rem, 3.8vw, 2.1rem);
  letter-spacing: 0.03em;
  line-height: 1.1;
  font-family: 'Menlo', 'SF Mono', 'Consolas', monospace;
}

.utility-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.45rem;
}

.utility,
.key,
.history-item {
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--ink);
  background: var(--surface);
  transition: transform 120ms ease, filter 120ms ease, border-color 120ms ease;
}

.utility {
  min-height: 44px;
  font-size: 0.93rem;
  font-weight: 700;
}

.utility:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.utility.danger {
  color: var(--danger);
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}

.key {
  min-height: 56px;
  font-size: 1.2rem;
  font-weight: 800;
}

.key.operator {
  background: var(--operator);
  color: var(--operator-ink);
  border-color: transparent;
}

.key.equals {
  background: var(--brand);
  color: var(--brand-ink);
  border-color: transparent;
}

.key.action {
  background: #f1f5f9;
}

.history-panel {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.8);
  display: grid;
  align-content: start;
  gap: 0.45rem;
}

.history-panel.hidden {
  display: none;
}

.history-title {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.history-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.45rem;
}

.history-empty {
  color: var(--muted);
  font-size: 0.9rem;
}

.history-item {
  width: 100%;
  min-height: 54px;
  text-align: left;
  padding: 0.4rem 0.5rem;
  display: grid;
  gap: 0.18rem;
}

.history-expression {
  color: var(--muted);
  font-size: 0.75rem;
}

.history-result {
  font-family: 'Menlo', 'SF Mono', 'Consolas', monospace;
  font-weight: 700;
  color: var(--ink);
}

.utility:hover,
.key:hover,
.history-item:hover {
  filter: brightness(0.98);
}

.utility:focus-visible,
.key:focus-visible,
.history-item:focus-visible,
.pos-calculator:focus-visible {
  outline: 3px solid color-mix(in oklab, var(--ring), white 40%);
  outline-offset: 1px;
  border-color: color-mix(in oklab, var(--ring), white 45%);
}

.utility:active,
.key:active,
.history-item:active {
  transform: translateY(1px) scale(0.995);
}

@media (max-width: 960px) {
  .pos-calculator {
    grid-template-columns: 1fr;
  }

  .history-panel {
    order: 2;
  }
}

@media (max-width: 640px) {
  .pos-calculator {
    padding: 0.7rem;
  }

  .key {
    min-height: 52px;
    font-size: 1.1rem;
  }
}
</style>
