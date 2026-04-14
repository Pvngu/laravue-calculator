<script setup>
import { ref } from 'vue'
import PosCalculator from './components/PosCalculator.vue'

const lastResult = ref('0')

function handleEvaluate(payload) {
  lastResult.value = payload.result
}
</script>

<template>
  <main class="demo-shell">
    <section class="demo-panel">
      <header>
        <p class="eyebrow">POS Utility</p>
        <h1>Checkout Calculator</h1>
        <p class="subtitle">Fast keyboard and touch input for cashier workflows.</p>
      </header>

      <PosCalculator
        compact
        :max-history="5"
        :precision="12"
        @evaluate="handleEvaluate"
      />

      <p class="last-result">Latest result: {{ lastResult }}</p>
    </section>
  </main>
</template>

<style scoped>
.demo-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background:
    radial-gradient(circle at 0% 0%, #fef3c7 0%, transparent 45%),
    radial-gradient(circle at 90% 90%, #bae6fd 0%, transparent 40%),
    #f8fafc;
}

.demo-panel {
  width: min(100%, 460px);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  box-shadow: 0 16px 32px rgba(2, 6, 23, 0.12);
  padding: 1rem;
}

.eyebrow {
  margin: 0;
  color: #1d4ed8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
}

h1 {
  margin: 0.3rem 0 0;
  font-size: 1.5rem;
  color: #0f172a;
}

.subtitle {
  margin: 0.3rem 0 1rem;
  color: #334155;
}

.last-result {
  margin: 1rem 0 0;
  color: #0f172a;
  font-weight: 600;
}
</style>
