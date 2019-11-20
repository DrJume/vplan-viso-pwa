import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

import Octicon from './components/Util/Octicon.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import { debounce, recursiveObjPatch } from '@/lib/util.js'

import localForage from 'localforage'

Vue.component('Octicon', Octicon)

Vue.config.productionTip = true

const AppDataStore = localForage.createInstance({
  name: 'MANOS V-Plan',
  version: 1.0,
  storeName: 'app_data',
  description: '',
  driver: localForage.LOCALSTORAGE
})
const AppDataHandler = {
  read: async () => {
    try {
      return AppDataStore.getItem('settings')
    } catch (err) {
      console.error('Problem with accessing localStorage/IndexedDB/WebSQL: ', err)
      return undefined
    }
  },
  save: async (obj) => {
    try {
      return AppDataStore.setItem('settings', obj)
    } catch (err) {
      console.error('Problem with accessing localStorage/IndexedDB/WebSQL: ', err)
    }
  }
}

const defaultAppData = Vue.observable({
  settings: {
    userGroup: '',
    filter: {
      active: false,
      query: '',
      searchInfo: false
    },
    darkMode: {
      active: false,
      definedBySystem: false
    }
  }
});

(async function run () {
  let appData = await AppDataHandler.read()

  // On access err
  if (appData === undefined) appData = defaultAppData

  if (appData === null) appData = {}

  // Patch/Update stored settings
  appData = recursiveObjPatch(defaultAppData, appData, (key, regular) => {
    console.debug(key)

    if (key === 'settings.darkMode.definedBySystem') {
      if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
        console.log('🎉 Dark mode is supported')

        if (window.matchMedia('(prefers-color-scheme: no-preference)').matches) {
          return false
        } else {
          console.log('💡 The Dark Mode setting is defined by your system')
          return true
        }
      }
    }

    return regular
  })
  await AppDataHandler.save(appData)

  Vue.mixin({
    data () {
      return {
        App: appData
      }
    }
  })

  new Vue({
    router: router(appData),

    data () {
      return {
        darkModeMediaQuery: undefined
      }
    },

    methods: {
      updateDarkMode (isDarkMode) {
        isDarkMode
          ? document.documentElement.classList.add('dark-theme')
          : document.documentElement.classList.remove('dark-theme')

        console.log(`Dark mode is ${isDarkMode ? '🌒 on' : '☀️ off'}.`)
      },

      darkModeListener (darkModeMediaQuery) {
        this.App.settings.darkMode.active = darkModeMediaQuery.matches
      }
    },
    created () {
      if (this.App.settings.darkMode.definedBySystem) {
        this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        this.App.settings.darkMode.active = this.darkModeMediaQuery.matches
        this.updateDarkMode(this.App.settings.darkMode.active)
        this.darkModeMediaQuery.addListener(this.darkModeListener)
      } else {
        this.updateDarkMode(this.App.settings.darkMode.active)
      }
    },
    watch: {
      App: {
        handler: debounce((newAppData) => {
          console.debug('Updated appData: ', JSON.parse(JSON.stringify(newAppData)))
          AppDataHandler.save(newAppData)
        }, 500),

        deep: true
      },
      'App.settings.darkMode.active': function (isDarkMode) {
        this.updateDarkMode(isDarkMode)
      },
      'App.settings.darkMode.definedBySystem': function (definedBySystem) {
        if (definedBySystem) {
          this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

          this.darkModeMediaQuery.addListener(this.darkModeListener)
          this.App.settings.darkMode.active = this.darkModeMediaQuery.matches
        } else {
          this.darkModeMediaQuery.removeListener(this.darkModeListener)
        }
      }
    },
    render: h => h(App)
  }).$mount('#vplan-web')
}())
