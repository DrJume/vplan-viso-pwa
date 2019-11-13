<template>
  <div class="text-center">
    <ConnectivityBadge ref="connectivity_badge"></ConnectivityBadge>
    <div>
      <div class="btn-group btn-group-toggle pb-4">
        <label
          class="shadow-sm btn btn-secondary"
          :class="display === 'current' ? ['active'] : ['text-blur']"
          @click.prevent="updateVplan('current')"
        >
          <input type="radio"> Heute
        </label>

        <label
          class="shadow-sm btn btn-secondary"
          :class="display === 'next' ? ['active'] : ['text-blur']"
          @click.prevent="updateVplan('next')"
        >
          <input type="radio"> Folgend
        </label>
      </div>

      <div
        v-if="this.authSuccess === false"
        class="alert alert-danger"
        role="alert"
      >
        Dieser Inhalt ist passwortgeschützt.
      </div>

      <VPlanTable v-else :vplanData="vplanData"></VPlanTable>

      <small class="font-weight-light font-italic">v{{ version }}</small>
    </div>
  </div>
</template>

<style scoped lang="css">

.text-blur {
  color: rgba(255, 255, 255, 0.85) !important;
}

</style>

<script>
import pkg from '@/../package.json'

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
  description: 'Caches VPlan files in JSON format locally'
})

const vplanPasswdCookieName = 'vplan_passwd'
let auth = {
  username: 'manos',
  password: ''
}

axios.defaults.baseURL = 'https://manos-dresden.de/vplan/upload/'

const authenticate = async (failed = 0) => {
  if (Cookies.get(vplanPasswdCookieName)) {
    auth.password = Cookies.get(vplanPasswdCookieName)
    axios.defaults.auth = auth

    if (navigator.onLine) {
      try {
        await axios.get('test.txt')
      } catch (error) {
        if (
          confirm('Daten konnten nicht geladen werden.\nSeite zurücksetzen?')
        ) {
          Cookies.remove(vplanPasswdCookieName)

          location.reload(true)
        }
      }
    }

    return true
  }

  const input = prompt(`${failed > 0 ? 'Falsches Passwort. ' : 'MANOS Vertretungsplan Passwort'}`, '')
  if (input === null) return false
  if (!input) return authenticate(failed + 1)
  auth.password = input

  try {
    if (!navigator.onLine) {
      alert('Keine Internetverbindung.')

      return false
    }

    await axios.get('test.txt', { auth })

    Cookies.set(vplanPasswdCookieName, auth.password, {
      expires: 120,
      secure: true /* FIXME: disable only during development */
    })
    axios.defaults.auth = auth

    return true
  } catch {
    if (failed >= 2) {
      alert('Zu viele Falscheingaben!')
      return false
    }

    return authenticate(failed + 1)
  }
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
      display: ''
    }
  },

  computed: {
    version () {
      return pkg.version
    }
  },

  methods: {
    async retreiveVplan (queue) {
      const vplanUrl = `${queue}/${this.type}.json`
      console.debug(vplanUrl)

      if (navigator.onLine) {
        try {
          const vplanData = (await axios.get(vplanUrl)).data
          await vplanCache.setItem(vplanUrl, vplanData)

          return vplanData
        } catch {
          await vplanCache.removeItem(vplanUrl)

          return null
        }
      } else {
        this.$refs.connectivity_badge.warn_offline()

        return vplanCache.getItem(vplanUrl)
      }
    },

    async updateVplan (queue) {
      this.vplanData = undefined

      this.authSuccess = await authenticate()
      if (!this.authSuccess) return

      this.display = queue
      this.vplanData = await this.retreiveVplan(queue)
    },

    checkURLOptions () {
      if (['current', 'next'].includes(this.$route.query.d)) {
        this.display = this.$route.query.d
      }
      if (Object.keys(this.$route.query).length !== 0) {
        this.$router.replace({ query: {} })
      }
    }
  },

  async mounted () {
    this.authSuccess = await authenticate()
    if (!this.authSuccess) return

    const hours = new Date().getHours()
    const queueDay = hours < 12 ? 'current' : 'next'
    this.updateVplan(queueDay)

    this.checkURLOptions()

    window.addEventListener('online', _ =>
      this.$refs.connectivity_badge.info_online()
    )
    window.addEventListener('offline', _ =>
      this.$refs.connectivity_badge.warn_offline()
    )
  },

  watch: {
    $route (to, from) {
      this.checkURLOptions()
      this.updateVplan(this.display)
    }
  }
}
</script>
