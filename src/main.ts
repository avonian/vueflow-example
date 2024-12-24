import './assets/main.css'
import tippyDirective from './directives/tippy.directive.ts'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.directive('tippy', tippyDirective)

app.mount('#app')
