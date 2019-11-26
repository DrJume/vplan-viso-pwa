<template>
   <div class="dropdown">
      <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
        <Octicon icon="three-bars" :scale="1.3" class="dropdown-menu-icon d-flex justify-content-center"></Octicon>
      </button>
      <div class="dropdown-menu dropdown-menu-right shadow-lg">
        <a v-if="$route.meta.backMenuOption" class="dropdown-item d-inline-flex" :href="$router.resolve({name: 'start'}).href">
          <Octicon icon="reply" class="d-inline-flex align-items-center mr-2"/> Zurück
        </a>

        <div v-if="$route.meta.backMenuOption" class="dropdown-divider"></div>

        <form action="" class="dropdown-item-text">
          <div class="custom-control custom-switch right">
            <input type="checkbox" @click="updateDarkMode" :checked="App.settings.darkMode.active" :disabled="App.settings.darkMode.definedBySystem" class="custom-control-input" id="dark_mode_switch">

            <label class="custom-control-label d-inline-flex" for="dark_mode_switch">
              <Octicon :icon="App.settings.darkMode.definedBySystem ? 'sync' : 'light-bulb'" class="d-inline-flex align-items-center mr-2"/> Dunkelmodus
            </label>
          </div>
        </form>

        <form action="" class="dropdown-item-text">
          <div class="custom-control custom-switch right">
            <input type="checkbox" v-model="App.settings.filter.active" class="custom-control-input" id="filter_switch">

            <label class="custom-control-label d-inline-flex" for="filter_switch">
              <Octicon icon="search" class="d-inline-flex align-items-center mr-2"/> Filter
            </label>
          </div>
        </form>

        <div class="dropdown-divider"></div>

        <a class="dropdown-item d-inline-flex" :href="$router.resolve({name: 'settings'}).href">
          <Octicon icon="gear" class="d-inline-flex align-items-center mr-2"/> Einstellungen
        </a>

        <a class="dropdown-item d-inline-flex" :href="$router.resolve({name: 'about'}).href">
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
        this.App.settings.darkMode.active = e.target.checked
      }, 150)
    }
  }
}
</script>

<style scoped>
.dropdown-menu {
  z-index: 1100;
}

.dropdown-menu >>> .octicon {
  width: 16px;
}

.dropdown-item, .dropdown-item-text {
  padding-left: 1rem;
  padding-right: 1rem;
}

.custom-switch {
  user-select: none;
}

.dropdown-toggle {
  padding: 0.1rem 0.2rem 0.1rem 0.2rem;
  height: 38px;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-menu-icon {
  width: 22px;
}

</style>
