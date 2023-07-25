import { reactive } from 'vue'

export const store = reactive({
  cards: [],
  formats: [],
  formatSelected: null
})