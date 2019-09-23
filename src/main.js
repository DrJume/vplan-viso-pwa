import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = true

const store = Vue.observable({ isDarkMode: false })

Vue.mixin({
  computed: {
    isDarkMode: {
      get () {
        return store.isDarkMode
      },
      set (val) {
        store.isDarkMode = val
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#vplan-web')
