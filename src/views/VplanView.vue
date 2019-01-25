<template>
  <div>
    <ConnectivityBadge ref="connectivity_badge"></ConnectivityBadge>
    <div class="pt-4">
      <div class="btn-group btn-group-toggle pb-4">
        <!-- <router-link
          to="?q=current"
          tag="label"
          exact-active-class="active"
          class="shadow-sm btn btn-secondary"
        >
          <input type="radio" checked> Heute
        </router-link>-->
        <label
          class="shadow-sm btn btn-secondary"
          :class="{active: display === 'current'}"
          @click="display = 'current'"
        >
          <input type="radio" checked> Heute
        </label>

        <!-- <router-link
          to="?q=next"
          tag="label"
          exact-active-class="active"
          class="shadow-sm btn btn-secondary"
        >
          <input type="radio" checked> Folgend
        </router-link>-->
        <label
          class="shadow-sm btn btn-secondary"
          :class="{active: display === 'next'}"
          @click="display = 'next'"
        >
          <input type="radio" checked> Folgend
        </label>
      </div>

      <div
        v-if="this.authSuccess === false"
        class="alert alert-danger"
        role="alert"
      >Dieser Inhalt ist passwortgeschützt.</div>
      <div
        v-else-if="this.vplanData === null"
        class="alert alert-secondary"
        role="alert"
      >Vertretungsplan folgt demnächst.</div>

      <div v-else-if="this.vplanData === undefined" class="d-flex justify-content-center m-5">
        <div class="spinner-grow" style="width: 4rem; height: 4rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <VplanTable :vplanData="vplanData"></VplanTable>

      <small class="font-weight-light font-italic">Version 0.1.1</small>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import localForage from 'localforage'

import VplanTable from '@/components/VplanTable.vue'
import ConnectivityBadge from '@/components/ConnectivityBadge.vue'

const vplanCache = localForage.createInstance({
  name: 'manos-vplan'
})

axios.defaults.baseURL = 'https://manos-dresden.de/vplan/upload/'
const cookieName = 'vplan_passwd'
let auth = {
  username: 'manos',
  password: ''
}

const authenticate = async (tries = 1) => {
  if (Cookies.get(cookieName)) {
    auth.password = Cookies.get(cookieName)
    axios.defaults.auth = auth

    return true
  }

  const input = prompt('MANOS Vertretungsplan Passwort', '')
  if (input === null) return false
  auth.password = input

  try {
    if (!navigator.onLine) {
      alert('Keine Internetverbindung.')

      return false
    }

    await axios.get('', { auth })

    Cookies.set(cookieName, auth.password, {
      expires: 120,
      /* FIXME */ secure: true
    })
    axios.defaults.auth = auth

    return true
  } catch {
    if (tries >= 3) {
      alert('Zu viele Fehleingaben!')
      return false
    }

    return authenticate(tries + 1)
  }
}

export default {
  name: 'VplanView',
  components: {
    VplanTable,
    ConnectivityBadge
  },
  props: {
    type: String
  },
  data () {
    return {
      authSuccess: undefined,
      vplanData: undefined,
      display: undefined
    }
  },
  methods: {
    async retreiveVplan () {
      const vplanUrl = `${this.display}/${this.type}.json`
      console.debug(vplanUrl)

      if (navigator.onLine) {
        try {
          const vplanData = (await axios.get(vplanUrl)).data
          await vplanCache.setItem(vplanUrl, vplanData)

          return vplanData
        } catch {
          await vplanCache.setItem(vplanUrl, null)
          return null
        }
      } else {
        this.$refs.connectivity_badge.warn_offline()

        return vplanCache.getItem(vplanUrl)
      }
    },
    async updateVplan () {
      this.vplanData = await this.retreiveVplan()
    }
  },
  async created () {
    this.authSuccess = await authenticate()
    if (!this.authSuccess) return

    try {
      await axios.get('')
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

    // check if its after 12 p.m.
    const queueDay = new Date().getHours() < 12 ? 'current' : 'next'
    this.display = queueDay

    if (['current', 'next'].includes(this.$route.query.d)) {
      this.display = this.$route.query.d
    }
    this.$router.replace({ query: undefined }) //TODO

    window.addEventListener('online', _ =>
      this.$refs.connectivity_badge.info_online()
    )
    window.addEventListener('offline', _ =>
      this.$refs.connectivity_badge.warn_offline()
    )
  },
  watch: {
    $route (to, from) {
      if (['current', 'next'].includes(this.$route.query.d)) {
        this.display = this.$route.query.d
      }
      this.$router.replace({ query: undefined }) //TODO
    },
    display () {
      this.authSuccess && this.updateVplan()
    }
  }
}
</script>
