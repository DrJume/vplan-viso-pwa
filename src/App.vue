<template>
  <div>
    <div id="app" class="container position-relative pt-4">
      <MenuDropdown v-if="$route.name !== 'start'" class="app-menu position-absolute"></MenuDropdown>
      <transition name="fade" mode="out-in" appear>
        <router-view/>
      </transition>
    </div>
    <!-- <iOSPWAPrompt/> -->
  </div>
</template>

<script>
// import iOSPWAPrompt from '@/components/iOS-PWA-Prompt.vue'

import MenuDropdown from '@/components/MenuDropdown.vue'

export default {
  name: 'App',
  components: {
    MenuDropdown
  }
}
</script>

<style lang="scss">

@import "~bootstrap/scss/bootstrap.scss";

html.dark-theme {
  background-color: var(--dark);

  body {
    background-color: var(--dark);

    #app *:not(.alert):not(.custom-control-label) {
      color: var(--light);
    }

    table {
      @extend .table-dark;
    }

    .dropdown-menu {
      background-color: var(--dark);
      border-color: #454d55;

      .dropdown-divider {
        border-color: rgba(255,255,255,0.07) !important;
      }

      .dropdown-item {
        &:hover, &:focus {
          background-color: rgba(255,255,255,0.08) !important;
          color: var(--light);
        }

        &:active {
          background-color: var(--blue) !important;
        }
      }
    }

    .jumbotron {
      background-color: var(--secondary);
    }

    textarea {
      &:focus {
        color: currentColor;
      }
      &:disabled {
        background-color: var(--gray) !important;
      }
      background-color: lighten($secondary, 10%) !important;
      border-color: darken($secondary, 7%);
    }
  }
}

.app-menu {
  padding-right: inherit;
  right: 0;
}

@media (min-width: 576px) {
  body {
    overflow: overlay;
  }
}

#app {
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
