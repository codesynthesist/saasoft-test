import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import '@/assets/css/index.scss'

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .mount('#app')
