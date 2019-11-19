<template>
  <div>
    <h2>Einstellungen</h2>
    <br>

    <div class="jumbotron p-3">
      <span class="lead">Allgemein</span>
      <hr class="mt-2 mb-3">

      <div class="form-group">
        <label for="filter_keywords">Filter</label>
        <textarea @blur="App.settings.filter.keywords = $event.target.value.trim()" :value="App.settings.filter.keywords" :disabled="!App.settings.filter.active" class="form-control" id="filter_keywords" rows="2"></textarea>
        <div class="custom-control custom-checkbox mt-1">
          <input type="checkbox" v-model="App.settings.filter.active" class="custom-control-input" id="filter_active">
          <label class="custom-control-label" for="filter_active">Aktiviert</label>
        </div>
      </div>

       <div class="form-group">
        <label for="user_group">Nutzergruppe</label>
        <div id="user_group">
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" v-model="App.settings.userGroup" value="students" id="students" name="user_group" class="custom-control-input">
            <label class="custom-control-label" for="students">Schüler</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" v-model="App.settings.userGroup" value="teachers" id="teachers" name="user_group" class="custom-control-input">
            <label class="custom-control-label" for="teachers">Lehrer</label>
          </div>
        </div>
      </div>

    </div>

    <div class="jumbotron p-3">
      <span class="lead">Darstellung</span>
      <hr class="mt-2 mb-3">

      <div class="custom-control custom-checkbox">
        <input type="checkbox" v-model="App.settings.darkMode.definedBySystem" :disabled="!systemDarkModeSupported" class="custom-control-input" id="system_darkmode">
        <label class="custom-control-label" for="system_darkmode">System-Dunkelmodus</label>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Settings',
  methods: {
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

<style scoped>

</style>
