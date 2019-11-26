<template>
  <div>
    <h2 class="mb-4">Einstellungen</h2>

    <div class="jumbotron p-3">
      <span class="lead">Allgemein</span>
      <hr class="mt-2 mb-3">

      <div class="form-group">
        <label for="filter_keywords">Filter</label>

        <div class="float-right">
          <a tabindex="0" role="button" id="filterQueryHelpPopover" class="d-inline-flex align-bottom text-reset">
            <Octicon class="d-inline-flex" icon="question" />
          </a>
        </div>

        <textarea
          @blur="formatFilterQueryInput($event)"
          :value="App.settings.filter.query"
          :class="{'disabled': !App.settings.filter.active}"
          class="form-control" id="filter_keywords" rows="2"
          placeholder="Bsp: 8c; JG11; JG12/de1; Kra; ..."
        ></textarea>

        <div class="custom-control custom-checkbox custom-control-inline mt-1 mr-0">
          <input type="checkbox" v-model="App.settings.filter.active"
            class="custom-control-input" id="filter_active">
          <label class="custom-control-label" for="filter_active">Aktiviert</label>
        </div>
        <div class="custom-control custom-checkbox custom-control-inline mt-1 mr-0 float-right">
          <input type="checkbox" v-model="App.settings.filter.searchInfo"
            class="custom-control-input" id="filter_search_info">
          <label class="custom-control-label" for="filter_search_info">Info-Spalte erfassen</label>
        </div>
      </div>

       <div class="form-group">
        <label for="user_group">Nutzergruppe</label>
        <div id="user_group">
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" v-model="App.settings.userGroup" value="students"
              id="students" name="user_group" class="custom-control-input">
            <label class="custom-control-label" for="students">Schüler</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" v-model="App.settings.userGroup" value="teachers"
              id="teachers" name="user_group" class="custom-control-input">
            <label class="custom-control-label" for="teachers">Lehrer</label>
          </div>
        </div>
      </div>

    </div>

    <div class="jumbotron p-3">
      <span class="lead">Darstellung</span>
      <hr class="mt-2 mb-3">

      <div class="custom-control custom-checkbox">
        <input type="checkbox" v-model="App.settings.darkMode.definedBySystem"
          :disabled="!systemDarkModeSupported" class="custom-control-input" id="system_darkmode">
        <label class="custom-control-label" for="system_darkmode">System-Dunkelmodus</label>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Settings',

  mounted () {
    $('#filterQueryHelpPopover').popover({
      trigger: 'focus',
      html: true,
      content: `<b>Suchbegriffe:</b>
          <ul class="list-unstyled m-0">
            <li> - <span class="text-monospace">;</span>-getrennte Liste</li>
            <li> - Leerzeichen werden ignoriert</li>
            <li> - Durchsucht <span class="text-monospace">|Klasse|</span> bzw. <span class="text-monospace">|Lehrer|</span></li>
            <li> - Bsp: <span class="text-monospace">'8c; JG11; JG12/de1; Kra'</span>
          </ul>`,
      template: '<div class="popover" role="tooltip"><div class="popover-body"></div></div>',
      placement: 'left',
      offset: '-40%p',
      container: this.$el
    })
  },

  beforeRouteLeave (to, from, next) {
    // Update userGroup on settings back navigation to a vplanview page
    if (to.meta.isVPlanView && to.name !== this.App.settings.userGroup) {
      next({ name: this.App.settings.userGroup, replace: true })
    } else next()
  },

  methods: {
    formatFilterQueryInput (event) {
      const formatted = event.target.value.trim().split(';')
        .map(keyword => keyword.replace(/ /g, '')).filter(keyword => !!keyword).join('; ')

      event.target.value = formatted
      this.App.settings.filter.query = formatted
    },

    systemDarkModeSupported () {
      if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
        return true
      } else {
        this.App.settings.darkMode.definedBySystem = false
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// Change padding of inline-checkboxes on narrow screens
@media (max-width: 390px) {
  .custom-checkbox.custom-control-inline {
    & .custom-control-label {
      &:before, &:after {
        left: -1.2rem;
      }
    }

    padding-left: 1.2rem;
  }
}

</style>
