import { computed, ref } from 'vue'

function decimalPlaces(raw) {
  const value = String(raw)
  if (!value.includes('.')) {
    return 0
  }
  return value.split('.')[1].length
}

function toIntScale(value, scale) {
  return Math.round(Number(value) * scale)
}

function trimDecimalZeros(value) {
  if (!value.includes('.')) {
    return value
  }
  return value.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
}

function normalizeNumber(value, precision) {
  if (!Number.isFinite(value)) {
    return 'Error'
  }

  const rounded = Number(value.toFixed(precision))

  if (Object.is(rounded, -0)) {
    return '0'
  }

  return trimDecimalZeros(String(rounded))
}

function preciseAdd(a, b, precision) {
  const factor = 10 ** Math.max(decimalPlaces(a), decimalPlaces(b), precision)
  return (toIntScale(a, factor) + toIntScale(b, factor)) / factor
}

function preciseSubtract(a, b, precision) {
  return preciseAdd(a, -Number(b), precision)
}

function preciseMultiply(a, b, precision) {
  const baseScale = 10 ** (decimalPlaces(a) + decimalPlaces(b))
  const intA = toIntScale(a, 10 ** decimalPlaces(a))
  const intB = toIntScale(b, 10 ** decimalPlaces(b))
  return Number(((intA * intB) / baseScale).toFixed(precision))
}

function preciseDivide(a, b, precision) {
  if (Number(b) === 0) {
    return Number.NaN
  }
  return Number((Number(a) / Number(b)).toFixed(precision))
}

function createSnapshot(state) {
  return {
    display: state.display,
    storedValue: state.storedValue,
    operator: state.operator,
    waitingForNextOperand: state.waitingForNextOperand,
    expression: state.expression,
    history: [...state.history]
  }
}

export function useCalculatorEngine(options = {}) {
  const maxHistory = options.maxHistory ?? 5
  const maxUndo = options.maxUndo ?? 25
  const precision = options.precision ?? 12

  const display = ref(options.initialValue ?? '0')
  const storedValue = ref(null)
  const operator = ref(null)
  const waitingForNextOperand = ref(false)
  const expression = ref('')
  const history = ref([])
  const undoStack = ref([])

  const canUndo = computed(() => undoStack.value.length > 0)

  function getState() {
    return {
      display: display.value,
      storedValue: storedValue.value,
      operator: operator.value,
      waitingForNextOperand: waitingForNextOperand.value,
      expression: expression.value,
      history: history.value
    }
  }

  function applySnapshot(snapshot) {
    display.value = snapshot.display
    storedValue.value = snapshot.storedValue
    operator.value = snapshot.operator
    waitingForNextOperand.value = snapshot.waitingForNextOperand
    expression.value = snapshot.expression
    history.value = [...snapshot.history]
  }

  function pushUndoSnapshot() {
    undoStack.value.push(createSnapshot(getState()))
    if (undoStack.value.length > maxUndo) {
      undoStack.value.shift()
    }
  }

  function resetUndo() {
    undoStack.value = []
  }

  function clearAll() {
    pushUndoSnapshot()
    display.value = '0'
    storedValue.value = null
    operator.value = null
    waitingForNextOperand.value = false
    expression.value = ''
  }

  function backspace() {
    if (display.value === 'Error') {
      clearAll()
      return
    }

    if (waitingForNextOperand.value) {
      return
    }

    if (display.value.length <= 1 || (display.value.length === 2 && display.value.startsWith('-'))) {
      pushUndoSnapshot()
      display.value = '0'
      return
    }

    pushUndoSnapshot()
    display.value = display.value.slice(0, -1)
  }

  function inputDigit(digit) {
    if (display.value === 'Error') {
      clearAll()
    }

    pushUndoSnapshot()

    if (waitingForNextOperand.value) {
      display.value = digit
      waitingForNextOperand.value = false
      return
    }

    display.value = display.value === '0' ? digit : `${display.value}${digit}`
  }

  function inputDecimal() {
    if (display.value === 'Error') {
      clearAll()
    }

    if (waitingForNextOperand.value) {
      pushUndoSnapshot()
      display.value = '0.'
      waitingForNextOperand.value = false
      return
    }

    if (!display.value.includes('.')) {
      pushUndoSnapshot()
      display.value = `${display.value}.`
    }
  }

  function toggleSign() {
    if (display.value === 'Error') {
      clearAll()
    }

    if (display.value === '0') {
      return
    }

    pushUndoSnapshot()

    if (display.value.startsWith('-')) {
      display.value = display.value.slice(1)
      return
    }

    display.value = `-${display.value}`
  }

  function calculate(left, right, op) {
    switch (op) {
      case '+':
        return preciseAdd(left, right, precision)
      case '-':
        return preciseSubtract(left, right, precision)
      case '*':
        return preciseMultiply(left, right, precision)
      case '/':
        return preciseDivide(left, right, precision)
      default:
        return Number(right)
    }
  }

  function percent() {
    if (display.value === 'Error') {
      clearAll()
    }

    pushUndoSnapshot()
    display.value = normalizeNumber(Number(display.value) / 100, precision)
  }

  function setOperator(nextOperator) {
    if (display.value === 'Error') {
      clearAll()
      return
    }

    const inputValue = display.value

    pushUndoSnapshot()

    if (storedValue.value === null) {
      storedValue.value = inputValue
    } else if (operator.value && !waitingForNextOperand.value) {
      const nextValue = calculate(storedValue.value, inputValue, operator.value)
      const normalized = normalizeNumber(nextValue, precision)

      if (normalized === 'Error') {
        display.value = 'Error'
        storedValue.value = null
        operator.value = null
        waitingForNextOperand.value = true
        expression.value = ''
        return
      }

      display.value = normalized
      storedValue.value = normalized
    }

    waitingForNextOperand.value = true
    operator.value = nextOperator
    expression.value = `${storedValue.value} ${nextOperator}`
  }

  function evaluate() {
    if (!operator.value || storedValue.value === null || waitingForNextOperand.value) {
      return null
    }

    pushUndoSnapshot()

    const currentValue = display.value
    const fullExpression = `${storedValue.value} ${operator.value} ${currentValue}`

    const nextValue = calculate(storedValue.value, currentValue, operator.value)
    const normalized = normalizeNumber(nextValue, precision)

    if (normalized === 'Error') {
      display.value = 'Error'
      storedValue.value = null
      operator.value = null
      waitingForNextOperand.value = true
      expression.value = ''
      return {
        expression: fullExpression,
        result: 'Error'
      }
    }

    display.value = normalized
    storedValue.value = normalized
    operator.value = null
    waitingForNextOperand.value = true
    expression.value = `${fullExpression} =`

    history.value = [{ id: Date.now(), expression: fullExpression, result: normalized }, ...history.value].slice(0, maxHistory)

    return {
      expression: fullExpression,
      result: normalized
    }
  }

  function undo() {
    const snapshot = undoStack.value.pop()
    if (!snapshot) {
      return false
    }
    applySnapshot(snapshot)
    return true
  }

  function useHistoryResult(result) {
    pushUndoSnapshot()
    display.value = result
    storedValue.value = null
    operator.value = null
    waitingForNextOperand.value = false
    expression.value = ''
  }

  function setDisplay(value) {
    display.value = String(value)
  }

  return {
    display,
    storedValue,
    operator,
    waitingForNextOperand,
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
  }
}
