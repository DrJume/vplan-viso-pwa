<template>
  <div class="text-center">
    <ConnectivityBadge ref="connectivity_badge"></ConnectivityBadge>
    <div class="btn-group btn-group-toggle pb-4">
      <label
        class="shadow-sm btn btn-secondary"
        :class="displayQueue === 'current' ? ['active'] : ['text-blur']"
        @click.prevent="updateVPlan('current')"
      >
        <input type="radio"> Heute
      </label>

      <label
        class="shadow-sm btn btn-secondary"
        :class="displayQueue === 'next' ? ['active'] : ['text-blur']"
        @click.prevent="updateVPlan('next')"
      >
        <input type="radio"> Folgend
      </label>
    </div>

    <transition name="fade" mode="out-in" appear>
      <div v-if="this.error"
        key="error"
        class="alert alert-danger mx-auto d-flex align-items-center"
        style="width: fit-content;"
        role="alert"
      >
        <Octicon icon="alert" :scale="1.5" class="mr-2" />
        Ein Fehler ist aufgetreten.
      </div>

      <div v-else-if="this.authSuccess === false"
        key="badPassword"
        class="alert alert-danger mx-auto d-flex align-items-center"
        style="width: fit-content;"
        role="alert"
      >
        <Octicon icon="lock" :scale="1.5" class="mr-2" />
        Dieser Inhalt ist passwortgeschützt.
      </div>

      <div v-else-if="this.vplanData === null"
        key="vplanUnavailable"
        class="alert alert-secondary mx-auto d-flex align-items-center"
        style="width: fit-content;"
        role="alert"
      >
        <Octicon icon="calendar" :scale="1.5" class="mr-2" />
        Vertretungsplan folgt demnächst.
      </div>

      <div v-else-if="this.vplanData === undefined"
        key="vplanLoadingSpinner"
        class="d-flex justify-content-center m-5"
      >
        <div class="spinner-grow" style="width: 4rem; height: 4rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <VPlanTable v-else :vplanData="vplanData" key="vplanTable"></VPlanTable>
    </transition>
  </div>
</template>

<style scoped lang="css">

.text-blur {
  color: rgba(255, 255, 255, 0.85) !important;
}

</style>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import localForage from 'localforage'

import VPlanTable from '@/components/VPlanTable.vue'
import ConnectivityBadge from '@/components/ConnectivityBadge.vue'

try {
  indexedDB.deleteDatabase('vplan-web')
} catch (error) {

}

const vplanCache = localForage.createInstance({
  name: 'MANOS V-Plan',
  version: 1.0,
  storeName: 'vplan_cache',
  description: ''
})

const vplanPasswdCookieName = 'vplan_passwd'
let auth = {
  username: 'manos',
  password: ''
}

axios.defaults.baseURL = 'https://manos-dresden.de/vplan/upload/'

const VPlanCacheManager = {
  async get (key) {
    try {
      return { cachedData: await vplanCache.getItem(key), error: null }
    } catch (err) {
      console.error('Problem with accessing localStorage/IndexedDB/WebSQL: ', err)

      return { cachedData: undefined, error: err }
    }
  },
  async set (key, data) {
    try {
      await vplanCache.setItem(key, data)
    } catch (err) {
      console.error('Problem with accessing localStorage/IndexedDB/WebSQL: ', err)
    }
  },
  async delete (key) {
    try {
      await vplanCache.removeItem(key)
    } catch (err) {
      console.error('Problem with accessing localStorage/IndexedDB/WebSQL: ', err)
    }
  }
}

// Test the connection to the web server
async function isBadPassword (auth) {
  if (navigator.onLine) {
    try {
      await axios.get('test.txt', { auth })

      return false
    } catch (error) {
      return true
    }
  } else return false // ignore password check if offline
}

export default {
  name: 'VPlanView',

  components: {
    VPlanTable,
    ConnectivityBadge
  },

  props: {
    type: String
  },

  data () {
    return {
      authSuccess: undefined,
      vplanData: undefined,
      displayQueue: '',
      error: null
    }
  },

  methods: {
    async authenticate (failedAttemps = 0) {
      if (Cookies.get(vplanPasswdCookieName)) {
        auth.password = Cookies.get(vplanPasswdCookieName)

        if (await isBadPassword(auth)) {
          if (
            confirm('Inhalte konnten nicht geladen werden.\nSeite zurücksetzen?')
          ) {
            Cookies.remove(vplanPasswdCookieName)
            location.reload(true) // refresh and skip cache
          }
        }

        axios.defaults.auth = auth

        return true
      }

      if (axios.defaults.auth) {
        if (await isBadPassword(axios.defaults.auth)) {
          return this.authenticate(failedAttemps + 1)
        }

        return true
      }

      const inputPasswd = prompt(`${failedAttemps > 0 ? 'Falsches Passwort. ' : 'MANOS Vertretungsplan Passwort'}`, '')
      if (inputPasswd === null) return false
      if (!inputPasswd.trim()) return this.authenticate(failedAttemps + 1)
      auth.password = inputPasswd

      if (!navigator.onLine) {
        alert('Keine Internetverbindung.')
        return false
      }

      if (await isBadPassword(auth)) {
        if (failedAttemps >= 2) {
          alert('Zu viele Falscheingaben!')
          return false
        }

        return this.authenticate(failedAttemps + 1)
      }

      Cookies.set(vplanPasswdCookieName, auth.password, {
        expires: 120,
        secure: true /* disable only during development */
      })
      axios.defaults.auth = auth

      return true
    },

    async fetchVPlan (queue) {
      this.error = null
      const vplanUrl = `${queue}/${this.type}.json`

      if (navigator.onLine) {
        try {
          const vplanData = (await axios.get(vplanUrl)).data
          await VPlanCacheManager.set(vplanUrl, vplanData)

          return vplanData
        } catch (error) {
          if (error.response) {
          // UNAUTHORIZED (wrong password)
            if (error.response.status === 401) {
              this.authSuccess = await this.authenticate()
              if (!this.authSuccess) return

              return this.fetchVPlan(queue)
            }

            // NOT FOUND (no VPlan available)
            if (error.response.status === 404) {
              await VPlanCacheManager.delete(vplanUrl)
              return null
            }
          }

          // other error
          console.error(error.toJSON())
          this.error = 'NETWORK'
          return undefined
        }
      } else {
        this.$refs.connectivity_badge.status('offline')

        const { cachedData, error } = await VPlanCacheManager.get(vplanUrl)
        if (error) return null

        return cachedData
      }
    },

    async updateVPlan (queue) {
      this.vplanData = undefined

      this.displayQueue = queue // give first feedback
      this.vplanData = await this.fetchVPlan(queue)
      this.displayQueue = queue // update again (fixes slow network overlap)
    },

    digestURLOptions () {
      if (['current', 'next'].includes(this.$route.query.d)) {
        return {
          displayQueue: this.$route.query.d
        }
      }
      // Clean up url paramters
      if (Object.keys(this.$route.query).length !== 0) {
        this.$router.replace({ query: {} })
      }

      return {}
    },

    networkConnectivityListener (event) {
      this.$refs.connectivity_badge.status(event.type)
    }
  },

  async mounted () {
    this.authSuccess = await this.authenticate()
    if (!this.authSuccess) return

    const urlOptions = this.digestURLOptions()
    if (urlOptions.displayQueue) {
      await this.updateVPlan(urlOptions.displayQueue)
    } else {
      const hours = new Date().getHours()
      const queueDay = hours < 12 ? 'current' : 'next'

      await this.updateVPlan(queueDay)
    }

    window.addEventListener('online', this.networkConnectivityListener)
    window.addEventListener('offline', this.networkConnectivityListener)
  },

  beforeDestroy () {
    window.removeEventListener('online', this.networkConnectivityListener)
    window.removeEventListener('offline', this.networkConnectivityListener)
  },

  watch: {
    async $route (to, from) {
      const urlOptions = this.digestURLOptions()
      if (urlOptions.displayQueue) {
        await this.updateVPlan(urlOptions.displayQueue)
      }
    }
  }
}
</script>
