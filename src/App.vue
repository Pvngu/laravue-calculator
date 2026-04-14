<script setup>
import { ref } from 'vue'
import { Card as ACard, TypographyTitle as ATypographyTitle, TypographyText as ATypographyText, Tag as ATag } from 'ant-design-vue'
import PosCalculator from './components/PosCalculator.vue'

const lastResult = ref('0')

function handleEvaluate(payload) {
  lastResult.value = payload.result
}
</script>

<template>
  <PosCalculator compact :max-history="5" :precision="12" @evaluate="handleEvaluate" />
</template>
