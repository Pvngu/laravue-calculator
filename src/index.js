import PosCalculator from './components/PosCalculator.vue'
import { useCalculatorEngine } from './composables/useCalculatorEngine'

export { PosCalculator, useCalculatorEngine }

export default {
  install(app) {
    app.component('PosCalculator', PosCalculator)
  }
}
