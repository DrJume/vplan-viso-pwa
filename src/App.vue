<template>
  <div class="app" :class="{'bg-dark': isDarkMode, 'make-all-text-light': isDarkMode}">
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',

  created () {
    const setDarkMode = (query) => {
      this.isDarkMode = query.matches
      console.log(`Dark mode is ${this.isDarkMode ? '🌒 on' : '☀️ off'}.`)

      this.isDarkMode ? document.documentElement.classList.add('bg-dark') : document.documentElement.classList.remove('bg-dark')
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkMode(darkModeMediaQuery)
    darkModeMediaQuery.addListener((e) => setDarkMode(e))
  }
}
</script>

<style lang="scss">

.make-all-text-light * {
  color: var(--light);
}

.app {
  text-align: center;

  // @import "~bootstrap/scss/bootstrap.scss";
}

</style>
