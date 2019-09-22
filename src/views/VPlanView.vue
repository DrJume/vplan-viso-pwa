<template>
  <div>
    <ConnectivityBadge ref="connectivity_badge"></ConnectivityBadge>
    <div class="pt-4">
      <div class="btn-group btn-group-toggle pb-4">
        <label
          class="shadow-sm btn btn-secondary"
          :class="{active: display === 'current'}"
          @click.prevent="updateVplan('current')"
        >
          <input type="radio" checked> Heute
        </label>

        <label
          class="shadow-sm btn btn-secondary"
          :class="{active: display === 'next'}"
          @click.prevent="updateVplan('next')"
        >
          <input type="radio" checked> Folgend
        </label>
      </div>

      <div
        v-if="this.authSuccess === false"
        class="alert alert-danger"
        role="alert"
      >
        Dieser Inhalt ist passwortgeschützt.
      </div>
      <div
        v-else-if="this.vplanData === null"
        class="alert alert-secondary"
        role="alert"
      >
        Vertretungsplan folgt demnächst.
      </div>

      <div v-else-if="this.vplanData === undefined" class="d-flex justify-content-center m-5">
        <div class="spinner-grow" style="width: 4rem; height: 4rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <VPlanTable :vplanData="vplanData"></VPlanTable>

      <small class="font-weight-light font-italic">Version 0.2.3</small>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import localForage from 'localforage'

import VPlanTable from '@/components/VPlanTable.vue'
import ConnectivityBadge from '@/components/ConnectivityBadge.vue'

const vplanCache = localForage.createInstance({
  name: 'vplan-web'
})

axios.defaults.baseURL = 'https://manos-dresden.de/vplan/upload/'
const cookieName = 'vplan_passwd'
let auth = {
  username: 'manos',
  password: ''
}

const authenticate = async (failed = 0) => {
  if (Cookies.get(cookieName)) {
    auth.password = Cookies.get(cookieName)
    axios.defaults.auth = auth

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

    Cookies.set(cookieName, auth.password, {
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

    try {
      await axios.get('test.txt')
    } catch (error) {
      if (navigator.onLine) {
        if (
          confirm('Daten konnten nicht geladen werden. \nSeite zurücksetzen?')
        ) {
          Cookies.remove(cookieName)
          location.reload(true)
        }
      }
    }

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
    }
  }
}
</script>
