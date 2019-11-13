<template>
   <div class="dropdown">
      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
        <Octicon icon="three-bars" :scale="1.3" className="dropdown-menu-icon d-flex justify-content-center"></Octicon>
      </button>
      <div class="dropdown-menu dropdown-menu-right shadow-lg" :class="{'bg-dark': $isDarkMode}">
        <a v-if="$route.meta.backMenuOption" class="dropdown-item d-inline-flex" :class="{'dark': $isDarkMode}" :href="$router.resolve({name: 'start'}).href">
          <Octicon icon="reply" class="d-inline-flex align-items-center mr-2"/> Zurück
        </a>

        <div v-if="$route.meta.backMenuOption" class="dropdown-divider" :class="{'dark': $isDarkMode}"></div>

        <form action="" class="dropdown-item-text">
          <div class="custom-control custom-switch right">
            <input type="checkbox" @click="updateDarkMode" :checked="$isDarkMode" class="custom-control-input" id="dark_mode_switch">
            <label class="custom-control-label d-inline-flex" for="dark_mode_switch">
              <Octicon icon="light-bulb" class="d-inline-flex align-items-center mr-2"/> Dunkelmodus
            </label>
          </div>
        </form>

        <div class="dropdown-divider" :class="{'dark': $isDarkMode}"></div>

        <a class="dropdown-item d-inline-flex" :class="{'dark': $isDarkMode}" :href="$router.resolve({name: 'settings'}).href">
          <Octicon icon="gear" class="d-inline-flex align-items-center mr-2"/> Einstellungen
        </a>

        <a class="dropdown-item d-inline-flex" :class="{'dark': $isDarkMode}" :href="$router.resolve({name: 'about'}).href">
          <Octicon icon="info" class="d-inline-flex align-items-center mr-2"/> Über
        </a>
      </div>
    </div>
</template>

<script>
export default {
  name: 'MenuDropdown',

  methods: {
    updateDarkMode (e) {
      setTimeout(() => {
        this.$isDarkMode = e.target.checked
      }, 250)
    }
  }
}
</script>

<style scoped>
.dropdown-item, .dropdown-item-text {
  padding-left: 1rem;
  padding-right: 1rem;
}

.dropdown-menu >>> .octicon {
  fill: currentColor;
}

.custom-switch {
  user-select: none;
}

.dark.dropdown-divider {
  border-color: rgba(255,255,255,0.07) !important;
}

.bg-dark.dropdown-menu {
  border-color: rgba(255,255,255,0.15);
}

.dropdown-toggle {
  padding: 0.1rem 0.2rem 0.1rem 0.2rem;
  height: 38px;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-toggle >>> .dropdown-menu-icon {
  fill: currentColor;
  width: 22px;
}

.dark.dropdown-item:hover, .dark.dropdown-item:focus {
  background-color: rgba(255,255,255,0.08) !important;
  color: var(--light);
}

.dark.dropdown-item:active {
  background-color: var(--blue) !important;
}

</style>
