<template>
  <div class="app" :class="{'make-all-text-light': $isDarkMode}">
    <div class="container position-relative pt-4">
      <MenuDropdown v-if="$route.name !== 'start'" class="app-menu position-absolute"></MenuDropdown>
      <router-view/>
    </div>
  </div>
</template>

<script>
import MenuDropdown from '@/components/MenuDropdown.vue'

export default {
  name: 'App',
  components: {
    MenuDropdown
  },

  created () {
    const setDarkMode = (val) => {
      this.$isDarkMode = val
      console.log(`Dark mode is ${val ? '🌒 on' : '☀️ off'}.`)
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkMode(darkModeMediaQuery.matches)

    darkModeMediaQuery.addListener((e) => setDarkMode(e.matches))
  },

  watch: {
    $isDarkMode: (isDarkMode) => {
      isDarkMode ? document.body.classList.add('bg-dark') : document.body.classList.remove('bg-dark')
    }
  }
}
</script>

<style lang="scss">

.app-menu {
  padding-right: inherit;
  right: 0;
}

.make-all-text-light :not(.alert) {
  color: var(--light);
}

@media (min-width: 576px) {
  body {
    overflow: overlay;
  }
}

.app {
  // @import "~bootstrap/scss/bootstrap.scss";
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.custom-switch { // source: https://github.com/twbs/bootstrap/pull/28052
   &.right {
    padding-left: 0;
    .custom-control-label {
      padding-right: 2.5rem;
      &::before {
        right: 0;
        left: auto;
      }

      &::after {
        right: 0.875rem;
        left: auto;
      }
    }
  }
}

</style>
