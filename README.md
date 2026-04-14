# vue-calculator

Touch-friendly POS calculator component for Vue 3. Built for checkout workflows where cashiers need fast arithmetic inside a modal or popover without leaving the POS screen.

## Features

- Large keypad with tap and keyboard input.
- Decimal support and precision-safe arithmetic helpers.
- Clear, backspace, sign toggle, and percent.
- Copy current result with clipboard fallback.
- Undo for recent actions.
- Lightweight recent history with tap-to-reuse.
- Responsive layout for desktop and tablet.

## Install

```bash
npm install vue-calculator
```

## Basic usage

```vue
<script setup>
import { ref } from 'vue'
import { PosCalculator } from 'vue-calculator'

const value = ref('0')

function onEvaluate(payload) {
	console.log('result', payload.result)
}
</script>

<template>
	<PosCalculator v-model="value" compact @evaluate="onEvaluate" />
</template>
```

## Modal / popover integration notes

- Use `compact` mode for constrained containers.
- Set `autofocus` to true when the overlay opens for immediate keyboard input.
- Keep `keyboard` enabled so numpad and operators work during checkout.
- Listen to `@evaluate` and feed result into your POS payment/discount field.

## Component API

### Props

- `modelValue: string | number` default `"0"`
- `precision: number` default `12`
- `maxHistory: number` default `5`
- `keyboard: boolean` default `true`
- `compact: boolean` default `false`
- `showHistory: boolean` default `true`
- `autofocus: boolean` default `true`
- `title: string` default `"POS Calculator"`

### Emits

- `update:modelValue` current display value
- `change` payload `{ value, expression }`
- `evaluate` payload `{ expression, result }`
- `copy` copied display string
- `error` payload `{ code, message, error? }`

## Programmatic engine (headless)

```js
import { useCalculatorEngine } from 'vue-calculator'

const calc = useCalculatorEngine({
	initialValue: '0',
	precision: 12,
	maxHistory: 5
})

calc.inputDigit('1')
calc.setOperator('+')
calc.inputDigit('2')
const result = calc.evaluate()
```

## Development

```bash
npm run dev
npm run build
```
